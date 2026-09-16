'use server';

import prisma from '@/src/lib/prisma';
import { ClassStatus } from '@/generated/prisma/client';
import { revalidatePath } from 'next/cache';

export async function bookClass(parentId: string, studentId: string, tutorId: string, scheduledAt: Date) {
  try {
    // 1. Validate Parent owns Student
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student || student.parentId !== parentId) {
      return { error: 'Invalid student selected' };
    }

    // 2. Validate Tutor exists
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
    });

    if (!tutor) {
      return { error: 'Tutor not found' };
    }
    
    // 3. Create Class
    await prisma.class.create({
      data: {
        tutorId,
        studentId,
        scheduledAt,
        status: ClassStatus.SCHEDULED,
      },
    });

    revalidatePath('/parent/dashboard');
    return { success: true };

  } catch (error) {
    console.error('Booking failed:', error);
    return { error: 'Failed to book class' };
  }
}

export async function searchTutors(query: string = "") {
  try {
    const tutors = await prisma.tutorProfile.findMany({
      where: {
        OR: [
          { subjects: { hasSome: [query] } },
          { user: { fullname: { contains: query, mode: 'insensitive' } } }
        ]
      },
      include: {
        user: {
          select: { fullname: true }
        }
      },
      take: 10
    });
    return { tutors };
  } catch (error) {
    return { error: 'Search failed' };
  }
}
