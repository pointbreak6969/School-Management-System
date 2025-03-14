import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/dbConnect";
import User from "@/models/User.model";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",	
            name: "Credentials",	
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDb();
                try {
                    const user = await User.findOne({
                        email: credentials.email,
                    })
                    if (!user) {
                        throw new Error("No user found")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (!isPasswordCorrect) {
                        throw new Error("Password is incorrect")
                    }
                    return {email: user.email, username: user.username}
                } catch (error) {
                    console.error("Error in authorize function:", error);
                    throw new Error("An error occurred during authorization. Please try again.")
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token._id = user._id;
                token.email = user.email;
                token.username = user.username;
            }
            return token;
        },
        async session({session, token}) {
            if (token) {
                session.user._id = token._id;
                session.user.email = token.email;
                session.user.username = token.username;
            }
            return session
        }
    },
    session: {
        strategy: "jwt",	
    },
    secret: process.env.NEXT_SECRET,
    pages: {
        signIn: "/signin",
        
    }
}