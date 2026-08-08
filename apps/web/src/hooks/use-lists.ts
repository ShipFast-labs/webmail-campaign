import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listApi } from "@/api/lists";
import { toast } from "sonner";

export function useLists() {
  return useQuery({
    queryKey: ["lists"],
    queryFn: () => listApi.getLists(),
  });
}

export function useList(id: string) {
  return useQuery({
    queryKey: ["lists", id],
    queryFn: () => listApi.getList(id),
    enabled: !!id,
  });
}

export function useListContacts(id: string) {
  return useQuery({
    queryKey: ["lists", id, "contacts"],
    queryFn: () => listApi.getListContacts(id),
    enabled: !!id,
  });
}

export function useCreateList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => listApi.createList(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lists"] });
      toast.success("List created");
    },
    onError: () => toast.error("Failed to create list"),
  });
}

export function useUpdateList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => listApi.updateList(id, name),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["lists"] });
      qc.invalidateQueries({ queryKey: ["lists", id] });
      toast.success("List updated");
    },
    onError: () => toast.error("Failed to update list"),
  });
}

export function useDeleteList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => listApi.deleteList(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lists"] });
      toast.success("List deleted");
    },
    onError: () => toast.error("Failed to delete list"),
  });
}

export function useAddContactsToList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, contactIds }: { listId: string; contactIds: string[] }) =>
      listApi.addContactsToList(listId, contactIds),
    onSuccess: (_, { listId }) => {
      qc.invalidateQueries({ queryKey: ["lists"] });
      qc.invalidateQueries({ queryKey: ["lists", listId] });
      toast.success("Contacts added to list");
    },
    onError: () => toast.error("Failed to add contacts"),
  });
}

export function useRemoveContactFromList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, contactId }: { listId: string; contactId: string }) =>
      listApi.removeContactFromList(listId, contactId),
    onSuccess: (_, { listId }) => {
      qc.invalidateQueries({ queryKey: ["lists"] });
      qc.invalidateQueries({ queryKey: ["lists", listId] });
      toast.success("Contact removed");
    },
    onError: () => toast.error("Failed to remove contact"),
  });
}
