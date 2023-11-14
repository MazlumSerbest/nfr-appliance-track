import PageHeader from "@/components/PageHeader";

export default function CustomersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Müşteriler" />
            {children}
        </div>
    );
}