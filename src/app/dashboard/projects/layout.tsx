import PageHeader from "@/components/PageHeader";

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <PageHeader title="Projeler" />
            {children}
        </div>
    );
}
