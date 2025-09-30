'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { BlurFade } from '@/components/magicui/blur-fade';
import { MagicCard } from '@/components/magicui/magic-card';
import { TextAnimate } from '@/components/magicui/text-animate';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  badge: string;
  purpose: string;
  tech: string[];
  highlights: string[];
  deployment: string;
  githubUrl?: string;
}

const projectTypeColors: Record<string, string> = {
  'Complete Web Application': 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  'Complete Application': 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30',
  'Prototype Web Tool': 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30',
  'Enterprise Tool': 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/30',
  'Automation Script': 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/30',
  'Full-Stack Application': 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border-indigo-500/30',
  'Aplicación Web Completa': 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  'Aplicación Completa': 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30',
  'Herramienta Web Prototipo': 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30',
  'Herramienta Empresarial': 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/30',
  'Script de Automatización': 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/30',
  'Aplicación Full-Stack': 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border-indigo-500/30',
};

const badgeStyles: Record<string, string> = {
  'Live on Vercel': 'bg-green-500/20 text-green-400 border-green-500/50',
  'Desktop App': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  'Demo/Local': 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  'Cloud Deployable': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
  'Prototype': 'bg-amber-500/20 text-amber-400 border-amber-500/50',
  'Proof of Concept': 'bg-pink-500/20 text-pink-400 border-pink-500/50',
  'MVP/Beta': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50',
  'En Vivo en Vercel': 'bg-green-500/20 text-green-400 border-green-500/50',
  'App de Escritorio': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  'Desplegable en Cloud': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
  'Prototipo': 'bg-amber-500/20 text-amber-400 border-amber-500/50',
  'Prueba de Concepto': 'bg-pink-500/20 text-pink-400 border-pink-500/50',
};

export default function WorkContent() {
  const locale = useLocale();
  const t = useTranslations('work');
  const projects = t.raw('projects') as Project[];
  const [selectedType, setSelectedType] = useState<string>('all');

  // Extract unique project types
  const projectTypes = ['all', ...Array.from(new Set(projects.map(p => p.type)))];

  const filteredProjects = selectedType === 'all' 
    ? projects 
    : projects.filter(p => p.type === selectedType);

  return (
    <div key={locale} className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <BlurFade delay={0.1}>
          <TextAnimate
            animation="blurInUp"
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            {t('title')}
          </TextAnimate>
        </BlurFade>
        <BlurFade delay={0.2}>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            {t('subtitle')}
          </p>
        </BlurFade>
        <BlurFade delay={0.3}>
          <p className="text-base text-muted-foreground/80 max-w-4xl mx-auto">
            {t('description')}
          </p>
        </BlurFade>
      </div>

      {/* Filter Section */}
      <BlurFade delay={0.4}>
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedType === type
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-secondary/50 hover:bg-secondary text-secondary-foreground hover:scale-105'
                }`}
              >
                {type === 'all' ? (locale === 'en' ? 'All Projects' : 'Todos los Proyectos') : type}
              </button>
            ))}
          </div>
        </div>
      </BlurFade>

      {/* Projects Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {filteredProjects.map((project, index) => (
          <BlurFade key={project.id} delay={0.5 + index * 0.1}>
            <MagicCard
              className={`group relative overflow-hidden rounded-3xl border-2 p-8 transition-all duration-500 hover:scale-[1.02] ${
                projectTypeColors[project.type] || 'bg-card/50 border-border'
              }`}
              gradientColor="rgba(139, 92, 246, 0.1)"
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium">
                      {project.subtitle}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${
                      badgeStyles[project.badge] || 'bg-secondary/50 text-secondary-foreground border-border'
                    }`}
                  >
                    {project.badge}
                  </span>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-background/50 text-foreground/80 border border-border">
                  {project.type}
                </span>
              </div>

              {/* Purpose */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-2">
                  {locale === 'en' ? 'Purpose' : 'Propósito'}
                </h3>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {project.purpose}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-3">
                  {locale === 'en' ? 'Tech Stack' : 'Tecnologías'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-background/80 text-foreground border border-border/50 hover:border-primary/50 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-3">
                  {locale === 'en' ? 'Key Highlights' : 'Características Clave'}
                </h3>
                <ul className="space-y-2">
                  {project.highlights.slice(0, 4).map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="text-primary mt-1 flex-shrink-0">▸</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deployment */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-2">
                  {locale === 'en' ? 'Deployment' : 'Despliegue'}
                </h3>
                <p className="text-sm text-foreground/80 italic">
                  {project.deployment}
                </p>
              </div>

              {/* GitHub Link */}
              {project.githubUrl && (
                <div className="pt-4 border-t border-border/50">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link"
                  >
                    <svg
                      className="w-5 h-5 group-hover/link:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {locale === 'en' ? 'View on GitHub' : 'Ver en GitHub'}
                  </a>
                </div>
              )}
            </MagicCard>
          </BlurFade>
        ))}
      </div>

      {/* Call to Action */}
      <BlurFade delay={0.8}>
        <div className="mt-20 text-center">
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/20">
            <h3 className="text-2xl font-bold mb-4">
              {locale === 'en' 
                ? 'Interested in working together?' 
                : '¿Interesado en trabajar juntos?'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              {locale === 'en'
                ? "Let's discuss how I can help bring your ideas to life with modern web technologies and AI integration."
                : 'Hablemos sobre cómo puedo ayudarte a dar vida a tus ideas con tecnologías web modernas e integración de IA.'}
            </p>
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {locale === 'en' ? 'Get in Touch' : 'Contactar'}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
