"use client";
import {motion} from 'framer-motion';

export function ServiceCard({title, desc}: {title: string; desc: string}) {
  return (
    <motion.div whileHover={{y: -4}} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </motion.div>
  );
}

