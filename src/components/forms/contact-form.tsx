"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { getProjectClarityCopy } from "@/i18n/project-clarity";
import { getContactOptions } from "@/i18n/site";
import {
  CONTACT_BUDGET_IDS,
  CONTACT_LIMITS,
  CONTACT_TIMING_IDS,
} from "@/lib/project-clarity/contracts";
import { TurnstileWidget } from "./turnstile-widget";

type Values = {
  name: string;
  businessName: string;
  email: string;
  website: string;
  timing: string;
  location: string;
  service: string;
  budget: string;
  message: string;
  consent: boolean;
  company: string;
};

type Field = keyof Values | "turnstile";

const initialValues: Values = {
  name: "",
  businessName: "",
  email: "",
  website: "",
  timing: "",
  location: "",
  service: "",
  budget: "",
  message: "",
  consent: false,
  company: "",
};

function validUrl(value: string) {
  if (!value) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function ContactForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [turnstileToken, setTurnstileToken] = useState("");
  const additions = getProjectClarityCopy(lang).contact;
  const form = dict.contact.form;
  const options = getContactOptions(lang);
  const labelClass = "eyebrow text-night";
  const selectClass =
    "mt-1 w-full border-0 border-b border-night/40 bg-transparent px-0 py-3 text-[17px] text-night outline-none transition-colors duration-300 placeholder:text-night/70 focus:border-spice";

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("service");
    if (!requested || !getContactOptions(lang).some((option) => option.value === requested)) return;
    const timer = window.setTimeout(() => {
      setValues((current) => ({ ...current, service: requested }));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [lang]);

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (values.name.trim().length < 2) next.name = form.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = form.errors.email;
    if (!validUrl(values.website)) next.website = additions.websiteError;
    if (!values.service) next.service = form.errorReview;
    if (values.message.trim().length < 20) next.message = form.errors.message;
    if (!values.consent) next.consent = form.errors.consent;
    if (!turnstileToken) next.turnstile = form.errorReview;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate() || status === "sending") return;
    setStatus("sending");
    setServerMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          locale: lang,
          startedAt,
          turnstileToken,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "delivery_failed");
      setStatus("success");
      setValues(initialValues);
    } catch {
      setStatus("error");
      setServerMessage(form.errorGeneric);
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="border border-night p-7 sm:p-10">
        <p className="font-display text-[clamp(1.6rem,2.6vw,2.3rem)] leading-tight">{form.success}</p>
        <button type="button" className="link-line mt-6 text-spice" onClick={() => setStatus("idle")}>{dict.contact.title}</button>
      </div>
    );
  }

  const field = (name: keyof Values, label: string, type = "text", placeholder = "", maxLength?: number) => (
    <div>
      <label htmlFor={`contact-${name}`} className={labelClass}>{label}</label>
      <input
        id={`contact-${name}`}
        name={name}
        type={type}
        value={String(values[name])}
        onChange={(event) => update(name, event.target.value as never)}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
        className={selectClass}
      />
      {errors[name] && <p id={`contact-${name}-error`} role="alert" className="mt-2 text-[14.5px] font-medium text-[#9b1c1c]">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        {field("name", form.name, "text", form.namePlaceholder, CONTACT_LIMITS.name)}
        {field("businessName", form.businessName, "text", form.businessPlaceholder, CONTACT_LIMITS.businessName)}
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        {field("email", form.email, "email", form.emailPlaceholder, CONTACT_LIMITS.email)}
        {field("website", additions.website, "url", additions.websitePlaceholder, CONTACT_LIMITS.website)}
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-service" className={labelClass}>{form.service}</label>
          <select id="contact-service" name="service" value={values.service} onChange={(event) => update("service", event.target.value)} aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? "contact-service-error" : undefined} className={selectClass}>
            <option value="">{form.servicePlaceholder}</option>
            {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            <option value="other">{form.serviceOther}</option>
          </select>
          {errors.service && <p id="contact-service-error" role="alert" className="mt-2 text-[14.5px] font-medium text-[#9b1c1c]">{errors.service}</p>}
        </div>
        <div>
          <label htmlFor="contact-budget" className={labelClass}>{form.budget}</label>
          <select id="contact-budget" name="budget" value={values.budget} onChange={(event) => update("budget", event.target.value)} className={selectClass}>
            <option value="">{form.budgetPlaceholder}</option>
            {form.budgetRanges.map((label, index) => <option key={CONTACT_BUDGET_IDS[index]} value={CONTACT_BUDGET_IDS[index]}>{label}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-timing" className={labelClass}>{additions.timing}</label>
          <select id="contact-timing" name="timing" value={values.timing} onChange={(event) => update("timing", event.target.value)} className={selectClass}>
            <option value="">{additions.timingPlaceholder}</option>
            {additions.timingOptions.map((label, index) => <option key={CONTACT_TIMING_IDS[index]} value={CONTACT_TIMING_IDS[index]}>{label}</option>)}
          </select>
        </div>
        {field("location", additions.location, "text", additions.locationPlaceholder, CONTACT_LIMITS.location)}
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>{form.message}</label>
        <textarea id="contact-message" name="message" value={values.message} onChange={(event) => update("message", event.target.value)} placeholder={form.messagePlaceholder} maxLength={CONTACT_LIMITS.message} rows={5} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} className={selectClass} />
        {errors.message && <p id="contact-message-error" role="alert" className="mt-2 text-[14.5px] font-medium text-[#9b1c1c]">{errors.message}</p>}
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={(event) => update("company", event.target.value)} />
      </div>
      <label className="flex items-start gap-3 text-[15.5px] leading-relaxed text-night/85">
        <input type="checkbox" name="consent" checked={values.consent} onChange={(event) => update("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "contact-consent-error" : undefined} className="mt-1.5 size-4 accent-[var(--color-spice)]" />
        <span>{form.consent} <Link href={`/${lang}/privacy`} className="text-spice underline">{additions.privacyLink}</Link>.</span>
      </label>
      {errors.consent && <p id="contact-consent-error" role="alert" className="text-[14.5px] font-medium text-[#9b1c1c]">{errors.consent}</p>}
      <div>
        <TurnstileWidget action="contact" onToken={setTurnstileToken} />
        <p className="mt-2 text-[13.5px] text-night-mute">{additions.turnstile}</p>
        {errors.turnstile && <p role="alert" className="mt-2 text-[14.5px] font-medium text-[#9b1c1c]">{errors.turnstile}</p>}
      </div>
      {serverMessage && <p role="alert" className="text-[14.5px] font-medium text-[#9b1c1c]">{serverMessage}</p>}
      <button type="submit" disabled={status === "sending"} className="cta cta-on-sand group w-full disabled:opacity-50 sm:w-auto">
        {status === "sending" ? form.sending : form.submit}
        {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : <ArrowUpRight aria-hidden className="size-[1.25em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />}
      </button>
      <noscript>
        <p className="border border-night/25 p-4 text-[15px]">{additions.noJs} <a className="text-spice underline" href="mailto:bonjour@thomas-nicoli.com">{additions.emailCta}</a></p>
      </noscript>
    </form>
  );
}
