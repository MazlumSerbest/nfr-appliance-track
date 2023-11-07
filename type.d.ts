interface Path {
    path: string;
    key: string;
    name: string;
    icon: React.ReactNode;
}

interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
}

interface ApplianceModel {
    id: string;
    name: string;
    modelNo: string;
    brand: string;
    type: string;
    active: boolean;
}

interface Appliance {
    id: string;
    modelId: string;
    licenseId: string;
    customerId: string;
    
    active: boolean;
}

interface License {
    id: string;
    key: string;

    active: string;
}

interface Connection {
    
}