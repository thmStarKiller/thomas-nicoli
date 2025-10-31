'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MessageSquare, User, Building, Globe } from 'lucide-react';

import { BlurFade } from '@/components/magicui/blur-fade';
import { MagicCard } from '@/components/magicui/magic-card';

export default function ContactContent() {
  const locale = useLocale();
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'ok' | 'error' | 'loading'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Load ElevenLabs widget script and configure client tools
  useEffect(() => {
    console.log('[Widget] Setting up ElevenLabs widget...');
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    // Wait for widget to be available in DOM
    const setupWidget = () => {
      const widget = document.querySelector('elevenlabs-convai');
      
      if (!widget) {
        console.log('[Widget] Widget not found yet, retrying in 500ms...');
        setTimeout(setupWidget, 500);
        return;
      }

      console.log('[Widget] Widget found! Setting up event listener...');

      // Set up client tool handler for phone calls
      const handleWidgetCall = (event: Event) => {
        console.log('[Widget] ⚡ elevenlabs-convai:call event received!');
        const customEvent = event as CustomEvent;
        const config = customEvent.detail?.config;
        
        if (!config) {
          console.error('[Widget] No config found in event');
          return;
        }

        console.log('[Widget] Registering client tools...');
        config.clientTools = {
          // Client tool to initiate phone call via Twilio
          initiatePhoneCall: async (params: Record<string, unknown>) => {
            console.log('[Widget] 🔥 initiatePhoneCall CALLED WITH PARAMS:', params);
            
            try {
              // Extract phone number - try different possible parameter names
              const phoneNumber = (params?.phoneNumber || 
                                  params?.phone_number || 
                                  params?.number || 
                                  params?.to) as string;
              
              console.log('[Widget] Extracted phone number:', phoneNumber);
              
              if (!phoneNumber || typeof phoneNumber !== 'string') {
                const error = 'Phone number is required. Please provide a valid phone number.';
                console.error('[Widget] ERROR:', error);
                return {
                  success: false,
                  error: error,
                };
              }
              
              console.log('[Widget] Calling API with phone number:', phoneNumber);
              
              const response = await fetch('/api/call/outbound', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  to_number: phoneNumber,
                }),
              });

              const data = await response.json();
              console.log('[Widget] API response:', data);

              if (!response.ok) {
                throw new Error(data.error || 'Failed to initiate call');
              }

              console.log('[Widget] ✅ Call initiated successfully!');
              return {
                success: true,
                message: `Call initiated successfully to ${phoneNumber}`,
                call_sid: data.call_sid,
              };
            } catch (error) {
              console.error('[Widget] ❌ Error initiating call:', error);
              return {
                success: false,
                error: String(error),
              };
            }
          },
        };
        
        console.log('[Widget] Client tools registered successfully!');
      };

      // Attach event listener to the WIDGET element (not document)
      widget.addEventListener('elevenlabs-convai:call', handleWidgetCall);
      console.log('[Widget] Event listener attached to widget element');
    };

    // Start setup after a short delay to ensure DOM is ready
    setTimeout(setupWidget, 100);

    return () => {
      console.log('[Widget] Cleanup: removing script');
      const scriptElement = document.querySelector(`script[src="${script.src}"]`);
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company || '',
          website: data.website || '',
          message: data.message,
          consent: data.consent === 'on',
        }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const result = await res.json();
      
      if (res.ok && result.sent) {
        setStatus('ok');
        // Reset form on success
        form.reset();
      } else {
        setStatus('error');
        // Better error message formatting
        let errorMsg = result.error || result.message || 'Failed to send message';
        
        // If there are field errors, list them
        if (result.details?.fieldErrors) {
          const fieldErrors = Object.entries(result.details.fieldErrors)
            .map(([field, errors]) => {
              const errorArray = Array.isArray(errors) ? errors : [String(errors)];
              return `${field}: ${errorArray.join(', ')}`;
            })
            .join('; ');
          errorMsg += ` - ${fieldErrors}`;
        }
        
        setErrorMessage(errorMsg);
        console.error('API error:', result);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
      console.error('Submit error:', error);
    }
  }

  return (
    <div key={locale} className="min-h-screen bg-background text-foreground">
      {/* ElevenLabs Voice Agent Widget */}
      <div dangerouslySetInnerHTML={{ 
        __html: '<elevenlabs-convai agent-id="jrtHx9K8suqXV9kyjlb6"></elevenlabs-convai>' 
      }} />
      
      <div className="mx-auto max-w-4xl px-4 py-12">
        <BlurFade delay={0.1}>
          <h1 className="text-4xl font-bold mb-2 text-foreground">{t('title')}</h1>
          <p className="text-xl text-muted-foreground mb-8">{t('body')}</p>
        </BlurFade>

        <BlurFade delay={0.2}>
          <MagicCard className="p-8 bg-card border border-border">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <User className="w-4 h-4" />
                  {t('name')}
                </label>
                <input id="name" name="name" required className="form-input" placeholder={t('placeholders.name')} />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Mail className="w-4 h-4" />
                  {t('email')}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="form-input"
                  placeholder={t('placeholders.email')}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="company" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Building className="w-4 h-4" />
                    {t('company')}
                  </label>
                  <input id="company" name="company" className="form-input" placeholder={t('placeholders.company')} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="website" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Globe className="w-4 h-4" />
                    {t('website')}
                  </label>
                  <input id="website" name="website" className="form-input" placeholder={t('placeholders.website')} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MessageSquare className="w-4 h-4" />
                  {t('message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="form-textarea"
                  placeholder={t('placeholders.message')}
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-1 rounded border-input bg-background text-primary focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:ring-offset-background"
                />
                <span>{t('consent')}</span>
              </label>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('submit')}
                    </>
                  )}
                </button>
              </div>

              {status === 'ok' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <p className="text-green-600 dark:text-green-400 text-center font-medium">
                    ✅ {t('thanks')}
                  </p>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <p className="text-red-600 dark:text-red-400 text-center font-medium">
                    ❌ {t('error')}
                  </p>
                  {errorMessage && (
                    <p className="text-red-500 dark:text-red-400 text-center text-sm mt-2">
                      {errorMessage}
                    </p>
                  )}
                </motion.div>
              )}
            </form>
          </MagicCard>
        </BlurFade>
      </div>
    </div>
  );
}
