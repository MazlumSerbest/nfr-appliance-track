import PageHeader from "@/components/PageHeader";

export default function DealersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Bayiler" />
            {children}
        </div>
    );
}
