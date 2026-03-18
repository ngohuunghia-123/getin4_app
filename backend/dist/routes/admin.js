import { Router } from 'express';
import { adminListAnswers } from '../controllers/answerController.js';
import { adminLogin } from '../controllers/adminAuthController.js';
import { adminCreateQuestion, adminDeleteQuestion, adminListQuestions, adminUpdateQuestion, } from '../controllers/questionController.js';
import { requireAdmin } from '../middleware/adminAuth.js';
export const adminRouter = Router();
adminRouter.post('/login', adminLogin);
adminRouter.get('/answers', requireAdmin, adminListAnswers);
adminRouter.get('/questions', requireAdmin, adminListQuestions);
adminRouter.post('/questions', requireAdmin, adminCreateQuestion);
adminRouter.put('/questions/:id', requireAdmin, adminUpdateQuestion);
adminRouter.delete('/questions/:id', requireAdmin, adminDeleteQuestion);
//# sourceMappingURL=admin.js.map