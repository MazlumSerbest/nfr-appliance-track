import toast from "react-hot-toast";

export async function getAppliances(forListBox?: boolean, productId?: number) {
    const res = await fetch(
        `/api/appliance${productId ? `?productId=${productId}` : ""}`,
    );
    const appliances = await res.json();
    console.log(appliances);
    console.log(productId);
    if (!appliances.length) {
        toast.error("Cihaz bulunamadı!");
        return [];
    }
    if (forListBox)
        return appliances?.map((a: vAppliance) => ({
            id: a.id,
            name: a.serialNo + " - " + a.productBrand + " " + a.productModel,
        }));
    return appliances;
}

export async function getLicenses(forListBox?: boolean) {
    const res = await fetch("/api/license");
    const licenses = await res.json();

    if (forListBox)
        return licenses?.map((l: vLicense) => ({
            id: l.id,
            name:
                l.serialNo +
                " - " +
                l.licenseType +
                " " +
                l.licenseDuration +
                " Ay" +
                (l.isStock ? " (Stok)" : ""),
        }));
    return licenses;
}

export async function getProducts(forListBox?: boolean) {
    const res = await fetch("/api/product");
    const products = await res.json();

    if (!products) return toast.error("Ürün bulunamadı!");
    if (forListBox)
        return products
            .filter((p: Product) => p.active)
            .map((p: Product) => ({
                id: p.id,
                name: p.brand + " " + p.model,
            }));
    return products.filter((p: Product) => p.active);
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
            .filter((lt: LicenseType) => lt.active)
            .map((lt: LicenseType) => ({
                id: lt.id,
                name: lt.type + " - " + lt.duration + " ay",
            }));
    return licenseTypes.filter((lt: LicenseType) => lt.active);
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
    const res = await fetch("/api/current?currentType=customer");
    const customers = await res.json();

    if (forListBox)
        return customers
            .filter((c: Current) => c.active)
            .map((c: Current) => ({
                id: c.id,
                name: c.name,
            }));
    return customers.filter((c: Current) => c.active);
}

export async function getDealers(forListBox?: boolean) {
    const res = await fetch("/api/current?currentType=dealer");
    const dealers = await res.json();

    if (forListBox)
        return dealers
            .filter((d: Current) => d.active)
            .map((d: Current) => ({
                id: d.id,
                name: d.name,
            }));
    return dealers.filter((d: Current) => d.active);
}

export async function getSuppliers(forListBox?: boolean) {
    const res = await fetch("/api/current?currentType=supplier");
    const suppliers = await res.json();

    if (forListBox)
        return suppliers
            .filter((s: Current) => s.active)
            .map((s: Current) => ({
                id: s.id,
                name: s.name,
            }));
    return suppliers.filter((s: Current) => s.active);
}
