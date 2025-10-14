import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle2,
  Circle,
  Search,
  FileText,
  Image,
  Code,
  MessageSquare,
  Star,
  BarChart3,
  Download,
  Copy,
  RefreshCw,
  Play,
  Check,
  AlertCircle,
  ShoppingCart,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react'

export function AmazonGeo() {
  const [currentStep, setCurrentStep] = useState('step1')

  // Progress tracking
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Step 1 - Amazon Ecosystem Audit
  const [asin, setAsin] = useState('')
  const [auditResults, setAuditResults] = useState<any>(null)
  const [isAuditing, setIsAuditing] = useState(false)

  // Step 2 - Product Title
  const [originalTitle, setOriginalTitle] = useState('')
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false)

  // Step 3 - Bullet Points
  const [bulletPoints, setBulletPoints] = useState<string[]>(['', '', '', '', ''])
  const [optimizedBullets, setOptimizedBullets] = useState<string[]>([])

  // Step 4 - Product Description
  const [productDescription, setProductDescription] = useState('')
  const [htmlDescription, setHtmlDescription] = useState('')

  // Step 5 - Backend Keywords
  const [backendKeywords, setBackendKeywords] = useState('')
  const [keywordAnalysis, setKeywordAnalysis] = useState<any>(null)

  // Step 6 - A+ Content
  const [aplusModules, setAplusModules] = useState<number>(6)
  const [moduleContent, setModuleContent] = useState<string>('')

  // Step 7 - Product Images
  const [imageCount, setImageCount] = useState(9)
  const [imageSpecs, setImageSpecs] = useState<any>(null)

  // Step 8 - Q&A System
  const [qaList, setQaList] = useState<Array<{ question: string; answer: string }>>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')

  // Step 9 - Reviews
  const [targetRating, setTargetRating] = useState(4.5)
  const [reviewStrategy, setReviewStrategy] = useState<any>(null)

  // Step 10 - Data Monitoring
  const [monitoringDashboard, setMonitoringDashboard] = useState<any>(null)

  // Helper functions
  const markStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
  }

  const handleCopyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const calculateProgress = () => {
    return Math.round((completedSteps.length / 10) * 100)
  }

  const exportAllData = () => {
    const exportData = {
      asin: asin,
      audit: auditResults,
      title: generatedTitles,
      bulletPoints: optimizedBullets,
      description: htmlDescription,
      keywords: backendKeywords,
      keywordAnalysis: keywordAnalysis,
      aplusContent: moduleContent,
      qaList: qaList,
      reviewStrategy: reviewStrategy,
      monitoring: monitoringDashboard,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `amazon-geo-optimization-${asin || Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleAmazonAudit = () => {
    setIsAuditing(true)
    setTimeout(() => {
      setAuditResults({
        a9Algorithm: { score: 78, status: 'good', message: 'Good keyword optimization' },
        rufusAI: { score: 65, status: 'warning', message: 'Needs intent-based optimization' },
        competitorAnalysis: {
          topCompetitors: 5,
          avgRating: 4.3,
          avgPrice: '$389',
          keyStrength: 'Better cooling technology',
        },
        categoryRank: { current: 23, opportunity: 'Top 10 achievable' },
      })
      setIsAuditing(false)
      markStepComplete(1)
    }, 2500)
  }

  const handleGenerateTitles = () => {
    setIsGeneratingTitles(true)
    setTimeout(() => {
      setGeneratedTitles([
        `${originalTitle} - 8°C Cooler Sleep Technology for Hot Sleepers | 5-Zone Support | Queen 12" CertiPUR-US Certified`,
        `${originalTitle} Cooling Mattress - Advanced Temperature Regulation | Gel Memory Foam + PCM | Queen Size - 100-Night Trial`,
        `${originalTitle} - Best Cooling Mattress for Night Sweats | Breathable 6-Layer System | Queen 12" - Back Pain Relief`,
        `${originalTitle} Memory Foam Mattress - Premium Cooling Gel + 5-Zone Support for Hot Sleepers | Queen - CertiPUR-US`,
      ])
      setIsGeneratingTitles(false)
      markStepComplete(2)
    }, 2000)
  }

  const handleOptimizeBullets = () => {
    const optimized = [
      '✓ ELIMINATE NIGHT SWEATS: Advanced cooling technology keeps you 8°C cooler with 10,000 micro-vents and PCM particles for sweat-free sleep all night',
      '✓ 6-LAYER COOLING SYSTEM: CoolNest™ Cover + PCMflux™ Foam + Gel Memory Foam + 5-Zone Support creates the ultimate cooling mattress experience',
      '✓ WAKE UP REFRESHED: No more flipping pillows or kicking off blankets - enjoy deep, uninterrupted sleep with consistent cooling comfort throughout the night',
      '✓ TRUSTED QUALITY: CertiPUR-US certified foam, OEKO-TEX fabric, 4.7/5 rating from 219+ verified buyers, recommended by sleep experts nationwide',
      '✓ RISK-FREE PURCHASE: 100-night sleep trial, 10-year warranty, free shipping, 0% APR financing available - start your coolest sleep tonight',
    ]
    setOptimizedBullets(optimized)
    markStepComplete(3)
  }

  const handleGenerateHTML = () => {
    const html = `<h3>Why Choose CoolNest™ Over Traditional Memory Foam?</h3>
<p>Traditional memory foam traps heat and causes night sweats. <strong>CoolNest™ revolutionizes sleep</strong> with advanced cooling technology.</p>

<h4>🌡️ Advanced Cooling Technology</h4>
<ul>
  <li><strong>CoolNest™ Cover:</strong> 3D weaving with 10,000 micro-vents (35% more airflow)</li>
  <li><strong>PCMflux™ Foam:</strong> Phase-change materials + hollow structure (3X breathability)</li>
  <li><strong>Gel-Infused Memory Foam:</strong> Continuous heat dissipation and pressure relief</li>
</ul>

<h4>💪 5-Zone Ergonomic Support</h4>
<p>Unlike generic mattresses, CoolNest™ features <strong>targeted support zones</strong> for optimal spinal alignment in all sleep positions.</p>

<h4>🔬 Clinical Testing Results</h4>
<p><strong>Independent lab testing proves:</strong> 8°C cooler surface temperature, 40% reduction in night sweats, 95% user satisfaction rate.</p>

<h4>✅ Certifications & Warranties</h4>
<ul>
  <li>CertiPUR-US certified foam (no harmful chemicals)</li>
  <li>OEKO-TEX 100 fabric certification</li>
  <li>100-night risk-free sleep trial</li>
  <li>10-year manufacturer warranty</li>
</ul>`
    setHtmlDescription(html)
    markStepComplete(4)
  }

  const handleAnalyzeKeywords = () => {
    const analysis = {
      totalCharacters: backendKeywords.length,
      maxCharacters: 249,
      utilization: Math.round((backendKeywords.length / 249) * 100),
      coreKeywords: 12,
      longTailKeywords: 8,
      semanticKeywords: 5,
      competitorKeywords: 3,
    }
    setKeywordAnalysis(analysis)
    if (backendKeywords.length >= 200) {
      markStepComplete(5)
    }
  }

  const handleAddQA = () => {
    if (newQuestion && newAnswer) {
      setQaList([...qaList, { question: newQuestion, answer: newAnswer }])
      setNewQuestion('')
      setNewAnswer('')
      if (qaList.length >= 4) {
        markStepComplete(8)
      }
    }
  }

  const handleGenerateReviewStrategy = () => {
    setReviewStrategy({
      currentRating: 4.3,
      targetRating: targetRating,
      requiredReviews: 47,
      emailTemplate: 'Follow-up email ready',
      responseTemplates: 3,
      timeline: '30 days',
    })
    markStepComplete(9)
  }

  const handleSetupMonitoring = () => {
    setMonitoringDashboard({
      rufusMetrics: ['Recommendation Rate', 'AI Query Match', 'Natural Language Conversion'],
      amazonMetrics: ['Keyword Rank', 'Click Rate', 'Conversion Rate', 'ACOS'],
      behaviorMetrics: ['Page Dwell Time', 'Image Click Distribution', 'A+ Content Engagement'],
      tools: ['Amazon Brand Analytics', 'Jungle Scout', 'Custom Dashboard'],
    })
    markStepComplete(10)
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Amazon GEO</h1>
        <p className="text-gray-600 mt-2">
          Interactive workspace for Amazon Rufus AI optimization and product listing enhancement
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Optimization Progress</CardTitle>
            <Button onClick={exportAllData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overall Completion</span>
              <span className="text-2xl font-bold text-blue-600">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
                <div
                  key={step}
                  className={`text-center p-2 rounded transition-all ${
                    completedSteps.includes(step)
                      ? 'bg-green-100 text-green-700 border-2 border-green-400'
                      : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                  }`}
                >
                  <div className="text-xs font-medium">Step {step}</div>
                  {completedSteps.includes(step) && <CheckCircle2 className="h-4 w-4 mx-auto mt-1" />}
                  {!completedSteps.includes(step) && <Circle className="h-4 w-4 mx-auto mt-1" />}
                </div>
              ))}
            </div>
            {copiedText && (
              <div className="flex items-center justify-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">Copied {copiedText} to clipboard!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Workflow Tabs */}
      <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="step1">
            <Search className="h-3 w-3 mr-1" />
            Step 1
          </TabsTrigger>
          <TabsTrigger value="step2">
            <FileText className="h-3 w-3 mr-1" />
            Step 2
          </TabsTrigger>
          <TabsTrigger value="step3">
            <FileText className="h-3 w-3 mr-1" />
            Step 3
          </TabsTrigger>
          <TabsTrigger value="step4">
            <Code className="h-3 w-3 mr-1" />
            Step 4
          </TabsTrigger>
          <TabsTrigger value="step5">
            <Target className="h-3 w-3 mr-1" />
            Step 5
          </TabsTrigger>
          <TabsTrigger value="step6">
            <Image className="h-3 w-3 mr-1" />
            Step 6
          </TabsTrigger>
          <TabsTrigger value="step7">
            <Image className="h-3 w-3 mr-1" />
            Step 7
          </TabsTrigger>
          <TabsTrigger value="step8">
            <MessageSquare className="h-3 w-3 mr-1" />
            Step 8
          </TabsTrigger>
          <TabsTrigger value="step9">
            <Star className="h-3 w-3 mr-1" />
            Step 9
          </TabsTrigger>
          <TabsTrigger value="step10">
            <BarChart3 className="h-3 w-3 mr-1" />
            Step 10
          </TabsTrigger>
        </TabsList>

        {/* Step 1: Amazon Ecosystem Audit */}
        <TabsContent value="step1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
                  1
                </div>
                Amazon Ecosystem Audit
              </CardTitle>
              <CardDescription>
                Analyze A9/A10 algorithm, Rufus AI mechanism, competitor ASINs, and category ranking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Product ASIN</label>
                <div className="flex gap-3">
                  <Input
                    placeholder="e.g., B08XYZABC123"
                    value={asin}
                    onChange={(e) => setAsin(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAmazonAudit} disabled={!asin || isAuditing}>
                    {isAuditing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Auditing...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Run Audit
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {auditResults && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Audit Results</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">
                              A9/A10 Algorithm (Score: {auditResults.a9Algorithm.score})
                            </div>
                            <div className="text-sm text-gray-600">{auditResults.a9Algorithm.message}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-yellow-200 bg-yellow-50">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">
                              Rufus AI Ready (Score: {auditResults.rufusAI.score})
                            </div>
                            <div className="text-sm text-gray-600">{auditResults.rufusAI.message}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Competitor Analysis</div>
                            <div className="text-sm text-gray-600">
                              Top {auditResults.competitorAnalysis.topCompetitors} competitors analyzed - Avg Rating:{' '}
                              {auditResults.competitorAnalysis.avgRating}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-purple-50">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">
                              Category Rank: #{auditResults.categoryRank.current}
                            </div>
                            <div className="text-sm text-gray-600">{auditResults.categoryRank.opportunity}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Full Audit Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Product Title Optimization */}
        <TabsContent value="step2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
                  2
                </div>
                Product Title Optimization
              </CardTitle>
              <CardDescription>
                Create intent-based titles matching natural language queries for Rufus AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Original Product Title</label>
                <Input
                  placeholder="e.g., SweetNight CoolNest Mattress Queen Size"
                  value={originalTitle}
                  onChange={(e) => setOriginalTitle(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGenerateTitles}
                disabled={!originalTitle || isGeneratingTitles}
                className="w-full"
              >
                {isGeneratingTitles ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Rufus AI-Optimized Titles...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Generate Optimized Titles
                  </>
                )}
              </Button>

              {generatedTitles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Generated Title Options (Rufus AI Optimized)</h4>
                  {generatedTitles.map((title, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-orange-500"
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <Badge className="mb-2 bg-orange-500">Option {index + 1}</Badge>
                            <p className="text-sm text-gray-900">{title}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {title.length} characters
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-green-50">
                                Rufus AI Ready
                              </Badge>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyToClipboard(title, `title option ${index + 1}`)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Bullet Points Rewrite */}
        <TabsContent value="step3" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
                  3
                </div>
                Bullet Points Rewrite
              </CardTitle>
              <CardDescription>
                Transform features into benefits with Problem→Solution→Benefit framework
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Bullet Point {index + 1}{' '}
                      {index === 0 && '(Core Problem Solved)'}
                      {index === 1 && '(Technical Features)'}
                      {index === 2 && '(User Benefits)'}
                      {index === 3 && '(Social Proof)'}
                      {index === 4 && '(Purchase Guarantee)'}
                    </label>
                    <Textarea
                      placeholder={`Enter bullet point ${index + 1}...`}
                      value={bulletPoints[index]}
                      onChange={(e) => {
                        const newBullets = [...bulletPoints]
                        newBullets[index] = e.target.value
                        setBulletPoints(newBullets)
                      }}
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleOptimizeBullets} className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Generate Optimized Bullet Points
              </Button>

              {optimizedBullets.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Optimized Bullet Points (Feature→Benefit)</h4>
                  {optimizedBullets.map((bullet, index) => (
                    <Card key={index} className="border-orange-200 bg-orange-50">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm text-gray-900 flex-1">{bullet}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyToClipboard(bullet, `bullet point ${index + 1}`)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 4: Product Description Restructuring */}
        <TabsContent value="step4" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
                  4
                </div>
                Product Description Restructuring
              </CardTitle>
              <CardDescription>Create HTML structured content for better Rufus AI parsing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Plain Text Description</label>
                <Textarea
                  placeholder="Enter your product description..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows={6}
                />
              </div>

              <Button onClick={handleGenerateHTML} className="w-full">
                <Code className="h-4 w-4 mr-2" />
                Generate HTML Structured Description
              </Button>

              {htmlDescription && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">HTML Structured Description</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(htmlDescription, 'HTML description')}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy HTML
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                    {htmlDescription}
                  </pre>
                  <div className="grid grid-cols-3 gap-2">
                    <Badge variant="outline" className="justify-center">
                      <Check className="h-3 w-3 mr-1" />
                      H3/H4 Headers
                    </Badge>
                    <Badge variant="outline" className="justify-center">
                      <Check className="h-3 w-3 mr-1" />
                      Bullet Lists
                    </Badge>
                    <Badge variant="outline" className="justify-center">
                      <Check className="h-3 w-3 mr-1" />
                      Rufus AI Ready
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 5: Backend Keywords Optimization */}
        <TabsContent value="step5" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
                  5
                </div>
                Backend Keywords Optimization
              </CardTitle>
              <CardDescription>
                Maximize 249-character limit with core, long-tail, and semantic keywords
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Backend Search Terms (Max 249 chars)</label>
                  <Badge variant={backendKeywords.length > 249 ? 'destructive' : 'outline'}>
                    {backendKeywords.length} / 249
                  </Badge>
                </div>
                <Textarea
                  placeholder="cooling mattress queen hot sleepers night sweats temperature regulation..."
                  value={backendKeywords}
                  onChange={(e) => setBackendKeywords(e.target.value)}
                  rows={6}
                />
              </div>

              <Button onClick={handleAnalyzeKeywords} disabled={!backendKeywords} className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Analyze Keywords
              </Button>

              {keywordAnalysis && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Keyword Analysis</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {keywordAnalysis.utilization}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Character Utilization</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{keywordAnalysis.coreKeywords}</div>
                        <div className="text-xs text-gray-600 mt-1">Core Keywords</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{keywordAnalysis.longTailKeywords}</div>
                        <div className="text-xs text-gray-600 mt-1">Long-Tail Keywords</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {keywordAnalysis.semanticKeywords}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Semantic Keywords</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 6: A+ Content Creation */}
        <TabsContent value="step6" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
                  6
                </div>
                A+ Content Creation
              </CardTitle>
              <CardDescription>Design 6 modules for systematic product value presentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-sm">Module 1: Product Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-gray-600">
                    <p>Layout: Left image + Right text</p>
                    <p>Content: Main visual, core headline, 3 key selling points</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-sm">Module 2: Technical Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-gray-600">
                    <p>Layout: Top image + Bottom text</p>
                    <p>Content: Technical diagrams, data display, scientific principles</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-sm">Module 3: Usage Scenarios</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-gray-600">
                    <p>Layout: Three-column lifestyle scenes</p>
                    <p>Content: Real-life applications, user scenarios, comparison charts</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-sm">Module 4: User Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-gray-600">
                    <p>Layout: Card-style testimonials</p>
                    <p>Content: Real user quotes, 5-star ratings, verified purchase badges</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-sm">Module 5: Comparison Table</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-gray-600">
                    <p>Layout: Table format competitor comparison</p>
                    <p>Content: Features vs competitors, price advantage, unique benefits</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-sm">Module 6: Purchase Guarantee</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-gray-600">
                    <p>Layout: Bottom banner with icons</p>
                    <p>Content: Trial period, warranty, free shipping, financing, support</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">A+ Content Planning Notes</label>
                <Textarea
                  placeholder="Add your A+ content planning notes and design specifications..."
                  value={moduleContent}
                  onChange={(e) => setModuleContent(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={() => markStepComplete(6)}
                disabled={!moduleContent}
                className="w-full"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark A+ Content as Planned
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 7: Product Images Optimization */}
        <TabsContent value="step7" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
                  7
                </div>
                Product Images Optimization
              </CardTitle>
              <CardDescription>Create 9-image system for visual search and scene recognition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { num: 1, title: 'Main Image', desc: 'White background + Brand logo + Certifications' },
                  { num: 2, title: 'Cross-section', desc: 'Layer structure + Technical labels + Materials' },
                  { num: 3, title: 'Lifestyle Scene', desc: 'Bedroom environment + User sleeping + Warm ambiance' },
                  { num: 4, title: 'Detail Close-up', desc: 'Fabric texture + Craftsmanship + Quality feel' },
                  { num: 5, title: 'Size Comparison', desc: 'Mattress dimensions + Room proportion + Selection guide' },
                  { num: 6, title: 'Packaging', desc: 'Compressed packaging + Delivery process + Easy setup' },
                  { num: 7, title: 'Certifications', desc: 'CertiPUR-US + OEKO-TEX + Quality assurance' },
                  { num: 8, title: 'User Reviews', desc: 'Real review screenshots + Star ratings + Review count' },
                  { num: 9, title: 'Brand Story', desc: 'Company intro + 15 years experience + Global service' },
                ].map((image) => (
                  <Card key={image.num} className="border-2 border-gray-200 hover:border-orange-300 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-orange-500">Image {image.num}</Badge>
                      </div>
                      <div className="font-medium text-sm text-gray-900 mb-1">{image.title}</div>
                      <div className="text-xs text-gray-600">{image.desc}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-sm">Image Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Main Image:</span>
                    <Badge variant="outline">1500x1500px, White BG, RGB</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Auxiliary Images:</span>
                    <Badge variant="outline">1000x1000px, Lifestyle/Infographic</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Rufus AI Optimization:</span>
                    <Badge variant="outline" className="bg-green-50">
                      Scene Recognition Ready
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => {
                  setImageSpecs({ planned: true, count: 9 })
                  markStepComplete(7)
                }}
                className="w-full"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark Image Optimization as Planned
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 8: Q&A System Establishment */}
        <TabsContent value="step8" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
                  8
                </div>
                Q&A System Establishment
              </CardTitle>
              <CardDescription>Create 20+ professional Q&As covering entire purchase journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Question</label>
                <Input
                  placeholder="e.g., How much cooler is CoolNest™ compared to regular mattresses?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Professional Answer</label>
                <Textarea
                  placeholder="Provide detailed, professional answer with data and specifications..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={5}
                />
              </div>

              <Button onClick={handleAddQA} disabled={!newQuestion || !newAnswer} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Add Q&A Pair
              </Button>

              {qaList.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Q&A List ({qaList.length} pairs)</h4>
                  {qaList.map((qa, index) => (
                    <Card key={index} className="border-orange-200">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Badge className="bg-orange-500 flex-shrink-0">Q{index + 1}</Badge>
                            <p className="text-sm font-medium text-gray-900">{qa.question}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="flex-shrink-0">
                              A
                            </Badge>
                            <p className="text-sm text-gray-600">{qa.answer}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() =>
                      handleCopyToClipboard(
                        qaList.map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}`).join('\n\n'),
                        'all Q&A pairs'
                      )
                    }
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All Q&A Pairs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 9: Reviews Management */}
        <TabsContent value="step9" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
                  9
                </div>
                Reviews Management Optimization
              </CardTitle>
              <CardDescription>
                Maintain 4.5+ star rating with review solicitation and response strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Target Star Rating</label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 cursor-pointer ${
                          star <= targetRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => setTargetRating(star)}
                      />
                    ))}
                  </div>
                  <Badge className="bg-orange-500">{targetRating.toFixed(1)} Stars</Badge>
                </div>
              </div>

              <Button onClick={handleGenerateReviewStrategy} className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Generate Review Strategy
              </Button>

              {reviewStrategy && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Review Strategy Plan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-gray-600">Current Rating</div>
                        <div className="text-2xl font-bold text-blue-600">{reviewStrategy.currentRating} ⭐</div>
                      </CardContent>
                    </Card>
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-gray-600">Target Rating</div>
                        <div className="text-2xl font-bold text-green-600">{reviewStrategy.targetRating} ⭐</div>
                      </CardContent>
                    </Card>
                    <Card className="border-orange-200 bg-orange-50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-gray-600">Reviews Needed</div>
                        <div className="text-2xl font-bold text-orange-600">{reviewStrategy.requiredReviews}</div>
                      </CardContent>
                    </Card>
                    <Card className="border-purple-200 bg-purple-50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-gray-600">Timeline</div>
                        <div className="text-2xl font-bold text-purple-600">{reviewStrategy.timeline}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-2 border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-sm">Review Solicitation Email Template</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                      <p className="mb-2">
                        <strong>Subject:</strong> How's Your Sleep on SweetNight CoolNest™?
                      </p>
                      <p className="mb-2">Hi [Customer Name],</p>
                      <p className="mb-2">
                        Thank you for choosing SweetNight CoolNest™! To help other hot sleepers find the perfect
                        cooling mattress, please share your sleep experience:
                      </p>
                      <ul className="list-disc list-inside space-y-1 mb-2">
                        <li>How much has your sleep temperature improved?</li>
                        <li>Which features do you find most satisfying?</li>
                        <li>Would you recommend it to friends?</li>
                      </ul>
                      <p>[Leave Review Button]</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-red-200">
                    <CardHeader>
                      <CardTitle className="text-sm">Negative Review Response Template</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                      <p className="mb-2">Dear [Customer Name],</p>
                      <p className="mb-2">
                        Thank you very much for your feedback. We value every customer's experience. Please contact our
                        customer service team via [Contact Method], and we will immediately provide personalized
                        solutions, including mattress adjustment advice or free exchange service within the 100-night
                        trial period.
                      </p>
                      <p>Best regards,</p>
                      <p>SweetNight Customer Care Team</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 10: Data Monitoring Deployment */}
        <TabsContent value="step10" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
                  10
                </div>
                Data Monitoring Deployment
              </CardTitle>
              <CardDescription>
                Multi-dimensional dashboard for real-time Rufus AI recommendation tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={handleSetupMonitoring} className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Setup Monitoring Dashboard
              </Button>

              {monitoringDashboard && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Monitoring Metrics System</h4>

                  <Card className="border-2 border-orange-200">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Badge className="bg-orange-500">Rufus AI</Badge>
                        Rufus AI-Related Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {monitoringDashboard.rufusMetrics.map((metric: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-orange-600" />
                            <span className="text-sm text-gray-700">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Badge className="bg-blue-500">Amazon</Badge>
                        Traditional Amazon Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {monitoringDashboard.amazonMetrics.map((metric: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-700">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Badge className="bg-green-500">Behavior</Badge>
                        User Behavior Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {monitoringDashboard.behaviorMetrics.map((metric: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-sm">Monitoring Tools</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {monitoringDashboard.tools.map((tool: string, index: number) => (
                          <Badge key={index} variant="outline" className="justify-center py-2">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="text-sm">Success Criteria</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Rufus Recommendation Rate:</span>
                        <Badge className="bg-yellow-600">+300%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Overall Sales Growth:</span>
                        <Badge className="bg-yellow-600">&gt;50%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">AI Query Conversion Rate:</span>
                        <Badge className="bg-yellow-600">&gt;8%</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
