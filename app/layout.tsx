import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Profiles — A minimal Discord directory",
  description:
    "A clean, minimalist board of Discord profiles. Sign in once, appear forever.",
  icons: {
    icon: "/logo.PNG",
    apple: "/logo.PNG",
  },
  openGraph: {
    title: "Profiles",
    description: "A minimal Discord directory",
    type: "website",
    images: [{ url: "/logo.PNG", width: 500, height: 500, alt: "Profiles" }],
  },
  twitter: {
    card: "summary",
    title: "Profiles",
    description: "A minimal Discord directory",
    images: ["/logo.PNG"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
