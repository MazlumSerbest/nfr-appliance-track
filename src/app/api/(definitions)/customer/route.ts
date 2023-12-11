import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: Request) {
    try {
        const data = await prisma.customers.findMany({
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (request) {
        try {
            const customer: Customer = await request.json();

            const newCustomer = await prisma.customers.create({
                data: customer,
            });

            if (newCustomer.id) {
                return NextResponse.json(
                    {
                        message: "Müşteri başarıyla kaydedildi!",
                    },
                    { status: 200 },
                );
            } else {
                return NextResponse.json(
                    {
                        message: "Müşteri kaydedilemedi!",
                    },
                    { status: 400 },
                );
            }
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    }
}
