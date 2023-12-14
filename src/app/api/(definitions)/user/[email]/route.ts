import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
    request: Request,
    { params }: { params: { email: string } },
) {
    try {
        const data = await prisma.users.findUnique({
            where: {
                email: params.email,
            },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                role: true,
                active: true,
            },
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error });
    }
}
