"""
End-to-End Pipeline Integration Test
Tests the complete data pipeline: Collection → ETL → Neo4j
"""

import requests
import json
import time

BASE_URL_COLLECTION = "http://localhost:8003"
BASE_URL_ETL = "http://localhost:8004"
BASE_URL_SCHEDULER = "http://localhost:8005"
BASE_URL_GRAPH = "http://localhost:8001"

def print_section(title):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}\n")

def test_services_health():
    """Test all services are healthy"""
    print_section("🏥 Services Health Check")

    services = [
        ("Data Collection", f"{BASE_URL_COLLECTION}/health"),
        ("ETL Processing", f"{BASE_URL_ETL}/health"),
        ("Scheduler", f"{BASE_URL_SCHEDULER}/health"),
    ]

    for name, url in services:
        try:
            response = requests.get(url, timeout=5)
            status = response.json()
            print(f"✅ {name:20} - {status.get('status', 'N/A')}")
        except Exception as e:
            print(f"❌ {name:20} - Error: {e}")
            return False

    return True

def test_neo4j_connection():
    """Test Neo4j connection and data"""
    print_section("🔗 Neo4j Connection Test")

    try:
        response = requests.get(f"{BASE_URL_GRAPH}/api/v1/graph/stats", timeout=5)
        stats = response.json()

        if stats.get('success'):
            results = stats['results'][0]
            print(f"✅ Neo4j Connected")
            print(f"   Total Nodes: {results['total_nodes']}")
            print(f"   Total Relationships: {results['total_relationships']}")
            print(f"   Node Types:")
            for node_type in results['node_types']:
                print(f"     - {node_type['type']}: {node_type['count']}")
            return True
        else:
            print(f"❌ Neo4j Stats Error")
            return False
    except Exception as e:
        print(f"❌ Neo4j Connection Error: {e}")
        return False

def test_collection_stats():
    """Test data collection statistics"""
    print_section("📊 Data Collection Stats")

    try:
        response = requests.get(f"{BASE_URL_COLLECTION}/api/v1/collection/stats", timeout=5)
        stats = response.json()

        print(f"Total Tasks: {stats['total_tasks']}")
        print(f"Completed: {stats['completed_tasks']}")
        print(f"Failed: {stats['failed_tasks']}")
        print(f"Items Collected: {stats['total_items_collected']}")

        return True
    except Exception as e:
        print(f"❌ Collection Stats Error: {e}")
        return False

def test_etl_stats():
    """Test ETL processing statistics"""
    print_section("⚙️ ETL Processing Stats")

    try:
        response = requests.get(f"{BASE_URL_ETL}/api/v1/etl/stats", timeout=5)
        stats = response.json()

        print(f"Total Tasks: {stats['total_tasks']}")
        print(f"Completed: {stats['completed_tasks']}")
        print(f"Failed: {stats['failed_tasks']}")
        print(f"Entities Extracted: {stats['total_entities_extracted']}")
        print(f"Entities Loaded: {stats['total_entities_loaded']}")

        return True
    except Exception as e:
        print(f"❌ ETL Stats Error: {e}")
        return False

def test_scheduler_stats():
    """Test scheduler statistics"""
    print_section("📅 Scheduler Stats")

    try:
        response = requests.get(f"{BASE_URL_SCHEDULER}/api/v1/scheduler/stats", timeout=5)
        stats = response.json()

        print(f"Scheduler Running: {stats['scheduler']['running']}")
        print(f"Total Jobs: {stats['scheduler']['total_jobs']}")
        print(f"Queue Size: {stats['queue']['queue_size']}")
        print(f"History Total: {stats['queue']['history_total']}")
        print(f"History Completed: {stats['queue']['history_completed']}")
        print(f"History Failed: {stats['queue']['history_failed']}")
        print(f"Total Schedules: {stats['schedules_total']}")

        return True
    except Exception as e:
        print(f"❌ Scheduler Stats Error: {e}")
        return False

def main():
    """Run all E2E tests"""
    print("\n" + "="*70)
    print("  🚀 END-TO-END PIPELINE INTEGRATION TEST")
    print("="*70)

    results = []

    # Test 1: Services Health
    results.append(("Services Health", test_services_health()))

    # Test 2: Neo4j Connection
    results.append(("Neo4j Connection", test_neo4j_connection()))

    # Test 3: Collection Stats
    results.append(("Collection Stats", test_collection_stats()))

    # Test 4: ETL Stats
    results.append(("ETL Stats", test_etl_stats()))

    # Test 5: Scheduler Stats
    results.append(("Scheduler Stats", test_scheduler_stats()))

    # Summary
    print_section("📋 Test Summary")

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:25} - {status}")

    print(f"\n{'='*70}")
    if passed == total:
        print(f"  ✅ ALL TESTS PASSED ({passed}/{total})")
    else:
        print(f"  ⚠️  SOME TESTS FAILED ({passed}/{total})")
    print("="*70 + "\n")

    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
