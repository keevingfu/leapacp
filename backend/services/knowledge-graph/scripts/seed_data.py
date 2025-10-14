#!/usr/bin/env python
"""
Seed Neo4j database with demo data

Creates sample products, features, scenarios, problems, and relationships
for testing and demonstration purposes.

Usage:
    python scripts/seed_data.py
"""
from neo4j import GraphDatabase
import sys
import os
from uuid import uuid4
from datetime import datetime

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import get_settings


def clear_database(session):
    """Clear all existing data"""
    print("🗑️  Clearing existing data...")
    session.run("MATCH (n) DETACH DELETE n")
    print("  ✓ Database cleared\n")


def create_products(session):
    """Create sample products"""
    print("📦 Creating products...")

    products = [
        {
            "id": str(uuid4()),
            "name": "Sweetnight Mattress",
            "sku": "SN-MATTRESS-001",
            "category": "Sleep Products",
            "brand": "Sweetnight",
            "description": "Premium memory foam mattress with cooling gel technology",
            "price": 599.99,
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid4()),
            "name": "Adjustable Bed Frame",
            "sku": "SN-FRAME-001",
            "category": "Sleep Products",
            "brand": "Sweetnight",
            "description": "Electric adjustable bed frame with USB ports",
            "price": 799.99,
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid4()),
            "name": "Cooling Pillow",
            "sku": "SN-PILLOW-001",
            "category": "Sleep Accessories",
            "brand": "Sweetnight",
            "description": "Gel-infused memory foam pillow for temperature regulation",
            "price": 49.99,
            "created_at": datetime.utcnow().isoformat()
        }
    ]

    for product in products:
        session.run("""
            CREATE (p:Product $props)
            RETURN p.name
        """, props=product)
        print(f"  ✓ {product['name']}")

    return products


def create_features(session, products):
    """Create product features"""
    print("\n✨ Creating features...")

    features = [
        {
            "id": str(uuid4()),
            "name": "Cooling Gel Technology",
            "type": "material",
            "value": "gel-infused",
            "description": "Advanced cooling gel that regulates body temperature"
        },
        {
            "id": str(uuid4()),
            "name": "Memory Foam",
            "type": "material",
            "value": "memory-foam",
            "description": "High-density memory foam for pressure relief"
        },
        {
            "id": str(uuid4()),
            "name": "USB Ports",
            "type": "convenience",
            "value": "2-ports",
            "description": "Built-in USB charging ports for devices"
        },
        {
            "id": str(uuid4()),
            "name": "Electric Adjustment",
            "type": "functionality",
            "value": "motorized",
            "description": "Remote-controlled electric adjustment system"
        }
    ]

    for feature in features:
        session.run("""
            CREATE (f:Feature $props)
            RETURN f.name
        """, props=feature)
        print(f"  ✓ {feature['name']}")

    # Link products to features
    print("\n🔗 Linking products to features...")

    # Sweetnight Mattress has Cooling Gel and Memory Foam
    session.run("""
        MATCH (p:Product {sku: 'SN-MATTRESS-001'})
        MATCH (f:Feature {name: 'Cooling Gel Technology'})
        CREATE (p)-[r:HAS_FEATURE {confidence: 0.95}]->(f)
    """)
    session.run("""
        MATCH (p:Product {sku: 'SN-MATTRESS-001'})
        MATCH (f:Feature {name: 'Memory Foam'})
        CREATE (p)-[r:HAS_FEATURE {confidence: 0.98}]->(f)
    """)

    # Adjustable Bed Frame has USB Ports and Electric Adjustment
    session.run("""
        MATCH (p:Product {sku: 'SN-FRAME-001'})
        MATCH (f:Feature {name: 'USB Ports'})
        CREATE (p)-[r:HAS_FEATURE {confidence: 1.0}]->(f)
    """)
    session.run("""
        MATCH (p:Product {sku: 'SN-FRAME-001'})
        MATCH (f:Feature {name: 'Electric Adjustment'})
        CREATE (p)-[r:HAS_FEATURE {confidence: 1.0}]->(f)
    """)

    # Cooling Pillow has Cooling Gel and Memory Foam
    session.run("""
        MATCH (p:Product {sku: 'SN-PILLOW-001'})
        MATCH (f:Feature {name: 'Cooling Gel Technology'})
        CREATE (p)-[r:HAS_FEATURE {confidence: 0.92}]->(f)
    """)
    session.run("""
        MATCH (p:Product {sku: 'SN-PILLOW-001'})
        MATCH (f:Feature {name: 'Memory Foam'})
        CREATE (p)-[r:HAS_FEATURE {confidence: 0.95}]->(f)
    """)

    print("  ✓ Product-Feature relationships created")

    return features


