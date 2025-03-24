import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, Code, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Updated type based on the Postman output
type ProjectRecommendation = {
  name: string;
  description: string;
  skills: string[];
  estimatedHours: number;
  complexity: string;
};

// Skill level options
const SKILL_LEVELS = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED"

];

const ProjectRecommendations: React.FC = () => {
  // State for form inputs
  const [framework, setFramework] = useState<string>('');
  const [skillLevel, setSkillLevel] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // State for API responses
  const [projects, setProjects] = useState<ProjectRecommendation[]>([]);
  
  // Function to fetch project recommendations directly from component
  const fetchProjectRecommendations = async () => {
    if (!framework || !skillLevel) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/learn/project-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ framework, skillLevel }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch project recommendations');
      
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching project recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get badge color based on complexity
  const getComplexityColor = (complexity: string) => {
    switch (complexity.toUpperCase()) {
      case 'EASY':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'HARD':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Your Project Ideas Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Discover project ideas tailored to your skill level and build amazing applications.</p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        {/* Projects Search Form */}
        <Card className="border-2 border-indigo-100 dark:border-indigo-900">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 rounded-t-lg">
            <CardTitle className="flex items-center text-2xl">
              <Code className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
              Find Project Ideas
            </CardTitle>
            <CardDescription className="text-base">
              Discover project ideas tailored to your skill level
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="project-framework" className="text-base">Technology/Framework</Label>
                <Input
                  id="project-framework"
                  placeholder="Enter a technology (e.g. React, Node.js, Python)"
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-skill-level" className="text-base">Skill Level</Label>
                <Select 
                  value={skillLevel} 
                  onValueChange={setSkillLevel}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select your skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level} value={level} className="text-base">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button 
              className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              onClick={fetchProjectRecommendations}
              disabled={isLoading || !framework || !skillLevel}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Finding Projects
                </>
              ) : (
                'Find Project Ideas'
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Display Project Recommendations */}
        {projects.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => {
              const borderColor = project.complexity === 'EASY' ? 'border-green-500' : 
                              project.complexity === 'MEDIUM' ? 'border-yellow-500' : 'border-red-500';
              
              return (
                <Card key={index} className={`overflow-hidden border-t-4 hover:shadow-lg transition-shadow ${borderColor} group`}>
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">{project.name}</CardTitle>
                      <Badge className={`${getComplexityColor(project.complexity)} px-3 py-1 text-sm font-medium`}>
                        {project.complexity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-base text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                    
                    <div className="flex items-center text-base text-gray-500 mb-4 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                      <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                      <span>Estimated: <strong>{project.estimatedHours} hours</strong></span>
                    </div>
                    
                    <div>
                      <h4 className="text-base font-medium mb-3 flex items-center">
                        <Zap className="h-4 w-4 mr-1 text-indigo-500" />
                        Skills Required
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-sm px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full h-10 text-base hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                      Start Project
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectRecommendations;