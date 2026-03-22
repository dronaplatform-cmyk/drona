import { createClient } from '@/src/lib/prismic';
import { PrismicRichText } from '@prismicio/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Drona',
  description: 'Privacy policy and data handling practices for the Drona platform',
};

export default async function PrivacyPage() {
  const client = createClient();
  let page;
  try {
    page = await client.getByUID('legal_page', 'privacy');
  } catch (e) {
    console.error('Error fetching privacy page from Prismic:', e);
  }

  return (
    <div className="container mx-auto py-16 px-6 max-w-4xl min-h-screen">
      {page ? (
        <>
           <h1 className="text-4xl font-extrabold mb-8 tracking-tight">{page.data.title || 'Privacy Policy'}</h1>
           <div className="prose prose-slate dark:prose-invert max-w-none">
               <PrismicRichText field={page.data.content} />
           </div>
        </>
      ) : (
        <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Our privacy policy is currently being updated. Please check back later.</p>
        </div>
      )}
    </div>
  );
}
