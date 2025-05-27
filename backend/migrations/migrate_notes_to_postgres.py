import json
import psycopg2

# Update these as needed
NOTES_FILE = "notes.json"
POSTGRES_URI = "dbname=noto user=postgres password=john222 host=localhost"

def load_notes():
    with open(NOTES_FILE, "r") as f:
        return json.load(f)

def migrate_notes():
    notes = load_notes()
    conn = psycopg2.connect(POSTGRES_URI)
    cur = conn.cursor()
    for note in notes:
        # Ensure tags is a list or set, or default to empty list
        tags = note.get("tags", [])
        # Remove duplicates if any
        tags = list(set(tags))
        cur.execute(
            """
            INSERT INTO notes (keyword, content, created_at, updated_at, userId, tags)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
            """,
            (
                note.get("keyword"),
                note.get("content"),
                note.get("created_at"),
                note.get("updated_at"),
                note.get("userId"),
                tags
            )
        )
    conn.commit()
    cur.close()
    conn.close()
    print(f"Migrated {len(notes)} notes to Postgres.")

if __name__ == "__main__":
    migrate_notes()