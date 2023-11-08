import PageHeader from "@/components/PageHeader";

export default function UsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Kullanıcılar" />
            {children}
        </div>
    );
}