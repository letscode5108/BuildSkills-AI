// Parser functions for AI generated content

/**
 * Parse project recommendations from AI text response
 * @param {string} text - Raw text from AI
 * @returns {Array} Array of project recommendation objects
 */
function parseProjectRecommendations(text) {
    // Split text by project (assuming each project starts with a number or dash)
    const projects = text.split(/(?=^\d+\.|\- Project name)/m)
      .filter(project => project.trim().length > 0);
    
    return projects.map(project => {
      // Extract project details using regex
      const nameMatch = project.match(/(?:Project name:|^\d+\.\s*)(.*?)(?=Brief description:|$)/mis);
      const descriptionMatch = project.match(/Brief description:(.*?)(?=Key skills practiced:|$)/mis);
      const skillsMatch = project.match(/Key skills practiced:(.*?)(?=Approximate completion time:|$)/mis);
      const timeMatch = project.match(/Approximate completion time:(.*?)(?=$)/mis);
      
      // Clean extracted strings and create object
      return {
        projectName: nameMatch ? nameMatch[1].trim() : "Undefined Project",
        description: descriptionMatch ? descriptionMatch[1].trim() : "",
        keySkills: skillsMatch 
          ? skillsMatch[1].split(',').map(skill => skill.trim())
          : [],
        completionTime: timeMatch ? timeMatch[1].trim() : "Unknown"
      };
    });
  }
  
  /**
   * Parse step-by-step guides from AI JSON response
   * @param {string} text - Raw JSON from AI
   * @returns {Array} Array of step objects
   */
  function parseStepByStepGuide(text) {
    try {
      // Extract JSON from text (sometimes AI wraps JSON in markdown)
      const jsonStr = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(jsonStr);
      
      // Format depends on AI response structure - adjust as needed
      // Assuming data has a "steps" array or is an array of steps
      const steps = data.steps || data;
      
      return steps.map((step, index) => {
        // Determine category based on step title or content
        let category = 'IMPLEMENTATION';
        if (/setup|install|config/i.test(step.title)) {
          category = 'SETUP';
        } else if (/component|ui|interface/i.test(step.title)) {
          category = 'COMPONENT';
        } else if (/test|verify|validate/i.test(step.title)) {
          category = 'TESTING';
        } else if (/deploy|publish|release/i.test(step.title)) {
          category = 'DEPLOYMENT';
        }
        
        return {
          stepNumber: step.number || index + 1,
          title: step.title || `Step ${index + 1}`,
          description: step.description || step.content || "",
          codeExample: step.code || step.codeExample || null,
          category: category,
          estimatedTime: step.estimatedTime || step.time || null
        };
      });
    } catch (error) {
      console.error("Error parsing step-by-step guide:", error);
      return [];
    }
  }
  
  /**
   * Parse prerequisites from AI text response
   * @param {string} text - Raw text from AI
   * @returns {Object} Prerequisite object
   */
  function parsePrerequisites(text) {
    // Extract sections using regex
    const backgroundMatch = text.match(/Required background knowledge:?(.*?)(?=\d+\.|Fundamental concepts|$)/mis);
    const conceptsMatch = text.match(/Fundamental concepts[^:]*:?(.*?)(?=\d+\.|Recommended development|$)/mis);
    const devEnvMatch = text.match(/Recommended development environment:?(.*?)(?=\d+\.|Suggested learning|$)/mis);
    const learningPathMatch = text.match(/Suggested learning path:?(.*?)(?=$)/mis);
    
    return {
      backgroundKnowledge: backgroundMatch ? backgroundMatch[1].trim() : "",
      fundamentalConcepts: conceptsMatch ? conceptsMatch[1].trim() : "",
      devEnvironment: devEnvMatch ? devEnvMatch[1].trim() : "",
      learningPath: learningPathMatch ? learningPathMatch[1].trim() : ""
    };
  }
  
  /**
   * Parse framework explanation from AI text response
   * @param {string} text - Raw text from AI
   * @returns {Object} Explanation object
   */
  function parseFrameworkExplanation(text) {
    // Extract sections using regex
    const basicMatch = text.match(/Basic explanation:?(.*?)(?=\d+\.|Why it's important|$)/mis);
    const importanceMatch = text.match(/Why it's important:?(.*?)(?=\d+\.|Simple code example|$)/mis);
    const codeMatch = text.match(/Simple code example:?(.*?)(?=\d+\.|Common pitfalls|$)/mis); 
    const pitfallsMatch = text.match(/Common pitfalls:?(.*?)(?=\d+\.|Best practices|$)/mis);
    const practicesMatch = text.match(/Best practices:?(.*?)(?=$)/mis);
    
    // Build explanation object
    const explanation = basicMatch ? basicMatch[1].trim() : "";
    const importance = importanceMatch ? importanceMatch[1].trim() : "";
    
    return {
      explanation: explanation + (importance ? `\n\nImportance: ${importance}` : ""),
      codeExample: codeMatch ? codeMatch[1].trim() : "",
      pitfalls: pitfallsMatch ? pitfallsMatch[1].trim() : "",
      bestPractices: practicesMatch ? practicesMatch[1].trim() : ""
    };
  }
  
  // Export all parsers
  module.exports = {
    parseProjectRecommendations,
    parseStepByStepGuide,
    parsePrerequisites,
    parseFrameworkExplanation
  };