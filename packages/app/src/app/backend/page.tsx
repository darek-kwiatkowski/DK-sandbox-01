import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@devmentor/ui/components/ui/card";
import { UsersTable } from "./users-table";

export default function BackendPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Użytkownicy</CardTitle>
        <CardDescription>
          Panel administracyjny (backend) używa komponentów shadcn-ui z <code>@devmentor/ui</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UsersTable />
      </CardContent>
    </Card>
  );
}
