"use client";
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';
import ShimmerButton from './magicui/shimmer-button';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const tNav = useTranslations('nav');
  const locale = (useLocale() as 'en' | 'es') || 'es';
  const base = `/${locale}`;
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { href: `${base}/services`, label: tNav('services') },
    { href: `${base}/work`, label: tNav('work') },
    { href: `${base}/about`, label: tNav('about') },
    { href: `${base}/contact`, label: tNav('contact') },
    { href: `${base}/chat`, label: tNav('chat') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-background rounded px-3 py-1 text-sm border border-border">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={base} className="font-bold text-xl tracking-tight text-foreground hover:text-primary transition-colors">
          Thomas Nicoli
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-background hover:bg-accent border border-border transition-all duration-200"
              aria-label="Toggle theme"
            >
              {currentTheme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          )}
          
          <LanguageSwitcher />
          
          <Link href={`${base}/contact`} suppressHydrationWarning>
            <ShimmerButton
              background="rgba(0, 0, 0, 1)"
              shimmerColor="#ffffff"
              className="text-white dark:text-white"
            >
              {tNav('contact')}
            </ShimmerButton>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-background hover:bg-accent border border-border transition-all duration-200"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <nav className="px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  {mounted && (
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-lg bg-background hover:bg-accent border border-border transition-all duration-200"
                      aria-label="Toggle theme"
                    >
                      {currentTheme === 'dark' ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <LanguageSwitcher />
                </div>
                
                <Link href={`${base}/contact`} onClick={() => setIsMenuOpen(false)} suppressHydrationWarning>
                  <ShimmerButton
                    background="rgba(0, 0, 0, 1)"
                    shimmerColor="#ffffff"
                    className="text-white dark:text-white"
                  >
                    {tNav('contact')}
                  </ShimmerButton>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
