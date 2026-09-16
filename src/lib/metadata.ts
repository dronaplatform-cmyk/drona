import { Metadata } from 'next';

/**
 * Constructs a Next.js Metadata object for SEO and page titles.
 * Formats title as "Drona - [Page Name]".
 * @param title The page title (without the "Drona - " prefix)
 * @param description The page description
 */
export function constructMetadata({
  title,
  description = "Connect with qualified tutors, track progress, and manage schedules securely. Drona bridges the gap between passionate tutors and parents.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const fullTitle = title ? `Drona - ${title}` : "Drona - The Perfect Connection for Your Child's Education";

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    icons,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}
