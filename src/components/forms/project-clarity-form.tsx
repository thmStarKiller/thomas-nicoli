"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getProjectClarityCopy } from "@/i18n/project-clarity";
import {
  CLARITY_LIMITS,
  type BuyerType,
  type ClarityRouteId,
  type ProjectLanguage,
  type SubmittedSummary,
} from "@/lib/project-clarity/contracts";
import { TurnstileWidget } from "./turnstile-widget";

type FormData = {
  buyerType: BuyerType;
  stuck: string;
  assets: string;
  outcome: string;
  timingConstraints: string;
  responseLanguage: ProjectLanguage;
  name: string;
  email: string;
  website: string;
  location: string;
  consent: boolean;
};

type Confirmation = {
  referenceId: string;
  duplicate?: boolean;
  summary: SubmittedSummary;
};

const buyerValues: BuyerType[] = ["independent", "digital-team", "unsure"];
const languageValues: ProjectLanguage[] = ["es", "en", "fr"];

function validHttpUrl(value: string) {
  if (!value) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function ProjectClarityForm({
  lang,
  initialRoute,
  legalReady,
  consentVersion,
}: {
  lang: Locale;
  initialRoute: ClarityRouteId;
  legalReady: boolean;
  consentVersion: string;
}) {
  const copy = getProjectClarityCopy(lang).clarity;
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState(false);
  const [form, setForm] = useState<FormData>({
    buyerType: initialRoute,
    stuck: "",
    assets: "",
    outcome: "",
    timingConstraints: "",
    responseLanguage: lang,
    name: "",
    email: "",
    website: "",
    location: "",
    consent: false,
  });
  const [error, setError] = useState<string>("");
  const [serverError, setServerError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation>();
  const headingRef = useRef<HTMLLegendElement>(null);
  const idempotencyKey = useRef<string | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [details, step]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const currentField = ["buyerType", "stuck", "assets", "outcome", "timingConstraints", "responseLanguage"][step] as keyof FormData;

  const validateCurrent = () => {
    const value = form[currentField];
    const valid = step === 0 || step === 5 || (typeof value === "string" && value.trim().length >= (step === 2 || step === 4 ? 2 : 10));
    if (!valid) setError(currentField);
    return valid;
  };

  const goNext = () => {
    if (!validateCurrent()) return;
    if (step < 5) setStep((value) => value + 1);
    else setDetails(true);
  };

  const goBack = () => {
    setError("");
    if (details) setDetails(false);
    else setStep((value) => Math.max(0, value - 1));
  };

  const detailsValid = () => {
    if (form.name.trim().length < 2) return setError("name"), false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("email"), false;
    if (!validHttpUrl(form.website)) return setError("website"), false;
    if (!form.consent) return setError("consent"), false;
    if (!turnstileToken) return setError("turnstile"), false;
    return true;
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError("");
    if (!legalReady || !detailsValid() || submitting) return;
    setSubmitting(true);
    idempotencyKey.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/project-clarity", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          consent: true,
          consentVersion,
          idempotencyKey: idempotencyKey.current,
          turnstileToken,
          company: "",
        }),
      });
      const payload = (await response.json()) as Confirmation & { ok?: boolean; error?: string };
      if (!response.ok || !payload.referenceId) throw new Error(payload.error ?? "submit_failed");
      setConfirmation(payload);
    } catch {
      setServerError(copy.error);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <section aria-labelledby="clarity-confirmation" className="rounded-[2rem] border border-cobalt/20 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex size-12 items-center justify-center rounded-full bg-cobalt text-porcelain"><Check className="size-6" /></div>
        <h2 id="clarity-confirmation" className="mt-6 font-display text-4xl font-semibold">{copy.confirmationTitle}</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-graphite/65">{copy.confirmationText}</p>
        <p className="mt-6 font-mono text-sm text-cobalt"><strong>{copy.reference}:</strong> {confirmation.referenceId}</p>
        {confirmation.duplicate && <p className="mt-3 text-sm text-graphite/65">{copy.duplicate}</p>}
        <h3 className="mt-8 font-display text-2xl">{copy.summaryTitle}</h3>
        <dl className="mt-4 grid gap-4">
          {Object.entries(confirmation.summary).map(([key, value]) => (
            <div key={key} className="border-t border-graphite/10 pt-3">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-graphite/45">{key}</dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm text-graphite/75">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  const title = copy.questions[step].title;
  const inputClass = "mt-4 w-full rounded-2xl border border-graphite/15 bg-white px-4 py-3.5 text-base text-graphite outline-none transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/15";

  return (
    <form onSubmit={submit} noValidate className="rounded-[2rem] border border-graphite/10 bg-porcelain-deep/45 p-5 sm:p-8 lg:p-10">
      {!details ? (
        <fieldset aria-describedby={`clarity-hint-${step} clarity-error`}>
          <legend className="sr-only">{title}</legend>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cobalt" aria-live="polite">
            {copy.progress.replace("{current}", String(step + 1))}
          </p>
          <h2 ref={headingRef} tabIndex={-1} className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h2>
          <p id={`clarity-hint-${step}`} className="mt-4 max-w-2xl text-sm leading-relaxed text-graphite/60">{copy.questions[step].hint}</p>
          <p className="sr-only" role="status">{copy.stepAnnouncement.replace("{current}", String(step + 1)).replace("{title}", title)}</p>

          {step === 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {buyerValues.map((value, index) => (
                <label key={value} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-graphite/15 bg-white p-4 has-[:checked]:border-cobalt has-[:checked]:ring-2 has-[:checked]:ring-cobalt/15">
                  <input type="radio" name="buyerType" value={value} checked={form.buyerType === value} onChange={() => update("buyerType", value)} />
                  <span>{copy.buyerOptions[index]}</span>
                </label>
              ))}
            </div>
          )}
          {step >= 1 && step <= 4 && (
            <textarea
              id={`clarity-${currentField}`}
              name={currentField}
              value={String(form[currentField])}
              onChange={(event) => update(currentField, event.target.value as never)}
              maxLength={CLARITY_LIMITS[currentField as "stuck" | "assets" | "outcome" | "timingConstraints"]}
              rows={6}
              placeholder={copy.fieldPlaceholders[step - 1]}
              aria-invalid={error === currentField}
              aria-errormessage={error === currentField ? "clarity-error" : undefined}
              className={inputClass}
            />
          )}
          {step === 5 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {languageValues.map((value, index) => (
                <label key={value} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-graphite/15 bg-white p-4 has-[:checked]:border-cobalt has-[:checked]:ring-2 has-[:checked]:ring-cobalt/15">
                  <input type="radio" name="responseLanguage" value={value} checked={form.responseLanguage === value} onChange={() => update("responseLanguage", value)} />
                  <span>{copy.languageOptions[index]}</span>
                </label>
              ))}
            </div>
          )}
          <p id="clarity-error" role="alert" className="mt-3 min-h-5 text-sm text-red-700">{error === currentField ? copy.validation : ""}</p>
        </fieldset>
      ) : (
        <fieldset>
          <legend ref={headingRef} tabIndex={-1} className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">{copy.detailsTitle}</legend>
          <p className="mt-4 text-sm text-graphite/60">{copy.detailsIntro}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {([
              ["name", copy.name, "text", CLARITY_LIMITS.name],
              ["email", copy.email, "email", CLARITY_LIMITS.email],
              ["website", copy.website, "url", CLARITY_LIMITS.website],
              ["location", copy.location, "text", CLARITY_LIMITS.location],
            ] as const).map(([field, label, type, maxLength]) => (
              <div key={field}>
                <label htmlFor={`clarity-${field}`} className="text-sm font-medium">{label}</label>
                <input id={`clarity-${field}`} name={field} type={type} value={form[field]} onChange={(event) => update(field, event.target.value)} maxLength={maxLength} aria-invalid={error === field} aria-describedby={error === field ? `clarity-${field}-error` : undefined} className={inputClass} />
                {error === field && <p id={`clarity-${field}-error`} role="alert" className="mt-2 text-sm text-red-700">{copy.validation}</p>}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-graphite/10 bg-white p-4">
            <label className="flex items-start gap-3 text-sm text-graphite/70">
              <input type="checkbox" name="clarityConsent" checked={form.consent} disabled={!legalReady} onChange={(event) => update("consent", event.target.checked)} aria-invalid={error === "consent"} className="mt-1" />
              <span>{copy.consentPending} <Link className="underline" href={`/${lang}/privacy`}>{copy.privacyLink}</Link></span>
            </label>
          </div>
          {legalReady && <div className="mt-6"><TurnstileWidget action="project_clarity" onToken={setTurnstileToken} /></div>}
          {!legalReady && (
            <div role="status" className="mt-6 rounded-2xl border border-cobalt/25 bg-cobalt/5 p-5">
              <h3 className="font-semibold text-cobalt">{copy.checkpointTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite/65">{copy.checkpointText}</p>
            </div>
          )}
          {serverError && <p role="alert" className="mt-4 text-sm text-red-700">{serverError}</p>}
        </fieldset>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={goBack} disabled={!details && step === 0} className="inline-flex items-center gap-2 rounded-full border border-graphite/20 px-5 py-3 text-sm disabled:opacity-35"><ArrowLeft className="size-4" />{copy.back}</button>
        {!details ? (
          <button type="button" onClick={goNext} className="inline-flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 text-sm font-medium text-porcelain">{copy.next}<ArrowRight className="size-4" /></button>
        ) : (
          <button type="submit" disabled={!legalReady || submitting} className="rounded-full bg-cobalt px-6 py-3 text-sm font-medium text-porcelain disabled:cursor-not-allowed disabled:opacity-40">{submitting ? copy.submitting : copy.submit}</button>
        )}
      </div>
      <p className="mt-8 text-sm text-graphite/55">{copy.alternative} <Link href={`/${lang}/contact`} className="font-medium text-cobalt underline">{copy.contactCta}</Link></p>
      <noscript><p className="mt-4 rounded-xl bg-white p-4 text-sm"><a className="text-cobalt underline" href={`/${lang}/contact`}>{copy.contactCta}</a></p></noscript>
    </form>
  );
}
