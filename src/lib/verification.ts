import crypto from 'crypto';

/**
 * Generates a deterministic, daily rotating 6-character code for class verification.
 * Structure: HMAC-SHA256(Secret + Date + ClassId + StudentId + TutorId).substring(0, 6)
 */
export function generateClassCode(classId: string, studentId: string, tutorId: string): string {
  // Use a consistent date format (YYYY-MM-DD) to ensure code is valid for the whole day
  const today = new Date().toISOString().split('T')[0];
  
  // In a real app, use a proper secret from env variables
  const secret = process.env.CLASS_VERIFICATION_SECRET || 'fallback-secret-DO-NOT-USE-IN-PROD';
  
  const data = `${today}:${classId}:${studentId}:${tutorId}`;
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data);
  const hash = hmac.digest('hex');
  
  // Take first 6 characters and uppercase them for readability
  return hash.substring(0, 6).toUpperCase();
}

/**
 * Verifies if the provided code matches the expected code for the class.
 */
export function verifyClassCode(
  inputCode: string,
  classId: string,
  studentId: string,
  tutorId: string
): boolean {
  if (!inputCode) return false;
  
  const expectedCode = generateClassCode(classId, studentId, tutorId);
  return inputCode.toUpperCase() === expectedCode;
}
