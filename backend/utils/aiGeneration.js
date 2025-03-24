import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });


export async function generatePrerequisites(framework, skillLevel) {
  try {
    const prompt = `Create a comprehensive detailed ingormative list of prerequisites for learning ${framework} at ${skillLevel} level .Each point should be detailed and informative in 5 lines.
    Include:
    1. Required background knowledge or skills 4 lines
    2. Fundamental concepts to understand first details(15 lines)
    3. Recommended development environment more details(with names of tools(must) and their purpose) 3 lines
    4. Learning objectives
    5.ATLEST 10 LINES IN description of each point
    Format the response as a JSON with the following structure:
    
    {
      "backgroundKnowledge": [{"title": "string", "description": "string"}],
      "fundamentalConcepts": [{"title": "string", "description": "string"}],
      "developmentEnvironment": [{"tool": "string", "purpose": "string"}],
      "learningObjectives": [{"objective": "string", "importance": "string"}]
    }`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || text.match(/({[\s\S]*})/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating prerequisites:", error);
    // Return a default structure in case of error
    return {
      backgroundKnowledge: [{ title: "Error generating content", description: "Please try again later" }],
      fundamentalConcepts: [],
      developmentEnvironment: [],
      learningObjectives: []
    };
  }
}

export async function generateProjectRecommendations(framework, skillLevel) {
  try {
    const prompt = `Suggest 10 practical unique projects for learning ${framework} at ${skillLevel} level.
    For each project include details in JSON format.7 TO 8 SKILL
    
    Format the response as a JSON array with the following structure:
    [
      {
        "name": "Project name",
        "description": "Brief description of the project 7 TO 8 lines in detail in sequence with numbered points",
        "skills": ["skill1", "skill2"],
        "estimatedHours": number,
        "complexity": "EASY/MEDIUM/HARD"
      }
    ]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || text.match(/(\[[\s\S]*\])/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating project recommendations:", error);
    return [{ name: "Error generating content", description: "Please try again later" }];
  }
}


export async function generateFrameworkExplanation(framework, concept) {
  try {
    const prompt = `Explain the ${concept} concept in ${framework} details.
    
    Format the response as a JSON object with the following structure without any markdown formatting or explanatory text:
    {
      "explanation": "Detailed explanation of the concept in the context of ${framework}",
      "importance": ["Why it's important point 1", "Why it's important point 2", "Point 3", "Point 4", "Point 5"],
      "codeExample": [
        "// Example 1: First detailed code example relevant to ${framework} and ${concept}\n// Include appropriate imports and a complete implementation",
        "// Example 2: Second detailed code example relevant to ${framework} and ${concept}\n// Include appropriate imports and a complete implementation"
        "// Example 3: Second detailed code example relevant to ${framework} and ${concept}\n// Include appropriate imports and a complete implementation"
      
      ],
      "pitfalls": "Common pitfalls when working with ${concept} in ${framework}",
      "bestPractices": "Best practices for implementing ${concept} in ${framework}"
    }`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON extraction
    let jsonData;
    try {
      // First try to parse the entire text as JSON
      jsonData = JSON.parse(text);
    } catch (e) {
      // If that fails, try to extract JSON from markdown code blocks or just find JSON-like structure
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || text.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        jsonData = JSON.parse(jsonMatch[1].trim());
      } else {
        throw new Error("Could not extract valid JSON from response");
      }
    }
    
    // Check if we have the expected nested structure and fix if needed
    if (jsonData.explanation && typeof jsonData.explanation === 'object' && !Array.isArray(jsonData.explanation)) {
      return jsonData.explanation;
    }
    
    return jsonData;
  } catch (error) {
    console.error("Error generating framework explanation:", error);
    return {
      explanation: "Error generating content. Please try again later.",
      importance: [],
      codeExample: [],
      pitfalls: "Error generating content.",
      bestPractices: "Error generating content."
    };
  }
}






export async function generateProjectSteps(projectName, framework, skillLevel) {
  try {
    const prompt = `Create a detailed step-by-step guide for building "${projectName}" with ${framework} at ${skillLevel} leveL FROM SETUP TO DEPLOYMENT.  

    
    for description: write proper logic and why it is used rom point of view of someone who is new to this in 7 to 8 lines
    For code snippets:
    - Include comments explaining key concepts
    - Focus on clean, readable code following ${framework} conventions that can actually work
    - Break complex functionality into smaller, digestible parts 
    -in details code mandetory
    -provied code snippets atleast it could be used for running
    Format the response as a JSON with the following structure:
    {
      "title": "${projectName}",
      "description": "Overall project description",
      "estimatedHours": number,
      "steps": [
        {
           "title": "Step title",
          "description": "Detailed step description with explanation of concepts why it is used IN 5 TO 10",
          "codeSnippets": ["code snippet 1", "code snippet 2"],
          "resources": ["helpful link 1", "helpful link 2","Article 1","Article 2"],
          "estimatedHours": number,
          "checkpoints": ["What to verify before moving to next step and what someone should read about"]
         
         
         
        }
      ]
    }`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || text.match(/({[\s\S]*})/);
   // const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || text.match(/({[\s\S]*})/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating project steps:", error);
    return {
      title: projectName,
      description: "Error generating content. Please try again later.",
      estimatedHours: 0,
      steps: []
    };
  }
}

export async function generateAssessmentQuestions(framework, skillLevel) {
  try {
    const prompt = `Create a comprehensive assessment for ${framework} at ${skillLevel} level.
    Generate 10 multiple-choice questions that test the user's understanding of key concepts, best practices, and implementati
    
    Format the response as a JSON array with the following structure:
    [
      {
        "questionText": "Detailed question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "0", // Index of correct answer (0-3)
        "explanation": "Explanation of the correct answer"
      }
    ]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/```json\n([\s\S]*)\n```/) || text.match(/(\[[\s\S]*\])/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating assessment questions:", error);
    // Return a default structure in case of error
    return [
      {
        questionText: "Error generating questions. Please try again later.",
        options: ["Error", "Error", "Error", "Error"],
        correctAnswer: "0",
        explanation: "An error occurred"
      }
    ];
  }
}