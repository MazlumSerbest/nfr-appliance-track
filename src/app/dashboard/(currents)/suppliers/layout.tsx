import PageHeader from "@/components/PageHeader";

export default function SuppliersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Tedarikçiler" close />
            {children}
        </div>
    );
}
