import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },   // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') return cb(null, true)
    cb(new Error('Only PDF files are allowed'))
  },
})

// Error aane par JSON mein saaf message deta hai
export const uploadResume = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
    next()
  })
}
