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
                        throw new Error(lang === 'ta' ? "நீங்கள் உள்ளிட்ட மின்னஞ்சல் முகவரி பதிவு செய்யப்படவில்லை. எழுத்துப் பிழைகளைச் சரிபார்க்கவும் அல்லது புதிய கணக்கை உருவாக்கவும்." : "The email address you entered is not registered. Please check for typos or register a new account.");
                    }

                    const isValidPasswords = await bcrypt.compare(
                        credentials?.password ?? "",
                        user.password as string
                    );

                    if (!isValidPasswords) {
                        throw new Error(lang === 'ta' ? "நீங்கள் உள்ளிட்ட கடவுச்சொல் தவறானது. நீங்கள் அதை மறந்திருந்தால், 'கடவுச்சொல்லை மறந்துவிட்டீர்களா' என்ற விருப்பத்தைப் பயன்படுத்தவும்." : "The password you entered is incorrect. If you've forgotten it, please use the 'Forgot Password' option.");
                    }

                    if (!is_admin) {
                        if (!user.is_approve) {
                            throw new Error(lang === 'ta' ? "உங்கள் கணக்கு தற்போது நிர்வாகத்தின் அங்கீகாரத்திற்காகக் காத்திருக்கிறது. உங்கள் பதிவுத் தரவை எங்கள் குழு சரிபார்த்து வருகிறது. உங்கள் கணக்கு செயல்பாட்டிற்கு வந்தவுடன் மின்னஞ்சல் மூலம் உங்களுக்குத் தெரிவிக்கப்படும்." : "Your account is currently pending administrative approval. Our team is verifying your registration data. You will be notified via email once your account is activated.");
                        }

                        if (!user.is_verify) {
                            throw new Error(lang === 'ta' ? "உங்கள் மின்னஞ்சல் முகவரி இன்னும் உறுதிப்படுத்தப்படவில்லை. உங்கள் மின்னஞ்சல் பெட்டியில் வந்திருக்கும் உறுதிப்படுத்தல் மெயிலைத் திறந்து, 'மின்னஞ்சலை உறுதிப்படுத்து' பொத்தானைக் கிளிக் செய்யவும்." : "Your email address has not been verified yet. Please check your inbox for the verification email and click the 'Verify Email' button to continue.");
                        }

                        if (!user.is_active) {
                            throw new Error(lang === 'ta' ? "இந்தக் கணக்கு முடக்கப்பட்டுள்ளது. மேலதிக உதவிக்கு எங்கள் ஆதரவு குழுவைத் தொடர்பு கொள்ளவும்." : "This account has been deactivated. Please contact our support team for further assistance.");
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
                token.id = user.id;
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
            // Redirect after sign-out
            if (url === "/login") {
                return `${process.env.DOMAIN_URL}/login`;
            }
            if (url === '/admin/auth/signin') {
                return `${process.env.DOMAIN_URL}/admin/auth/signin`;
            }
            return url;
        },
        async signIn({ user }) {

            await connectToDatabase();

            if (user?.id) {
                try {
                    await Users_activity_log.create({
                        user_id: user.id,
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