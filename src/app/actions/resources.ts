'use server';

import prisma from '@/src/lib/prisma';
import { ResourceType } from '@/generated/prisma/client';
import { revalidatePath } from 'next/cache';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_DOMAINS_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|linkedin\.com|instagram\.com|github\.com|stackoverflow\.com|medium\.com|dev\.to)/i;

export async function addResourceLink(classId: string, tutorId: string, title: string, url: string) {
  if (!ALLOWED_DOMAINS_REGEX.test(url)) {
    return { error: 'Invalid URL. Only links from reputable platforms (YouTube, LinkedIn, etc.) are allowed.' };
  }

  try {
    await prisma.resource.create({
      data: {
        tutorId,
        classId,
        title,
        type: ResourceType.LINK,
        url,
      },
    });
    revalidatePath('/tutors/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to add resource link:', error);
    return { error: 'Failed to add resource link' };
  }
}

// Placeholder for actual file upload logic to S3/Blob storage
// Since we don't have a storage provider configured, we'll mock the "upload" to DB for now
export async function uploadResourceFile(classId: string, tutorId: string, formData: FormData) {
  const file = formData.get('file') as File;
  const title = formData.get('title') as string;

  if (!file) return { error: 'No file provided' };
  
  if (file.size > MAX_FILE_SIZE) {
    return { error: 'File size exceeds 10MB limit.' };
  }

  // In a real app, upload `file` to S3/Cloudinary here and get the URL
  // For demo, we just store a fake URL but save metadata
  const mockUrl = `https://storage.placeholder.com/${Math.random().toString(36).substr(2, 9)}/${file.name}`; 

  try {
    await prisma.resource.create({
      data: {
        tutorId,
        classId,
        title: title || file.name,
        type: getResourceTypeFromMime(file.type),
        url: mockUrl,
        size: file.size,
        mimeType: file.type,
      },
    });
    revalidatePath('/tutors/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to upload resource:', error);
    return { error: 'Failed to upload resource' };
  }
}

function getResourceTypeFromMime(mimeType: string): ResourceType {
  if (mimeType.startsWith('image/')) return ResourceType.IMAGE;
  if (mimeType === 'application/pdf') return ResourceType.PDF;
  return ResourceType.TEXT; // Fallback
}
