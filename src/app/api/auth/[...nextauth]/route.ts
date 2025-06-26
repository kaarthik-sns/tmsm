import NextAuth from "next-auth";
import User from "@/models/User";
import Admin from "@/models/Admin";
import Users_activity_log from "@/models/Users_activity_log";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AdapterUser } from "next-auth/adapters";
import { Types } from "mongoose";

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
                lang: {}
            },
            async authorize(credentials) {
                try {
                    await connectToDatabase();

                    const is_admin = credentials?.is_admin === "true";
                    const email = credentials?.email?.replace(/\s+/g, "").toLowerCase() || "";
                    const lang = credentials?.lang || "en";

                    let user;

                    if (is_admin) {
                        user = await Admin.findOne({ email });
                    } else {
                        user = await User.findOne({ email });
                    }

                    if (!user) {
                        throw new Error(lang === 'ta' ? "மின்னஞ்சல் முகவரி தவறானது. தயவுசெய்து உங்கள் விவரங்களை சரிபார்க்கவும்." : "Email address not recognized.");
                    }

                    const isValidPasswords = await bcrypt.compare(
                        credentials?.password ?? "",
                        user.password as string
                    );

                    if (!isValidPasswords) {
                        throw new Error(lang === 'ta' ? "கடவுச்சொல் தவறானது. தயவுசெய்து உங்கள் விவரங்களை சரிபார்க்கவும்." : "Invalid password. Please check your credentials.");
                    }

                    if (!is_admin) {
                        if (!user.is_approve) {
                            throw new Error(lang === 'ta' ? "உங்கள் கணக்கு இன்னும் அங்கீகரிக்கப்படவில்லை.சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்." : "Account activation is pending. You will be notified once approved.");
                        }

                        if (!user.is_verify) {
                            throw new Error(lang === 'ta' ? "உங்கள் மின்னஞ்சல் முகவரிக்கு வந்துள்ள உறுதிப்படுத்தல் மெயிலைத் திறந்து, 'Verify Email' பொத்தானைக் கிளிக் செய்யவும்." : "Email not yet verified.");
                        }

                        if (!user.is_active) {
                            throw new Error(lang === 'ta' ? "உங்கள் கணக்கு முடக்கப்பட்டுள்ளது." : "Your account has been deactivated.");
                        }
                    }

                    return {
                        id: (user._id as Types.ObjectId).toString(),
                        email: user.email,
                        name: user.name,
                        is_admin,
                    } as AdapterUser;

                } catch (error) {
                    throw new Error(error.message || (credentials?.lang === 'ta' ? "உள்நுழைவதில் பிழை. உங்கள் விவரங்களை சரிபார்க்கவும்." : "Authentication error. Please check your login details."));
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
        async redirect({ url, baseUrl }) {
            // Redirect to matrimony.searchnscore.com after sign-out
            if (url === "/login") {
                return `${process.env.BASE_URL}/login`;
            }
            if (url === '/admin/auth/signin') {
                return `${process.env.BASE_URL}/admin/auth/signin`;
            }
            return url;
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