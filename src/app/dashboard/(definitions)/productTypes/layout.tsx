import PageHeader from "@/components/PageHeader";

export default function ProductTypesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Ürün Tipleri" />
            {children}
        </div>
    );
}
