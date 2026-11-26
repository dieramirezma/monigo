import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { baseOpenGraph, SHARE_IMAGE } from "@/lib/metadata";
import "../globals.css";

const bricolage = localFont({
  src: "../fonts/bricolage.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-bricolage",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
});

const atkinson = localFont({
  src: [
    { path: "../fonts/atkinson-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/atkinson-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/atkinson-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-atkinson",
  display: "swap",
});

/** Only prerendered params exist; anything else is a 404 without rendering on the Worker. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://monigo.dieramirezma.dev";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: d.meta.title, template: "%s · MoniGo" },
    description: d.meta.description,
    alternates: { languages: { es: "/es", en: "/en" } },
    openGraph: baseOpenGraph(locale),
    twitter: { card: "summary_large_image", images: [SHARE_IMAGE] },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = { themeColor: "#a3203f" };

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale as Locale} className={`${bricolage.variable} ${atkinson.variable}`}>
      <body className="min-h-dvh pb-20 md:pb-0">{children}</body>
    </html>
  );
}
