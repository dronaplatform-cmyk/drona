import { createClient } from '@/src/lib/prismic';
import { PrismicRichText } from '@prismicio/react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';

export const metadata: Metadata = {
  title: 'Blog | Drona',
  description: 'Latest news and updates from the Drona learning platform',
};

export default async function BlogsPage() {
  const client = createClient();
  let blogs: Record<string, any>[] = [];
  
  try {
    const response = await client.getByType('blog_post', {
        orderings: {
            field: 'document.first_publication_date',
            direction: 'desc',
        },
    });
    blogs = response.results;
  } catch (e) {
    console.error('Error fetching blogs from Prismic:', e);
  }

  return (
    <div className="container mx-auto py-16 px-6 max-w-6xl min-h-screen">
      <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl   mb-4">Drona Insights</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover educational insights, platform updates, and learning strategies.
          </p>
      </div>

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link href={`/blogs/${blog.uid}`} key={blog.id} className="block group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card overflow-hidden">
                {blog.data.featured_image?.url && (
                    <div className="w-full h-48 overflow-hidden rounded-t-xl bg-muted">
                        <img 
                            src={blog.data.featured_image.url} 
                            alt={blog.data.featured_image.alt || 'Blog cover'} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {blog.data.title || 'Untitled Post'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 text-sm -mt-4 mb-6">
                     {blog.data.excerpt || `Read more about ${blog.data.title} this topic...`}
                  </CardDescription>
                  <div className="flex flex-col gap-2 text-accent-foreground/60 justify-between items-start text-xs mt-auto">
                      {blog.data.author && <span>{blog.data.author}</span>}
                      <span className='' >{new Date(blog.first_publication_date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <h2 className="text-2xl font-bold mb-2">No posts found</h2>
            <p className="text-muted-foreground">Check back later for new updates and articles.</p>
        </div>
      )}
    </div>
  );
}
