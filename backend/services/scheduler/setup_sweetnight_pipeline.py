"""
SweetNight GEO Data Pipeline Setup
Automated data collection for SweetNight brand enrichment
"""

import requests
import json
import time
from datetime import datetime

BASE_URL_SCHEDULER = "http://localhost:8005"

def print_section(title):
    """Print formatted section header"""
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}\n")

def create_sweetnight_schedules():
    """Create automated schedules for SweetNight data collection"""
    print_section("🚀 Setting Up SweetNight Data Pipeline")

    schedules = []

    # 1. Official Website - Daily at 2 AM
    print("📌 Creating Schedule 1: SweetNight Official Website (Daily)")
    schedule1 = {
        "name": "SweetNight Official Website - Daily",
        "description": "Collect product information from SweetNight official website",
        "schedule_type": "cron",
        "cron_expression": "0 2 * * *",  # Daily at 2 AM
        "task_type": "pipeline",
        "task_config": {
            "url": "https://www.sweetnight.com",
            "formats": ["markdown"],
            "only_main_content": True
        },
        "max_retries": 3,
        "retry_delay": 300
    }

    try:
        response = requests.post(
            f"{BASE_URL_SCHEDULER}/api/v1/scheduler/schedules",
            json=schedule1
        )
        if response.status_code == 200:
            data = response.json()
            schedules.append(data['schedule'])
            print(f"✅ Created: {data['schedule']['schedule_id']}")
            print(f"   Next Run: {data['schedule']['next_run_at']}")
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

    # 2. Product Pages - Every 12 hours
    print("\n📌 Creating Schedule 2: SweetNight Product Pages (Every 12h)")
    schedule2 = {
        "name": "SweetNight Products - 12 Hour Sync",
        "description": "Sync product details, features, and pricing",
        "schedule_type": "interval",
        "interval_seconds": 43200,  # 12 hours
        "task_type": "pipeline",
        "task_config": {
            "url": "https://www.sweetnight.com/collections/mattresses",
            "formats": ["markdown"],
            "only_main_content": True
        },
        "max_retries": 3,
        "retry_delay": 300
    }

    try:
        response = requests.post(
            f"{BASE_URL_SCHEDULER}/api/v1/scheduler/schedules",
            json=schedule2
        )
        if response.status_code == 200:
            data = response.json()
            schedules.append(data['schedule'])
            print(f"✅ Created: {data['schedule']['schedule_id']}")
            print(f"   Next Run: {data['schedule']['next_run_at']}")
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

    # 3. Reviews & Customer Feedback - Daily at 4 AM
    print("\n📌 Creating Schedule 3: Customer Reviews (Daily)")
    schedule3 = {
        "name": "SweetNight Reviews - Daily Analysis",
        "description": "Collect customer reviews and feedback for sentiment analysis",
        "schedule_type": "cron",
        "cron_expression": "0 4 * * *",  # Daily at 4 AM
        "task_type": "pipeline",
        "task_config": {
            "url": "https://www.sweetnight.com/pages/reviews",
            "formats": ["markdown"],
            "only_main_content": True
        },
        "max_retries": 2,
        "retry_delay": 180
    }

    try:
        response = requests.post(
            f"{BASE_URL_SCHEDULER}/api/v1/scheduler/schedules",
            json=schedule3
        )
        if response.status_code == 200:
            data = response.json()
            schedules.append(data['schedule'])
            print(f"✅ Created: {data['schedule']['schedule_id']}")
            print(f"   Next Run: {data['schedule']['next_run_at']}")
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

    # 4. Competitor Analysis - Weekly on Monday 1 AM
    print("\n📌 Creating Schedule 4: Competitor Analysis (Weekly)")
    schedule4 = {
        "name": "Competitor Analysis - Weekly",
        "description": "Monitor competitor pricing and features",
        "schedule_type": "cron",
        "cron_expression": "0 1 * * 1",  # Monday at 1 AM
        "task_type": "data_collection",
        "task_config": {
            "url": "https://www.casper.com/mattresses",
            "formats": ["markdown"],
            "only_main_content": True
        },
        "max_retries": 2,
        "retry_delay": 300
    }

    try:
        response = requests.post(
            f"{BASE_URL_SCHEDULER}/api/v1/scheduler/schedules",
            json=schedule4
        )
        if response.status_code == 200:
            data = response.json()
            schedules.append(data['schedule'])
            print(f"✅ Created: {data['schedule']['schedule_id']}")
            print(f"   Next Run: {data['schedule']['next_run_at']}")
        else:
            print(f"❌ Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

    return schedules

def trigger_immediate_collection(schedules):
    """Trigger immediate execution for all schedules"""
    print_section("⚡ Triggering Immediate Data Collection")

    execution_ids = []

    for schedule in schedules:
        schedule_id = schedule['schedule_id']
        schedule_name = schedule['name']

        print(f"🔄 Triggering: {schedule_name}")

        try:
            response = requests.post(
                f"{BASE_URL_SCHEDULER}/api/v1/scheduler/schedules/{schedule_id}/trigger"
            )

            if response.status_code == 200:
                data = response.json()
                execution_id = data['execution']['execution_id']
                execution_ids.append(execution_id)
                print(f"✅ Started: Execution ID {execution_id}")
            else:
                print(f"❌ Failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Error: {e}")

        # Small delay between triggers
        time.sleep(1)

    return execution_ids

def monitor_executions(execution_ids):
    """Monitor execution progress"""
    print_section("📊 Monitoring Execution Progress")

    print("Waiting 10 seconds for tasks to process...\n")
    time.sleep(10)

    for exec_id in execution_ids:
        try:
            response = requests.get(
                f"{BASE_URL_SCHEDULER}/api/v1/scheduler/executions/{exec_id}"
            )

            if response.status_code == 200:
                data = response.json()
                execution = data['execution']

                status_emoji = {
                    'pending': '⏳',
                    'running': '🔄',
                    'completed': '✅',
                    'failed': '❌'
                }.get(execution['status'], '❓')

                print(f"{status_emoji} Execution {exec_id}")
                print(f"   Status: {execution['status']}")
                print(f"   Task Type: {execution['task_type']}")
                if execution.get('error_message'):
                    print(f"   Error: {execution['error_message']}")
                print()
            else:
                print(f"❌ Failed to get execution {exec_id}: {response.status_code}\n")
        except Exception as e:
            print(f"❌ Error getting execution {exec_id}: {e}\n")

def get_pipeline_stats():
    """Get statistics from all services"""
    print_section("📈 Pipeline Statistics")

    # Scheduler Stats
    try:
        response = requests.get(f"{BASE_URL_SCHEDULER}/api/v1/scheduler/stats")
        if response.status_code == 200:
            stats = response.json()
            print("🔧 Scheduler Service:")
            print(f"   Active Schedules: {stats['schedules_total']}")
            print(f"   Total Executions: {stats['queue']['history_total']}")
            print(f"   Completed: {stats['queue']['history_completed']}")
            print(f"   Failed: {stats['queue']['history_failed']}")
            print()
    except Exception as e:
        print(f"❌ Scheduler stats error: {e}\n")

    # Collection Stats
    try:
        response = requests.get("http://localhost:8003/api/v1/collection/stats")
        if response.status_code == 200:
            stats = response.json()
            print("📥 Data Collection Service:")
            print(f"   Total Tasks: {stats['total_tasks']}")
            print(f"   Completed: {stats['completed_tasks']}")
            print(f"   Failed: {stats['failed_tasks']}")
            print()
    except Exception as e:
        print(f"❌ Collection stats error: {e}\n")

    # ETL Stats
    try:
        response = requests.get("http://localhost:8004/api/v1/etl/stats")
        if response.status_code == 200:
            stats = response.json()
            print("⚙️ ETL Processing Service:")
            print(f"   Total Tasks: {stats['total_tasks']}")
            print(f"   Entities Extracted: {stats['total_entities_extracted']}")
            print(f"   Entities Loaded: {stats['total_entities_loaded']}")
            print()
    except Exception as e:
        print(f"❌ ETL stats error: {e}\n")

    # Neo4j Stats
    try:
        response = requests.get("http://localhost:8001/api/v1/graph/stats")
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                stats = data['results'][0]
                print("🗄️ Neo4j Database:")
                print(f"   Total Nodes: {stats['total_nodes']}")
                print(f"   Total Relationships: {stats['total_relationships']}")
                print()
    except Exception as e:
        print(f"❌ Neo4j stats error: {e}\n")

def main():
    """Main execution flow"""
    print("\n" + "="*70)
    print("  🌙 SWEETNIGHT GEO DATA PIPELINE SETUP")
    print("="*70)

    # Step 1: Create automated schedules
    schedules = create_sweetnight_schedules()

    if not schedules:
        print("\n❌ No schedules created. Exiting.")
        return

    print(f"\n✅ Successfully created {len(schedules)} automated schedules")

    # Step 2: Trigger immediate collection
    execution_ids = trigger_immediate_collection(schedules)

    if execution_ids:
        # Step 3: Monitor progress
        monitor_executions(execution_ids)

    # Step 4: Show pipeline statistics
    get_pipeline_stats()

    # Summary
    print_section("✅ Setup Complete")
    print("🎯 SweetNight data pipeline is now active!")
    print(f"📅 {len(schedules)} automated schedules are running")
    print(f"⚡ {len(execution_ids)} immediate collections started")
    print("\n📊 Monitor progress at:")
    print("   - Scheduler: http://localhost:8005/health")
    print("   - Data Collection: http://localhost:8003/api/v1/collection/stats")
    print("   - ETL Processing: http://localhost:8004/api/v1/etl/stats")
    print("   - Neo4j Data: http://localhost:8001/api/v1/graph/stats")
    print("\n" + "="*70 + "\n")

if __name__ == "__main__":
    main()
