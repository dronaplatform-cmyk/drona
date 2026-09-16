'use server';

import prisma from '@/src/lib/prisma';

export async function resolveEntityName(id: string): Promise<string | null> {
  // Try to find the Entity in various tables
  // This is a naive parallel search, optimized for our known ID types
  
  if (!id) return null;

  try {
      // Check User/Tutor/Student tables
    const [user, tutor, student, classObj] = await Promise.all([
      prisma.user.findUnique({ where: { id }, select: { fullname: true, username: true } }),
      prisma.tutorProfile.findUnique({ where: { id }, include: { user: { select: { fullname: true } } } }),
      prisma.student.findUnique({ where: { id }, select: { name: true } }),
      prisma.class.findUnique({ where: { id }, select: { scheduledAt: true } })
    ]);

    if (tutor) return tutor.user.fullname;
    if (user) return user.fullname || user.username;
    if (student) return student.name;
    if (classObj) return `Class ${classObj.scheduledAt.toLocaleDateString()}`;

    return null;
  } catch (error) {
    console.error(`Failed to resolve name for ID ${id}:`, error);
    return null;
  }
}
