import NextAuth from "next-auth";
import User from "@/models/User";
import Admin from "@/models/Admin";
import Users_activity_log from "@/models/Users_activity_log";
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
                is_admin: {},
            },
            async authorize(credentials) {
                try {
                    await connectToDatabase();

                    const is_admin = credentials?.is_admin === "true";

                    // Check in Admin or User collection based on is_admin
                    let user = is_admin
                        ? await Admin.findOne({ email: credentials?.email })
                        : await User.findOne({ email: credentials?.email });

                    if (!user) {
                        throw new Error("User not found, Please Check your Email");
                    }

                    if (!is_admin && !user.is_approve) {
                        throw new Error("Admin Not Approved Your Registration");
                    }

                    if (!is_admin && !user.is_active) {
                        throw new Error("Your account has been deactivated");
                    }

                    const isValidPassword = await bcrypt.compare(
                        credentials?.password ?? "",
                        user.password as string
                    );

                    if (!isValidPassword) {
                        throw new Error("Invalid password");
                    }

                    // Add is_admin to user object
                    return { ...user.toObject(), is_admin };
                } catch (error) {
                    throw new Error(error.message || "Authentication failed");
                }
            },
        }),
    ],
    pages: {
        signOut: "/",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id;
                token.email = user.email;
                token.name = user.name;
                token.is_admin = user.is_admin;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    email: token.email,
                    name: token.name,
                    id: token.id as string,
                    is_admin: token.is_admin as boolean,
                };
            }
            return session;
        },
        async signIn({ user }) {

            await connectToDatabase();

            if (user?._id) {
                try {
                    await Users_activity_log.create({
                        user_id: user._id,
                        desc: user.name + ' Logged In',
                        created_at: new Date()
                    });
                    console.log('User activity log created successfully.');
                } catch (error) {
                    console.error('Error creating user activity log:', error);
                }
            } else {
                console.error('No user ID found in user object');
            }

            return true;
        },

    },
    secret: process.env.NEXTAUTH_SECRET,
});
export { handler as GET, handler as POST };
