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

type ListBoxItem = {
    id: number;
    name: string;
    blacklisted?: boolean;
};
