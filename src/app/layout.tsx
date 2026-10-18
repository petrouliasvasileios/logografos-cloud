import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LegalBar from "./LegalBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clinicscribe.vercel.app"),
  title: "ClinicScribe v2",
  description:
    "ClinicScribe — Medical Documentation Platform. Doctor-reviewed & verified clinical documentation.",

  openGraph: {
    title: "ClinicScribe v2",
    description:
      "Medical Documentation Platform — Specialized Medical Transcription, Clinical Report Generation, Doctor-Reviewed & Verified.",
    url: "https://clinicscribe.vercel.app",
    siteName: "ClinicScribe",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ClinicScribe v2",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ClinicScribe v2",
    description:
      "Medical Documentation Platform — Doctor-reviewed & verified clinical documentation.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        <LegalBar />
      </body>
    </html>
  );
}
