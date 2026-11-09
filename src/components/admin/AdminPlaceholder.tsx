import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminHero, AdminSurface } from "@/components/admin/admin-ui";

export function AdminPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <AdminHero>
        <AdminPageHeader
          variant="onDark"
          title={title}
          description={description}
        />
      </AdminHero>
      <AdminSurface className="p-6 md:p-8">
        <p className="text-sm leading-6 text-muted-foreground">
          This screen is next. The layout already matches the rest of the admin
          studio.
        </p>
      </AdminSurface>
    </div>
  );
}
