import PageHeader from "@/components/PageHeader";

export default function BoughtTypesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Alım Tipleri" />
            {children}
        </div>
    );
}