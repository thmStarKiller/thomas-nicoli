import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {Resend} from 'resend';

export const runtime = 'edge';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional().default(''),
  website: z.string().optional().default('').refine(
    (val) => !val || val === '' || z.string().url().safeParse(val).success,
    { message: 'Website must be a valid URL or empty' }
  ),
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
    
    // Spanish poet quotes for thank you email
    const poetQuotes = [
      {
        quote: "Caminante, son tus huellas el camino y nada más; caminante, no hay camino, se hace camino al andar.",
        author: "Antonio Machado",
        translation: "Traveler, your footprints are the path and nothing more; traveler, there is no path, the path is made by walking."
      },
      {
        quote: "La poesía es el sentimiento que le sobra al corazón y te sale por la mano.",
        author: "Carmen Conde",
        translation: "Poetry is the feeling that overflows from the heart and comes out through your hand."
      },
      {
        quote: "Yo soy yo y mi circunstancia, y si no la salvo a ella no me salvo yo.",
        author: "José Ortega y Gasset",
        translation: "I am myself and my circumstance, and if I do not save it, I do not save myself."
      },
      {
        quote: "Todo pasa y todo queda, pero lo nuestro es pasar, pasar haciendo caminos, caminos sobre la mar.",
        author: "Antonio Machado",
        translation: "Everything passes and everything remains, but our task is to pass, to pass making paths, paths over the sea."
      },
      {
        quote: "Siempre imaginé que el paraíso sería algún tipo de biblioteca.",
        author: "Jorge Luis Borges",
        translation: "I have always imagined that Paradise will be a kind of library."
      }
    ];
    
    const randomQuote = poetQuotes[Math.floor(Math.random() * poetQuotes.length)];
    
    // Create mobile-responsive HTML email template for admin notification
    const htmlEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>New Lead</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <!-- Wrapper Table for Email Clients -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center" style="padding: 0;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); overflow: hidden; margin: 0 auto;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 10px;">🎯</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">New Lead!</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">Someone wants to work with you</p>
            </td>
          </tr>
          
          <!-- Content Section -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Alert Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px; background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); border-radius: 8px; border: 2px solid #e0e7ff; padding: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0; color: #4338ca; font-size: 14px; line-height: 1.6; font-weight: 500;">
                      ⚡ <strong>Quick action recommended!</strong> Respond within 24 hours to increase conversion chances.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Contact Details Card --><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px; background-color: #fafafa; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 18px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">Contact Information</h2>
                    
                    <!-- Name -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px;">
                      <tr>
                        <td width="30" style="vertical-align: top; padding-top: 2px;">
                          <span style="font-size: 20px;">👤</span>
                        </td>
                        <td>
                          <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Name</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${data.name}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Email -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px;">
                      <tr>
                        <td width="30" style="vertical-align: top; padding-top: 2px;">
                          <span style="font-size: 20px;">📧</span>
                        </td>
                        <td>
                          <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Email</p>
                          <p style="margin: 4px 0 0 0;"><a href="mailto:${data.email}" style="color: #6366f1; font-size: 16px; font-weight: 600; text-decoration: none;">${data.email}</a></p>
                        </td>
                      </tr>
                    </table>
                    
                    ${data.company ? `
                    <!-- Company -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px;">
                      <tr>
                        <td width="30" style="vertical-align: top; padding-top: 2px;">
                          <span style="font-size: 20px;">🏢</span>
                        </td>
                        <td>
                          <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Company</p>
                          <p style="margin: 4px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${data.company}</p>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                    
                    ${data.website ? `
                    <!-- Website -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="30" style="vertical-align: top; padding-top: 2px;">
                          <span style="font-size: 20px;">🌐</span>
                        </td>
                        <td>
                          <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Website</p>
                          <p style="margin: 4px 0 0 0;"><a href="${data.website}" target="_blank" style="color: #6366f1; font-size: 16px; font-weight: 600; text-decoration: none;">${data.website.replace(/^https?:\/\//, '')}</a></p>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
              </table>
              
              <!-- Message Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px; background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%); border-radius: 10px; border-left: 6px solid #f59e0b; overflow: hidden;">
                <tr>
                  <td style="padding: 24px;">
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                      <span style="font-size: 24px; margin-right: 8px;">💬</span>
                      <h3 style="margin: 0; color: #92400e; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Their Message</h3>
                    </div>
                    <p style="margin: 0; color: #78350f; font-size: 15px; line-height: 1.7; white-space: pre-wrap; font-weight: 500;">${data.message}</p>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${data.email}?subject=Re:%20Your%20inquiry%20about%20our%20services" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3); text-transform: uppercase; letter-spacing: 0.5px;">
                      ✉️ Reply Now
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Tip Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; padding: 16px;">
                <tr>
                  <td>
                    <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                      <strong style="color: #374151;">💡 Pro Tip:</strong> Personalize your reply by referencing their specific message or company for better engagement.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #111827; padding: 30px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px; font-weight: 500;">
                📨 Sent from <strong style="color: #e5e7eb;">thomas-nicoli.com</strong> contact form
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 11px;">
                ${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
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
    
    console.log('[lead] Admin email sent successfully! ID:', result.data?.id);
    
    // Send beautiful thank you email to the lead with Spanish poet quote
    const thankYouHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Thank You</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="width: 600px; max-width: 100%; margin: 0 auto;">
          
          <!-- Animated Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); border-radius: 20px 20px 0 0; padding: 50px 40px; text-align: center; position: relative;">
              <div style="font-size: 64px; margin-bottom: 20px; animation: fadeIn 1s;">✨</div>
              <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 36px; font-weight: 800; letter-spacing: -1px; line-height: 1.2;">Thank You, ${data.name.split(' ')[0]}!</h1>
              <p style="margin: 0; color: rgba(255,255,255,0.95); font-size: 18px; font-weight: 500; line-height: 1.6;">We've received your message</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="background-color: #ffffff; padding: 50px 40px;">
              
              <!-- Welcome Message -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 35px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 700; line-height: 1.3;">Your inquiry means the world to us</h2>
                    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 16px; line-height: 1.7;">Hi <strong style="color: #111827;">${data.name}</strong>,</p>
                    <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 16px; line-height: 1.7;">Thank you for reaching out! We're thrilled that you're interested in working together. Your message has been received and we'll get back to you within <strong style="color: #6366f1;">24 hours</strong>.</p>
                    <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.7;">In the meantime, feel free to explore our portfolio or check out our services page to learn more about what we do.</p>
                  </td>
                </tr>
              </table>
              
              <!-- Quote Card with Spanish Poet -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 35px; background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border-radius: 16px; border-left: 6px solid #f59e0b; overflow: hidden; box-shadow: 0 10px 25px rgba(245, 158, 11, 0.2);">
                <tr>
                  <td style="padding: 35px 30px;">
                    <div style="font-size: 40px; margin-bottom: 20px; opacity: 0.7;">📖</div>
                    <p style="margin: 0 0 20px 0; color: #78350f; font-size: 19px; line-height: 1.8; font-style: italic; font-weight: 500;">"${randomQuote.quote}"</p>
                    <div style="border-top: 2px solid #fbbf24; padding-top: 16px; margin-top: 16px;">
                      <p style="margin: 0 0 8px 0; color: #92400e; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">— ${randomQuote.author}</p>
                      <p style="margin: 0; color: #a16207; font-size: 14px; line-height: 1.6; font-style: italic;">${randomQuote.translation}</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- What Happens Next -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 35px; background-color: #f8fafc; border-radius: 12px; padding: 30px; border: 2px solid #e2e8f0;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 20px 0; color: #111827; font-size: 20px; font-weight: 700;">What happens next?</h3>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="40" style="vertical-align: top; padding-top: 4px;">
                          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px;">1</div>
                        </td>
                        <td style="padding-bottom: 20px;">
                          <p style="margin: 0; color: #111827; font-size: 15px; font-weight: 600; line-height: 1.6;">We review your message</p>
                          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">Our team will carefully read through your inquiry</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="40" style="vertical-align: top; padding-top: 4px;">
                          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px;">2</div>
                        </td>
                        <td style="padding-bottom: 20px;">
                          <p style="margin: 0; color: #111827; font-size: 15px; font-weight: 600; line-height: 1.6;">We craft a personalized response</p>
                          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">Expect a thoughtful reply tailored to your needs</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="40" style="vertical-align: top; padding-top: 4px;">
                          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px;">3</div>
                        </td>
                        <td>
                          <p style="margin: 0; color: #111827; font-size: 15px; font-weight: 600; line-height: 1.6;">Let's start the conversation</p>
                          <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">We'll reach out within 24 hours to discuss next steps</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Quick Links -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">While you wait, explore more</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="https://thomas-nicoli.com/work" style="display: inline-block; background-color: #f3f4f6; color: #374151; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; border: 2px solid #e5e7eb;">
                            📁 Our Work
                          </a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://thomas-nicoli.com/services" style="display: inline-block; background-color: #f3f4f6; color: #374151; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; border: 2px solid #e5e7eb;">
                            ⚡ Services
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Signature -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="border-top: 2px solid #e5e7eb; padding-top: 30px;">
                    <p style="margin: 0 0 8px 0; color: #111827; font-size: 16px; font-weight: 600;">Best regards,</p>
                    <p style="margin: 0; color: #6366f1; font-size: 18px; font-weight: 700;">Thomas & Virginia</p>
                    <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">Strategy, Editorial & AI Consulting</p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 0 0 20px 20px; padding: 40px; text-align: center;">
              <p style="margin: 0 0 16px 0; color: #94a3b8; font-size: 13px; line-height: 1.6;">
                This email was sent to <strong style="color: #cbd5e1;">${data.email}</strong> in response to your inquiry at thomas-nicoli.com
              </p>
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                © ${new Date().getFullYear()} Thomas & Virginia. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
    
    const thankYouText = `Thank You, ${data.name}!

We've received your message and we're excited to connect with you.

Your inquiry means a lot to us, and we'll get back to you within 24 hours with a personalized response.

"${randomQuote.quote}"
— ${randomQuote.author}

${randomQuote.translation}

What happens next?
1. We review your message
2. We craft a personalized response  
3. We reach out within 24 hours

Best regards,
Thomas & Virginia
Strategy, Editorial & AI Consulting

---
This email was sent to ${data.email} in response to your inquiry at thomas-nicoli.com`;

    console.log('[lead] Sending thank you email to:', data.email);
    
    const thankYouResult = await resend.emails.send({
      from: 'Thomas & Virginia <hello@' + (mailDomain || 'example.com') + '>',
      to: [data.email],
      subject: `✨ Thank you for reaching out, ${data.name.split(' ')[0]}!`,
      html: thankYouHtml,
      text: thankYouText
    });
    
    console.log('[lead] Thank you email result:', thankYouResult);
    
    if (thankYouResult.error) {
      console.error('[lead] Thank you email failed (non-critical):', thankYouResult.error);
      // Don't fail the request if thank you email fails
    } else {
      console.log('[lead] Thank you email sent! ID:', thankYouResult.data?.id);
    }
    
    return NextResponse.json({
      ok: true, 
      sent: true, 
      emailId: result.data?.id,
      thankYouEmailId: thankYouResult.data?.id
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

