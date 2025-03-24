import React, { useState } from 'react';
import axios from 'axios';
import { Search, BookOpen, Code, AlertTriangle, CheckCircle, Loader2, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Explanation {
  explanation: string;
  importance: string[];
  codeExample: string[];
  pitfalls: string;
  bestPractices: string;
}

const FrameworkExplorer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [framework, setFramework] = useState('');
  const [concept, setConcept] = useState('');
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('explanation');

  const popularFrameworks = [
    'React', 'Angular', 'Vue', 'Next.js', 'Express', 
    'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails'
  ];

  const popularConcepts = [
    'Routing', 'State Management', 'Data Fetching', 'Authentication',
    'Forms', 'Testing', 'Deployment', 'Performance Optimization',
    'Server-Side Rendering', 'API Integration'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setExplanation(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/learn/explanation`, 
        { framework, concept },
        { 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      setExplanation(response.data.explanation);
      setActiveTab('explanation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch explanation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-100 min-h-screen">
      <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <CardTitle className="text-2xl font-bold">Framework Concept Explorer</CardTitle>
          </div>
          <CardDescription className="text-blue-100">
            Learn concepts across different frameworks and libraries
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 bg-gradient-to-b from-blue-50 to-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="framework" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Framework or Library
                </label>
                <Input
                  id="framework"
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  placeholder="e.g. React, Angular, Next.js"
                  className="w-full bg-white/90"
                  required
                />
                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-2">Popular frameworks:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularFrameworks.map((fw) => (
                      <Badge 
                        key={fw} 
                        variant={framework === fw ? "default" : "outline"}
                        className={`cursor-pointer ${framework === fw ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-100'}`}
                        onClick={() => setFramework(fw)}
                      >
                        {fw}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="concept" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Concept to Learn
                </label>
                <Input
                  id="concept"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="e.g. Routing, State Management"
                  className="w-full bg-white/90"
                  required
                />
                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-2">Popular concepts:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularConcepts.map((c) => (
                      <Badge 
                        key={c}
                        variant={concept === c ? "default" : "outline"}
                        className={`cursor-pointer ${concept === c ? 'bg-indigo-600 hover:bg-indigo-700' : 'hover:bg-indigo-100'}`}
                        onClick={() => setConcept(c)}
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Explanation'
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {explanation && (
        <Card className="mt-8 border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">
                {concept} in {framework}
              </CardTitle>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Developer Guide
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 w-full rounded-none bg-slate-100">
                <TabsTrigger value="explanation" className="data-[state=active]:bg-white">Explanation</TabsTrigger>
                <TabsTrigger value="importance" className="data-[state=active]:bg-white">Importance</TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-white">Code Examples</TabsTrigger>
                <TabsTrigger value="pitfalls" className="data-[state=active]:bg-white">Pitfalls</TabsTrigger>
                <TabsTrigger value="practices" className="data-[state=active]:bg-white">Best Practices</TabsTrigger>
              </TabsList>
              
              <ScrollArea className="h-96 w-full">
                <TabsContent value="explanation" className="p-6 bg-gradient-to-b from-blue-50 to-white">
                  <div className="prose max-w-none">
                    {explanation.explanation}
                  </div>
                </TabsContent>
                
                <TabsContent value="importance" className="p-6 bg-gradient-to-b from-purple-50 to-white">
                  <ul className="space-y-3">
                    {explanation.importance?.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="code" className="p-6 bg-gradient-to-b from-gray-50 to-white">
                  {explanation.codeExample?.map((example, index) => (
                    <div key={index} className="mb-4">
                      <div className="bg-slate-800 text-slate-50 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                        <pre>{example}</pre>
                      </div>
                      {index < explanation.codeExample.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="pitfalls" className="p-6 bg-gradient-to-b from-amber-50 to-white">
                  <div className="prose max-w-none">
                    <div className="flex items-center mb-4">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                      <h3 className="text-lg font-medium">Common Mistakes to Avoid</h3>
                    </div>
                    {explanation.pitfalls}
                  </div>
                </TabsContent>
                
                <TabsContent value="practices" className="p-6 bg-gradient-to-b from-green-50 to-white">
                  <div className="prose max-w-none">
                    <div className="flex items-center mb-4">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <h3 className="text-lg font-medium">Recommended Approaches</h3>
                    </div>
                    {explanation.bestPractices}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </CardContent>
          
          <CardFooter className="bg-slate-100 p-4 flex justify-between items-center">
            <div className="text-sm text-slate-500">
              Framework Explorer • {new Date().toLocaleDateString()}
            </div>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="hover:bg-slate-200">
              <Download className="h-4 w-4 mr-2" />
              Save as PDF
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default FrameworkExplorer;