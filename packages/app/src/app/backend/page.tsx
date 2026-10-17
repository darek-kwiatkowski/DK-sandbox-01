import { connection } from "next/server";
import { Badge } from "@devmentor/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@devmentor/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@devmentor/ui/components/table";
import { getRequestScope } from "@/server/container";

export default async function BackendHomePage() {
  // Query the database per request, not at build time.
  await connection();
  const users = await getRequestScope().cradle.userService.list();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Użytkownicy</CardTitle>
        <CardDescription>
          Panel administracyjny (backend) używa komponentów shadcn-ui z <code>@devmentor/ui</code>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground">Brak użytkowników.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imię</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Utworzono</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.email}</Badge>
                  </TableCell>
                  <TableCell>{user.createdAt.toLocaleString("pl-PL")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
