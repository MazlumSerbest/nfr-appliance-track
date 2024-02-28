type Entity = {
    id: number;
    active: boolean;
    createdBy: string;
    createdAt: string;
    updatedBy?: string;
    updatedAt?: string;
};

type Path = {
    path: string;
    key: string;
    name: string;
    roles?: string[];
    icon: React.ReactNode;
};

type ListBoxItem = {
    id: number;
    name: string;
};

//#region DataTable Component Types
type Column = {
    name: string;
    key: string;
    width?: number;
    sortable?: boolean;
    searchable?: boolean;
};

type ActiveOption = {
    name: string;
    key: string;
};
//#endregion

//#region Data Types
type Connection = Entity & {
    customerId?: number;
    ip: string;
    login?: string;
    password?: string;
    note?: string;
    customer: any;
};

type User = Entity & {
    username: string;
    name?: string;
    email: string;
    role: "admin" | "technical" | "seller";
};

type Appliance = Entity & {
    predecessorId?: number;
    productId: number;
    customerId: number;
    dealerId: number;
    subDealerId: number;
    supplierId: number;
    serialNo: string;
    boughtAt?: string;
    soldAt?: string;
    note?: string;
};

type vAppliance = Appliance & {
    status: string;
    productBrand?: string;
    productModel?: string;
};

type License = Entity & {
    serialNo: string;
    customerId: number;
    dealerId: number;
    subDealerId: number;
    supplierId: number;
    licenseTypeId: number;
    boughtTypeId?: number;
    startDate?: string;
    expiryDate?: string;
    boughtAt?: string;
    soldAt?: string;
    orderedAt?: string;
    note?: string;
    appSerialNo?: string;
    licenseType: any;
    // boughtType: any;
};

type vLicense = License & {
    status: string;
    applianceSerialNo?: string;
    productModel?: string;
    productBrand?: string;
    licenseType?: string;
    licenseDuration?: string;
};

type Project = Entity & {
    date: string;
    customerId: number;
    dealerId: number;
    productId: number;
    licenseTypeId: number;
};

type vProject = Project & {
    customerName: string;
    dealerName?: string;
    productModel?: string;
    productBrand?: string;
    licenseType?: string;
    licenseDuration?: string;
}

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
    price?: Decimal;
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
//#endregion
