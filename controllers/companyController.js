import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import generateToken from '../utils/generateToken.js';

// Register a new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: 'Missing Details' });
  }

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({ success: false, message: 'Company already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    res.json({
      success: true,
      company: { _id: company._id, name: company.name, email: company.email, image: company.image },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Company login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      company: { _id: company._id, name: company.name, email: company.email, image: company.image },
      token: generateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get logged-in company data
export const getCompanyData = async (req, res) => {
  try {
    res.json({ success: true, company: req.company });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Post a new job
export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body;
  const companyId = req.company._id;

  if (!title || !description || !location || !level || !category) {
    return res.json({ success: false, message: 'Missing Details' });
  }

  try {
    const newJob = await Job.create({
      title,
      description,
      location,
      salary: Number(salary) || 0,
      level,
      category,
      companyId,
      date: Date.now(),
    });

    res.json({ success: true, newJob });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get company's job applicants
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;

    const applications = await JobApplication.find({ companyId })
      .populate('userId', 'name image resume')
      .populate('jobId', 'title location category level salary');

    res.json({ success: true, applications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get company's posted jobs (applicants count ke saath)
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });

    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.find({ jobId: job._id });
        return { ...job.toObject(), applicants: applicants.length };
      })
    );

    res.json({ success: true, jobsData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Change application status (Accepted / Rejected)
export const changeJobApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    await JobApplication.findOneAndUpdate(
      { _id: id, companyId: req.company._id },
      { status }
    );

    res.json({ success: true, message: 'Status Changed' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Change job visibility
export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body;

    const job = await Job.findById(id);

    if (job && req.company._id.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
      await job.save();
    }

    res.json({ success: true, job });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};