import { createClient } from '@/src/lib/prismic';
import { PrismicRichText } from '@prismicio/react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

type Params = { uid: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const client = createClient();
  try {
    const page = await client.getByUID('blog_post', params.uid);
    return {
      title: `${page.data.title || 'Blog Post'} | Drona`,
      description: page.data.excerpt || 'Read this post on Drona.',
    };
  } catch (e) {
    return { title: 'Blog Post Not Found | Drona' };
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const client = createClient();
  let page;
  try {
    page = await client.getByUID('blog_post', params.uid);
  } catch (e) {
    notFound();
  }

  return (
    <article className="container mx-auto py-12 px-6 max-w-3xl min-h-screen">
      <Link href="/blogs" className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-4">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to all posts
          </Button>
      </Link>
      
      <header className="mb-10 text-center">
          {page.data.featured_image?.url && (
              <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-md">
                  <img 
                      src={page.data.featured_image.url} 
                      alt={page.data.featured_image.alt || 'Post feature image'} 
                      className="w-full h-full object-cover"
                  />
              </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              {page.data.title || 'Untitled Post'}
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-6">
              <span>{new Date(page.first_publication_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              {page.data.author && (
                  <>
                      <span>•</span>
                      <Badge variant="secondary" className="font-normal">{page.data.author}</Badge>
                  </>
              )}
          </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl">
        <PrismicRichText field={page.data.content} />
      </div>
    </article>
  );
}
