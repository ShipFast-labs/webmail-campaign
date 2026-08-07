import { createFileRoute, Link } from "@tanstack/react-router";
import { useList, useListContacts, useRemoveContactFromList } from "@/hooks/use-lists";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, PlusSignIcon, Delete02Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/lists/$listId")({
  component: ListDetailPage,
});

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  UNSUBSCRIBED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  BOUNCED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  CLEANED: "bg-muted text-muted-foreground",
};

function ListDetailPage() {
  const { listId } = Route.useParams();
  const { data: list, isLoading: isListLoading } = useList(listId);
  const { data: contacts, isLoading: isContactsLoading } = useListContacts(listId);
  const removeContact = useRemoveContactFromList();

  return (
    <div className="space-y-6 h-full flex flex-col max-w-6xl mx-auto w-full pb-10">
      <div>
        <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-muted-foreground" asChild>
          <Link to="/lists">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-1" />
            Back to Lists
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isListLoading ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              <h1 className="text-3xl font-bold tracking-tight">{list?.name}</h1>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <HugeiconsIcon icon={Settings01Icon} size={16} className="mr-2" />
              Settings
            </Button>
            <Button>
              <HugeiconsIcon icon={PlusSignIcon} size={16} className="mr-2" />
              Add Contacts
            </Button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-b border-border/60 hover:bg-transparent">
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Added On</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isContactsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))
            ) : contacts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                  No contacts in this list yet.
                </TableCell>
              </TableRow>
            ) : (
              contacts?.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.email}</TableCell>
                  <TableCell>
                    {[contact.firstName, contact.lastName].filter(Boolean).join(" ") || "—"}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[contact.status]}`}>
                      {contact.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(contact.addedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeContact.mutate({ listId, contactId: contact.id })}
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
