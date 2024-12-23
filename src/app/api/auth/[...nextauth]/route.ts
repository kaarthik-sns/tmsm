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
                is_admin: {}, // Added is_admin as a credential field
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
                        throw new Error("User not found");
                    }

                    if (!is_admin && !user.is_approve) {
                        throw new Error("Admin Not Approved Your Registration");
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
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.is_admin = user.is_admin; // Include is_admin in token
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    email: token.email,
                    name: token.name,
                    image: token.picture,
                    is_admin: token.is_admin, // Map is_admin to session
                };
            }
            return session;
        },
        async signIn({ user }) {
            console.log('User object:', user); // Debug: Check the user object
            await connectToDatabase();

            if (user?._id) {
                try {
                    await Users_activity_log.create({
                        user_id: user._id,  // Ensure user.id exists
                        desc: user.name+' Logged In',
                        created_at: new Date()
                    });
                    console.log('User activity log created successfully.');
                } catch (error) {
                    console.error('Error creating user activity log:', error); // Debug: Log any errors
                }
            } else {
                console.error('No user ID found in user object');
            }

            return true;  // Ensure the sign-in process is successful
        },

    },
    secret: process.env.NEXTAUTH_SECRET,
});
export { handler as GET, handler as POST };
