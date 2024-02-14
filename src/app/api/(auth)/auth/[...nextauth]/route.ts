import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/utils/db";
import bcrypt from "bcrypt";

const options: NextAuthOptions = {
    session: {
        maxAge: 12 * 60 * 60, // 12 hours
        // updateAge: 24 * 60 * 60,
    },
    // pages: {
    //     signIn: "/auth/signin",
    // },
    theme: {
        colorScheme: "light",
        brandColor: "#0ea5e9",
        logo: "https://nfrbilisim.com/wp-content/uploads/2022/04/nfr-logo.png",
        buttonText: "#0ea5e9",
    },
    providers: [
        CredentialsProvider({
            name: "Username",
            credentials: {
                username: {
                    label: "Kullanıcı Adı:",
                    type: "text",
                },
                password: {
                    label: "Şifre:",
                    type: "password",
                },
            },
            async authorize(credentials) {
                let isValid: boolean, authUser: any;

                const { username, password } = credentials as {
                    username: string;
                    password: string;
                };

                let user = await prisma.users.findFirst({
                    where: {
                        username: username,
                    },
                    select: {
                        active: true,
                        username: true,
                        email: true,
                        password: true,
                        name: true,
                    },
                });

                if (!user?.active) return null;

                // if (!user) throw new Error("Kullanıcı mevcut değil!");
                if (!user) return null;

                isValid = await bcrypt.compare(password, user?.password);

                // if (!isValid) throw new Error("Giriş bilgileri yanlış! Lütfen tekrar deneyiniz.");
                if (!isValid) return null;
                
                authUser = {
                    // id: user.id,
                    // active: user.active,
                    username: user.username,
                    email: user.email,
                    // role: "",
                    name: user.name ?? "",
                    // createdBy: "",
                    // createdAt: user.createdAt,
                };

                return authUser;
            },
        }),
    ],
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
