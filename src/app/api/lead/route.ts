import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {Resend} from 'resend';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional().default(''),
  website: z.string().url().optional().or(z.literal('')).default(''),
  message: z.string().min(10),
  consent: z.boolean().refine((v) => v === true, {message: 'Consent required'})
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({error: 'Invalid JSON'}, {status: 400});
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
  }
  const data = parsed.data;

  const hasResend = !!process.env.RESEND_API_KEY && !!process.env.RESEND_TO;

  if (!hasResend) {
    console.log('[lead] dev log:', data);
    return NextResponse.json({ok: true, sent: false});
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Leads <noreply@' + (process.env.MAIL_DOMAIN || 'example.com') + '>',
      to: [process.env.RESEND_TO!],
      subject: `New lead: ${data.name} (${data.company || '—'})`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company}\nWebsite: ${data.website}\n\n${data.message}`
    });
    return NextResponse.json({ok: true, sent: true});
  } catch (e) {
    console.error('Resend error', e);
    return NextResponse.json({ok: true, sent: false}, {status: 200});
  }
}

