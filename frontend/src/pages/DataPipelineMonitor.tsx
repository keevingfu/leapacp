import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Activity,
  Database,
  Server,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

interface ServiceStatus {
  name: string
  status: 'healthy' | 'unhealthy' | 'unknown'
  url: string
  responseTime?: number
}

interface PipelineStats {
  collection: {
    total: number
    completed: number
    failed: number
    pending: number
  }
  etl: {
    total: number
    completed: number
    failed: number
    pending: number
    entitiesExtracted: number
    entitiesLoaded: number
  }
  scheduler: {
    running: boolean
    totalJobs: number
    queueSize: number
    historyTotal: number
    historyCompleted: number
    historyFailed: number
  }
  neo4j: {
    totalNodes: number
    totalRelationships: number
    nodeTypes: Array<{ type: string; count: number }>
  }
}

interface TaskExecution {
  task_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  method: string
  progress: number
  created_at: string
  started_at?: string
  completed_at?: string
  error?: string
}

export default function DataPipelineMonitor() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Data Collection', status: 'unknown', url: 'http://localhost:8003/health' },
    { name: 'ETL Processing', status: 'unknown', url: 'http://localhost:8004/health' },
    { name: 'Scheduler', status: 'unknown', url: 'http://localhost:8005/health' },
    { name: 'Knowledge Graph', status: 'unknown', url: 'http://localhost:8001/health' }
  ])

  const [stats, setStats] = useState<PipelineStats | null>(null)
  const [collectionTasks, setCollectionTasks] = useState<TaskExecution[]>([])
  const [etlTasks, setEtlTasks] = useState<TaskExecution[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Fetch service health status
  const checkServiceHealth = async () => {
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        const startTime = performance.now()
        try {
          const response = await fetch(service.url, { signal: AbortSignal.timeout(5000) })
          const endTime = performance.now()
          const responseTime = Math.round(endTime - startTime)

          if (response.ok) {
            return { ...service, status: 'healthy' as const, responseTime }
          } else {
            return { ...service, status: 'unhealthy' as const }
          }
        } catch (error) {
          return { ...service, status: 'unhealthy' as const }
        }
      })
    )
    setServices(updatedServices)
  }

  // Fetch pipeline statistics
  const fetchPipelineStats = async () => {
    try {
      const [collectionRes, etlRes, schedulerRes, neo4jRes] = await Promise.all([
        fetch('http://localhost:8003/api/v1/collection/stats'),
        fetch('http://localhost:8004/api/v1/etl/stats'),
        fetch('http://localhost:8005/api/v1/scheduler/stats'),
        fetch('http://localhost:8001/api/v1/graph/stats')
      ])

      const collectionData = await collectionRes.json()
      const etlData = await etlRes.json()
      const schedulerData = await schedulerRes.json()
      const neo4jData = await neo4jRes.json()

      setStats({
        collection: {
          total: collectionData.total_tasks,
          completed: collectionData.completed_tasks,
          failed: collectionData.failed_tasks,
          pending: collectionData.pending_tasks
        },
        etl: {
          total: etlData.total_tasks,
          completed: etlData.completed_tasks,
          failed: etlData.failed_tasks,
          pending: etlData.pending_tasks,
          entitiesExtracted: etlData.total_entities_extracted,
          entitiesLoaded: etlData.total_entities_loaded
        },
        scheduler: {
          running: schedulerData.scheduler.running,
          totalJobs: schedulerData.scheduler.total_jobs,
          queueSize: schedulerData.queue.queue_size,
          historyTotal: schedulerData.queue.history_total,
          historyCompleted: schedulerData.queue.history_completed,
          historyFailed: schedulerData.queue.history_failed
        },
        neo4j: {
          totalNodes: neo4jData.results[0].total_nodes,
          totalRelationships: neo4jData.results[0].total_relationships,
          nodeTypes: neo4jData.results[0].node_types
        }
      })
    } catch (error) {
      console.error('Failed to fetch pipeline stats:', error)
    }
  }

  // Fetch recent tasks
  const fetchRecentTasks = async () => {
    try {
      const [collectionRes, etlRes] = await Promise.all([
        fetch('http://localhost:8003/api/v1/collection/tasks'),
        fetch('http://localhost:8004/api/v1/etl/tasks')
      ])

      const collectionData = await collectionRes.json()
      const etlData = await etlRes.json()

      setCollectionTasks(collectionData.tasks || [])
      setEtlTasks(etlData.tasks || [])
    } catch (error) {
      console.error('Failed to fetch recent tasks:', error)
    }
  }

  // Refresh all data
  const refreshAll = async () => {
    setIsRefreshing(true)
    await Promise.all([
      checkServiceHealth(),
      fetchPipelineStats(),
      fetchRecentTasks()
    ])
    setLastUpdate(new Date())
    setIsRefreshing(false)
  }

  // Auto-refresh every 10 seconds
  useEffect(() => {
    refreshAll()

    if (autoRefresh) {
      const interval = setInterval(refreshAll, 10000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  // Calculate success rate
  const successRate = useMemo(() => {
    if (!stats) return { collection: 0, etl: 0 }

    const collectionRate = stats.collection.total > 0
      ? ((stats.collection.completed / stats.collection.total) * 100).toFixed(1)
      : '0'

    const etlRate = stats.etl.total > 0
      ? ((stats.etl.completed / stats.etl.total) * 100).toFixed(1)
      : '0'

    return { collection: collectionRate, etl: etlRate }
  }, [stats])

  // Generate report
  const generateReport = () => {
    if (!stats) return

    const report = {
      timestamp: new Date().toISOString(),
      services: services.map(s => ({ name: s.name, status: s.status, responseTime: s.responseTime })),
      statistics: stats,
      successRate,
      recentTasks: {
        collection: collectionTasks.slice(0, 10),
        etl: etlTasks.slice(0, 10)
      }
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pipeline-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'unhealthy':
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      healthy: 'default',
      completed: 'default',
      unhealthy: 'destructive',
      failed: 'destructive',
      pending: 'secondary',
      processing: 'secondary',
      unknown: 'outline'
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const getTrendIcon = (current: number, total: number) => {
    const rate = total > 0 ? (current / total) * 100 : 0
    if (rate >= 80) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (rate >= 50) return <Minus className="h-4 w-4 text-yellow-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Pipeline Monitor</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time monitoring and reporting • Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-pulse' : ''}`} />
            Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAll}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={generateReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <Card key={service.name} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{service.name}</span>
              </div>
              {getStatusIcon(service.status)}
            </div>
            <div className="space-y-1">
              {getStatusBadge(service.status)}
              {service.responseTime && (
                <p className="text-xs text-muted-foreground mt-2">
                  Response: {service.responseTime}ms
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Statistics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Data Collection Stats */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Data Collection</h3>
              {getTrendIcon(stats.collection.completed, stats.collection.total)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium">{stats.collection.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed:</span>
                <span className="font-medium text-green-600">{stats.collection.completed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Failed:</span>
                <span className="font-medium text-red-600">{stats.collection.failed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Success Rate:</span>
                <span className="font-medium">{successRate.collection}%</span>
              </div>
            </div>
          </Card>

          {/* ETL Processing Stats */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">ETL Processing</h3>
              {getTrendIcon(stats.etl.completed, stats.etl.total)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium">{stats.etl.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed:</span>
                <span className="font-medium text-green-600">{stats.etl.completed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Entities Loaded:</span>
                <span className="font-medium">{stats.etl.entitiesLoaded}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Success Rate:</span>
                <span className="font-medium">{successRate.etl}%</span>
              </div>
            </div>
          </Card>

          {/* Scheduler Stats */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Scheduler</h3>
              {stats.scheduler.running ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium">
                  {stats.scheduler.running ? 'Running' : 'Stopped'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Jobs:</span>
                <span className="font-medium">{stats.scheduler.totalJobs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Queue Size:</span>
                <span className="font-medium">{stats.scheduler.queueSize}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">History:</span>
                <span className="font-medium">{stats.scheduler.historyTotal}</span>
              </div>
            </div>
          </Card>

          {/* Neo4j Stats */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Neo4j Database</h3>
              <Database className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nodes:</span>
                <span className="font-medium">{stats.neo4j.totalNodes}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Relationships:</span>
                <span className="font-medium">{stats.neo4j.totalRelationships}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Node Types:</span>
                <span className="font-medium">{stats.neo4j.nodeTypes.length}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Task History Tabs */}
      <Card className="p-6">
        <Tabs defaultValue="collection" className="w-full">
          <TabsList>
            <TabsTrigger value="collection">
              Collection Tasks ({collectionTasks.length})
            </TabsTrigger>
            <TabsTrigger value="etl">
              ETL Tasks ({etlTasks.length})
            </TabsTrigger>
            <TabsTrigger value="neo4j">
              Neo4j Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collection" className="space-y-4 mt-4">
            <div className="space-y-2">
              {collectionTasks.slice(0, 10).map((task) => (
                <div
                  key={task.task_id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(task.status)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">Task {task.task_id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.method} • Created: {new Date(task.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(task.status)}
                    <span className="text-sm font-medium">{task.progress}%</span>
                  </div>
                </div>
              ))}
              {collectionTasks.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No collection tasks found</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="etl" className="space-y-4 mt-4">
            <div className="space-y-2">
              {etlTasks.slice(0, 10).map((task) => (
                <div
                  key={task.task_id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(task.status)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">Task {task.task_id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.method} • Created: {new Date(task.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(task.status)}
                    <span className="text-sm font-medium">{task.progress}%</span>
                  </div>
                </div>
              ))}
              {etlTasks.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No ETL tasks found</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="neo4j" className="space-y-4 mt-4">
            {stats && (
              <div className="grid grid-cols-2 gap-4">
                {stats.neo4j.nodeTypes.map((nodeType) => (
                  <div
                    key={nodeType.type}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <span className="font-medium text-sm">{nodeType.type}</span>
                    <Badge variant="secondary">{nodeType.count} nodes</Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
