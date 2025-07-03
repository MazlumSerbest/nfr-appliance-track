import PageHeader from "@/components/PageHeader";

export default function LicensesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Lisanslar" close/>
            {children}
        </div>
    );
}
