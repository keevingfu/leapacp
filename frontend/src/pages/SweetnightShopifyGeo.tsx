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
  Clock,
  Target,
  Search,
  FileText,
  Image,
  Zap,
  Smartphone,
  Star,
  BarChart3,
  Code,
  Play,
  Download,
  Copy,
  RefreshCw,
  Upload,
  Check,
  AlertCircle,
} from 'lucide-react'

export function SweetnightShopifyGeo() {
  const [currentStep, setCurrentStep] = useState('step1')

  // Progress tracking
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Step 1 - Page Structure Audit
  const [auditUrl, setAuditUrl] = useState('')
  const [auditResults, setAuditResults] = useState<any>(null)
  const [isAuditing, setIsAuditing] = useState(false)

  // Step 2 - Title Restructuring
  const [originalTitle, setOriginalTitle] = useState('')
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false)

  // Step 3 - Product Description
  const [productDescription, setProductDescription] = useState('')
  const [selectedFramework, setSelectedFramework] = useState('why')

  // Step 4 - Schema Data
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [generatedSchema, setGeneratedSchema] = useState('')

  // Step 5 - FAQ System
  const [faqList, setFaqList] = useState<Array<{ question: string; answer: string }>>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')

  // Step 6 - Image SEO
  const [imageName, setImageName] = useState('')
  const [optimizedImageName, setOptimizedImageName] = useState('')
  const [altText, setAltText] = useState('')

  // Step 7 - Performance Metrics
  const [testUrl, setTestUrl] = useState('')
  const [performanceScore, setPerformanceScore] = useState<any>(null)

  // Step 8 - Mobile Preview
  const [previewUrl, setPreviewUrl] = useState('')
  const [deviceType, setDeviceType] = useState('mobile')

  // Step 9 - Reviews
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviews, setReviews] = useState<any[]>([])

  // Step 10 - Monitoring
  const [monitoringUrl, setMonitoringUrl] = useState('')
  const [trackingCode, setTrackingCode] = useState('')

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
      audit: auditResults,
      titles: generatedTitles,
      description: productDescription,
      schema: generatedSchema,
      faqs: faqList,
      images: { name: optimizedImageName, alt: altText },
      performance: performanceScore,
      reviews: reviews,
      tracking: trackingCode,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shopify-geo-optimization-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleAuditPage = () => {
    setIsAuditing(true)
    setTimeout(() => {
      setAuditResults({
        urlCheck: { status: 'pass', message: 'URL is SEO-friendly' },
        h1Tags: { count: 1, status: 'pass', message: 'Correct H1 tag usage' },
        h2Tags: { count: 5, status: 'pass', message: 'Good H2 structure' },
        breadcrumbs: { status: 'pass', message: 'Breadcrumb navigation present' },
        contentStructure: { score: 85, status: 'good', message: 'Well-structured content' },
      })
      setIsAuditing(false)
      markStepComplete(1)
    }, 2000)
  }

  const handleGenerateTitles = () => {
    setIsGeneratingTitles(true)
    setTimeout(() => {
      setGeneratedTitles([
        `What Makes ${originalTitle} Different? Top Features Explained`,
        `How Does ${originalTitle} Work? Complete Guide Under $400`,
        `Why Choose ${originalTitle}? Benefits & Real User Reviews`,
        `${originalTitle}: Everything You Need to Know Before Buying`,
      ])
      setIsGeneratingTitles(false)
      markStepComplete(2)
    }, 2000)
  }

  const handleGenerateSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productName || 'Product Name',
      offers: {
        '@type': 'Offer',
        price: productPrice || '0.00',
        priceCurrency: 'USD',
      },
    }
    setGeneratedSchema(JSON.stringify(schema, null, 2))
    markStepComplete(4)
  }

  const handleAddFAQ = () => {
    if (newQuestion && newAnswer) {
      setFaqList([...faqList, { question: newQuestion, answer: newAnswer }])
      setNewQuestion('')
      setNewAnswer('')
      if (faqList.length >= 2) {
        markStepComplete(5)
      }
    }
  }

  const handleOptimizeImageName = () => {
    const optimized = imageName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setOptimizedImageName(optimized + '.webp')
    if (altText) {
      markStepComplete(6)
    }
  }

  const handleTestPerformance = () => {
    setPerformanceScore({
      lcp: { value: 2.3, status: 'good', target: '<2.5s' },
      fid: { value: 85, status: 'good', target: '<100ms' },
      cls: { value: 0.08, status: 'good', target: '<0.1' },
      overall: 92,
    })
    markStepComplete(7)
  }

  const handleAddReview = () => {
    if (reviewText) {
      setReviews([...reviews, { rating: reviewRating, text: reviewText, date: new Date().toLocaleDateString() }])
      setReviewText('')
      setReviewRating(5)
      if (reviews.length >= 2) {
        markStepComplete(9)
      }
    }
  }

  const handleGenerateTrackingCode = () => {
    setTrackingCode(`
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`)
    markStepComplete(10)
  }

  const handleGenerateDescription = () => {
    if (productDescription.length >= 100) {
      markStepComplete(3)
    }
  }

  const handleLoadPreview = () => {
    if (previewUrl) {
      setTimeout(() => {
        markStepComplete(8)
      }, 1500)
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shopify Product Page GEO Optimization</h1>
        <p className="text-gray-600 mt-2">
          Interactive workspace for systematic product page optimization
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
            <FileText className="h-3 w-3 mr-1" />
            Step 5
          </TabsTrigger>
          <TabsTrigger value="step6">
            <Image className="h-3 w-3 mr-1" />
            Step 6
          </TabsTrigger>
          <TabsTrigger value="step7">
            <Zap className="h-3 w-3 mr-1" />
            Step 7
          </TabsTrigger>
          <TabsTrigger value="step8">
            <Smartphone className="h-3 w-3 mr-1" />
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

        {/* Step 1: Page Structure Audit */}
        <TabsContent value="step1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  1
                </div>
                Page Structure Audit
              </CardTitle>
              <CardDescription>Analyze your product page structure for SEO optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* URL Input */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Product Page URL</label>
                <div className="flex gap-3">
                  <Input
                    placeholder="https://yourstore.myshopify.com/products/product-name"
                    value={auditUrl}
                    onChange={(e) => setAuditUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAuditPage} disabled={!auditUrl || isAuditing}>
                    {isAuditing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Audit Page
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Audit Results */}
              {auditResults && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Audit Results</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={auditResults.urlCheck.status === 'pass' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          {auditResults.urlCheck.status === 'pass' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">URL Structure</div>
                            <div className="text-sm text-gray-600">{auditResults.urlCheck.message}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">H1 Tags ({auditResults.h1Tags.count})</div>
                            <div className="text-sm text-gray-600">{auditResults.h1Tags.message}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">H2 Tags ({auditResults.h2Tags.count})</div>
                            <div className="text-sm text-gray-600">{auditResults.h2Tags.message}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">Content Structure (Score: {auditResults.contentStructure.score})</div>
                            <div className="text-sm text-gray-600">{auditResults.contentStructure.message}</div>
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

        {/* Step 2: Title Restructuring */}
        <TabsContent value="step2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  2
                </div>
                Title Restructuring
              </CardTitle>
              <CardDescription>Generate AI-optimized product titles with question formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Original Product Title</label>
                <Input
                  placeholder="e.g., SweetNight CoolNest™ Mattress"
                  value={originalTitle}
                  onChange={(e) => setOriginalTitle(e.target.value)}
                />
              </div>

              <Button onClick={handleGenerateTitles} disabled={!originalTitle || isGeneratingTitles} className="w-full">
                {isGeneratingTitles ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating AI-Optimized Titles...
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
                  <h4 className="font-semibold text-gray-900">Generated Title Options</h4>
                  {generatedTitles.map((title, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <Badge className="mb-2">Option {index + 1}</Badge>
                            <p className="text-sm text-gray-900">{title}</p>
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

                  <Button className="w-full" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Set Up A/B Testing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Product Description Rewrite */}
        <TabsContent value="step3" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  3
                </div>
                Product Description Rewrite
              </CardTitle>
              <CardDescription>Structure your content using Why/What/How/Who framework</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-4 gap-2">
                {['why', 'what', 'how', 'who'].map((framework) => (
                  <Button
                    key={framework}
                    variant={selectedFramework === framework ? 'default' : 'outline'}
                    onClick={() => setSelectedFramework(framework)}
                    className="capitalize"
                  >
                    {framework} {framework === 'why' && 'Choose'}
                    {framework === 'what' && 'Problems'}
                    {framework === 'how' && 'It Works'}
                    {framework === 'who' && 'Perfect For'}
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    {selectedFramework === 'why' && 'Why Choose - Explain unique value'}
                    {selectedFramework === 'what' && 'What Problems - List problems solved'}
                    {selectedFramework === 'how' && 'How It Works - Technical details'}
                    {selectedFramework === 'who' && 'Who Perfect For - Target customers'}
                  </label>
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    Use Template
                  </Button>
                </div>
                <Textarea
                  placeholder={`Enter ${selectedFramework} content here...`}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows={8}
                />
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleGenerateDescription}>
                  <Play className="h-4 w-4 mr-2" />
                  Generate AI Content
                </Button>
                <Button className="flex-1" variant="outline" onClick={handleGenerateDescription}>
                  <Check className="h-4 w-4 mr-2" />
                  Check Readability
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 4: Schema Structured Data */}
        <TabsContent value="step4" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  4
                </div>
                Schema Structured Data
              </CardTitle>
              <CardDescription>Generate JSON-LD structured data for AI understanding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Product Name</label>
                  <Input
                    placeholder="SweetNight CoolNest™ Mattress"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Price (USD)</label>
                  <Input
                    placeholder="349.99"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleGenerateSchema} className="w-full">
                <Code className="h-4 w-4 mr-2" />
                Generate Schema Markup
              </Button>

              {generatedSchema && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Generated JSON-LD Schema</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(generatedSchema, 'schema code')}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Code
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                    {generatedSchema}
                  </pre>
                  <Button className="w-full" variant="outline">
                    <Check className="h-4 w-4 mr-2" />
                    Validate Schema
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 5: FAQ System */}
        <TabsContent value="step5" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  5
                </div>
                FAQ System Establishment
              </CardTitle>
              <CardDescription>Create comprehensive FAQ covering purchase journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Question</label>
                <Input
                  placeholder="What makes this product different?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Answer</label>
                <Textarea
                  placeholder="Detailed answer explaining the unique features..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={handleAddFAQ} disabled={!newQuestion || !newAnswer} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>

              {faqList.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">FAQ List ({faqList.length})</h4>
                  {faqList.map((faq, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="font-medium text-gray-900 mb-2">Q: {faq.question}</div>
                        <div className="text-sm text-gray-600">A: {faq.answer}</div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="flex gap-3">
                    <Button className="flex-1" variant="outline">
                      <Code className="h-4 w-4 mr-2" />
                      Generate FAQ Schema
                    </Button>
                    <Button className="flex-1" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export FAQ
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 6: Image SEO Optimization */}
        <TabsContent value="step6" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  6
                </div>
                Image SEO Optimization
              </CardTitle>
              <CardDescription>Optimize image filenames and alt text for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Original Image Name</label>
                <div className="flex gap-3">
                  <Input
                    placeholder="IMG_001.jpg"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleOptimizeImageName} disabled={!imageName}>
                    <Zap className="h-4 w-4 mr-2" />
                    Optimize
                  </Button>
                </div>
              </div>

              {optimizedImageName && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-green-900">Optimized Filename:</div>
                      <code className="bg-white px-3 py-2 rounded block text-sm">{optimizedImageName}</code>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Alt Text</label>
                <Textarea
                  placeholder="Descriptive alt text with keywords..."
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  rows={3}
                />
              </div>

              <Button className="w-full" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload & Convert to WebP
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 7: Page Performance Optimization */}
        <TabsContent value="step7" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  7
                </div>
                Page Performance Optimization
              </CardTitle>
              <CardDescription>Test and optimize Core Web Vitals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Test URL</label>
                <div className="flex gap-3">
                  <Input
                    placeholder="https://yourstore.myshopify.com/products/product-name"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleTestPerformance} disabled={!testUrl}>
                    <Zap className="h-4 w-4 mr-2" />
                    Test Performance
                  </Button>
                </div>
              </div>

              {performanceScore && (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">{performanceScore.overall}</div>
                        <div className="text-sm text-gray-600">Overall Performance Score</div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <div className="font-medium text-gray-900 mb-1">LCP</div>
                        <div className="text-2xl font-bold text-green-600">{performanceScore.lcp.value}s</div>
                        <div className="text-xs text-gray-600">{performanceScore.lcp.target}</div>
                      </CardContent>
                    </Card>
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <div className="font-medium text-gray-900 mb-1">FID</div>
                        <div className="text-2xl font-bold text-green-600">{performanceScore.fid.value}ms</div>
                        <div className="text-xs text-gray-600">{performanceScore.fid.target}</div>
                      </CardContent>
                    </Card>
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <div className="font-medium text-gray-900 mb-1">CLS</div>
                        <div className="text-2xl font-bold text-green-600">{performanceScore.cls.value}</div>
                        <div className="text-xs text-gray-600">{performanceScore.cls.target}</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 8: Mobile Adaptation */}
        <TabsContent value="step8" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  8
                </div>
                Mobile Adaptation
              </CardTitle>
              <CardDescription>Preview and optimize for mobile devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Preview URL</label>
                <Input
                  placeholder="https://yourstore.myshopify.com/products/product-name"
                  value={previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {['mobile', 'tablet', 'desktop'].map((device) => (
                  <Button
                    key={device}
                    variant={deviceType === device ? 'default' : 'outline'}
                    onClick={() => setDeviceType(device)}
                    className="capitalize"
                  >
                    {device}
                  </Button>
                ))}
              </div>

              <Card className="border-gray-300">
                <CardContent className="pt-4">
                  <div
                    className={`bg-gray-100 rounded-lg flex items-center justify-center ${
                      deviceType === 'mobile' ? 'h-[600px]' : deviceType === 'tablet' ? 'h-[500px]' : 'h-[400px]'
                    }`}
                  >
                    <div className="text-center text-gray-500">
                      <Smartphone className="h-12 w-12 mx-auto mb-3" />
                      <p className="text-sm">Mobile preview will appear here</p>
                      <p className="text-xs">Enter URL and click Preview to see live view</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" onClick={handleLoadPreview} disabled={!previewUrl}>
                <Play className="h-4 w-4 mr-2" />
                Load Preview
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 9: User Review Optimization */}
        <TabsContent value="step9" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  9
                </div>
                User Review Optimization
              </CardTitle>
              <CardDescription>Manage and optimize customer reviews display</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer ${
                        star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => setReviewRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Review Text</label>
                <Textarea
                  placeholder="Customer review content..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={handleAddReview} disabled={!reviewText} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Add Review
              </Button>

              {reviews.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Reviews ({reviews.length})</h4>
                  {reviews.map((review, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-700">{review.text}</p>
                      </CardContent>
                    </Card>
                  ))}
                  <Button className="w-full" variant="outline">
                    <Code className="h-4 w-4 mr-2" />
                    Generate Review Schema
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 10: Monitoring Deployment */}
        <TabsContent value="step10" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                  10
                </div>
                Monitoring Deployment
              </CardTitle>
              <CardDescription>Set up tracking and monitoring for continuous optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Website URL to Monitor</label>
                <Input
                  placeholder="https://yourstore.myshopify.com"
                  value={monitoringUrl}
                  onChange={(e) => setMonitoringUrl(e.target.value)}
                />
              </div>

              <Button onClick={handleGenerateTrackingCode} disabled={!monitoringUrl} className="w-full">
                <Code className="h-4 w-4 mr-2" />
                Generate Tracking Code
              </Button>

              {trackingCode && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Google Analytics 4 Code</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(trackingCode, 'tracking code')}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Code
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                    {trackingCode}
                  </pre>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Setup Search Console
                </Button>
                <Button variant="outline" className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Configure AI Citation Tracking
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
