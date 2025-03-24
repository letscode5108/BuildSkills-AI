import express from 'express';
import { validateToken } from "../utils/generate.js";
const router = express.Router();

import { pathgenerator,projectgenerator,frameworkexplain,projectguide,stepprogress,userprogress,generateAssessment,submitAssessment
    
 } from '../controller/ailearning.controller.js';
router.use(validateToken);

router.post("/learning-path",pathgenerator);
router.post("/project-recommendations",projectgenerator);
router.post("/explanation",frameworkexplain);
router.post("/project-guide",projectguide);
router.post("/progress",stepprogress);
router.get("/progress/:learningPathId",userprogress);
 router.get('/generate/:learningPathId', generateAssessment);
 router.post('/submit/:assessmentId', submitAssessment);

export default router;