def create_problems(session):
    """Create problems that products solve"""
    print("\n🎯 Creating problems...")

    problems = [
        {
            "id": str(uuid4()),
            "description": "Sleeping too hot at night",
            "severity": 4,
            "frequency": 85
        },
        {
            "id": str(uuid4()),
            "description": "Back pain from poor mattress support",
            "severity": 5,
            "frequency": 72
        },
        {
            "id": str(uuid4()),
            "description": "Difficulty reading or watching TV in bed",
            "severity": 2,
            "frequency": 60
        },
        {
            "id": str(uuid4()),
            "description": "Neck pain from poor pillow support",
            "severity": 4,
            "frequency": 68
        }
    ]

    for problem in problems:
        session.run("""
            CREATE (p:Problem $props)
            RETURN p.description
        """, props=problem)
        print(f"  ✓ {problem['description']}")

    # Link products to problems they solve
    print("\n🔗 Linking products to problems...")

    session.run("""
        MATCH (prod:Product {sku: 'SN-MATTRESS-001'})
        MATCH (prob:Problem)
        WHERE prob.description IN ['Sleeping too hot at night', 'Back pain from poor mattress support']
        CREATE (prod)-[r:SOLVES {effectiveness: 0.88}]->(prob)
    """)

    session.run("""
        MATCH (prod:Product {sku: 'SN-FRAME-001'})
        MATCH (prob:Problem {description: 'Difficulty reading or watching TV in bed'})
        CREATE (prod)-[r:SOLVES {effectiveness: 0.95}]->(prob)
    """)

    session.run("""
        MATCH (prod:Product {sku: 'SN-PILLOW-001'})
        MATCH (prob:Problem)
        WHERE prob.description IN ['Sleeping too hot at night', 'Neck pain from poor pillow support']
        CREATE (prod)-[r:SOLVES {effectiveness: 0.82}]->(prob)
    """)

    print("  ✓ Product-Problem relationships created")

    return problems


def create_scenarios(session):
    """Create usage scenarios"""
    print("\n🌟 Creating scenarios...")

    scenarios = [
        {
            "id": str(uuid4()),
            "name": "Hot Sleeper",
            "description": "People who experience overheating during sleep",
            "tags": ["temperature", "comfort", "sleep-quality"]
        },
        {
            "id": str(uuid4()),
            "name": "Chronic Back Pain",
            "description": "Users with ongoing back pain issues",
            "tags": ["health", "pain-relief", "support"]
        },
        {
            "id": str(uuid4()),
            "name": "Bedroom Reading",
            "description": "People who read or work in bed regularly",
            "tags": ["lifestyle", "convenience", "comfort"]
        }
    ]

    for scenario in scenarios:
        session.run("""
            CREATE (s:Scenario $props)
            RETURN s.name
        """, props=scenario)
        print(f"  ✓ {scenario['name']}")

    # Link products to scenarios
    print("\n🔗 Linking products to scenarios...")

    session.run("""
        MATCH (p:Product {sku: 'SN-MATTRESS-001'})
        MATCH (s:Scenario)
        WHERE s.name IN ['Hot Sleeper', 'Chronic Back Pain']
        CREATE (p)-[r:APPLIES_TO {relevance: 0.92}]->(s)
    """)

    session.run("""
        MATCH (p:Product {sku: 'SN-FRAME-001'})
        MATCH (s:Scenario {name: 'Bedroom Reading'})
        CREATE (p)-[r:APPLIES_TO {relevance: 0.95}]->(s)
    """)

    session.run("""
        MATCH (p:Product {sku: 'SN-PILLOW-001'})
        MATCH (s:Scenario {name: 'Hot Sleeper'})
        CREATE (p)-[r:APPLIES_TO {relevance: 0.85}]->(s)
    """)

    print("  ✓ Product-Scenario relationships created")

    return scenarios


