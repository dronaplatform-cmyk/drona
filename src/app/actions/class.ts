'use server';

import prisma from '@/src/lib/prisma';
import { verifyClassCode } from '@/src/lib/verification';
import { ClassStatus } from '@/generated/prisma/client';
import { revalidatePath } from 'next/cache';

export async function verifyClassAttendance(classId: string, inputCode: string) {
  try {
    const classRecord = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        student: true,
        tutor: true,
      },
    });

    if (!classRecord) {
      return { error: 'Class not found' };
    }

    if (classRecord.status === ClassStatus.COMPLETED || classRecord.status === ClassStatus.CANCELLED) {
      return { error: 'Class is already completed or cancelled' };
    }

    const isValid = verifyClassCode(
        inputCode, 
        classRecord.id, 
        classRecord.studentId, 
        classRecord.tutorId
    );

    if (!isValid) {
      return { error: 'Invalid Class Code' };
    }

    // Update class status
    await prisma.class.update({
      where: { id: classId },
      data: {
        status: ClassStatus.IN_PROGRESS,
        verificationDate: new Date(),
      },
    });

    revalidatePath('/tutors/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Verification failed:', error);
    return { error: 'Verification failed' };
  }
}

export async function endClassSession(classId: string) {
  try {
    const classRecord = await prisma.class.findUnique({
        where: { id: classId }
    });

    if (!classRecord) return { error: 'Class not found' };
    
    if (classRecord.status !== ClassStatus.IN_PROGRESS) {
        return { error: 'Class must be IN_PROGRESS to end it.' };
    }

    await prisma.class.update({
        where: { id: classId },
        data: {
            status: ClassStatus.COMPLETED,
            endTime: new Date()
        }
    });

    revalidatePath(`/tutor/classes/${classId}`);
    return { success: true };

  } catch (error) {
      console.error('Failed to end class:', error);
      return { error: 'Failed to end class' };
  }
}
