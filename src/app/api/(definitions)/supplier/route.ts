import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(request: Request) {
    try {
        const data = await prisma.suppliers.findMany({
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
            const supplier: Supplier = await request.json();

            const newSupplier = await prisma.suppliers.create({
                data: supplier,
            });

            if (newSupplier.id) {
                return NextResponse.json(
                    {
                        message: "Tedarikçi başarıyla kaydedildi!",
                    },
                    { status: 200 },
                );
            } else {
                return NextResponse.json(
                    {
                        message: "Tedarikçi kaydedilemedi!",
                    },
                    { status: 400 },
                );
            }
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
    }
}
