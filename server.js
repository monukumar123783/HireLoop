 import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import './config/instrument.js'
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';
const app = express();

await connectDB();

app.use(cors());
app.use(express.json());
app.post('/webhooks', express.raw({ type: 'application/json' }), clerkWebhooks);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.get('/', (req, res) => res.send('API Working'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
export default app;