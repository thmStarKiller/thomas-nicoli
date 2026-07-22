import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  external?: boolean;
  withIcon?: boolean;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  external,
  withIcon = false,
}: ButtonLinkProps) {
  const styles = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300",
    variant === "primary" &&
      "bg-graphite text-porcelain hover:bg-cobalt hover:text-white active:scale-[0.98]",
    variant === "secondary" &&
      "border border-line bg-transparent text-graphite hover:border-graphite active:scale-[0.98]",
    variant === "ghost" && "text-graphite link-underline px-1",
    className,
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
        {children}
        {withIcon && <ArrowUpRight className="size-4" aria-hidden />}
      </a>
    );
  }

  return (
    <Link href={href} className={styles}>
      {children}
      {withIcon && <ArrowUpRight className="size-4" aria-hidden />}
    </Link>
  );
}
