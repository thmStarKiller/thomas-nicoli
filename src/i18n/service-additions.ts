import type { Locale } from "./config";

const copy = {
  es: { title: "Studio Lab — capacidad opcional", note: "La 3D solo entra cuando ayuda a comprender, imaginar o decidir. Se plantea como complemento de una web o campaña, con presupuesto de rendimiento y una alternativa sin 3D igual de cuidada.", cta: "Consultar una opción 3D" },
  en: { title: "Studio Lab — optional capability", note: "3D is used only when it helps someone understand, imagine or decide. It is scoped as an add-on to a website or campaign, with a performance budget and an equally considered non-3D alternative.", cta: "Ask about a 3D option" },
  fr: { title: "Studio Lab — capacité optionnelle", note: "La 3D n’intervient que lorsqu’elle aide à comprendre, imaginer ou décider. Elle reste un complément à un site ou une campagne, avec un budget de performance et une alternative sans 3D tout aussi soignée.", cta: "Étudier une option 3D" },
} as const;

export function getServiceLabCopy(lang: Locale) {
  return copy[lang];
}