def create_user_groups(session):
    """Create user group segments"""
    print("\n👥 Creating user groups...")

    user_groups = [
        {
            "id": str(uuid4()),
            "name": "Health-Conscious Adults",
            "demographics": {
                "age_range": "30-55",
                "income": "middle-upper"
            },
            "behavior": {
                "research_intensive": True,
                "price_sensitive": False
            }
        },
        {
            "id": str(uuid4()),
            "name": "Budget Shoppers",
            "demographics": {
                "age_range": "25-40",
                "income": "lower-middle"
            },
            "behavior": {
                "research_intensive": False,
                "price_sensitive": True
            }
        }
    ]

    for group in user_groups:
        session.run("""
            CREATE (u:UserGroup $props)
            RETURN u.name
        """, props=group)
        print(f"  ✓ {group['name']}")

    # Link products to user groups
    print("\n🔗 Linking products to user groups...")

    session.run("""
        MATCH (p:Product {sku: 'SN-MATTRESS-001'})
        MATCH (u:UserGroup {name: 'Health-Conscious Adults'})
        CREATE (p)-[r:TARGETS {priority: 1}]->(u)
    """)

    session.run("""
        MATCH (p:Product {sku: 'SN-PILLOW-001'})
        MATCH (u:UserGroup {name: 'Budget Shoppers'})
        CREATE (p)-[r:TARGETS {priority: 2}]->(u)
    """)

    print("  ✓ Product-UserGroup relationships created")

    return user_groups


def print_stats(session):
    """Print database statistics"""
    print("\n📊 Database Statistics:")

    # Count nodes by type
    result = session.run("""
        MATCH (n)
        RETURN labels(n)[0] as type, count(*) as count
        ORDER BY count DESC
    """)

    print("\n  Node counts:")
    for record in result:
        print(f"    {record['type']}: {record['count']}")

    # Count relationships by type
    result = session.run("""
        MATCH ()-[r]->()
        RETURN type(r) as type, count(*) as count
        ORDER BY count DESC
    """)

    print("\n  Relationship counts:")
    for record in result:
        print(f"    {record['type']}: {record['count']}")


def seed_database():
    """Main function to seed the database"""
    settings = get_settings()

    print(f"🌱 Seeding Neo4j database at {settings.NEO4J_URI}...")
    print(f"   User: {settings.NEO4J_USER}\n")

    driver = GraphDatabase.driver(
        settings.NEO4J_URI,
        auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
    )

    try:
        # Test connection
        driver.verify_connectivity()
        print("✅ Connected to Neo4j\n")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return

    with driver.session() as session:
        # Clear existing data
        clear_database(session)

        # Create entities
        products = create_products(session)
        features = create_features(session, products)
        problems = create_problems(session)
        scenarios = create_scenarios(session)
        user_groups = create_user_groups(session)

        # Print statistics
        print_stats(session)

    driver.close()

    print("\n✅ Database seeding complete!")
    print("\nNext steps:")
    print("  1. Test API: curl http://localhost:8001/api/v1/graph/entities")
    print("  2. View stats: curl http://localhost:8001/api/v1/graph/stats")
    print("  3. View in browser: http://localhost:7475 (Neo4j Browser)")
    print("\nSample Cypher queries:")
    print("  MATCH (n) RETURN n LIMIT 25")
    print("  MATCH (p:Product)-[r:HAS_FEATURE]->(f:Feature) RETURN p,r,f")
    print("  MATCH (p:Product)-[r:SOLVES]->(prob:Problem) RETURN p,r,prob")


if __name__ == "__main__":
    seed_database()
