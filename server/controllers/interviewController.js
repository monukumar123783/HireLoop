import { PDFParse } from 'pdf-parse'
import { generateInterviewReport, generateResumePdf, evaluateAnswer } from '../services/ai.service.js'
import interviewReportModel from '../models/InterviewReport.js'

/** Resume + job description se interview report banata hai */
export async function generateInterviewReportController(req, res) {
  try {
    const { selfDescription, jobDescription } = req.body

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: 'Job description is required.' })
    }

    let resumeText = ''
    if (req.file) {
      const resumeContent = await new PDFParse(Uint8Array.from(req.file.buffer)).getText()
      resumeText = resumeContent.text
    }

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    })

    const interviewReport = await interviewReportModel.create({
      userId: req.userId,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
      title: interviewReportByAi.title || 'Interview Report',
    })

    res.status(201).json({
      message: 'Interview report generated successfully.',
      interviewReport,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/** Ek report id se nikalta hai */
export async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      userId: req.userId,
    })

    if (!interviewReport) {
      return res.status(404).json({ message: 'Interview report not found.' })
    }

    res.status(200).json({
      message: 'Interview report fetched successfully.',
      interviewReport,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/** Logged-in user ki saari reports */
export async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan')

    res.status(200).json({
      message: 'Interview reports fetched successfully.',
      interviewReports,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/** ATS resume PDF */
export async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      userId: req.userId,   // pehle ye check nahi tha, ab sirf apni report
    })

    if (!interviewReport) {
      return res.status(404).json({ message: 'Interview report not found.' })
    }

    const { resume, jobDescription, selfDescription } = interviewReport
    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`,
    })
    res.send(pdfBuffer)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

/** Practice answer ka AI feedback */
export async function evaluateAnswerController(req, res) {
  try {
    const { interviewId } = req.params
    const { question, answer } = req.body

    if (!question || !answer || !answer.trim()) {
      return res.status(400).json({ message: 'Question and answer are required.' })
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      userId: req.userId,
    })

    if (!interviewReport) {
      return res.status(404).json({ message: 'Interview report not found.' })
    }

    const feedback = await evaluateAnswer({ question, answer })

    interviewReport.practiceAttempts.push({
      question,
      answer,
      score: feedback.score,
      feedback,
    })
    await interviewReport.save()

    res.status(200).json({ message: 'Answer evaluated successfully.', feedback })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
