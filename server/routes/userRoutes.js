import express from 'express'
import upload from '../config/multer.js'
import { requireUser } from '../middleware/authMiddleware.js'
import {
  getUserData, applyForJob, getUserJobApplications, updateUserResume,
} from '../controllers/userController.js'

const router = express.Router()
router.get('/user', requireUser, getUserData)
router.post('/apply', requireUser, applyForJob)
router.get('/applications', requireUser, getUserJobApplications)
router.post('/update-resume', requireUser, upload.single('resume'), updateUserResume)
export default router