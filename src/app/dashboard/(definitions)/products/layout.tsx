import PageHeader from "@/components/PageHeader";

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Ürünler" />
            {children}
        </div>
    );
}
