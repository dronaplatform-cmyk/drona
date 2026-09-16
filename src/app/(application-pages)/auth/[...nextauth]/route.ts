import NextAuth from 'next-auth';
import { authOptions } from '@/src/lib/auth'; // Import the configuration object

// NextAuth creates the GET and POST handlers internally based on the config
const handler = NextAuth(authOptions);

// Export the handlers for Next.js to use
export { handler as GET, handler as POST };