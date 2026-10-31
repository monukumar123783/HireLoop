import { getAuth , clerkClient } from '@clerk/express'
import { v2 as cloudinary } from 'cloudinary'
import User from '../models/User.js'
import Job from '../models/Job.js'
import JobApplication from '../models/JobApplication.js'

// User ka data
// Get the logged-in user's data (create it if the webhook has not done so yet)
export const getUserData = async (req, res) => {
  try {
    const { userId } = getAuth(req)

    let user = await User.findById(userId)

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId)
      const fullName =
        `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
        clerkUser.username ||
        'User'

      user = await User.create({
        _id: userId,
        name: fullName,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
        image: clerkUser.imageUrl || '',
        resume: '',
      })
    }

    res.json({ success: true, user })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Job par apply
export const applyForJob = async (req, res) => {
  try {
    const { userId } = getAuth(req)
    const { jobId } = req.body

    const already = await JobApplication.findOne({ userId, jobId })
    if (already) return res.json({ success: false, message: 'Already applied' })

    const jobData = await Job.findById(jobId)
    if (!jobData) return res.json({ success: false, message: 'Job not found' })

    await JobApplication.create({
      userId,
      companyId: jobData.companyId,
      jobId,
      date: Date.now(),
    })
    res.json({ success: true, message: 'Applied successfully' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// User ki saari applications
export const getUserJobApplications = async (req, res) => {
  try {
    const { userId } = getAuth(req)
    const applications = await JobApplication.find({ userId })
      .populate('companyId', 'name email image')
      .populate('jobId', 'title description location category level salary')
    res.json({ success: true, applications })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Resume upload
export const updateUserResume = async (req, res) => {
  try {
    const { userId } = getAuth(req)
    const resumeFile = req.file
    if (!resumeFile) return res.json({ success: false, message: 'No file' })

    const userData = await User.findById(userId)
    const upload = await cloudinary.uploader.upload(resumeFile.path)
    userData.resume = upload.secure_url
    await userData.save()
    res.json({ success: true, message: 'Resume updated' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}