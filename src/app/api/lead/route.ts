import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {Resend} from 'resend';

export const runtime = 'edge';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional().default(''),
  website: z.string().url().optional().or(z.literal('')).default(''),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  consent: z.boolean().refine((v) => v === true, {message: 'Consent required'})
});

export async function POST(req: NextRequest) {
  console.log('[lead] Received request');
  
  // Parse JSON with better error handling
  let json;
  try {
    json = await req.json();
  } catch (error) {
    console.error('[lead] JSON parse error:', error);
    return NextResponse.json({error: 'Invalid JSON body'}, {status: 400});
  }

  // Validate data
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    console.error('[lead] Validation error:', parsed.error.flatten());
    return NextResponse.json({
      error: 'Validation failed', 
      details: parsed.error.flatten()
    }, {status: 400});
  }
  
  const data = parsed.data;
  console.log('[lead] Valid data received for:', data.email);

  // Check environment variables
  const apiKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.RESEND_TO;
  const mailDomain = process.env.MAIL_DOMAIN;

  console.log('[lead] Environment check:', {
    hasApiKey: !!apiKey,
    hasRecipient: !!recipientEmail,
    hasDomain: !!mailDomain,
    apiKeyLength: apiKey?.length || 0,
    domain: mailDomain || 'NOT SET'
  });

  if (!apiKey || !recipientEmail) {
    console.error('[lead] Missing required environment variables');
    console.error('[lead] RESEND_API_KEY:', apiKey ? 'SET' : 'MISSING');
    console.error('[lead] RESEND_TO:', recipientEmail ? 'SET' : 'MISSING');
    console.error('[lead] MAIL_DOMAIN:', mailDomain ? 'SET' : 'MISSING');
    
    // In development, log the data instead
    if (process.env.NODE_ENV === 'development') {
      console.log('[lead] DEV MODE - Would send:', data);
      return NextResponse.json({ok: true, sent: false, dev: true});
    }
    
    return NextResponse.json({
      error: 'Email service not configured',
      sent: false
    }, {status: 500});
  }

  try {
    console.log('[lead] Initializing Resend...');
    const resend = new Resend(apiKey);
    
    // Create HTML email template
    const htmlEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px 40px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">🎯 New Lead Submission</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px;">
      <div style="margin-bottom: 30px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px 0;">You've received a new lead from your website contact form.</p>
      </div>
      
      <!-- Contact Info -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #374151; font-size: 14px;">👤 Name:</strong>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
            <span style="color: #1f2937; font-size: 14px;">${data.name}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #374151; font-size: 14px;">📧 Email:</strong>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
            <a href="mailto:${data.email}" style="color: #3b82f6; font-size: 14px; text-decoration: none;">${data.email}</a>
          </td>
        </tr>
        ${data.company ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #374151; font-size: 14px;">🏢 Company:</strong>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
            <span style="color: #1f2937; font-size: 14px;">${data.company}</span>
          </td>
        </tr>
        ` : ''}
        ${data.website ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #374151; font-size: 14px;">🌐 Website:</strong>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
            <a href="${data.website}" target="_blank" style="color: #3b82f6; font-size: 14px; text-decoration: none;">${data.website}</a>
          </td>
        </tr>
        ` : ''}
      </table>
      
      <!-- Message -->
      <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
        <strong style="color: #374151; font-size: 14px; display: block; margin-bottom: 10px;">💬 Message:</strong>
        <p style="color: #1f2937; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${data.message}</p>
      </div>
      
      <!-- Action Button -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="mailto:${data.email}?subject=Re: Your inquiry" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Reply to ${data.name}</a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        Sent from <strong>thomas-nicoli.com</strong> contact form<br>
        ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
    
    // Plain text fallback
    const textEmail = `New Lead Submission

Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}` : ''}
${data.website ? `Website: ${data.website}` : ''}

Message:
${data.message}

---
Sent from thomas-nicoli.com contact form
${new Date().toLocaleString()}`;
    
    console.log('[lead] Sending email...');
    console.log('[lead] From:', `Leads <noreply@${mailDomain || 'example.com'}>`);
    console.log('[lead] To:', recipientEmail);
    console.log('[lead] Subject:', `🎯 New lead: ${data.name}${data.company ? ` (${data.company})` : ''}`);
    
    const result = await resend.emails.send({
      from: 'Leads <noreply@' + (mailDomain || 'example.com') + '>',
      to: [recipientEmail],
      replyTo: data.email, // Allow direct reply to the sender
      subject: `🎯 New lead: ${data.name}${data.company ? ` (${data.company})` : ''}`,
      html: htmlEmail,
      text: textEmail
    });
    
    console.log('[lead] Resend result:', result);
    
    if (result.error) {
      console.error('[lead] Resend returned error:', result.error);
      return NextResponse.json({
        error: 'Failed to send email',
        details: result.error,
        sent: false
      }, {status: 500});
    }
    
    console.log('[lead] Email sent successfully! ID:', result.data?.id);
    return NextResponse.json({
      ok: true, 
      sent: true, 
      emailId: result.data?.id
    });
    
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[lead] Exception caught:', error);
    console.error('[lead] Error name:', err?.name);
    console.error('[lead] Error message:', err?.message);
    console.error('[lead] Error stack:', err?.stack);
    
    return NextResponse.json({
      error: 'Failed to send email',
      message: err?.message || 'Unknown error',
      sent: false
    }, {status: 500});
  }
}

