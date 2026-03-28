import { createClient } from '@/src/lib/prismic';
import { PrismicRichText } from '@prismicio/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Drona',
  description: 'Learn more about the Drona platform and our mission',
};

export default async function AboutPage() {
  const client = createClient();
  let page;
  try {
    page = await client.getByUID('legal_page', 'about');
  } catch (e) {
    console.error('Error fetching about page from Prismic:', e);
  }

  return (
    <div className="container mx-auto py-16 px-6 max-w-4xl min-h-screen">
      {page ? (
        <>
          <h1 className="text-4xl  mb-8  ">{page.data.title || 'About Us'}</h1>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <PrismicRichText field={page.data.content} />
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <h1 className="text-3xl mb-4">About Us</h1>
          <p className="text-muted-foreground">Information about Drona is currently being updated. Please check back later.</p>
        </div>
      )}
    </div>
  );
}