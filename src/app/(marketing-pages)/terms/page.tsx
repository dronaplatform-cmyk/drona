import { createClient } from '@/src/lib/prismic';
import { PrismicRichText } from '@prismicio/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Drona',
  description: 'Terms and conditions for using the Drona platform',
};

export default async function TermsPage() {
  const client = createClient();
  let page;
  try {
    page = await client.getByUID('legal_page', 'terms');
  } catch (e) {
    console.error('Error fetching terms page from Prismic:', e);
  }

  return (
    <div className="container mx-auto py-16 px-6 max-w-4xl min-h-screen">
      {page ? (
        <>
          <h1 className="text-4xl  mb-8 tracking-tight">{page.data.title || 'Terms & Conditions'}</h1>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <PrismicRichText field={page.data.content} />
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <h1 className="text-3xl mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground">Our terms are currently being updated. Please check back later.</p>
        </div>
      )}
    </div>
  );
}
