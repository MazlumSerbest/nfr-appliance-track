import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        let licenseTypeId = Number(
            request.nextUrl.searchParams.get("licenseTypeId"),
        );

        const data = await prisma.vLicenses.findMany({
            where: {
                ...(licenseTypeId ? { licenseTypeId: licenseTypeId } : {}),
            },
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session)
            return NextResponse.json({
                message: "Authorization Needed!",
                status: 401,
                ok: false,
            });

        const license: License = await request.json();
        license.startDate = license.startDate
            ? new Date(license.startDate).toISOString()
            : undefined;
        license.expiryDate = license.expiryDate
            ? new Date(license.expiryDate).toISOString()
            : undefined;
        license.boughtAt = license.boughtAt
            ? new Date(license.boughtAt).toISOString()
            : undefined;
        license.soldAt = license.soldAt
            ? new Date(license.soldAt).toISOString()
            : undefined;
        license.orderedAt = license.orderedAt
            ? new Date(license.orderedAt).toISOString()
            : undefined;

        license.applianceId ? (license.productId = null) : null;

        // const checkSerialNo = await prisma.licenses.findUnique({
        //     where: {
        //         serialNo: license.serialNo,
        //     },
        //     select: {
        //         serialNo: true,
        //     },
        // });
        // if (checkSerialNo)
        //     return NextResponse.json({
        //         message: "Bu seri numarası önceden kullanılmıştır!",
        //         status: 400,
        //         ok: false,
        //     });

        const newLicense = await prisma.licenses.create({
            data: license,
        });

        if (!newLicense.id)
            return NextResponse.json({
                message: "Lisans kaydedilemedi!",
                status: 400,
                ok: false,
            });

        await prisma.logs.create({
            data: {
                action: "create",
                table: "licenses",
                user: newLicense.createdBy,
                date: new Date().toISOString(),
                description: `License created: ${newLicense.id}`,
                data: JSON.stringify(newLicense),
            },
        });

        return NextResponse.json({
            message: "Lisans başarıyla kaydedildi!",
            status: 200,
            ok: true,
            data: newLicense,
        });
    } catch (error) {
        return NextResponse.json({ message: error, status: 500, ok: false });
    }
}
