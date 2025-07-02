type vAppliance = Appliance & {
    status: string;
    product?: string;
    productBrand?: string;
    productModel?: string;
};

type vLicense = License & {
    status: string;
    applianceSerialNo?: string;
    productModel?: string;
    productBrand?: string;
    licenseType?: string;
    licenseDuration?: string;
    licenseBrand?: string;
    isLost?: boolean;
    isPassive?: boolean;
    expiryStatus?: string;
};

type vOrder = Order & {
    applianceSerialNo?: string;
    productModel?: string;
    productBrand?: string;
    licenseType?: string;
    licenseSerialNo?: string;
};

type vProject = Project & {
    customerName: string;
    dealerName?: string;
    productModel?: string;
    productBrand?: string;
    licenseType?: string;
    licenseDuration?: string;
};

type vSetup = Setup & {
    applianceSerialNo?: string;
    licenseSerialNo?: string;
    productModel?: string;
    productBrand?: string;
    licenseType?: string;
    userId?: string;
    assignedUser?: string;
}

type vProduct = Product & {
    brandName: string;
    productTypeName: string;
};

type vLicenseType = LicenseType & {
    brandName: string;
};

type vLicenseCounts = {
    id: number;
    stockCount?: number;
    orderCount?: number;
    waitingCount?: number;
    activeCount?: number;
    lostCount?: number;
    passiveCount?: number;
    undefinedCount?: number;
    endedCount?: number;
    endingCount?: number;
    continuesCount?: number;
};

type vApplianceCounts = {
    id: number;
    stockCount?: number;
    orderCount?: number;
    activeCount?: number;
};

type vOrderCounts = {
    id: number;
    orderCount?: number;
    invoiceCount?: number;
    purchaseCount?: number;
    completeCount?: number;
};

type vProjectCounts = {
    id: number;
    activeCount?: number;
    winCount?: number;
    lostCount?: number;
};
