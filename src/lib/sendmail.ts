"use server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST as string,
    port: parseInt(process.env.SMTP_PORT as string, 10),
    // tls: {
    //     ciphers: "SSLv3",
    //     rejectUnauthorized: false,
    // },
    secure: false,
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
                to: "mazlum.serbest@d3bilisim.com.tr", // list of receivers
                cc: cc, // list of cc
                subject: subject, // Subject line
                html: html, // html body
            },
            // (error: any, info: any) => {
            //     if (error) {
            //         return { message: error, status: 500, ok: false };
            //     } else {
            //         return {
            //             message: "Mail başarıyla gönderildi!",
            //             status: 200,
            //             ok: true,
            //         };
            //     }
            // },
        );

        return info;
    } catch (error) {
        return { message: error, status: 500, ok: false };
    }
}
