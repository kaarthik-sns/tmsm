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
        maxAge: 60 * 60, // Session expires after 10 minutes of inactivity (600 seconds)
        updateAge: 5 * 60, // Session refreshes after every 5 minutes of activity (300 seconds)
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
                    const email = credentials?.email?.replace(/\s+/g, "").toLowerCase() || "";

                    // Check in Admin or User collection based on is_admin
                    let user = is_admin
                        ? await Admin.findOne({ email: email })
                        : await User.findOne({ email: email });

                    if (!user) {
                        throw new Error("Email address not recognized.");
                    }

                    // Check password first
                    const isValidPasswords = await bcrypt.compare(
                        credentials?.password ?? "",
                        user.password as string
                    );

                    if (!isValidPasswords) {
                        throw new Error("Invalid password. Please check your credentials.");
                    }

                    if (!is_admin) {

                        if (!user.is_approve) {
                            throw new Error("Account activation is pending. You will be notified once approved.");
                        }

                        if (!user.is_verify) {
                            throw new Error("Email not yet verified.");
                        }

                        if (!user.is_active) {
                            throw new Error("Your account has been deactivated");
                        }
                    }

                    const isValidPassword = await bcrypt.compare(
                        credentials?.password ?? "",
                        user.password as string
                    );

                    if (!isValidPassword) {
                        throw new Error("Invalid password. Please check your credentials.");
                    }

                    // Add is_admin to user object
                    return { ...user.toObject(), is_admin };
                } catch (error) {
                    throw new Error(error.message || "Authentication error. Please check your login details.");
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
