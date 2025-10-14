"""
Test script for Scheduler Service
"""

import requests
import json
import time
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8005"

def print_section(title):
    """Print section header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def test_health_check():
    """Test health check endpoint"""
    print_section("1. Health Check Test")

    response = requests.get(f"{BASE_URL}/health")
    data = response.json()

    print(f"Status Code: {response.status_code}")
    print(f"Service: {data['service']} v{data['version']}")
    print(f"Status: {data['status']}")
    print(f"Scheduler Running: {data['scheduler_running']}")
    print(f"Total Jobs: {data['scheduler_info']['total_jobs']}")

    assert response.status_code == 200
    assert data['status'] == 'healthy'
    print("\n✅ Health check passed!")

def test_create_interval_schedule():
    """Test creating an interval-based schedule"""
    print_section("2. Create Interval Schedule Test")

    # Create a schedule that runs every 60 seconds
    payload = {
        "name": "Test Interval Schedule",
        "description": "Runs every 60 seconds for testing",
        "schedule_type": "interval",
        "interval_seconds": 60,
        "task_type": "pipeline",
        "task_config": {
            "url": "https://example.com",
            "formats": ["markdown"],
            "only_main_content": True
        },
        "max_retries": 2,
        "retry_delay": 30
    }

    response = requests.post(
        f"{BASE_URL}/api/v1/scheduler/schedules",
        json=payload
    )
    data = response.json()

    print(f"Status Code: {response.status_code}")
    print(f"Schedule ID: {data['schedule']['schedule_id']}")
    print(f"Name: {data['schedule']['name']}")
    print(f"Type: {data['schedule']['schedule_type']}")
    print(f"Status: {data['schedule']['status']}")
    print(f"Next Run: {data['schedule']['next_run_at']}")

    assert response.status_code == 200
    assert data['schedule']['status'] == 'active'
    print("\n✅ Interval schedule created successfully!")

    return data['schedule']['schedule_id']

def test_create_cron_schedule():
    """Test creating a cron-based schedule"""
    print_section("3. Create Cron Schedule Test")

    # Create a schedule that runs daily at midnight
    payload = {
        "name": "Daily Midnight Collection",
        "description": "Runs daily at 00:00 UTC",
        "schedule_type": "cron",
        "cron_expression": "0 0 * * *",  # Daily at midnight
        "task_type": "data_collection",
        "task_config": {
            "url": "https://example.com/daily",
            "formats": ["markdown"]
        }
    }

    response = requests.post(
        f"{BASE_URL}/api/v1/scheduler/schedules",
        json=payload
    )
    data = response.json()

    print(f"Status Code: {response.status_code}")
    print(f"Schedule ID: {data['schedule']['schedule_id']}")
    print(f"Name: {data['schedule']['name']}")
    print(f"Cron: {data['schedule']['cron_expression']}")
    print(f"Next Run: {data['schedule']['next_run_at']}")

    assert response.status_code == 200
    print("\n✅ Cron schedule created successfully!")

    return data['schedule']['schedule_id']

def test_list_schedules():
    """Test listing all schedules"""
    print_section("4. List Schedules Test")

    response = requests.get(f"{BASE_URL}/api/v1/scheduler/schedules")
    data = response.json()

    print(f"Status Code: {response.status_code}")
    print(f"Total Schedules: {data['total']}")
    print(f"Active: {data['active']}")
    print(f"Paused: {data['paused']}")
    print(f"Disabled: {data['disabled']}")

    print("\nSchedules:")
    for schedule in data['schedules']:
        print(f"  - {schedule['name']} ({schedule['schedule_type']}) - {schedule['status']}")

    assert response.status_code == 200
    assert data['total'] >= 2
    print("\n✅ List schedules passed!")

def test_get_schedule(schedule_id):
    """Test getting a specific schedule"""
    print_section("5. Get Schedule Detail Test")

    response = requests.get(f"{BASE_URL}/api/v1/scheduler/schedules/{schedule_id}")
    data = response.json()

    print(f"Status Code: {response.status_code}")
    print(f"Schedule ID: {data['schedule']['schedule_id']}")
    print(f"Name: {data['schedule']['name']}")
    print(f"Status: {data['schedule']['status']}")
    print(f"Created: {data['schedule']['created_at']}")

    assert response.status_code == 200
    print("\n✅ Get schedule detail passed!")

def test_pause_resume_schedule(schedule_id):
    """Test pausing and resuming a schedule"""
    print_section("6. Pause/Resume Schedule Test")

    # Pause
    response = requests.post(f"{BASE_URL}/api/v1/scheduler/schedules/{schedule_id}/pause")
    data = response.json()

    print(f"Pause Status Code: {response.status_code}")
    print(f"Message: {data['message']}")
    assert response.status_code == 200
    print("✅ Schedule paused")

    time.sleep(1)

    # Resume
    response = requests.post(f"{BASE_URL}/api/v1/scheduler/schedules/{schedule_id}/resume")
    data = response.json()

    print(f"Resume Status Code: {response.status_code}")
    print(f"Message: {data['message']}")
    assert response.status_code == 200
    print("✅ Schedule resumed")

    print("\n✅ Pause/Resume test passed!")

def test_trigger_manually(schedule_id):
    """Test manually triggering a schedule"""
    print_section("7. Manual Trigger Test")

    response = requests.post(f"{BASE_URL}/api/v1/scheduler/schedules/{schedule_id}/trigger")
    data = response.json()

    print(f"Status Code: {response.status_code}")
    print(f"Execution ID: {data['execution']['execution_id']}")
    print(f"Task Type: {data['execution']['task_type']}")
    print(f"Status: {data['execution']['status']}")
    print(f"Message: {data['message']}")

    assert response.status_code == 200
    print("\n✅ Manual trigger test passed!")

    return data['execution']['execution_id']

def test_get_stats():
    """Test getting scheduler stats"""
    print_section("8. Get Stats Test")

    response = requests.get(f"{BASE_URL}/api/v1/scheduler/stats")
    data = response.json()

    print(f"Status Code: {response.status_code}")
    print(f"\nScheduler Info:")
    print(f"  Running: {data['scheduler']['running']}")
    print(f"  Total Jobs: {data['scheduler']['total_jobs']}")

    print(f"\nQueue Stats:")
    print(f"  Queue Size: {data['queue']['queue_size']}")
    print(f"  Running Tasks: {data['queue']['running_tasks']}")
    print(f"  History Total: {data['queue']['history_total']}")
    print(f"  Completed: {data['queue']['history_completed']}")
    print(f"  Failed: {data['queue']['history_failed']}")

    print(f"\nTotal Schedules: {data['schedules_total']}")

    assert response.status_code == 200
    print("\n✅ Get stats test passed!")

def test_delete_schedule(schedule_id):
    """Test deleting a schedule"""
    print_section("9. Delete Schedule Test")

    response = requests.delete(f"{BASE_URL}/api/v1/scheduler/schedules/{schedule_id}")
    data = response.json()

    print(f"Status Code: {response.status_code}")
    print(f"Message: {data['message']}")
    print(f"Deleted Schedule ID: {data['schedule_id']}")

    assert response.status_code == 200
    print("\n✅ Delete schedule test passed!")

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  SCHEDULER SERVICE TEST SUITE")
    print("="*60)

    try:
        # Test 1: Health check
        test_health_check()

        # Test 2: Create interval schedule
        interval_schedule_id = test_create_interval_schedule()

        # Test 3: Create cron schedule
        cron_schedule_id = test_create_cron_schedule()

        # Test 4: List schedules
        test_list_schedules()

        # Test 5: Get schedule detail
        test_get_schedule(interval_schedule_id)

        # Test 6: Pause/Resume
        test_pause_resume_schedule(interval_schedule_id)

        # Test 7: Manual trigger
        execution_id = test_trigger_manually(interval_schedule_id)

        # Wait a bit for execution to process
        print("\nWaiting 3 seconds for task execution...")
        time.sleep(3)

        # Test 8: Get stats
        test_get_stats()

        # Test 9: Delete schedules
        test_delete_schedule(interval_schedule_id)
        test_delete_schedule(cron_schedule_id)

        print("\n" + "="*60)
        print("  ✅ ALL TESTS PASSED!")
        print("="*60 + "\n")

    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()
