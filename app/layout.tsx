import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flightsearch-cyan.vercel.app"),
  title: "Flight Search - Find & Book Flights",
  description:
    "Search and compare flight deals with advanced filters. Find the best flights for your trip with real-time pricing.",
  keywords:
    "flights, flight search, book flights, cheap flights, flight deals, airline tickets",
  authors: [{ name: "Flight Search" }],

  openGraph: {
    title: "Flight Search - Find & Book Flights",
    description:
      "Search and compare flight deals with advanced filters. Find the best flights for your trip with real-time pricing.",
    type: "website",
    url: "https://flightsearch-cyan.vercel.app",
    images: [
      {
        url: "/images/flight.png",
        width: 1200,
        height: 630,
        alt: "Flight Search",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Flight Search - Find & Book Flights",
    description: "Search and compare flight deals with advanced filters.",
    images: ["/images/flight.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
