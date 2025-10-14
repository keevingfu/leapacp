#!/bin/bash

echo "🚀 Testing Simple Data Pipeline"
echo "================================"
echo ""

# Test 1: Collect data from a simple page
echo "📥 Step 1: Data Collection"
COLLECTION_RESPONSE=$(curl -s -X POST http://localhost:8003/api/v1/collection/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "formats": ["markdown"],
    "only_main_content": true
  }')

TASK_ID=$(echo $COLLECTION_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['task_id'])")
echo "✅ Collection task created: $TASK_ID"
echo ""

# Wait for collection to complete
echo "⏳ Waiting for collection (10s)..."
sleep 10

# Check collection status
COLLECTION_STATUS=$(curl -s http://localhost:8003/api/v1/collection/tasks/$TASK_ID | python3 -c "import sys, json; print(json.load(sys.stdin)['status'])")
echo "Collection status: $COLLECTION_STATUS"
echo ""

if [ "$COLLECTION_STATUS" = "completed" ]; then
  echo "✅ Data collection successful!"
  echo ""
  
  # Test 2: ETL Processing
  echo "⚙️ Step 2: ETL Processing"
  ETL_RESPONSE=$(curl -s -X POST "http://localhost:8004/api/v1/etl/process?collection_task_id=$TASK_ID&task_name=Test+Pipeline")
  
  ETL_TASK_ID=$(echo $ETL_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['task_id'])")
  echo "✅ ETL task created: $ETL_TASK_ID"
  echo ""
  
  # Wait for ETL to complete
  echo "⏳ Waiting for ETL processing (10s)..."
  sleep 10
  
  # Check ETL status
  ETL_STATUS=$(curl -s http://localhost:8004/api/v1/etl/tasks/$ETL_TASK_ID | python3 -c "import sys, json; print(json.load(sys.stdin)['status'])")
  echo "ETL status: $ETL_STATUS"
  echo ""
  
  if [ "$ETL_STATUS" = "completed" ]; then
    echo "✅ ETL processing successful!"
    echo ""
    
    # Test 3: Check Neo4j
    echo "🗄️ Step 3: Verify Neo4j Data"
    curl -s http://localhost:8001/api/v1/graph/stats | python3 -m json.tool
    echo ""
    echo "✅ Pipeline test complete!"
  else
    echo "❌ ETL processing failed: $ETL_STATUS"
  fi
else
  echo "❌ Data collection failed: $COLLECTION_STATUS"
fi
