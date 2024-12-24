"use server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST as string,
    port: Number(process.env.SMTP_PORT) || 587,
    tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
    },
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

type Mail = {
    to: string;
    cc: string;
    subject: string;
    html: string;
};

export async function sendMail({ to, cc, subject, html }: Mail) {
    try {
        const info = await transporter.sendMail(
            {
                from: process.env.SMTP_FROM, // sender address
                to: "portal@nfrbilisim.com", // list of receivers
                cc: cc, // list of cc
                subject: subject, // Subject line
                html: html, // html body
            },
        );

        return info;
    } catch (error: any) {
        return {
            message: error.response,
            status: error.responseCode,
            ok: false,
        };
    }
}
