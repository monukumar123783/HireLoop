import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';
import { getAuth } from '@clerk/express'
 


export const requireUser = (req, res, next) => {
  const { userId } = getAuth(req)
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authorized, please login' })
  }
  req.userId = userId   // AI controllers yahi use karenge
  next()
}

export const protectCompany = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.json({ success: false, message: 'Not authorized, Login Again' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.company = await Company.findById(decoded.id).select('-password');

    if (!req.company) {
      return res.json({ success: false, message: 'Company not found' });
    }
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};