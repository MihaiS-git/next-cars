import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { validatePassword } from "@/lib/util/password";
import { authConfig } from "@/auth.config";
import { logInSchema } from "@/lib/auth-zod";
import { getUserByEmail } from "@/lib/queries/users-queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const parsedCredentials = logInSchema.safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUserByEmail(email);
          if (!user) return null;
          const passwordsMatch = await validatePassword(password, user.password);
          if (!passwordsMatch) return null;
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});