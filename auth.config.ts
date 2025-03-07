import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email ?? '';
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedRoutes = ['/welcome', '/account', '/booking'];

      // If the user is logged in and tries to access /welcome, allow them to stay
      if (protectedRoutes.some(route => nextUrl.pathname.startsWith(route)) && isLoggedIn) {
        return true;  // Stay on /welcome
      }

      // If the user is not logged in and tries to access a protected route, deny access
      if (protectedRoutes.some(route => nextUrl.pathname.startsWith(route)) && !isLoggedIn) {
        return false;  // Deny access to /welcome
      }

      // If the user is logged in and tries to access any other route, allow access to that route
      if (isLoggedIn) {
        return true;
      }

      // If the user is not logged in, allow access to non-protected routes
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  /* trustHost: true, */
  /* debug: true, */
  providers: [],
} satisfies NextAuthConfig;