import { Webhook } from 'svix';
import User from '../models/User.js';

// Clerk ke users ko apne database ke saath sync karne wala controller
export const clerkWebhooks = async (req, res) => {
  try {
    // Svix instance Clerk ke secret ke saath
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Raw body se signature verify (req.body yahan Buffer hai)
    await whook.verify(req.body.toString(), {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    });

    // Verify hone ke baad body parse karo
    const { data, type } = JSON.parse(req.body.toString());

    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User',
          image: data.image_url,
          resume: '',
        };
        await User.create(userData);
        return res.json({ success: true });
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User',
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        return res.json({ success: true });
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        return res.json({ success: true });
      }

      default:
        // Koi aur event aaye to bhi Clerk ko 200 do
        return res.json({ success: true, message: 'Event ignored' });
    }
  } catch (error) {
    console.log('Webhook error:', error.message);
    return res.status(400).json({ success: false, message: 'Webhooks Error' });
  }
};