type Entity = {
    id: number;
    active: boolean;
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: string;
};

type Current = {
    name: string;
    phone: string;
    email: string;
};

type Path = {
    path: string;
    key: string;
    name: string;
    isAdmin?: boolean;
    icon: React.ReactNode;
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
    customerId: number;
    ip?: string;
    login?: string;
    password?: string;
    note?: string;
};

type User = Entity & {
    username: string;
    name?: string;
    email: string;
    role: string;
};

type Appliance = Entity & {
    predecessorId?: number;
    productId: number;
    licenseId: number;
    customerId: number;
    dealerId: number;
    supplierId: number;
    serialNo: string;
    boughtAt?: Date;
    soldAt?: Date;
};

type License = Entity & {
    predecessorId?: number;
    customerId: number;
    dealerId: number;
    supplierId: number;
    licenseTypeId: number;
    isStock: boolean;
    startDate?: Date;
    expiryDate?: Date;
    boughtType?: string;
    boughtAt?: Date;
    soldAt?: Date;
};

type Product = Entity & {
    brand: string;
    model: string;
    type?: string;
};

type LicenseType = Entity & {
    productId: number;
    type: string;
    duration: number?;
    price: Decimal?;
};

type Customer = Entity & Current;

type Dealer = Entity & Current;

type Supplier = Entity & Current;
//#endregion
