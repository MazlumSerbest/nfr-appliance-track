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
    controlled: boolean;
};

type ControlHistory = Entity & {
    connectionId: number;
    userId: number;
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
    history: any;
};

type ApplianceHistory = Entity & {
    applianceId: number;
    customerId?: number;
    cusName?: string;
    boughtAt?: string | null;
    soldAt?: string | null;
    customer: any;
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
    isLost: boolean;
    isPassive: boolean;
    licenseType: any;
    history: any;
    mailSended: boolean;
    // boughtType: any;
};

type LicenseHistory = Entity & {
    licenseId: number;
    serialNo?: string;
    licenseTypeId: number;
    boughtTypeId?: number;
    startDate: string;
    expiryDate: string;
    dealerId: number;
    subDealerId: number;
    supplierId: number;
    boughtAt?: string;
    soldAt?: string;
    orderedAt?: string;
    applianceId?: number;
    appSerialNo?: string;
    productId?: number;
    note?: string;
    licenseType: any;
    boughtType: any;
    dealer: any;
    subDealer: any;
    supplier: any;
    appliance: any;
    product: any;
};

type LicenseMail = Entity & {
    licenseId: number;
    to: string;
    subject?: string;
    content?: string;
};

type Order = Entity & {
    status: "order" | "invoice" | "purchase" | "complete";
    registerNo?: string;
    invoiceNo?: string;
    paymentPlan?: string | null;
    soldAt?: string | null;
    price?: number;
    currency?: "TRY" | "USD" | "EUR";
    appliancePrice?: number;
    applianceCurrency?: "TRY" | "USD" | "EUR";
    licensePrice?: number;
    licenseCurrency?: "TRY" | "USD" | "EUR";
    address?: string;
    note?: string;
    cusName?: string;
    customerId?: number;
    dealerId?: number;
    subDealerId?: number;
    supplierId?: number;
    licenseId?: number;
    applianceId?: number;
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
