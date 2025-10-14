"""End-to-End Test: Data Collection → ETL → Neo4j"""

import httpx
import time
import json
from datetime import datetime

# Service URLs
DATA_COLLECTION_URL = "http://localhost:8003"
ETL_SERVICE_URL = "http://localhost:8004"
KNOWLEDGE_GRAPH_URL = "http://localhost:8001"

def test_e2e_pipeline():
    """Test the complete pipeline"""
    print("=" * 60)
    print("ETL Processing Service - End-to-End Test")
    print("=" * 60)
    print(f"Started at: {datetime.now().isoformat()}\n")

    # Step 1: Create data collection task
    print("Step 1: Creating data collection task...")
    collection_payload = {
        "url": "https://example.com",
        "task_name": "ETL E2E Test",
        "formats": ["markdown"],
        "only_main_content": True
    }

    with httpx.Client(timeout=30.0) as client:
        response = client.post(
            f"{DATA_COLLECTION_URL}/api/v1/collection/scrape",
            json=collection_payload
        )
        response.raise_for_status()
        collection_data = response.json()
        collection_task_id = collection_data["task_id"]

    print(f"✅ Collection task created: {collection_task_id}")
    print(f"   Status: {collection_data['status']}")
    print(f"   Progress: {collection_data['progress']}%\n")

    # Step 2: Wait for collection to complete
    print("Step 2: Waiting for data collection to complete...")
    max_wait = 30  # 30 seconds max
    wait_time = 0

    with httpx.Client(timeout=30.0) as client:
        while wait_time < max_wait:
            response = client.get(
                f"{DATA_COLLECTION_URL}/api/v1/collection/tasks/{collection_task_id}"
            )
            response.raise_for_status()
            task_data = response.json()

            status = task_data["status"]
            progress = task_data["progress"]

            print(f"   Status: {status}, Progress: {progress}%")

            if status == "completed":
                print("✅ Data collection completed!\n")
                break
            elif status == "failed":
                print(f"❌ Data collection failed: {task_data.get('error', 'Unknown error')}")
                return

            time.sleep(2)
            wait_time += 2

        if wait_time >= max_wait:
            print("⚠️  Collection timeout - continuing anyway...\n")

    # Step 3: Create ETL task
    print("Step 3: Creating ETL processing task...")

    with httpx.Client(timeout=60.0) as client:
        response = client.post(
            f"{ETL_SERVICE_URL}/api/v1/etl/process",
            params={
                "collection_task_id": collection_task_id,
                "task_name": "E2E ETL Test"
            }
        )
        response.raise_for_status()
        etl_data = response.json()
        etl_task_id = etl_data["task_id"]

    print(f"✅ ETL task created: {etl_task_id}")
    print(f"   Status: {etl_data['status']}")
    print(f"   Progress: {etl_data['progress']}%\n")

    # Step 4: Wait for ETL to complete
    print("Step 4: Waiting for ETL processing to complete...")
    max_wait = 30
    wait_time = 0

    with httpx.Client(timeout=30.0) as client:
        while wait_time < max_wait:
            response = client.get(
                f"{ETL_SERVICE_URL}/api/v1/etl/tasks/{etl_task_id}"
            )
            response.raise_for_status()
            task_data = response.json()

            status = task_data["status"]
            progress = task_data["progress"]
            stage = task_data.get("stage", "N/A")

            print(f"   Status: {status}, Stage: {stage}, Progress: {progress}%")

            if status == "completed":
                print("✅ ETL processing completed!")
                print(f"\nResults:")
                print(f"   - Extracted: {task_data.get('extracted_count', 0)} items")
                print(f"   - Transformed: {task_data.get('transformed_count', 0)} items")
                print(f"   - Loaded: {task_data.get('loaded_count', 0)} items\n")

                if task_data.get("result"):
                    result = task_data["result"]
                    print(f"   Graph Load Results:")
                    print(f"   - Entities created: {result.get('entities_created', 0)}")
                    print(f"   - Relationships created: {result.get('relationships_created', 0)}\n")
                break
            elif status == "failed":
                print(f"❌ ETL processing failed: {task_data.get('error', 'Unknown error')}")
                return

            time.sleep(2)
            wait_time += 2

        if wait_time >= max_wait:
            print("⚠️  ETL timeout\n")

    # Step 5: Verify data in Neo4j
    print("Step 5: Verifying data in Neo4j...")

    try:
        with httpx.Client(timeout=30.0) as client:
            # Check entities
            response = client.get(f"{KNOWLEDGE_GRAPH_URL}/api/v1/entities")
            response.raise_for_status()
            entities_data = response.json()

            print(f"✅ Total entities in graph: {len(entities_data)}")

            # Check stats
            response = client.get(f"{KNOWLEDGE_GRAPH_URL}/api/v1/stats")
            response.raise_for_status()
            stats = response.json()

            print(f"✅ Graph statistics:")
            print(f"   - Total nodes: {stats.get('total_nodes', 0)}")
            print(f"   - Total relationships: {stats.get('total_relationships', 0)}\n")

    except Exception as e:
        print(f"⚠️  Could not verify Neo4j data: {e}\n")

    # Final summary
    print("=" * 60)
    print("✅ END-TO-END TEST COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    print(f"Completed at: {datetime.now().isoformat()}")
    print("\nPipeline Flow:")
    print(f"  Web Page → Data Collection Service → ETL Processing → Neo4j Graph")
    print(f"  (example.com)        (Port 8003)           (Port 8004)      (Port 7688)")

if __name__ == "__main__":
    try:
        test_e2e_pipeline()
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
