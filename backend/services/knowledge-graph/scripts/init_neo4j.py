#!/usr/bin/env python
"""
Initialize Neo4j database with constraints and indexes

Run this script once after database setup to create:
- Unique constraints on entity IDs
- Indexes on frequently queried properties
- Full-text search indexes

Usage:
    python scripts/init_neo4j.py
"""
from neo4j import GraphDatabase
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import get_settings


def init_database():
    """Create constraints and indexes in Neo4j database"""
    settings = get_settings()

    print(f"Connecting to Neo4j at {settings.NEO4J_URI}...")
    driver = GraphDatabase.driver(
        settings.NEO4J_URI,
        auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
    )

    try:
        # Test connection
        driver.verify_connectivity()
        print("✓ Connected successfully\n")
    except Exception as e:
        print(f"✗ Connection failed: {e}")
        return

    # Define constraints (unique entity IDs)
    constraints = [
        "CREATE CONSTRAINT product_id IF NOT EXISTS FOR (p:Product) REQUIRE p.id IS UNIQUE",
        "CREATE CONSTRAINT feature_id IF NOT EXISTS FOR (f:Feature) REQUIRE f.id IS UNIQUE",
        "CREATE CONSTRAINT scenario_id IF NOT EXISTS FOR (s:Scenario) REQUIRE s.id IS UNIQUE",
        "CREATE CONSTRAINT problem_id IF NOT EXISTS FOR (p:Problem) REQUIRE p.id IS UNIQUE",
        "CREATE CONSTRAINT usergroup_id IF NOT EXISTS FOR (u:UserGroup) REQUIRE u.id IS UNIQUE",
        "CREATE CONSTRAINT competitor_id IF NOT EXISTS FOR (c:Competitor) REQUIRE c.id IS UNIQUE",
        "CREATE CONSTRAINT offer_id IF NOT EXISTS FOR (o:Offer) REQUIRE o.offer_id IS UNIQUE",
        "CREATE CONSTRAINT merchant_id IF NOT EXISTS FOR (m:Merchant) REQUIRE m.merchant_id IS UNIQUE",
    ]

    # Define indexes (frequently queried properties)
    indexes = [
        "CREATE INDEX product_sku IF NOT EXISTS FOR (p:Product) ON (p.sku)",
        "CREATE INDEX product_category IF NOT EXISTS FOR (p:Product) ON (p.category)",
        "CREATE INDEX product_brand IF NOT EXISTS FOR (p:Product) ON (p.brand)",
        "CREATE INDEX offer_region IF NOT EXISTS FOR (o:Offer) ON (o.region)",
        "CREATE INDEX offer_merchant IF NOT EXISTS FOR (o:Offer) ON (o.merchant_id)",
    ]

    # Define full-text indexes (search capability)
    fulltext_indexes = [
        "CREATE FULLTEXT INDEX product_search IF NOT EXISTS FOR (p:Product) ON EACH [p.name, p.description]",
    ]

    with driver.session() as session:
        # Create constraints
        print("Creating unique constraints...")
        for constraint in constraints:
            try:
                session.run(constraint)
                # Extract entity type from constraint
                entity_type = constraint.split("FOR (")[1].split(":")[1].split(")")[0]
                print(f"  ✓ {entity_type} ID uniqueness constraint")
            except Exception as e:
                print(f"  ✗ Failed: {e}")

        # Create indexes
        print("\nCreating property indexes...")
        for index in indexes:
            try:
                session.run(index)
                # Extract index name
                index_name = index.split("INDEX ")[1].split(" IF")[0]
                print(f"  ✓ {index_name}")
            except Exception as e:
                print(f"  ✗ Failed: {e}")

        # Create full-text indexes
        print("\nCreating full-text search indexes...")
        for ft_index in fulltext_indexes:
            try:
                session.run(ft_index)
                index_name = ft_index.split("INDEX ")[1].split(" IF")[0]
                print(f"  ✓ {index_name} (full-text)")
            except Exception as e:
                print(f"  ✗ Failed: {e}")

    driver.close()
    print("\n✅ Database initialization complete!")
    print("\nNext steps:")
    print("  1. Start the service: python main.py")
    print("  2. Check health: curl http://localhost:8001/api/v1/graph/health")
    print("  3. View API docs: http://localhost:8001/docs")


if __name__ == "__main__":
    init_database()
