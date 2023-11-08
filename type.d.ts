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

interface Product {
    id: string;
    customerId: string;
    name: string;
    modelNo: string;
    brand: string;
    type: string;
    active: boolean;
}

interface Appliance {
    id: string;
    productId: string;
    licenseId: string;
    
    active: boolean;
}

interface License {
    id: string;
    key: string;

    active: string;
}

interface Customer {
    id: string;
    name: string;

    active: boolean;
}

interface Connection {
    id: string;
    customerId: string;
    ip: string;
    login: string;
    password: string;
    note: string;
    active: boolean;
}