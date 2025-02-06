"use server";
import nodemailer from "nodemailer";
import toast from "react-hot-toast";

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
        await transporter
            .sendMail({
                from: process.env.SMTP_FROM, // sender address
                to: to, // list of receivers
                cc: cc, // list of cc
                subject: subject, // Subject line
                html: html, // html body
            })
            .then((res) => {
                return {
                    message: res,
                    status: 200,
                    ok: true,
                };
            })
            .catch((err) => {
                return {
                    message: err,
                    status: 500,
                    ok: true,
                };
            });
    } catch (error: any) {
        return {
            message: error.response,
            status: error.responseCode,
            ok: false,
        };
    }
}
