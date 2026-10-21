import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

await connectDB();
connectCloudinary();

app.use(cors());

// Webhook sabse pehle, raw body ke saath
app.post('/webhooks', express.raw({ type: 'application/json' }), clerkWebhooks);

app.use(express.json());

app.get('/', (req, res) => res.send('API Working'));
app.use('/api/company', companyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;