export async function getLicenses(forListBox?: boolean, productId?: number) {
    const res = await fetch(`/api/license${productId ? `?productId=${productId}` : "" }`);
    const licenses = await res.json();

    if (forListBox)
        return licenses
            .filter((l: License) => l.active)
            .map((l: License) => ({
                id: l.id,
                name: l.serialNo
            }));
    return licenses.filter((l: License) => l.active);
}

export async function getProducts(forListBox?: boolean) {
    const res = await fetch("/api/product");
    const products = await res.json();

    if (forListBox)
        return products
            .filter((p: Product) => p.active)
            .map((p: Product) => ({
                id: p.id,
                name: p.brand + " " + p.model,
            }));
    return products.filter((p: Product) => p.active);
}

export async function getLicenseTypes(forListBox?: boolean, productId?: number) {
    const res = await fetch(`/api/licenseType${productId ? `?productId=${productId}` : "" }`);
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

export async function getCustomers(forListBox?: boolean) {
    const res = await fetch("/api/customer");
    const customers = await res.json();

    if (forListBox)
        return customers
            .filter((c: Customer) => c.active)
            .map((c: Customer) => ({
                id: c.id,
                name: c.name,
            }));
    return customers.filter((c: Customer) => c.active);
}

export async function getDealers(forListBox?: boolean) {
    const res = await fetch("/api/dealer");
    const dealers = await res.json();

    if (forListBox)
        return dealers
            .filter((d: Dealer) => d.active)
            .map((d: Dealer) => ({
                id: d.id,
                name: d.name,
            }));
    return dealers.filter((d: Dealer) => d.active);
}

export async function getSuppliers(forListBox?: boolean) {
    const res = await fetch("/api/supplier");
    const suppliers = await res.json();

    if (forListBox)
        return suppliers
            .filter((s: Supplier) => s.active)
            .map((s: Supplier) => ({
                id: s.id,
                name: s.name,
            }));
    return suppliers.filter((s: Supplier) => s.active);
}