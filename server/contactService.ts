import { Request, Response } from 'express';
import { ContactSubmission } from './types';

// In-memory store for contact submissions
const contactSubmissions: ContactSubmission[] = [];

export function handleContactSubmission(req: Request, res: Response) {
  const { name, email, topic, message } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter a valid name (at least 2 characters).' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters long.' });
  }

  const cleanTopic = typeof topic === 'string' && topic.trim() ? topic.trim() : 'General Inquiry';

  const submission: ContactSubmission = {
    id: `DNLY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    topic: cleanTopic,
    message: message.trim(),
    timestamp: new Date().toISOString(),
  };

  contactSubmissions.unshift(submission);
  // Keep last 100 submissions in memory
  if (contactSubmissions.length > 100) {
    contactSubmissions.pop();
  }

  return res.status(200).json({
    success: true,
    message: 'Your message has been sent successfully. Our team will review your inquiry shortly.',
    ticketId: submission.id,
    timestamp: submission.timestamp,
  });
}
