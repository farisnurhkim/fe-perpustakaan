/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { CredentialsSignin, Session } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import environment from "./config/environment";
import authServices from "./services/auth.service";
import { JWTExtended, SessionExtended, UserExtended } from "./types/auth";
import { JWT } from "next-auth/jwt";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password"
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
       try {
            const { email, password } = credentials as { email: string; password: string };

            const loginRes = await authServices.login({ email, password })

            if (!loginRes.status) {
                 // Jika password salah atau user tidak ditemukan
                 throw new Error("Email atau Password salah"); 
            }

            const accessToken = loginRes.data.data; 

            const profileRes = await authServices.getProfileWithToken(accessToken)

            if (profileRes.status !== 200) {
                throw new Error("Gagal mengambil data user");
            }

            const user = profileRes.data.data;

            if (user && user._id) {
                user.accessToken = accessToken;
                return user;
            }
            
            return null;

        } catch (error: any) {
            console.error("Login Error:", error.message);
            return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token
    },

    async session({ session, token }: { session: Session; token: JWT }): Promise<SessionExtended> {
      const t = token as JWTExtended;
      const s = session as SessionExtended;
      s.user = t.user;
      s.accessToken = t.user?.accessToken;

      return s;
    },
  },

  secret: environment.AUTH_SECRET
})