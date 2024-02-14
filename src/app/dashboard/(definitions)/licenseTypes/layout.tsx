import PageHeader from "@/components/PageHeader";

export default function LicenseTypesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Lisans Tipleri" />
            {children}
        </div>
    );
}
