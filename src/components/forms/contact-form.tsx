"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

interface ContactFormState {
  status: "idle" | "success" | "error" | "validation";
  message: string;
  fieldErrors?: Record<string, string>;
}

const initialState: ContactFormState = { status: "idle", message: "" };

const inputClass =
  "w-full rounded-xl border border-graphite/15 bg-porcelain px-4.5 py-3.5 text-[15px] text-graphite placeholder:text-graphite/35 transition-colors duration-300 focus:border-cobalt focus:outline-none";
const labelClass = "mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-graphite/55";
const errorClass = "mt-2 text-[13px] text-cobalt";

export function ContactForm({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const t = dict.contact.form;
  const [state, setState] = useState<ContactFormState>(initialState);
  const [pending, setPending] = useState(false);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const searchParams = useSearchParams();

  const preselectedService = searchParams.get("service") ?? "";
  const preselectedPackage = searchParams.get("package") ?? "";
  const defaultService =
    preselectedService || (preselectedPackage ? `${t.packagePrefix}: ${preselectedPackage}` : "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const formData = new FormData(event.currentTarget);
    const value = (key: string) => String(formData.get(key) ?? "").trim();
    const fieldErrors: Record<string, string> = {};
    const name = value("name");
    const email = value("email");
    const message = value("message");
    const consent = value("consent") === "on";

    if (name.length < 2) fieldErrors.name = t.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = t.errors.email;
    if (message.length < 20) fieldErrors.message = t.errors.message;
    if (!consent) fieldErrors.consent = t.errors.consent;

    if (Object.keys(fieldErrors).length) {
      setState({ status: "validation", message: t.errorReview, fieldErrors });
      return;
    }

    setPending(true);
    setState(initialState);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          businessName: value("businessName"),
          email,
          service: value("service"),
          budget: value("budget"),
          message,
          consent,
          company: value("company"),
          formStartedAt: value("formStartedAt"),
          lang,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        fields?: string[];
      };

      if (response.status === 400 && result.fields?.length) {
        const messages: Record<string, string> = {
          name: t.errors.name,
          email: t.errors.email,
          message: t.errors.message,
          consent: t.errors.consent,
        };
        setState({
          status: "validation",
          message: t.errorReview,
          fieldErrors: Object.fromEntries(
            result.fields.filter((field) => messages[field]).map((field) => [field, messages[field]]),
          ),
        });
        return;
      }

      if (!response.ok) throw new Error("Contact delivery failed");
      setState({ status: "success", message: t.success });
    } catch {
      setState({ status: "error", message: t.errorGeneric });
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
    }
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  const serviceOptions: string[] = [
    ...dict.services.map((s) => s.title),
    t.serviceOther,
  ];

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-7" noValidate>
      <input type="hidden" name="lang" value={lang} />
      {/* Honeypot — must stay invisible to humans */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="formStartedAt" ref={startedAtRef} defaultValue="" />

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            {t.name} *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={t.namePlaceholder}
            aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
            className={cn(inputClass, state.fieldErrors?.name && "border-cobalt")}
          />
          {state.fieldErrors?.name && (
            <p id="name-error" className={errorClass}>
              {state.fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="businessName" className={labelClass}>
            {t.businessName}
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            autoComplete="organization"
            placeholder={t.businessPlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          {t.email} *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.emailPlaceholder}
          aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
          className={cn(inputClass, state.fieldErrors?.email && "border-cobalt")}
        />
        {state.fieldErrors?.email && (
          <p id="email-error" className={errorClass}>
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="service" className={labelClass}>
            {t.service}
          </label>
          <select id="service" name="service" defaultValue={defaultService} className={inputClass}>
            <option value="">{t.servicePlaceholder}</option>
            {defaultService && !serviceOptions.includes(defaultService) && (
              <option value={defaultService}>{defaultService}</option>
            )}
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className={labelClass}>
            {t.budget}
          </label>
          <select id="budget" name="budget" className={inputClass}>
            <option value="">{t.budgetPlaceholder}</option>
            {t.budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          {t.message} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={t.messagePlaceholder}
          aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
          className={cn(inputClass, "resize-y", state.fieldErrors?.message && "border-cobalt")}
        />
        {state.fieldErrors?.message && (
          <p id="message-error" className={errorClass}>
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-graphite/65">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 size-4.5 shrink-0 accent-[#1f3be0]"
            aria-describedby={state.fieldErrors?.consent ? "consent-error" : undefined}
          />
          {t.consent}
        </label>
        {state.fieldErrors?.consent && (
          <p id="consent-error" className={errorClass}>
            {state.fieldErrors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-2.5 rounded-full bg-cobalt px-8 py-4 text-[15px] font-medium text-porcelain transition-all duration-300 hover:bg-cobalt-bright disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? t.sending : t.submit}
        </button>
        {state.message && (
          <p
            ref={statusRef}
            role="status"
            tabIndex={-1}
            className={cn(
              "max-w-sm text-[14px] leading-relaxed",
              state.status === "error" || state.status === "validation"
                ? "text-cobalt"
                : "text-graphite/65",
            )}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
