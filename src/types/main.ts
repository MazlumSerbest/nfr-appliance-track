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

type PageState = {
    openTab?: string;
}

type TableState = {
    currentPage: number;
    visibleColumns: string[];
    rowsPerPage: number;
}
