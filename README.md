# HireLoop

Full-stack job portal with an AI Interview Preparation module.

**Live:** https://hire-loop-koxg.vercel.app
**API:** https://hireloop-orf5.onrender.com

## Features
- Job seekers: browse and apply to jobs, resume upload (Clerk auth)
- Recruiters: company login, post and manage jobs, review applicants
- AI Interview Prep: upload resume and job description to get a match score,
  technical and behavioral questions, skill gaps, a preparation roadmap,
  answer evaluation, and a tailored ATS-friendly resume PDF (Gemini)
- "Prepare for this job" button on every job page

## Tech Stack
React, Vite, Tailwind CSS, SCSS, Node.js, Express, MongoDB (Mongoose),
Clerk, JWT, Cloudinary, Google Gemini, Puppeteer, Sentry, Docker

## Architecture
- `client/`: React app (deployed on Vercel)
- `server/`: Express API in Docker (deployed on Render)
- MongoDB Atlas, Cloudinary for images, Clerk for job-seeker auth

## Run locally
1. `git clone https://github.com/monukumar123783/HireLoop.git`
2. Server: `cd server`, copy `.env.example` to `.env`, fill values, then `npm install` and `npm run dev`
3. Client: `cd client`, copy `.env.example` to `.env`, fill values, then `npm install` and `npm run dev`
4. Open http://localhost:5173
