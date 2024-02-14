import PageHeader from "@/components/PageHeader";

export default function UsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Kullanıcılar" />
            {children}
        </div>
    );
}
