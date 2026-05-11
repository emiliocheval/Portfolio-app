'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof message !== 'string' || !message.trim()
  ) {
    return { ok: false, error: 'All fields are required.' };
  }

  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'emil.conradsson1@gmail.com',
      subject: `New message from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
    });

    return { ok: true };
  } catch {
    return { ok: false, error: 'Failed to send. Please try again.' };
  }
}
