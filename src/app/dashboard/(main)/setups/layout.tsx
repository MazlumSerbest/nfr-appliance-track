import PageHeader from "@/components/PageHeader";

export default function SetupsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Kurulumlar" />
            {children}
        </div>
    );
}
