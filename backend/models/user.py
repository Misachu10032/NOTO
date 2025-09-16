import datetime
from typing import Optional, Dict, Any, List
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


# -----------------------------
# Users CRUD
# -----------------------------

def create_or_update_user(email: str, name: Optional[str] = None) -> Dict[str, Any]:
    """
    Create a new user or update existing user's name.
    Returns the user record as a dictionary.
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Check if user exists
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            existing = cur.fetchone()

            if existing:
                user_id = existing[0]
                # Update existing user's name
                cur.execute(
                    """
                    UPDATE users
                    SET name=%s, updated_at=%s
                    WHERE id=%s
                    RETURNING id, email, name, created_at, updated_at
                    """,
                    (name, datetime.datetime.now(), user_id)
                )
            else:
                # Insert new user
                cur.execute(
                    """
                    INSERT INTO users (email, name, created_at, updated_at)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, email, name, created_at, updated_at
                    """,
                    (email, name, datetime.datetime.now(), datetime.datetime.now())
                )

            user = cur.fetchone()
            conn.commit()

            return {
                "id": user[0],
                "email": user[1],
                "name": user[2],
                "created_at": user[3].isoformat() if user[3] else None,
                "updated_at": user[4].isoformat() if user[4] else None,
            }


def get_all_users() -> List[Dict[str, Any]]:
    """
    Retrieve all users from the database.
    Returns a list of user dictionaries.
    """
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, email, name, created_at, updated_at FROM users ORDER BY id ASC"
            )
            rows = cur.fetchall()

            return [
                {
                    "id": row[0],
                    "email": row[1],
                    "name": row[2],
                    "created_at": row[3].isoformat() if row[3] else None,
                    "updated_at": row[4].isoformat() if row[4] else None,
                }
                for row in rows
            ]
