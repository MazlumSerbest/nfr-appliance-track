import PageHeader from "@/components/PageHeader";

export default function OrdersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Siparişler" close />
            {children}
        </div>
    );
}
