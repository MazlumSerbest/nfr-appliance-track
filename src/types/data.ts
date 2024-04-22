type User = Entity & {
    username: string;
    name?: string;
    email: string;
    role: "admin" | "technical" | "seller";
};

type Connection = Entity & {
    customerId?: number;
    ip: string;
    login?: string;
    password?: string;
    note?: string;
    customer: any;
};

type Appliance = Entity & {
    predecessorId?: number;
    productId: number;
    customerId: number;
    dealerId: number;
    subDealerId: number;
    supplierId: number;
    serialNo: string;
    boughtAt?: string | null;
    soldAt?: string | null;
    note?: string;
    isDemo: boolean;
};

type License = Entity & {
    serialNo: string;
    customerId: number;
    dealerId: number;
    subDealerId: number;
    supplierId: number;
    licenseTypeId: number;
    boughtTypeId?: number;
    startDate?: string | null;
    expiryDate?: string | null;
    boughtAt?: string | null;
    soldAt?: string | null;
    orderedAt?: string | null;
    note?: string;
    applianceId?: number | null;
    appSerialNo?: string;
    productId?: number | null;
    licenseType: any;
    history: any;
    // boughtType: any;
};

type LicenseHistory = Entity & {
    licenseId: number;
    serialNo?: string;
    licenseTypeId: number;
    boughtTypeId?: number;
    startDate: string;
    expiryDate: string;
    licenseType: any;
    boughtType: any;
};

type Project = Entity & {
    date: string;
    customerId: number;
    dealerId: number;
    productId: number;
    licenseTypeId: number;
    note?: string;
    status: "active" | "won" | "lost";
};

type Brand = Entity & {
    name: string;
};

type Product = Entity & {
    model: string;
    brand?: Brand;
    productType?: ProductType;
};

type ProductType = Entity & {
    type: string;
};

type LicenseType = Entity & {
    productId: number;
    type: string;
    duration?: number;
    price?: number;
    brand?: Brand;
};

type BoughtType = Entity & {
    type: string;
};

type Current = Entity & {
    name: string;
    type: "customer" | "dealer" | "supplier";
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    taxOffice?: string;
    taxNo?: string;
    paymentPlan?: string;
    paymentNumber?: string;
    authorizedName?: string;
    authorizedTitle?: string;
};

type AuthorizedPerson = Entity & {
    currentId: number;
    name: string;
    isMain: boolean;
    title?: string;
    phone?: string;
    email?: string;
};

type Address = Entity & {
    currentId: number;
    name: string;
    address: string;
    city?: string;
};
