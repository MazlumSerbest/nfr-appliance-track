export { default } from "next-auth/middleware";
export const config = {
    matcher: ["/dashboard/:path*"],
    pages: {
        signIn: "/auth/signin",
    },
};
