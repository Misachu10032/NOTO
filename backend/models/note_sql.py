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
    finally:
        conn.close()

def get_all_notes() -> List[Dict[str, Any]]:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, keyword, content, created_at, updated_at, userId, tags FROM notes ORDER BY id ASC")
            rows = cur.fetchall()
            return [
                {
                    "id": row[0],
                    "keyword": row[1],
                    "content": row[2],
                    "created_at": row[3].isoformat() if row[3] else None,
                    "updated_at": row[4].isoformat() if row[4] else None,
                    "userId": row[5],
                    "tags": row[6] if row[6] is not None else [],
                }
                for row in rows
            ]

def create_new_note(keyword: str, content: str, tags: Optional[List[str]] = None, userId: Optional[int] = None) -> Dict[str, Any]:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO notes (keyword, content, created_at, tags, userId)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, keyword, content, created_at, updated_at, userId, tags
                """,
                (keyword, content, datetime.datetime.now(), tags or [], userId)
            )
            note = cur.fetchone()
            conn.commit()
            return {
                "id": note[0],
                "keyword": note[1],
                "content": note[2],
                "created_at": note[3].isoformat() if note[3] else None,
                "updated_at": note[4].isoformat() if note[4] else None,
                "userId": note[5],
                "tags": note[6] if note[6] is not None else [],
            }

def update_existing_note(note_id: int, content: str, tags: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE notes SET content=%s, updated_at=%s, tags=%s WHERE id=%s
                RETURNING id, keyword, content, created_at, updated_at, userId, tags
                """,
                (content, datetime.datetime.now(), tags or [], note_id)
            )
            note = cur.fetchone()
            conn.commit()
            if note:
                return {
                    "id": note[0],
                    "keyword": note[1],
                    "content": note[2],
                    "created_at": note[3].isoformat() if note[3] else None,
                    "updated_at": note[4].isoformat() if note[4] else None,
                    "userId": note[5],
                    "tags": note[6] if note[6] is not None else [],
                }
            return None

def delete_note_by_id(note_id: int) -> bool:
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM notes WHERE id=%s", (note_id,))
            deleted = cur.rowcount > 0
            conn.commit()
            return deleted