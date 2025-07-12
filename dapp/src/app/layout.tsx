import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediaAuth - Blockchain Multimedia Authentication",
  description: "Secure your digital media assets with blockchain-powered authentication. Register, authenticate, and trade multimedia content with IPFS storage and smart contracts.",
  keywords: ["blockchain", "multimedia", "authentication", "IPFS", "NFT", "digital assets", "media marketplace"],
  authors: [{ name: "MediaAuth Team" }],
  creator: "MediaAuth",
  publisher: "MediaAuth",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mediaauth.com'),
  openGraph: {
    title: "MediaAuth - Blockchain Multimedia Authentication",
    description: "Secure your digital media assets with blockchain-powered authentication",
    url: "https://mediaauth.com",
    siteName: "MediaAuth",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MediaAuth - Blockchain Multimedia Authentication",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediaAuth - Blockchain Multimedia Authentication",
    description: "Secure your digital media assets with blockchain-powered authentication",
    images: ["/og-image.png"],
  },
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">MediaAuth</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure blockchain-powered multimedia authentication platform
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Platform</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/media/register" className="hover:text-foreground transition-colors">Register Media</a></li>
                    <li><a href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</a></li>
                    <li><a href="/rental" className="hover:text-foreground transition-colors">Rental</a></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Resources</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Legal</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                <p>&copy; 2024 MediaAuth. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
