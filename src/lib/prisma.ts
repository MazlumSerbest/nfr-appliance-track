"use server";
import prisma from "@/utils/db";
import { Prisma } from "@prisma/client";

export async function deleteData(
    table:
        | "appliances"
        | "licenses"
        | "connections"
        | "users"
        | "connections"
        | "products"
        | "licenseTypes"
        | "boughtTypes"
        | "currents",
    id: number,
    updatedBy?: string,
) {
    if (!updatedBy) return;

    const query = `DELETE FROM "${table}" WHERE id = ${id};`;

    const res = await prisma.$queryRaw`${Prisma.raw(query)}`;

    if (res) return true;
    else return false;
}

export async function setActiveStatus(
    table: "users" | "products" | "licenseTypes" | "boughtTypes" | "currents",
    id: number,
    activeStatus: boolean,
    updatedBy?: string,
) {
    if (!updatedBy) return;
    const date = new Date().toISOString();

    const query = `UPDATE "${table}" SET active = ${
        activeStatus ? "true" : "false"
    }, "updatedBy" = '${updatedBy}', "updatedAt" = '${date}' WHERE id = ${id};`;

    const res = await prisma.$queryRaw`${Prisma.raw(query)}`;

    if (res) return true;
    else return false;
}

export async function setLicenseAppliance(
    licenseId: number,
    applianceId: number,
    updatedBy?: string,
) {
    if (!updatedBy) return;

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

export async function newAuthorizedPerson(
    authorizedPerson: AuthorizedPerson,
    createdBy?: string,
) {
    if (!createdBy) return;

    const person = await prisma.authorizedPersons.create({
        data: { ...authorizedPerson, createdBy: createdBy },
    });

    if (person.id) return true;
    else return false;
}

export async function updateAuthorizedPerson(
    authorizedPerson: AuthorizedPerson,
    updatedBy?: string,
) {
    if (!updatedBy) return;

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

export async function setMainAuthorizedPerson(
    currentId: number,
    authorizedPersonId: number,
    updatedBy?: string,
) {
    if (!updatedBy) return;

    await prisma.authorizedPersons.updateMany({
        data: {
            isMain: false,
            updatedBy: updatedBy,
            updatedAt: new Date().toISOString(),
        },
        where: {
            currentId: currentId,
            id: { not: authorizedPersonId },
        },
    });
    const person = await prisma.authorizedPersons.update({
        data: {
            isMain: true,
            updatedBy: updatedBy,
            updatedAt: new Date().toISOString(),
        },
        where: {
            id: authorizedPersonId,
        },
    });

    if (person.isMain == true) return true;
    else return false;
}

export async function getReport() {
    const report = prisma.vLicenses.count();

    return null;
}
