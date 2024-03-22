type vAppliance = Appliance & {
    status: string;
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
};

type vProject = Project & {
    customerName: string;
    dealerName?: string;
    productModel?: string;
    productBrand?: string;
    licenseType?: string;
    licenseDuration?: string;
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

type vProjectCounts = {
    id: number;
    activeCount?: number;
    winCount?: number;
    lostCount?: number;
};