"use client";
import { motion } from 'framer-motion';
import { MagicCard } from './magicui/magic-card';

export function ServiceCard({title, desc}: {title: string; desc: string}) {
  return (
    <MagicCard className="group p-6 h-full bg-card text-card-foreground border border-border hover:border-primary transition-all duration-300">
      <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </MagicCard>
  );
}

