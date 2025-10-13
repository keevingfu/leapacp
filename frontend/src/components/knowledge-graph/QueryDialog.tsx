import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useExecuteQuery } from '@/hooks/useGraph'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface QueryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EXAMPLE_QUERIES = [
  {
    name: 'Get all products',
    query: 'MATCH (p:Product) RETURN p LIMIT 10'
  },
  {
    name: 'Product with features',
    query: `MATCH (p:Product)-[r:HAS_FEATURE]->(f:Feature)
RETURN p.name as product, collect(f.name) as features
LIMIT 5`
  },
  {
    name: 'Problems solved by products',
    query: `MATCH (p:Product)-[r:SOLVES]->(prob:Problem)
RETURN p.name as product, prob.description as problem, r.effectiveness as effectiveness
ORDER BY r.effectiveness DESC
LIMIT 10`
  },
  {
    name: 'Products by scenario',
    query: `MATCH (s:Scenario)<-[:APPLIES_TO]-(p:Product)
RETURN s.name as scenario, collect(p.name) as products`
  }
]

export function QueryDialog({ open, onOpenChange }: QueryDialogProps) {
  const [cypherQuery, setCypherQuery] = useState<string>('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const executeMutation = useExecuteQuery()

  const handleExecute = async () => {
    setError(null)
    setResult(null)

    try {
      const response = await executeMutation.mutateAsync({
        cypher: cypherQuery,
        parameters: {}
      })

      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.message || 'Query execution failed')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    }
  }

  const loadExample = (query: string) => {
    setCypherQuery(query)
    setResult(null)
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cypher Query Console</DialogTitle>
          <DialogDescription>
            Execute custom Cypher queries on the knowledge graph
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Example Queries */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Example Queries</Label>
            <div className="grid grid-cols-2 gap-2">
              {EXAMPLE_QUERIES.map((example) => (
                <Button
                  key={example.name}
                  variant="outline"
                  size="sm"
                  onClick={() => loadExample(example.query)}
                  className="text-left justify-start h-auto py-2"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{example.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Query Input */}
          <div className="space-y-2">
            <Label htmlFor="cypher">Cypher Query *</Label>
            <Textarea
              id="cypher"
              value={cypherQuery}
              onChange={(e) => setCypherQuery(e.target.value)}
              placeholder="MATCH (n) RETURN n LIMIT 10"
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          {/* Execute Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleExecute}
              disabled={!cypherQuery || executeMutation.isPending}
            >
              {executeMutation.isPending ? 'Executing...' : 'Execute Query'}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {result && !error && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Query executed successfully. Found {result.results?.length || 0} results.
              </AlertDescription>
            </Alert>
          )}

          {/* Results Display */}
          {result && result.results && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Results</Label>
              <div className="border rounded-lg p-4 bg-muted/50 max-h-96 overflow-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {JSON.stringify(result.results, null, 2)}
                </pre>
              </div>

              {/* Metadata */}
              {result.metadata && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Execution time: {result.metadata.execution_time_ms}ms</div>
                  <div>Records: {result.metadata.record_count}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
