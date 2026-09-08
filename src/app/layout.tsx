import './globals.css';
import { Providers } from './provider';

import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { Geist_Mono, JetBrains_Mono, Gloock, Inter,Geist, Manrope, Tiro_Devanagari_Hindi } from "next/font/google";

import { BetaDialog } from "@/src/components/BetaDialog";
import { constructMetadata } from '@/src/lib/metadata';

export const metadata = constructMetadata();

const gloock = Gloock({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gloock",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});
const tiroDevanagari = Tiro_Devanagari_Hindi({
  variable: "--font-tiro-devanagari-hindi",
  subsets: ["devanagari"],
  weight: ["400"],
});



export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${manrope.variable} ${jetBrainsMono.variable} ${gloock.variable} ${tiroDevanagari.variable} font-sans antialiased`} >
        <Providers session={session}>
          <BetaDialog />
          {children}
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js');
                  });
                }
              `,
          }}
        />
      </body>
    </html>
  );
}