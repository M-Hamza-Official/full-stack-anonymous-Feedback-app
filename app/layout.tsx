import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "OpenFeedback | Anonymous Feedback, Honestly Shared",
  description:
    "Get honest, anonymous feedback and messages from friends, colleagues, or followers. Create your free profile link, share it anywhere, and receive real thoughts without the awkwardness.",
  keywords: [
    "anonymous messages",
    "anonymous feedback",
    "honest feedback app",
    "anonymous questions",
    "feedback link",
    "OpenFeedback",
  ],
  authors: [{ name: "Muhammad Hamza" }],
  metadataBase: new URL("https://openfeedback.muhammadhamza.me"),
  openGraph: {
    title: "OpenFeedback | Anonymous Feedback, Honestly Shared",
    description:
      "Create your free profile link and get honest, anonymous feedback from anyone.",
    url: "https://openfeedback.muhammadhamza.me",
    siteName: "OpenFeedback",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenFeedback | Anonymous Feedback, Honestly Shared",
    description:
      "Create your free profile link and get honest, anonymous feedback from anyone.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <AuthProvider>

        <body className="min-h-full flex flex-col">
          <Navbar />{children}
          <Toaster />
          <Analytics />
        </body>
      </AuthProvider>
    </html>
  );
}
