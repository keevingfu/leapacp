"""
Check SweetNight Data Pipeline Status
Monitor task execution and data enrichment progress
"""

import requests
import json
from datetime import datetime

BASE_URL_COLLECTION = "http://localhost:8003"
BASE_URL_ETL = "http://localhost:8004"
BASE_URL_SCHEDULER = "http://localhost:8005"
BASE_URL_GRAPH = "http://localhost:8001"

def print_section(title):
    """Print formatted section header"""
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}\n")

def check_schedules():
    """Check all active schedules"""
    print_section("📅 Active Schedules")

    try:
        response = requests.get(f"{BASE_URL_SCHEDULER}/api/v1/scheduler/schedules")
        if response.status_code == 200:
            data = response.json()

            print(f"Total Schedules: {data['total']}")
            print(f"Active: {data['active']}")
            print(f"Paused: {data['paused']}")
            print(f"Disabled: {data['disabled']}\n")

            if data['schedules']:
                print("Schedules List:")
                for schedule in data['schedules']:
                    status_emoji = '✅' if schedule['status'] == 'active' else '⏸️'
                    print(f"{status_emoji} {schedule['name']}")
                    print(f"   ID: {schedule['schedule_id']}")
                    print(f"   Type: {schedule['schedule_type']}")
                    if schedule['schedule_type'] == 'cron':
                        print(f"   Cron: {schedule.get('cron_expression', 'N/A')}")
                    else:
                        print(f"   Interval: {schedule.get('interval_seconds', 0)}s")
                    print(f"   Next Run: {schedule.get('next_run_at', 'N/A')}")
                    print()

            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def check_task_execution():
    """Check recent task executions"""
    print_section("⚡ Recent Task Executions")

    try:
        response = requests.get(f"{BASE_URL_SCHEDULER}/api/v1/scheduler/executions")
        if response.status_code == 200:
            data = response.json()

            if data['executions']:
                print(f"Total Executions: {data['total']}")
                print(f"Showing last {len(data['executions'])} executions:\n")

                for exec in data['executions'][:10]:  # Show last 10
                    status_emoji = {
                        'pending': '⏳',
                        'running': '🔄',
                        'completed': '✅',
                        'failed': '❌'
                    }.get(exec['status'], '❓')

                    print(f"{status_emoji} Execution {exec['execution_id'][:8]}...")
                    print(f"   Schedule: {exec['schedule_name']}")
                    print(f"   Status: {exec['status']}")
                    print(f"   Started: {exec.get('started_at', 'N/A')}")
                    if exec['status'] == 'completed':
                        print(f"   Completed: {exec.get('completed_at', 'N/A')}")
                    if exec.get('error_message'):
                        print(f"   Error: {exec['error_message']}")
                    print()
            else:
                print("No executions found")

            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def check_collection_tasks():
    """Check data collection tasks"""
    print_section("📥 Data Collection Tasks")

    try:
        # Get stats
        response = requests.get(f"{BASE_URL_COLLECTION}/api/v1/collection/stats")
        if response.status_code == 200:
            stats = response.json()
            print(f"Total Tasks: {stats['total_tasks']}")
            print(f"Completed: {stats['completed_tasks']}")
            print(f"Failed: {stats['failed_tasks']}")
            print(f"Pending: {stats['pending_tasks']}")
            print(f"Items Collected: {stats['total_items_collected']}\n")

        # Get recent tasks
        response = requests.get(f"{BASE_URL_COLLECTION}/api/v1/collection/tasks")
        if response.status_code == 200:
            tasks = response.json()

            if tasks:
                print(f"Recent Tasks (showing last {min(5, len(tasks))}):\n")
                for task in tasks[:5]:
                    status_emoji = {
                        'pending': '⏳',
                        'processing': '🔄',
                        'completed': '✅',
                        'failed': '❌'
                    }.get(task['status'], '❓')

                    print(f"{status_emoji} Task {task['task_id'][:8]}...")
                    print(f"   URL: {task.get('url', 'N/A')[:60]}...")
                    print(f"   Status: {task['status']}")
                    print(f"   Created: {task.get('created_at', 'N/A')}")
                    if task.get('error_message'):
                        print(f"   Error: {task['error_message']}")
                    print()

            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def check_etl_tasks():
    """Check ETL processing tasks"""
    print_section("⚙️ ETL Processing Tasks")

    try:
        # Get stats
        response = requests.get(f"{BASE_URL_ETL}/api/v1/etl/stats")
        if response.status_code == 200:
            stats = response.json()
            print(f"Total Tasks: {stats['total_tasks']}")
            print(f"Completed: {stats['completed_tasks']}")
            print(f"Failed: {stats['failed_tasks']}")
            print(f"Pending: {stats['pending_tasks']}")
            print(f"Entities Extracted: {stats['total_entities_extracted']}")
            print(f"Entities Loaded: {stats['total_entities_loaded']}\n")

        # Get recent tasks
        response = requests.get(f"{BASE_URL_ETL}/api/v1/etl/tasks")
        if response.status_code == 200:
            tasks = response.json()

            if tasks:
                print(f"Recent Tasks (showing last {min(5, len(tasks))}):\n")
                for task in tasks[:5]:
                    status_emoji = {
                        'pending': '⏳',
                        'processing': '🔄',
                        'completed': '✅',
                        'failed': '❌'
                    }.get(task['status'], '❓')

                    print(f"{status_emoji} Task {task['task_id'][:8]}...")
                    print(f"   Status: {task['status']}")
                    print(f"   Entities: {task.get('entities_extracted', 0)} extracted")
                    print(f"   Created: {task.get('created_at', 'N/A')}")
                    if task.get('error_message'):
                        print(f"   Error: {task['error_message']}")
                    print()

            return True
        else:
            print(f"❌ Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def check_neo4j_data():
    """Check Neo4j database status"""
    print_section("🗄️ Neo4j Database Status")

    try:
        response = requests.get(f"{BASE_URL_GRAPH}/api/v1/graph/stats")
        if response.status_code == 200:
            data = response.json()

            if data.get('success'):
                stats = data['results'][0]
                print(f"Total Nodes: {stats['total_nodes']}")
                print(f"Total Relationships: {stats['total_relationships']}\n")

                print("Node Types:")
                for node_type in stats['node_types']:
                    print(f"  {node_type['type']:20} : {node_type['count']:4} nodes")
                print()

                print("Relationship Types:")
                for rel_type in stats['relationship_types']:
                    print(f"  {rel_type['type']:20} : {rel_type['count']:4} relationships")

                return True
            else:
                print("❌ Failed to get Neo4j stats")
                return False
        else:
            print(f"❌ Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main execution flow"""
    print("\n" + "="*70)
    print("  🌙 SWEETNIGHT DATA PIPELINE STATUS CHECK")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)

    # Check all components
    schedules_ok = check_schedules()
    executions_ok = check_task_execution()
    collection_ok = check_collection_tasks()
    etl_ok = check_etl_tasks()
    neo4j_ok = check_neo4j_data()

    # Summary
    print_section("📊 Overall Status")

    components = [
        ("Schedules", schedules_ok),
        ("Task Executions", executions_ok),
        ("Data Collection", collection_ok),
        ("ETL Processing", etl_ok),
        ("Neo4j Database", neo4j_ok)
    ]

    all_ok = all(status for _, status in components)

    for name, status in components:
        status_icon = "✅" if status else "❌"
        print(f"{status_icon} {name:20} : {'OK' if status else 'ERROR'}")

    print("\n" + "="*70)
    if all_ok:
        print("  ✅ ALL COMPONENTS OPERATIONAL")
    else:
        print("  ⚠️  SOME COMPONENTS NEED ATTENTION")
    print("="*70 + "\n")

if __name__ == "__main__":
    main()
