"use server";
import prisma from "@/utils/db";

export async function setLicenseAppliance(
    licenseId: number,
    applianceId: number,
    updatedBy: string,
) {
    const license = await prisma.licenses.update({
        data: {
            applianceId: applianceId,
            updatedBy: updatedBy,
            updatedAt: new Date().toISOString(),
        },
        where: {
            id: licenseId,
        },
    });
    if (license.applianceId == applianceId) return true;
    else return false;
}

export async function getReport() {
    const report = prisma.vLicenses.count();

    return null;
}
