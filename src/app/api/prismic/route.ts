import { NextResponse } from 'next/server';
import { createClient } from '@/src/lib/prismic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const uid = searchParams.get('uid');

  if (!type) {
    return NextResponse.json({ error: 'Type is required' }, { status: 400 });
  }

  try {
    const client = createClient();
    let data;

    if (uid) {
      data = await client.getByUID(type as any, uid);
    } else {
      data = await client.getByType(type as any);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Prismic document:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
