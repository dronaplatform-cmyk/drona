import { createClient } from '@/src/lib/prismic';
import { PrismicRichText } from '@prismicio/react';
import { Metadata } from 'next';
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { cn } from "@/src/lib/utils";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

type Params = { uid: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolvedParams = await params;
  const client = createClient();
  try {
    const page = await client.getByUID('blog_post', resolvedParams.uid);
    return {
      title: `${page.data.title || 'Blog Post'} | Drona`,
      description: page.data.excerpt || 'Read this post on Drona.',
    };
  } catch (e) {
    return { title: 'Blog Post Not Found | Drona' };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const client = createClient();
  let page;
  try {
    page = await client.getByUID('blog_post', resolvedParams.uid);
  } catch (e) {
    notFound();
  }

  return (
       <section className={cn("p-32")}>
      <div className="container">
        <div className="relative flex flex-col justify-between gap-10 lg:flex-row">
          <aside className="top-10 h-fit flex-shrink-0 lg:sticky lg:w-[300px] xl:w-[400px]">
          <Link href="/blogs" className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-4">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to all posts
          </Button>
      </Link>
             <h1 className="text-4xl  mb-4 leading-normal">
              {page.data.title || 'Untitled Post'}
          </h1>
            <div className="flex gap-3">
              {/* <Avatar className="size-7 rounded-full">
                <AvatarImage
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp"
                  alt="placeholder"
                />
              </Avatar> */}
              <div>
                <span className="  ">{page.data.author}</span>
                <p className="text-xs mt-2 text-muted-foreground">{new Date(page.first_publication_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </aside>

           <article className="container mx-auto py-12 px-6 max-w-3xl min-h-screen">
     
      
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
          
        
          
          
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary leading-relaxed prose-img:rounded-xl">
        <PrismicRichText field={page.data.content} />
      </div>
    </article>
        </div>
      </div>
    </section>
  
  );
}
