import NextAuth from "next-auth";
import User from "@/models/User";
import Admin from "@/models/Admin";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
                is_admin:{}
            },
            async authorize(credentials) {
                try {
                    await connectToDatabase();

                    const is_admin = credentials?.is_admin === "true";

                    var user = await User.findOne({ email: credentials?.email });

                    if(is_admin) {
                         user = await Admin.findOne({ email: credentials?.email });
                    } 

                    console.log(user);
                    
                    if (!user) {
                        throw new Error("")
                    }
                    const isValidPassword = await bcrypt.compare(
                        credentials?.password ?? "", user.password as string
                    );
                    if (!isValidPassword) {
                        throw new Error("")
                    }
                    return user;
                }
                catch {
                    return null
                }
            }
        })

    ],
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
                session.user = {
                    email: token.email,
                    name: token.name,
                    image: token.picture,
                };
            };
            return session;
        }

    },
    secret: process.env.NEXTAUTH_SECRET

});
export { handler as GET, handler as POST };
