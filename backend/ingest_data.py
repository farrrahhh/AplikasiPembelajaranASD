#!/usr/bin/env python3
"""
Script to ingest lecture materials from extracted PDF contents
Run this after extracting PDF contents to populate the database
"""

import sys
import json
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.config import settings
from app.db import Base
from app.ingestion import ingest_pdf_contents


def main():
    """Run the ingestion process"""

    # Use SQLite for local development
    database_url = "sqlite:///./asd_learning.db"
    
    # Create database connection
    engine = create_engine(database_url, echo=False)

    # Create tables
    Base.metadata.create_all(bind=engine)

    # Create session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # Path to extracted PDF contents
        json_file = Path(__file__).parent / "pdf_contents.json"

        print(f"Starting ingestion from {json_file}...")

        result = ingest_pdf_contents(db, str(json_file))

        print("\n=== Ingestion Summary ===")
        print(f"Total Materials Ingested: {result['total_materials']}")
        print(f"Total Chunks Created: {result['total_chunks']}")
        print(f"Total Concepts Extracted: {result['total_concepts']}")
        print(f"Total Code Examples Extracted: {result['total_code_examples']}")
        print(f"Total Exercises Extracted: {result['total_exercises']}")

        if result["errors"]:
            print(f"\nErrors encountered ({len(result['errors'])}):")
            for error in result["errors"]:
                print(f"  - {error}")
        else:
            print("\nNo errors encountered!")

        print("\n✓ Ingestion completed successfully!")

    except Exception as e:
        print(f"Error during ingestion: {str(e)}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
