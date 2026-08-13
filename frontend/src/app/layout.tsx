import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { DataFastIdentity } from "@/components/datafast-identity";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FeedbackButton } from "@/components/feedback-button";
import { getSiteUrl } from "@/lib/site";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dataFastWebsiteId = process.env.NEXT_PUBLIC_DATAFAST_WEBSITE_ID;
const dataFastDomain = process.env.NEXT_PUBLIC_DATAFAST_DOMAIN;
const shouldTrackLocalhost = process.env.NEXT_PUBLIC_DATAFAST_ALLOW_LOCALHOST === "true";
const isDataFastEnabled = Boolean(dataFastWebsiteId && dataFastDomain);

export const metadata: Metadata = {
  title: {
    default: "LibreClip – Open-Source AI Video Clipper",
    template: "%s | LibreClip",
  },
  description:
    "Turn long videos into captioned short-form clips with open-source AI clipping, virality scoring, and face-aware vertical crops.",
  metadataBase: new URL(getSiteUrl()),
  applicationName: "LibreClip",
  authors: [{ name: "LibreClip Team", url: getSiteUrl() }],
  creator: "LibreClip Team",
  publisher: "LibreClip",
  category: "video software",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "LibreClip – Open-Source AI Video Clipper",
    description:
      "Turn long videos into captioned short-form clips with open-source AI clipping.",
    siteName: "LibreClip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LibreClip – Open-Source AI Video Clipper",
    description:
      "Open-source AI clipping, virality scoring, captions, and face-aware vertical crops.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {isDataFastEnabled ? (
          <>
            <Script id="datafast-queue" strategy="beforeInteractive">
              {`window.datafast = window.datafast || function() {
  window.datafast.q = window.datafast.q || [];
  window.datafast.q.push(arguments);
};`}
            </Script>
            <Script
              id="datafast-script"
              strategy="afterInteractive"
              src="/js/script.js"
              data-website-id={dataFastWebsiteId}
              data-domain={dataFastDomain}
              data-allow-localhost={shouldTrackLocalhost ? "true" : undefined}
              data-disable-console="true"
            />
          </>
        ) : null}
      </head>
      <body className={`${dmSans.variable} antialiased`}>
        <TooltipProvider>
          {children}
          <DataFastIdentity />
          <FeedbackButton />
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
