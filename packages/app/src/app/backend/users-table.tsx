"use client";

import { Badge } from "@devmentor/ui/components/ui/badge";
import { useApiResource } from "@devmentor/ui/backend/api";
import { DataTable, type DataTableColumn } from "@devmentor/ui/backend/tables";

/** JSON shape returned by GET /api/users. */
type UserRow = { id: string; email: string; name: string; createdAt: string };

const columns: DataTableColumn<UserRow>[] = [
  { id: "name", header: "Imię", cell: (user) => user.name },
  { id: "email", header: "E-mail", cell: (user) => <Badge variant="secondary">{user.email}</Badge> },
  { id: "createdAt", header: "Utworzono", cell: (user) => new Date(user.createdAt).toLocaleString("pl-PL") },
];

export function UsersTable() {
  const users = useApiResource<UserRow[]>("/api/users");

  return (
    <DataTable
      label="Użytkownicy"
      columns={columns}
      rows={users.status === "ready" ? users.data : undefined}
      getRowId={(user) => user.id}
      isLoading={users.status === "loading"}
      error={users.status === "error" ? users.error.message : null}
      onRetry={users.reload}
      emptyTitle="Brak użytkowników."
    />
  );
}
