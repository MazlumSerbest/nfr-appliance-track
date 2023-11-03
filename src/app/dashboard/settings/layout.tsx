import PageHeader from "@/components/PageHeader";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Settings" />
            {children}
        </div>
    );
}