import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ModalProvider from "@/components/provider/modal-provider";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://smartlib-ubharajaya.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SmartLib Ubhara",
    template: "%s | SmartLib Ubhara",
  },

  description: "SmartLib Ubhara adalah perpustakaan digital untuk pencarian buku dan sistem peminjaman yang mudah, cepat, dan terintegrasi.",
  keywords: ["Next.js", "React", "Web Development", "smartlib ubhara", "perpustakaan digital", "sistem peminjaman buku", "ubhara", "universitas bhayangkara jakarta raya"],

  authors: [{ name: "F3B2 (angkatan 2024)" }],
  creator: "F3B2 Team",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    title: "SmartLib Ubhara – Perpustakaan Digital",
    description:
      "SmartLib Ubhara adalah perpustakaan digital untuk pencarian dan peminjaman buku secara mudah dan terintegrasi.",
    siteName: "SmartLib Ubhara",
    images: [
      {
        url: "/logoApp.png",
        width: 1200,
        height: 630,
        alt: "SmartLib Ubhara – Perpustakaan Digital",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "SmartLib Ubhara – Perpustakaan Digital",
    description:
      "Perpustakaan digital untuk pencarian dan peminjaman buku yang mudah, cepat, dan terintegrasi.",
    images: ["/logoApp.png"],
    creator: "@smartlib_ubhara",
  },
  icons: {
    icon: "/logoApp.png",
    shortcut: "/logoApp.png",
    apple: "/logoApp.png",
  },

  // verification: {
  //   google: "kode-verifikasi-google-console-anda",
  //   yandex: "kode-yandex",
  // },

  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          toastOptions={{
            style: {
              background: "oklch(14.1% 0.005 285.823)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              outline: "none",
            }
          }}
        />
        <ModalProvider />
        <Footer />
      </body>
    </html>
  );
}
