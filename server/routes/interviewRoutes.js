import express from 'express'
import { requireUser } from '../middleware/authMiddleware.js'
import { aiLimiter } from '../middleware/rateLimit.middleware.js'
import { uploadResume } from '../middleware/file.middleware.js'
import {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  evaluateAnswerController,
  generateResumePdfController,
} from '../controllers/interviewController.js'

const router = express.Router()

router.post('/', requireUser, aiLimiter, uploadResume, generateInterviewReportController)
router.get('/', requireUser, getAllInterviewReportsController)
router.get('/report/:interviewId', requireUser, getInterviewReportByIdController)
router.post('/report/:interviewId/evaluate', requireUser, aiLimiter, evaluateAnswerController)
router.post('/resume/pdf/:interviewReportId', requireUser, generateResumePdfController)

export default router