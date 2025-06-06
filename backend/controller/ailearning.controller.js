// routes/learning.routes.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { generatePrerequisites, generateProjectRecommendations, generateFrameworkExplanation, generateProjectSteps,generateAssessmentQuestions} from "../utils/aiGeneration.js";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
// 
// 

// 1. Get framework learning path with prerequisites
export const pathgenerator = async (req, res) => {
  try {
    const { framework, skillLevel } = req.body;
    const userId = req.user.id;
    
    // Check cache first
    const existingPath = await prisma.learningPath.findFirst({
      where: {
        technology: framework,
        skillLevel: skillLevel
      },
      include: {
        steps: {
          orderBy: { order: "asc" }
        }
      }
    });
    
    // if (existingPath) {
      // return res.json(existingPath);
    // }

    if (existingPath) {
      // Format the response to ensure steps content is parsed JSON when appropriate
      const formattedPath = {
        ...existingPath,
        steps: existingPath.steps.map(step => {
          // Try to parse content as JSON if possible, otherwise keep as is
          try {
            const parsedContent = JSON.parse(step.content);
            return {
              ...step,
              content: parsedContent
            };
          } catch (e) {
            // If it's not valid JSON, return as is (likely markdown content)
            return{ ...step,
            content: {
              markdown: step.content
            }
          };
        }
        })
      };
      
      return res.json(formattedPath);
    }
    



    
    // Generate prerequisites via Gemini API
    const prerequisites = await generatePrerequisites(framework, skillLevel);
    
    // Create learning path
    const learningPath = await prisma.learningPath.create({
      data: {
        title: `${framework} Learning Path`,
        description: `Complete learning path for ${framework} at ${skillLevel} level`,
        technology: framework,
        skillLevel: skillLevel,
        steps: {
          create: [
            {
              title: "Prerequisites",
              content: JSON.stringify(prerequisites),
              order: 1
            }
          ]
        }
      },
      include: {
        steps: true
      }
    });

    const formattedPath = {
      ...learningPath,
      steps: learningPath.steps.map(step => {
        try {
          const parsedContent = JSON.parse(step.content);
          return {
            ...step,
            content: parsedContent
          };
        } catch (e) {
          return step;
        }
      })
    };
    
    // Log AI-generated content
    await prisma.aIGeneratedContent.create({
      data: {
        prompt: `Prerequisites for ${framework} at ${skillLevel} level`, 
        response: JSON.stringify(prerequisites),
        type: "learning_prerequisites",
        parameters: { framework, skillLevel }
      }
    });
    
    res.json(formattedPath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate learning path" });
  }
};

// 2. Generate project recommendations
export const projectgenerator = async (req, res) => {
  try {
    const { framework, skillLevel } = req.body;
    const userId = req.user.id;
    
    // Generate project recommendations via Gemini API
    const recommendations = await generateProjectRecommendations(framework, skillLevel);
    
    // Add to learning path
    const learningPath = await prisma.learningPath.findFirst({
      where: {
        technology: framework,
        skillLevel: skillLevel
      }
    });
    
    if (learningPath) {
      // Add recommended projects as a step
      await prisma.learningStep.create({
        data: {
          title: "Recommended Projects",
          content: JSON.stringify(recommendations),
          order: 2,
          learningPathId: learningPath.id
        }
      });
    }
    
    // Log AI-generated content
    await prisma.aIGeneratedContent.create({
      data: {
        prompt: `Project recommendations for ${framework} at ${skillLevel} level`,
        response: JSON.stringify(recommendations),
        type: "project_recommendations",
        parameters: { framework, skillLevel }
      }
    });
    
    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate project recommendations" });
  }
};

// 3. Get framework explanation
export const frameworkexplain= async (req, res) => {
  try {
    const { framework, concept } = req.body;
    
    // Generate framework explanation via Gemini API
    const explanation = await generateFrameworkExplanation(framework, concept);
    
    // Find learning path to add this to
    const learningPath = await prisma.learningPath.findFirst({
      where: {
        technology: framework
      }
    });
    
    if (learningPath) {
      // Check if concept explanation already exists
      const existingStep = await prisma.learningStep.findFirst({
        where: {
          learningPathId: learningPath.id,
          title: `Understanding ${concept}`
        }
      });
      
      if (!existingStep) {
        // Add explanation as a learning step
        await prisma.learningStep.create({
          data: {
            title: `Understanding ${concept}`,
            content: JSON.stringify({ markdown: explanation }),
            order: 3, // This might need adjustment based on existing steps
            learningPathId: learningPath.id
          }
        });
      }
    }
    
    // Log AI-generated content
    await prisma.aIGeneratedContent.create({
      data: {
        prompt: `Explanation of ${concept} in ${framework}`,
        response: JSON.stringify(explanation),
        type: "framework_explanation",
        parameters: { framework, concept }
      }
    });
    
    res.json({ explanation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate framework explanation" });
  }
};

// 4. Get project step-by-step guide
export const projectguide= async (req, res) => {
  try {
    const { projectName, framework, skillLevel ,category} = req.body;
    const userEmail = req.user.email;
   // console.log("User object:", req.user);
   
    
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    


    // Generate step-by-step guide via Gemini API
    const guide = await generateProjectSteps(projectName, framework, skillLevel);
    
    // Create project in database
    const project = await prisma.project.create({
      data: {
        title: projectName,
        description: `A ${framework} project for ${skillLevel} developers`,
        difficulty: skillLevel,
        estimatedHours: guide.estimatedHours || 10,
       
        user: {
          connect: { id: user.id }
        },
        
        status: "NOT_STARTED",
        techStack: {
          connectOrCreate: {
            where: {
              name_category: {
                name: framework,
                category: category // Adjust based on framework
              }
            },
            create: {
              name: framework,
              category: category // Adjust based on framework
            }
          }
        },
        // Create tasks from guide steps
        tasks: {
          create: guide.steps.map((step, index) => ({
            title: step.title,
            description: step.description,
            estimatedHours: step.estimatedHours || 1,
            priority: "MEDIUM",
            status: "NOT_STARTED"
          }))
        }
      }
    });
    
    // Add to learning path if it exists
    const learningPath = await prisma.learningPath.findFirst({
      where: {
        technology: framework,
        skillLevel: skillLevel
      }
    });
    
    if (learningPath) {
      await prisma.learningStep.create({
        data: {
          title: `Building ${projectName}`,
          content: JSON.stringify(guide),
          order: 4, // This might need adjustment
          learningPathId: learningPath.id
        }
      });
    }
    
    // Log AI-generated content
    await prisma.aIGeneratedContent.create({
      data: {
        prompt: `Step-by-step guide for ${projectName} with ${framework}`,
        response: JSON.stringify(guide),
        type: "project_guide",
        parameters: { projectName, framework, skillLevel }
      }
    });
    
    res.json({ project, guide });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate project guide" });
  }
};

// 5. Mark step as completed
export const stepprogress=async (req, res) => {
  try {
    const { stepId, completed } = req.body;
    const userEmail = req.user.email;
 const user = await prisma.user.findUnique({
   where: { email: userEmail },
   select: { id: true }
 });
 
 if (!user) {
   return res.status(404).json({ message: "User not found" });
 }

 
    // Update or create step progress
    const progress = await prisma.userStepProgress.upsert({
      where: {
        userId_stepId: {
          
          userId: user.id,
          stepId: stepId
        }
      },
      update: {
        completed: completed,
        completedAt: completed ? new Date() : null
      },
      create: {
        userId: user.id,
        stepId: stepId,
        completed: completed,
        completedAt: completed ? new Date() : null
      }
    });
    
    // Calculate overall progress
    const learningStep = await prisma.learningStep.findUnique({
      where: { id: stepId },
      include: { learningPath: true }
    });
    
    if (learningStep) {
      const allSteps = await prisma.learningStep.findMany({
        where: { learningPathId: learningStep.learningPathId }
      });
      
      const userProgress = await prisma.userStepProgress.findMany({
        where: {
         
         userId: user.id,
         
          stepId: { in: allSteps.map(step => step.id) },
          completed: true
        }
      });
      
      const progressPercentage = (userProgress.length / allSteps.length) * 100;
      
      res.json({ progress, progressPercentage });
    } else {
      res.json({ progress });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update progress" });
  }
};

// 6. Get user progress for a learning path
export const userprogress= async (req, res) => {
  try {
    const { learningPathId } = req.params;
    const userId = req.user.email;
    
    const learningPath = await prisma.learningPath.findUnique({
      where: { id: learningPathId },
      include: {
        steps: {
          include: {
            completedByUsers: {
              where: { userId: userId }
            }
          }
        }
      }
    });
    
    if (!learningPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }
    
    const totalSteps = learningPath.steps.length;
    const completedSteps = learningPath.steps.filter(step => 
      step.completedByUsers.length > 0 && step.completedByUsers[0].completed
    ).length;
    
    const progressPercentage = (completedSteps / totalSteps) * 100;
    
    res.json({
      learningPath,
      progressPercentage,
      completedSteps,
      totalSteps
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user progress" });
  }
};


// Generate assessment for a completed learning path


export const generateAssessment = async (req, res) => {
  try {
    const { learningPathId } = req.params;
    const userEmail = req.user.email;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if user has completed all steps
    const learningPath = await prisma.learningPath.findUnique({
      where: { id: learningPathId },
      include: {
        steps: true
      }
    });
    
    if (!learningPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }
    
    // Get user progress
    const userStepProgress = await prisma.userStepProgress.findMany({
      where: {
        userId: user.id,
        step: {
          learningPathId: learningPathId
        },
        completed: true
      }
    });
    
    const totalSteps = learningPath.steps.length;
    const completedSteps = userStepProgress.length;
    const progressPercentage = (completedSteps / totalSteps) * 100;
    
    // Check if user has completed 100% of the learning path
    if (progressPercentage < 100) {
      return res.status(400).json({ 
        message: "Cannot generate assessment until all steps are completed",
        progressPercentage,
        completedSteps,
        totalSteps 
      });
    }
    
    // Check if assessment already exists
    const existingAssessment = await prisma.assessment.findFirst({
      where: {
        userId: user.id,
        learningPathId: learningPathId
      }
    });
    
    if (existingAssessment) {
      return res.json(existingAssessment);
    }
    
    // Generate assessment questions via Gemini API
    const assessmentQuestions = await generateAssessmentQuestions(
      learningPath.technology, 
      learningPath.skillLevel
    );
    
    // Create assessment in database
    const assessment = await prisma.assessment.create({
      data: {
        userId: user.id,
        learningPathId: learningPathId,
        questions: assessmentQuestions,
        status: "PENDING",
        passingScore: 75,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });
    
    // Log AI-generated content
    await prisma.aIGeneratedContent.create({
      data: {
        prompt: `Assessment questions for ${learningPath.technology} at ${learningPath.skillLevel} level`,
        response: JSON.stringify(assessmentQuestions),
        type: "assessment_questions",
        parameters: { 
          framework: learningPath.technology, 
          skillLevel: learningPath.skillLevel 
        }
      }
    });
    
    res.json(assessment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate assessment" });
  }
};

//8. Submit assessment answers
export const submitAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { answers } = req.body;
    const userEmail = req.user.email;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true,skillLevel:true }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Find assessment
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId }
    });
    
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    
    // Verify this assessment belongs to the user
    if (assessment.userId !== user.id) {
      return res.status(403).json({ message: "Unauthorized access to assessment" });
    }
    
    // Verify assessment is still pending
    if (assessment.status !== "PENDING") {
      return res.status(400).json({ 
        message: "Assessment already submitted", 
        result: assessment
      });
    }
    
    // Calculate score
    const questions = assessment.questions;
    let correctAnswers = 0;
    
    const gradedAnswers = answers.map((answer, index) => {
      const question = questions[index];
      const isCorrect = question.correctAnswer === answer;
      
      if (isCorrect) {
        correctAnswers++;
      }
      
      return {
        questionId: index,
        userAnswer: answer,
        correct: isCorrect
      };
    });
    
    if (!questions) {
      return res.status(400).json({ message: "Questions not found in the assessment" });
    }
    if (!Array.isArray(questions)) {
      throw new Error("Questions should be an array");
    }
    const score = (correctAnswers / questions.length) * 100;
    const passed = score >= assessment.passingScore;
    
    // Update assessment with results
    const updatedAssessment = await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        userAnswers: gradedAnswers,
        score: score,
        status: passed ? "PASSED" : "FAILED",
        completedAt: new Date()
      }
    });
    
    // If passed, update user skill level if appropriate
    if (passed) {
      const learningPath = await prisma.learningPath.findUnique({
        where: { id: assessment.learningPathId }
      });
      
      // Consider upgrading user skill level if they passed an advanced assessment
      if (learningPath && learningPath.skillLevel === "ADVANCED") {
        await prisma.user.update({
          where: { id: user.id },
          data: { skillLevel: "ADVANCED" }
        });
      } else if (learningPath && learningPath.skillLevel === "INTERMEDIATE" && 
                 user.skillLevel === "BEGINNER") {
        await prisma.user.update({
          where: { id: user.id },
          data: { skillLevel: "INTERMEDIATE" }
        });
      }
      
      // Create certificate of completion
      await prisma.certificate.create({
        data: {
          userId: user.id,
          learningPathId: assessment.learningPathId,
          assessmentId: assessmentId,
          issueDate: new Date(),
          score: score
        }
      });
    }
    
    res.json({
      assessment: updatedAssessment,
      passed,
      score,
      requiredScore: assessment.passingScore
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit assessment" });
  }
};