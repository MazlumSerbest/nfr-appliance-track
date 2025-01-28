"use server";
import prisma from "@/utils/db";
import { Prisma } from "@prisma/client";

export async function deleteData(
    table:
        | "appliances"
        | "licenses"
        | "projects"
        | "connections"
        | "users"
        | "brands"
        | "products"
        | "productTypes"
        | "licenseTypes"
        | "boughtTypes"
        | "currents"
        | "authorizedPersons"
        | "addresses"
        | "licenseHistory"
        | "applianceHistory",
    id: number,
    updatedBy?: string,
) {
    let res;
    const date = new Date().toISOString();
    if (!updatedBy) return false;

    if (table == "appliances" || table == "licenses") {
        const query = `UPDATE "${table}" SET deleted = true, "updatedBy" = '${updatedBy}', "updatedAt" = '${date}' WHERE id = ${id};`;

        res = await prisma.$queryRaw`${Prisma.raw(query)}`;
    } else {
        const query = `DELETE FROM "${table}" WHERE id = ${id};`;

        res = await prisma.$queryRaw`${Prisma.raw(query)}`;
    }

    await prisma.logs.create({
        data: {
            action: "delete",
            table: table,
            user: updatedBy || "",
            date: date,
            description: `Deleted: ${id}`,
            data: JSON.stringify({ id: id, updatedBy: date }),
        },
    });

    if (res) return true;
    else return false;
}

export async function setActiveStatus(
    table:
        | "users"
        | "brands"
        | "products"
        | "productTypes"
        | "licenseTypes"
        | "boughtTypes"
        | "currents",
    id: number,
    activeStatus: boolean,
    updatedBy?: string,
) {
    if (!updatedBy) return false;
    const date = new Date().toISOString();

    const query = `UPDATE "${table}" SET active = ${
        activeStatus ? "true" : "false"
    }, "updatedBy" = '${updatedBy}', "updatedAt" = '${date}' WHERE id = ${id};`;

    const res = await prisma.$queryRaw`${Prisma.raw(query)}`;

    if (res) return true;
    else return false;
}

export async function setControlStatus(
    id: number,
    controlStatus: boolean,
    updatedBy?: string,
) {
    if (!updatedBy) return false;

    const connection = await prisma.connections.update({
        data: {
            controlled: controlStatus,
            updatedBy: updatedBy,
            updatedAt: new Date().toISOString(),
        },
        where: {
            id: id,
        },
    });

    if (connection.controlled === controlStatus) return true;
    else return false;
}

export async function setLicenseAppliance(
    licenseId: number,
    applianceId: number | null,
    updatedBy?: string,
) {
    if (!updatedBy) return false;

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

export async function setApplianceDemoStatus(
    applianceId: number,
    isDemo: boolean,
    updatedBy?: string,
) {
    if (!updatedBy) return false;

    const appliance = await prisma.appliances.update({
        data: {
            isDemo: isDemo,
            updatedBy: updatedBy,
            updatedAt: new Date().toISOString(),
        },
        where: {
            id: applianceId,
        },
    });

    if (appliance.isDemo == isDemo) return true;
    else return false;
}

export async function setLicenseActiveStatus(
    licenseId: number,
    status: string,
    updatedBy?: string,
) {
    if (!updatedBy) return false;

    const license = await prisma.licenses.update({
        data: {
            isLost: status == "lost" ? true : false,
            updatedBy: updatedBy,
            updatedAt: new Date().toISOString(),
        },
        where: {
            id: licenseId,
        },
    });

    if (license.id) return true;
    else return false;
}

export async function newAuthorizedPerson(
    authorizedPerson: AuthorizedPerson,
    createdBy?: string,
) {
    if (!createdBy) return false;

    const newPerson = await prisma.authorizedPersons.create({
        data: { ...authorizedPerson, createdBy: createdBy },
    });

    if (newPerson.id) return true;
    else return false;
}

export async function updateAuthorizedPerson(
    authorizedPerson: AuthorizedPerson,
    updatedBy?: string,
) {
    if (!updatedBy) return false;

    const person = await prisma.authorizedPersons.update({
        data: {
            ...authorizedPerson,
            updatedBy: updatedBy,
            updatedAt: new Date().toISOString(),
        },
        where: {
            id: authorizedPerson.id,
        },
    });

    if (person.id) return true;
    else return false;
}

export async function newAddress(address: Address, createdBy?: string) {
    if (!createdBy) return false;

    const newAddress = await prisma.addresses.create({
        data: { ...address, createdBy: createdBy },
    });

    if (newAddress.id) return true;
    else return false;
}

export async function updateAddress(address: Address, updatedBy?: string) {
    if (!updatedBy) return false;

    const newAddress = await prisma.addresses.update({
        data: {
            ...address,
            updatedBy: updatedBy,
            updatedAt: new Date().toISOString(),
        },
        where: {
            id: address.id,
        },
    });

    if (newAddress.id) return true;
    else return false;
}

export async function getLicenseCounts() {
    const licenseCounts = await prisma.vLicenseCounts.findFirst();

    return licenseCounts;
}

export async function getApplianceCounts() {
    const applianceCounts = await prisma.vApplianceCounts.findFirst();

    return applianceCounts;
}

export async function getProjectCounts() {
    const projectCounts = await prisma.vProjectCounts.findFirst();

    return projectCounts;
}

// export async function setMainAuthorizedPerson(
//     currentId: number,
//     authorizedPersonId: number,
//     updatedBy?: string,
// ) {
//     if (!updatedBy) return;

//     await prisma.authorizedPersons.updateMany({
//         data: {
//             isMain: false,
//             updatedBy: updatedBy,
//             updatedAt: new Date().toISOString(),
//         },
//         where: {
//             currentId: currentId,
//             id: { not: authorizedPersonId },
//         },
//     });
//     const person = await prisma.authorizedPersons.update({
//         data: {
//             isMain: true,
//             updatedBy: updatedBy,
//             updatedAt: new Date().toISOString(),
//         },
//         where: {
//             id: authorizedPersonId,
//         },
//     });

//     if (person.isMain == true) return true;
//     else return false;
// }
