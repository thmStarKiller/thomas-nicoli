"use client";
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('legal');
  const tFooter = useTranslations('footer');
  const base = `/${locale}`;
  
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-xl mb-4 text-foreground">Thomas Nicoli</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              {tFooter('description')}
            </p>
            <div className="flex gap-4">
              <a 
                href="mailto:thomas@example.com" 
                className="p-2 rounded-lg bg-background/50 hover:bg-background/80 border border-border transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com/in/thomas-nicoli" 
                className="p-2 rounded-lg bg-background/50 hover:bg-background/80 border border-border transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com/thomas-nicoli" 
                className="p-2 rounded-lg bg-background/50 hover:bg-background/80 border border-border transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com/thomas_nicoli" 
                className="p-2 rounded-lg bg-background/50 hover:bg-background/80 border border-border transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{tFooter('servicesTitle')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`${base}/services`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {tFooter('aiStrategy')}
                </Link>
              </li>
              <li>
                <Link href={`${base}/services`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {tFooter('ecommerceOptimization')}
                </Link>
              </li>
              <li>
                <Link href={`${base}/services`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {tFooter('ragImplementation')}
                </Link>
              </li>
              <li>
                <Link href={`${base}/services`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {tFooter('salesforceCommerce')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{tFooter('companyTitle')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`${base}/about`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {tFooter('about')}
                </Link>
              </li>
              <li>
                <Link href={`${base}/work`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {tFooter('caseStudies')}
                </Link>
              </li>
              <li>
                <Link href={`${base}/contact`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {tFooter('contact')}
                </Link>
              </li>
              <li>
                <Link href={`${base}/chat`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {tFooter('aiChat')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Thomas Nicoli. {tFooter('copyright')}
          </p>
          <nav className="flex gap-6 text-sm">
            <Link href={`${base}/privacy`} className="text-muted-foreground hover:text-foreground transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`${base}/terms`} className="text-muted-foreground hover:text-foreground transition-colors">
              {t('terms')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
