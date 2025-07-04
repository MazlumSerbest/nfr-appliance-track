import toast from "react-hot-toast";

export async function getUsers(forListBox?: boolean, currUser?: User) {
    const res = await fetch("/api/user");
    const users = await res.json();

    if (!users) return toast.error("Kullanıcı bulunamadı!");
    if (forListBox)
        return users
            .filter((u: User) => u.active)
            .map((u: User) => ({
                id: u.id,
                name: `${u.name} ${u.id == currUser?.id ? "(Siz)" : ""}`,
            }));
    return users.filter((u: User) => u.active);
}

export async function getAppliances(
    forListBox?: boolean,
    productId?: number,
    status?: string[],
) {
    const res = await fetch(
        `/api/appliance${productId ? `?productId=${productId}` : ""}`,
    );
    let appliances = await res.json();

    if (status)
        appliances = appliances.filter((l: vLicense) =>
            status.includes(l.status),
        );

    if (!appliances.length) {
        toast.error("Cihaz bulunamadı!");
        return [];
    }
    if (forListBox)
        return appliances?.map((a: vAppliance) => ({
            id: a.id,
            name: a.serialNo + (a.status == "stock" ? " (Stok)" : ""),
        }));
    return appliances;
}

export async function getLicenses(
    forListBox?: boolean,
    licenseTypeId?: number,
    status?: string[],
) {
    const res = await fetch(
        `/api/license${licenseTypeId ? `?licenseTypeId=${licenseTypeId}` : ""}`,
    );
    let licenses = await res.json();

    if (status)
        licenses = licenses.filter((l: vLicense) => status.includes(l.status));

    if (!licenses.length) {
        toast.error("Lisans bulunamadı!");
        return [];
    }
    if (forListBox)
        return licenses?.map((l: vLicense) => ({
            id: l.id,
            name:
                (l.applianceSerialNo
                    ? l.applianceSerialNo
                    : "Cihaz Seri No Yok") +
                " - " +
                l.licenseType +
                (l.licenseDuration ? l.licenseDuration + " Ay" : "") +
                (l.status == "stock" ? " (Stok)" : ""),
        }));
    return licenses;
}

export async function getBrands(forListBox?: boolean) {
    const res = await fetch("/api/brand");
    const brands = await res.json();

    if (forListBox)
        return brands
            .filter((b: Brand) => b.active)
            .map((b: Brand) => ({
                id: b.id,
                name: b.name,
            }));
    return brands.filter((b: Brand) => b.active);
}

export async function getProducts(forListBox?: boolean) {
    const res = await fetch("/api/product");
    const products = await res.json();

    if (!products) return toast.error("Ürün bulunamadı!");
    if (forListBox)
        return products
            .filter((p: vProduct) => p.active)
            .map((p: vProduct) => ({
                id: p.id,
                name: (p.brandName ? p.brandName + " " : "") + p.model,
            }));
    return products.filter((p: Product) => p.active);
}

export async function getProductTypes(forListBox?: boolean) {
    const res = await fetch("/api/productType");
    const productTypes = await res.json();

    if (forListBox)
        return productTypes
            .filter((pt: ProductType) => pt.active)
            .map((pt: ProductType) => ({
                id: pt.id,
                name: pt.type,
            }));
    return productTypes.filter((pt: ProductType) => pt.active);
}

export async function getLicenseTypes(
    forListBox?: boolean,
    productId?: number,
) {
    const res = await fetch(
        `/api/licenseType${productId ? `?productId=${productId}` : ""}`,
    );
    const licenseTypes = await res.json();

    if (forListBox)
        return licenseTypes
            .filter((lt: vLicenseType) => lt.active)
            .map((lt: vLicenseType) => ({
                id: lt.id,
                name:
                    lt.brandName + " " + lt.type + " - " + lt.duration + " ay",
            }));
    return licenseTypes.filter((lt: vLicenseType) => lt.active);
}

export async function getBoughtTypes(forListBox?: boolean) {
    const res = await fetch("/api/boughtType");
    const boughtTypes = await res.json();

    if (forListBox)
        return boughtTypes
            .filter((bt: BoughtType) => bt.active)
            .map((bt: BoughtType) => ({
                id: bt.id,
                name: bt.type,
            }));
    return boughtTypes.filter((bt: BoughtType) => bt.active);
}

export async function getCustomers(forListBox?: boolean) {
    let query = `/api/current?currentType=customer&active=true`;
    if (forListBox)
        query += `&select=${JSON.stringify({
            id: true,
            name: true,
        })}`;
    const res = await fetch(query);
    const customers = await res.json();

    return customers;
}

export async function getDealers(forListBox?: boolean) {
    let query = `/api/current?currentType=dealer&active=true`;
    if (forListBox)
        query += `&select=${JSON.stringify({
            id: true,
            name: true,
            blacklisted: true,
        })}`;
    const res = await fetch(query);
    const dealers = await res.json();

    return dealers;
}

export async function getSuppliers(forListBox?: boolean) {
    let query = `/api/current?currentType=supplier&active=true`;
    if (forListBox)
        query += `&select=${JSON.stringify({
            id: true,
            name: true,
        })}`;
    const res = await fetch(query);
    const suppliers = await res.json();

    return suppliers;
}
