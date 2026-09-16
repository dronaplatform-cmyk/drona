'use server';

import prisma from '@/src/lib/prisma';
import { generateClassCode } from '@/src/lib/verification';
import { ClassStatus } from '@/generated/prisma/client';

export async function generateStudentClassCode(classId: string, studentId: string) {
  try {
    const classRecord = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        tutor: true,
      },
    });

    if (!classRecord) {
      return { error: 'Class not found' };
    }

    if (classRecord.studentId !== studentId) {
       return { error: 'Unauthorized: You are not the student for this class' };
    }

    if (classRecord.status === ClassStatus.COMPLETED || classRecord.status === ClassStatus.CANCELLED) {
      return { error: 'Class is not active' };
    }

    const code = generateClassCode(classRecord.id, studentId, classRecord.tutorId);
    return { code };

  } catch (error) {
    console.error('Failed to generate code:', error);
    return { error: 'Failed to generate code' };
  }
}
