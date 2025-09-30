declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // OpenAI Configuration
      OPENAI_API_KEY?: string;
      
      // Google/Gemini Configuration
      GOOGLE_API_KEY?: string;
      GEMINI_MODEL?: string;
      
      // Email Configuration (Resend)
      RESEND_API_KEY?: string;
      RESEND_TO?: string;
      
      // Site Configuration
      SITE_URL?: string;
      
      // Analytics
      NEXT_PUBLIC_PLAUSIBLE_DOMAIN?: string;
      NEXT_PUBLIC_UMAMI_WEBSITE_ID?: string;
      
      // Node Environment
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
