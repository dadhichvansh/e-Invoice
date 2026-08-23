import 'server-only';

import nodemailer from 'nodemailer';
import { env } from '@/lib/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export async function sendEmailChangeCode(email: string, code: string) {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: `Your e-Invoice verification code`,
    text: `Your e-Invoice verification code is ${code}`,
  });
}
