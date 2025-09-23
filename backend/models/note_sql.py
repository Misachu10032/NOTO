import datetime
from typing import List, Optional, Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from config import POSTGRES_URI

# -----------------------------
# Database Connection
# -----------------------------


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
    """Fetch all notes, optionally filtered by user_id, including their tags."""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if user_id:
                cur.execute(
                    """
                    SELECT 
                        n.id,
                        n.keyword,
                        n.content,
                        n.created_at,
                        n.updated_at,
                        COALESCE(array_agg(nt.tag) FILTER (WHERE nt.tag IS NOT NULL), '{}') AS tags
                    FROM notes n
                    LEFT JOIN note_tags nt 
                        ON n.id = nt.note_id AND nt.user_id = %s
                    WHERE n.user_id = %s
                    GROUP BY n.id
                    ORDER BY n.id ASC
                    """,
                    (user_id, user_id),
                )
            else:
                cur.execute(
                    """
                    SELECT 
                        n.id,
                        n.keyword,
                        n.content,
                        n.created_at,
                        n.updated_at,
                        COALESCE(array_agg(nt.tag) FILTER (WHERE nt.tag IS NOT NULL), '{}') AS tags
                    FROM notes n
                    LEFT JOIN note_tags nt 
                        ON n.id = nt.note_id
                    GROUP BY n.id
                    ORDER BY n.id ASC
                    """
                )
            rows = cur.fetchall()

            # Convert timestamps to ISO format
            return [
                {
                    "id": row["id"],
                    "keyword": row["keyword"],
                    "content": row["content"],
                    "created_at": (
                        row["created_at"].isoformat() if row["created_at"] else None
                    ),
                    "updated_at": (
                        row["updated_at"].isoformat() if row["updated_at"] else None
                    ),
                    "tags": row["tags"] or [],
                }
                for row in rows
            ]


def create_new_note(
    keyword: str, content: str, user_id: int, tags: Optional[List[str]] = None
) -> Dict[str, Any]:
    """Create a new note and save tags if provided."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            now = datetime.datetime.now()

            # Insert the note
            cur.execute(
                """
                INSERT INTO notes (keyword, content, user_id, created_at)
                VALUES (%s, %s, %s, %s)
                RETURNING id, keyword, content, created_at, updated_at
                """,
                (keyword, content, user_id, now),
            )
            note = cur.fetchone()
            note_id = note[0]

            # Insert tags in bulk if provided (correct column order)
            if tags:
                values = [(note_id, tag, now, user_id) for tag in tags]
                args_str = ",".join(
                    cur.mogrify("(%s,%s,%s,%s)", val).decode("utf-8") for val in values
                )
                cur.execute(
                    f"""
                    INSERT INTO note_tags (note_id, tag, created_at, user_id)
                    VALUES {args_str}
                    ON CONFLICT (note_id, tag) DO NOTHING
                    """
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
    note_id: int,
    user_id: int,
    content: str,
    keyword: Optional[str] = None,
    tags: Optional[List[str]] = None,
) -> Optional[Dict[str, Any]]:
    """
    Update an existing note and optionally its tags.
    Tags are stored in the note_tags table with a composite primary key (user_id, tag).
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            now = datetime.datetime.now()

            # --- Update note content (and keyword if provided) ---
            if keyword is not None:
                cur.execute(
                    """
                    UPDATE notes
                    SET content = %s,
                        keyword = %s,
                        updated_at = %s
                    WHERE id = %s AND user_id = %s
                    RETURNING id, keyword, content, created_at, updated_at
                    """,
                    (content, keyword, now, note_id, user_id),
                )
            else:
                cur.execute(
                    """
                    UPDATE notes
                    SET content = %s,
                        updated_at = %s
                    WHERE id = %s AND user_id = %s
                    RETURNING id, keyword, content, created_at, updated_at
                    """,
                    (content, now, note_id, user_id),
                )

            note = cur.fetchone()
            if not note:
                return None

            # --- Delete old tags for this note and user ---
            cur.execute(
                "DELETE FROM note_tags WHERE note_id = %s AND user_id = %s",
                (note_id, user_id),
            )

            # --- Insert new tags in bulk if provided ---
            if tags:
                # Prepare bulk insert values
                values = [(note_id, tag, now, user_id) for tag in tags]
                args_str = ",".join(
                    cur.mogrify("(%s, %s, %s, %s)", val).decode("utf-8")
                    for val in values
                )
                cur.execute(
                    f"""
                    INSERT INTO note_tags (note_id, tag, created_at, user_id)
                    VALUES {args_str}
                    ON CONFLICT (note_id, tag) DO NOTHING
                    """
                )

            conn.commit()

            # --- Return updated note ---
            return {
                "id": note[0],
                "keyword": note[1],
                "content": note[2],
                "created_at": note[3].isoformat() if note[3] else None,
                "updated_at": note[4].isoformat() if note[4] else None,
                "tags": tags or [],
            }


def delete_note_by_id(note_id: int, user_id: int) -> bool:
    """Delete a note and its tags by note_id and user_id."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Delete tags first (cascade might handle this)
            cur.execute(
                "DELETE FROM note_tags WHERE note_id=%s AND user_id=%s",
                (note_id, user_id),
            )
            # Delete note
            cur.execute(
                "DELETE FROM notes WHERE id=%s AND user_id=%s",
                (note_id, user_id),
            )
            deleted = cur.rowcount > 0
            conn.commit()
            return deleted


def get_notes_by_user(user_id: int) -> List[Dict[str, Any]]:
    """Fetch all notes for a specific user, including their tags."""
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT
                    n.id,
                    n.keyword,
                    n.content,
                    n.created_at,
                    n.updated_at,
                    COALESCE(json_agg(nt.tag) FILTER (WHERE nt.tag IS NOT NULL), '[]') AS tags
                FROM notes n
                LEFT JOIN note_tags nt ON n.id = nt.note_id
                WHERE n.user_id = %s
                GROUP BY n.id, n.keyword, n.content, n.created_at, n.updated_at
                ORDER BY n.created_at DESC
                """,
                (user_id,),
            )
            rows = cur.fetchall()

            # RealDictCursor already gives dict rows
            return [
                {
                    "id": row["id"],
                    "keyword": row["keyword"],
                    "content": row["content"],
                    "created_at": (
                        row["created_at"].isoformat() if row["created_at"] else None
                    ),
                    "updated_at": (
                        row["updated_at"].isoformat() if row["updated_at"] else None
                    ),
                    "tags": row["tags"],  # This will be a Python list from json_agg
                }
                for row in rows
            ]
