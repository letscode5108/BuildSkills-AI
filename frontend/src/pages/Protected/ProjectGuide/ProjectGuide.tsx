

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, Code, Clock, BookOpen, Link, CheckSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const ProjectGuide = () => {
  // Form state
  const [projectName, setProjectName] = useState('');
  const [framework, setFramework] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [category, setCategory] = useState('');
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Result state
  interface ProjectGuideResult {
    project: {
      title: string;
      difficulty: string;
    };
    guide: {
      description: string;
      estimatedHours: number;
      steps: Array<{
        title: string;
        description: string;
        estimatedHours: number;
        codeSnippets?: string[];
        resources?: string[];
        checkpoints?: string[];
      }>;
    };
  }
  const [result, setResult] = useState<ProjectGuideResult | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/learn/project-guide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          projectName,
          framework,
          skillLevel,
          category
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate project guide');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // For demo/testing purposes

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty?.toUpperCase()) {
      case 'BEGINNER': return 'bg-green-500';
      case 'INTERMEDIATE': return 'bg-yellow-500';
      case 'ADVANCED': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const renderCodeSnippets = (snippets: string[]) => {
    if (!snippets || snippets.length === 0) return null;
    
    return (
      <div className="bg-gray-900 rounded-md p-4 overflow-x-auto text-sm">
        <pre className="text-gray-100 font-mono">
          {snippets.join('\n')}
        </pre>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {!result ? (
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-8">
            <h1 className="text-3xl font-bold">Project Guide Generator</h1>
            <p className="text-lg mt-2 text-gray-100">
              Generate a step-by-step guide for your next coding project
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="projectName" className="text-lg font-medium">
                Project Description
              </label>
              <Textarea
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Describe your project idea or what you want to build for guidance..."
                required
                className="focus:border-blue-500 w-full min-h-32"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label htmlFor="framework" className="text-lg font-medium">
                  Framework
                </label>
                <Input
                  id="framework"
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  placeholder="Enter framework (React, Vue, Angular, etc.)"
                  className="focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-3">
                <label htmlFor="category" className="text-lg font-medium">
                  Category
                </label>
                <Select
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="focus:border-blue-500">
                    <SelectValue placeholder="What type of project is this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FRONTEND">Frontend</SelectItem>
                    <SelectItem value="BACKEND">Backend</SelectItem>
                    <SelectItem value="FULLSTACK">Fullstack</SelectItem>
                    <SelectItem value="MOBILE">Mobile</SelectItem>
                    <SelectItem value="DATASCIENCE">Data Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <label htmlFor="skillLevel" className="text-lg font-medium">
                  Skill Level
                </label>
                <Select
                  value={skillLevel}
                  onValueChange={setSkillLevel}
                >
                  <SelectTrigger className="focus:border-blue-500">
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading || !projectName || !framework || !skillLevel || !category}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating your guide...
                  </>
                ) : (
                  'Generate Project Guide'
                )}
              </Button>
              
            </div>
          </form>
          
          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="border-b pb-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{result.project.title}</h1>
                
                </div>
                
                <div className="flex items-center mt-4 md:mt-0 space-x-4">
                  <Badge 
                    className={`${getDifficultyColor(result.project.difficulty)} text-white px-3 py-1 text-base`}
                  >
                    {result.project.difficulty}
                  </Badge>
                  <div className="flex items-center text-base text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    {result.guide.estimatedHours} hours
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8 bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-medium flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-blue-500" />
                About This Project
              </h2>
              <p className="mt-3 text-lg">{result.guide.description}</p>
            </div>
            
            <Tabs defaultValue="steps" className="w-full">
              <TabsList className="grid grid-cols-1 w-full max-w-md">
                <TabsTrigger value="steps" className="text-lg py-3">Step-by-Step Guide</TabsTrigger>
              </TabsList>
              
              <TabsContent value="steps" className="mt-6">
                <div className="space-y-8">
                  {result.guide.steps.map((step, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md border-l-4 border-l-blue-500 overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-medium">
                            Step {index + 1}: {step.title}
                          </h3>
                          <Badge variant="outline" className="flex items-center gap-1 text-base px-3 py-1">
                            <Clock className="h-4 w-4" />
                            {step.estimatedHours} hr
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="space-y-6">
                          <p className="text-lg">{step.description}</p>
                          
                          {step.codeSnippets && (
                            <div>
                              <div className="flex items-center text-base text-gray-600 mb-3">
                                <Code className="h-5 w-5 mr-2" /> Code Snippet
                              </div>
                              {renderCodeSnippets(step.codeSnippets)}
                            </div>
                          )}
                          
                          {step.resources && step.resources.length > 0 && (
                            <div className="bg-blue-50 p-4 rounded-md">
                              <h4 className="text-base font-medium text-blue-700 flex items-center mb-3">
                                <Link className="h-5 w-5 mr-2" /> Helpful Resources
                              </h4>
                              <ul className="space-y-2 text-base">
                                {step.resources.map((resource, idx) => (
                                  <li key={idx}>
                                    <a href={resource} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                      {resource}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {step.checkpoints && step.checkpoints.length > 0 && (
                            <div className="bg-green-50 p-4 rounded-md">
                              <h4 className="text-base font-medium text-green-700 flex items-center mb-3">
                                <CheckSquare className="h-5 w-5 mr-2" /> Checkpoints
                              </h4>
                              <ul className="space-y-2 text-base">
                                {step.checkpoints.map((checkpoint, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <CheckCircle className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                                    <span>{checkpoint}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between mt-10 pt-6 border-t">
              <Button 
                onClick={() => setResult(null)} 
                variant="outline" 
                className="py-6 text-lg px-6"
              >
                Generate Another Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGuide;
















































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































