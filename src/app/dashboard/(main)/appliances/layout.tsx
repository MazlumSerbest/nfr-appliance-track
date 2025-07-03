import PageHeader from "@/components/PageHeader";

export default function AppliancesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Cihazlar" close/>
            {children}
        </div>
    );
}
