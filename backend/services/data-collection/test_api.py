#!/usr/bin/env python3
"""Quick API test script for Data Collection Service"""

import httpx
import json
import asyncio

BASE_URL = "http://localhost:8003"

async def test_endpoints():
    """Test all major endpoints"""

    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Test health check
        print("=" * 60)
        print("1. Testing Health Check")
        print("=" * 60)
        try:
            response = await client.get(f"{BASE_URL}/health")
            print(f"Status: {response.status_code}")
            print(json.dumps(response.json(), indent=2))
        except Exception as e:
            print(f"Error: {e}")

        # 2. Test stats
        print("\n" + "=" * 60)
        print("2. Testing Statistics Endpoint")
        print("=" * 60)
        try:
            response = await client.get(f"{BASE_URL}/api/v1/collection/stats")
            print(f"Status: {response.status_code}")
            print(json.dumps(response.json(), indent=2))
        except Exception as e:
            print(f"Error: {e}")

        # 3. Test scrape endpoint
        print("\n" + "=" * 60)
        print("3. Testing Scrape Endpoint")
        print("=" * 60)
        try:
            scrape_data = {
                "url": "https://example.com",
                "task_name": "Test Scrape Example.com"
            }
            response = await client.post(
                f"{BASE_URL}/api/v1/collection/scrape",
                json=scrape_data
            )
            print(f"Status: {response.status_code}")
            result = response.json()
            print(json.dumps(result, indent=2))

            # Get task_id for status check
            task_id = result.get("task_id")

            if task_id:
                # 4. Wait a bit and check task status
                print("\n" + "=" * 60)
                print("4. Checking Task Status (after 3 seconds)")
                print("=" * 60)
                await asyncio.sleep(3)

                response = await client.get(
                    f"{BASE_URL}/api/v1/collection/tasks/{task_id}"
                )
                print(f"Status: {response.status_code}")
                print(json.dumps(response.json(), indent=2))

        except Exception as e:
            print(f"Error: {e}")

        # 5. Test task listing
        print("\n" + "=" * 60)
        print("5. Testing Task Listing")
        print("=" * 60)
        try:
            response = await client.get(f"{BASE_URL}/api/v1/collection/tasks")
            print(f"Status: {response.status_code}")
            print(json.dumps(response.json(), indent=2))
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_endpoints())
