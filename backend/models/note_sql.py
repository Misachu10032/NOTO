import datetime
from typing import List, Optional, Dict, Any
import psycopg2
from contextlib import contextmanager
from config import POSTGRES_URI


@contextmanager
def get_db_connection():
    conn = psycopg2.connect(POSTGRES_URI)
    try:
        yield conn
        print("_--------------connected____________")
    finally:
        conn.close()


# -----------------------------
# Notes CRUD
# -----------------------------


def get_all_notes(user_id: Optional[int] = None) -> List[Dict[str, Any]]:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            if user_id:
                cur.execute(
                    """
                    SELECT n.id, n.keyword, n.content, n.created_at, n.updated_at,
                           array_agg(nt.tag) as tags
                    FROM notes n
                    LEFT JOIN note_tags nt ON n.id = nt.note_id
                    WHERE n.user_id = %s
                    GROUP BY n.id
                    ORDER BY n.id ASC
                """,
                    (user_id,),
                )
            else:
                cur.execute(
                    """
                    SELECT n.id, n.keyword, n.content, n.created_at, n.updated_at,
                           array_agg(nt.tag) as tags
                    FROM notes n
                    LEFT JOIN note_tags nt ON n.id = nt.note_id
                    GROUP BY n.id
                    ORDER BY n.id ASC
                """
                )
            rows = cur.fetchall()
            return [
                {
                    "id": row[0],
                    "keyword": row[1],
                    "content": row[2],
                    "created_at": row[3].isoformat() if row[3] else None,
                    "updated_at": row[4].isoformat() if row[4] else None,
                    "tags": row[5] if row[5] is not None else [],
                }
                for row in rows
            ]


def create_new_note(
    keyword: str, content: str, user_id: int, tags: Optional[List[str]] = None
) -> Dict[str, Any]:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Insert note
            cur.execute(
                """
                INSERT INTO notes (keyword, content, user_id, created_at)
                VALUES (%s, %s, %s, %s)
                RETURNING id, keyword, content, created_at, updated_at
                """,
                (keyword, content, user_id, datetime.datetime.now()),
            )
            note = cur.fetchone()
            note_id = note[0]  # this is the 'id' column

            # Insert tags into note_tags table
            if tags:
                for tag in tags:
                    cur.execute(
                        """
                        INSERT INTO note_tags (note_id, user_id, tag, created_at)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT DO NOTHING
                        """,
                        (note_id, user_id, tag, datetime.datetime.now()),
                    )

            conn.commit()
            return {
                "id": note[0],
                "keyword": note[1],
                "content": note[2],
                "created_at": note[3].isoformat() if note[3] else None,
                "updated_at": note[4].isoformat() if note[4] else None,
                "saved": True,
                "tags": tags or [],
            }


def update_existing_note(
    note_id: int, user_id: int, content: str, tags: Optional[List[str]] = None
) -> Optional[Dict[str, Any]]:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Update note content
            cur.execute(
                """
                UPDATE notes
                SET content=%s, updated_at=%s
                WHERE id=%s AND user_id=%s
                RETURNING id, keyword, content, created_at, updated_at
                """,
                (content, datetime.datetime.now(), note_id, user_id),
            )
            note = cur.fetchone()
            if not note:
                return None

            # Delete old tags
            cur.execute(
                "DELETE FROM note_tags WHERE note_id=%s",
                (note_id,),
            )

            # Insert new tags
            if tags:
                for tag in tags:
                    cur.execute(
                        "INSERT INTO note_tags (note_id, user_id, tag, created_at) VALUES (%s, %s, %s, %s) ON CONFLICT DO NOTHING",
                        (note_id, user_id, tag, datetime.datetime.now()),
                    )

            conn.commit()
            return {
                "id": note[0],
                "keyword": note[1],
                "content": note[2],
                "created_at": note[3].isoformat() if note[3] else None,
                "updated_at": note[4].isoformat() if note[4] else None,
                "tags": tags or [],
            }


def delete_note_by_id(note_id: int, user_id: int) -> bool:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Delete tags first (optional, cascade might handle this)
            cur.execute(
                "DELETE FROM note_tags WHERE id=%s AND user_id=%s",
                (note_id, user_id),
            )
            # Delete note
            cur.execute(
                "DELETE FROM notes WHERE id=%s AND user_id=%s", (note_id, user_id)
            )
            deleted = cur.rowcount > 0
            conn.commit()
            return deleted
