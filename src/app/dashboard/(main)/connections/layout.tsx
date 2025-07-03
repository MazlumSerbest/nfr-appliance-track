import PageHeader from "@/components/PageHeader";

export default function ConnectionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Bağlantılar" close/>
            {children}
        </div>
    );
}