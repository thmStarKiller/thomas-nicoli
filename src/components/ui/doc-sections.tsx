import { PageHero } from "@/components/ui/page-hero";
import { Rule } from "@/components/ui/headline";
import { Rise } from "@/components/ui/rise";

/** Layout shared by the privacy policy and the legal notice. */
export function DocPage({
  title,
  intro,
  sections,
  note,
}: {
  title: string;
  intro: string;
  sections: readonly { heading: string; body: string }[];
  note: string;
}) {
  return (
    <>
      <PageHero eyebrow={title} title={title} intro={intro} />
      <section className="bg-sand py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          {sections.map((section, i) => (
            <div key={section.heading}>
              <Rule className="text-night" />
              <Rise className="grid gap-x-10 gap-y-4 py-9 sm:py-11 lg:grid-cols-12">
                <h2 className="font-display text-[clamp(1.4rem,2.1vw,1.9rem)] leading-tight lg:col-span-5">
                  <span className="mr-4 text-[1.05rem] italic text-spice">{String(i + 1).padStart(2, "0")}</span>
                  {section.heading}
                </h2>
                <p className="max-w-[44rem] text-[17px] leading-relaxed text-night/85 lg:col-span-7">{section.body}</p>
              </Rise>
            </div>
          ))}
          <Rule className="text-night" />
          <p className="mt-10 max-w-[44rem] border border-night/25 p-5 text-[15px] leading-relaxed text-night-mute">
            {note}
          </p>
        </div>
      </section>
    </>
  );
}
