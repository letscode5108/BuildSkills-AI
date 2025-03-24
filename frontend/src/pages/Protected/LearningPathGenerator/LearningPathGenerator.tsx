

import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
import {  useNavigate,useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookOpen, Code, CheckCircle, ListChecks, Server, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LearningItem {
  title: string;
  description?: string;
  importance?: string;
  tool?: string;
  purpose?: string;
  objective?: string;
}

interface LearningPathStep {
  id: string;
  title: string;
  order: number;
  content: {
    backgroundKnowledge?: LearningItem[];
    fundamentalConcepts?: LearningItem[];
    developmentEnvironment?: LearningItem[];
    learningObjectives?: LearningItem[];
    markdown?: string;
    technologies?: string[];
    concepts?: string[];
    resources?: {
      title: string;
      url: string;
      type: string;
    }[];
  };
  learningPathId: string;
  completed?: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  technology: string;
  skillLevel: string;
  createdAt: string;
  updatedAt: string;
  steps: LearningPathStep[];
}

// Define skill level options
const skillLevelOptions = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" }
];

const LearningPathGenerator: React.FC = () => {
  const navigate = useNavigate();
  const { stepId, section } = useParams();
  
  const [framework, setFramework] = useState<string>("");
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  useEffect(() => {
    // If stepId is provided in the URL, set it as the active step
    if (stepId && typeof stepId === 'string') {
      setActiveStep(stepId);
    }
  }, [stepId]);

             

  const generateLearningPath = async () => {
    if (!framework || !skillLevel) {
      setError("Please enter both a framework and skill level");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/learn/learning-path`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}` 
        },
        body: JSON.stringify({ framework, skillLevel }),
      });
      console.log(import.meta.env.VITE_API_URL);

      if (!response.ok) {
        throw new Error(`Failed to generate learning path: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      console.log("Before setting state: ", learningPath);
      setLearningPath(data);
      console.log("After setting state: ", data);
      
      
      // Set the first step as active
      if (data.steps && data.steps.length > 0) {
        setActiveStep(data.steps[0].id);
        // Navigate to the first step
        navigate(`/learning-path/${data.id}/step/${data.steps[0].id}`);
      }
    } catch (err) {
      console.error("Error fetching learning path:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };


  // Find the current step
  const currentStep = learningPath?.steps.find(step => step.id === activeStep);

  // Render different sections based on the content structure
  const renderSection = (title: string, items: LearningItem[], icon: React.ReactNode) => {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-medium flex items-center gap-2 mb-3">
          {icon}
          {title}
        </h3>
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={index} className="p-3">
              <div className="flex flex-col">
                <div className="font-medium text-lg">{item.title}</div>
                {item.description && <div className="text-base text-gray-600 dark:text-gray-400 mt-1">{item.description}</div>}
                {item.tool && <div className="text-base text-gray-600 dark:text-gray-400 mt-1">{item.tool}</div>}
                {item.purpose && <div className="text-base text-gray-600 dark:text-gray-400 mt-1">{item.purpose}</div>}
                {item.objective && <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">Objective: {item.objective}</div>}
                {item.importance && <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">Importance: {item.importance}</div>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Render the specific content section based on the URL parameter
  const renderContentSection = () => {
    if (!currentStep || !section) return null;

    switch (section) {
      case 'background-knowledge':
        return currentStep.content.backgroundKnowledge ? renderSection(
          "Background Knowledge", 
          currentStep.content.backgroundKnowledge, 
          <BookOpen className="h-6 w-6 text-blue-500" />
        ) : <div>No background knowledge available for this step.</div>;
      
      case 'fundamental-concepts':
        return currentStep.content.fundamentalConcepts ? renderSection(
          "Fundamental Concepts", 
          currentStep.content.fundamentalConcepts, 
          <Code className="h-6 w-6 text-purple-500" />
        ) : <div>No fundamental concepts available for this step.</div>;
      
      case 'development-environment':
        return currentStep.content.developmentEnvironment ? renderSection(
          "Development Environment", 
          currentStep.content.developmentEnvironment, 
          <Server className="h-6 w-6 text-green-500" />
        ) : <div>No development environment details available for this step.</div>;
      
      case 'learning-objectives':
        return currentStep.content.learningObjectives ? renderSection(
          "Learning Objectives", 
          currentStep.content.learningObjectives, 
          <ListChecks className="h-6 w-6 text-amber-500" />
        ) : <div>No learning objectives available for this step.</div>;
      
      default:
        return null;
    }
  };

  // Render the specific content format from the API response
  const renderContent = (content: LearningPathStep['content']) => {
    return (
      <div className="space-y-6">
        {content.backgroundKnowledge && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-medium flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-500" />
                Background Knowledge
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/learning-path/${learningPath?.id}/step/${activeStep}/background-knowledge`)}
              >
                View Details
              </Button>
            </div>
            <div className="space-y-3">
              {content.backgroundKnowledge.slice(0, 2).map((item, index) => (
                <Card key={index} className="p-3">
                  <div className="flex flex-col">
                    <div className="font-medium text-lg">{item.title}</div>
                    {item.description && <div className="text-base text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</div>}
                  </div>
                </Card>
              ))}
              {content.backgroundKnowledge.length > 2 && (
                <div className="text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/learning-path/${learningPath?.id}/step/${activeStep}/background-knowledge`)}>
                  View {content.backgroundKnowledge.length - 2} more items...
                </div>
              )}
            </div>
          </div>
        )}
        
        {content.fundamentalConcepts && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-medium flex items-center gap-2">
                <Code className="h-6 w-6 text-purple-500" />
                Fundamental Concepts
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/learning-path/${learningPath?.id}/step/${activeStep}/fundamental-concepts`)}
              >
                View Details
              </Button>
            </div>
            <div className="space-y-3">
              {content.fundamentalConcepts.slice(0, 2).map((item, index) => (
                <Card key={index} className="p-3">
                  <div className="flex flex-col">
                    <div className="font-medium text-lg">{item.title}</div>
                    {item.description && <div className="text-base text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</div>}
                  </div>
                </Card>
              ))}
              {content.fundamentalConcepts.length > 2 && (
                <div className="text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/learning-path/${learningPath?.id}/step/${activeStep}/fundamental-concepts`)}>
                  View {content.fundamentalConcepts.length - 2} more items...
                </div>
              )}
            </div>
          </div>
        )}
        
        {content.developmentEnvironment && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-medium flex items-center gap-2">
                <Server className="h-6 w-6 text-green-500" />
                Development Environment
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/learning-path/${learningPath?.id}/step/${activeStep}/development-environment`)}
              >
                View Details
              </Button>
            </div>
            <div className="space-y-3">
              {content.developmentEnvironment.slice(0, 2).map((item, index) => (
                <Card key={index} className="p-3">
                  <div className="flex flex-col">
                    <div className="font-medium text-lg">{item.title}</div>
                    {item.description && <div className="text-base text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</div>}
                  </div>
                </Card>
              ))}
              {content.developmentEnvironment.length > 2 && (
                <div className="text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/learning-path/${learningPath?.id}/step/${activeStep}/development-environment`)}>
                  View {content.developmentEnvironment.length - 2} more items...
                </div>
              )}
            </div>
          </div>
        )}
        
        {content.learningObjectives && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-medium flex items-center gap-2">
                <ListChecks className="h-6 w-6 text-amber-500" />
                Learning Objectives
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/learning-path/${learningPath?.id}/step/${activeStep}/learning-objectives`)}
              >
                View Details
              </Button>
            </div>
            <div className="space-y-3">
              {content.learningObjectives.slice(0, 2).map((item, index) => (
                <Card key={index} className="p-3">
                  <div className="flex flex-col">
                    <div className="font-medium text-lg">{item.title}</div>
                    {item.description && <div className="text-base text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</div>}
                  </div>
                </Card>
              ))}
              {content.learningObjectives.length > 2 && (
                <div className="text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/learning-path/${learningPath?.id}/step/${activeStep}/learning-objectives`)}>
                  View {content.learningObjectives.length - 2} more items...
                </div>
              )}
            </div>
          </div>
        )}

        {content.markdown && (
          <div className="prose max-w-none dark:prose-invert">
            {content.markdown}
          </div>
        )}
        
        {content.technologies && (
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3">Technologies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {content.technologies.map((tech, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <Code className="h-5 w-5 text-blue-500" />
                  <span className="text-base">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {content.resources && (
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3">Learning Resources</h3>
            <div className="space-y-2">
              {content.resources.map((resource, index) => (
                <a 
                  key={index} 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span className="text-base">{resource.title}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">{resource.type}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render section detail page
  const renderSectionDetailPage = () => {
    if (!currentStep || !section) return null;

    return (
      <Card>
        <CardHeader>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-2 w-fit"
            onClick={() => navigate(`/learning-path/${learningPath?.id}/step/${activeStep}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Step
          </Button>
          <CardTitle className="text-2xl font-bold">{currentStep.title} - {section?.toString().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContentSection()}
        </CardContent>
      </Card>
    );
  };

  // Main render
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Understand the Prerequisites</h1>
      
      {!section ? (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl"></CardTitle>
              <CardDescription className="text-lg">
                Enter a framework and your skill level to generate a personalized learning path
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-lg font-medium">Framework/Technology</label>
                  <Input 
                    placeholder="Enter framework (e.g. React, Machine Learning)" 
                    value={framework} 
                    onChange={(e) => setFramework(e.target.value)}
                    className="text-lg py-6"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-lg font-medium">Skill Level</label>
                  <Select value={skillLevel} onValueChange={setSkillLevel}>
                    <SelectTrigger className="text-lg py-6">
                      <SelectValue placeholder="Select your skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-lg py-2">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generateLearningPath}
                disabled={loading || !framework || !skillLevel}
                className="w-full py-6 text-xl"
              >
                {loading ? "Generating..." : "Generate Learning Path"}
              </Button>
            </CardFooter>
          </Card>

          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertTitle className="text-xl">Error</AlertTitle>
              <AlertDescription className="text-lg">{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <Card className="mb-8">
              <CardHeader>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          )}

          {learningPath && !section && (
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{learningPath.title}</CardTitle>
                <CardDescription className="text-xl">{learningPath.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <h3 className="text-2xl font-medium mb-4">Learning Steps</h3>
                    <div className="space-y-3">
                      {learningPath.steps.map((step) => (
                        <div
                          key={step.id}
                          className={`p-4 rounded-md cursor-pointer flex items-center justify-between text-lg
                            ${activeStep === step.id ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                            ${step.completed ? 'border-l-4 border-green-500' : ''}`}
                          onClick={() => {
                            setActiveStep(step.id);
                            navigate(`/learning-path/${learningPath.id}/step/${step.id}`);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{step.order}.</span>
                            <span className="font-medium">{step.title}</span>
                          </div>
                          {step.completed && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-3">
                    {activeStep && (
                      <div className="space-y-6">
                        {learningPath.steps.map((step) => (
                          step.id === activeStep && (
                            <div key={step.id}>
                              <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">{step.title}</h2>
                                      
                               
                              </div>
                              {renderContent(step.content)}
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        renderSectionDetailPage()
      )}
    </div>
  );
};

export default LearningPathGenerator;


































































































































































































































































































































