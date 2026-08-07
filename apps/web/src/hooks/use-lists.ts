import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listApi } from "@/api/lists";
import { toast } from "sonner";

export function useLists() {
  return useQuery({
    queryKey: ["lists"],
    queryFn: () => listApi.getLists().then(res => res.data),
  });
}

export function useList(id: string) {
  return useQuery({
    queryKey: ["lists", id],
    queryFn: () => listApi.getList(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useListContacts(id: string) {
  return useQuery({
    queryKey: ["lists", id, "contacts"],
    queryFn: () => listApi.getListContacts(id).then(res => res.data),
    enabled: !!id,
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => listApi.createList(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("List created successfully");
    },
    onError: () => toast.error("Failed to create list"),
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => listApi.updateList(id, name),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["lists", id] });
      toast.success("List updated successfully");
    },
    onError: () => toast.error("Failed to update list"),
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => listApi.deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("List deleted successfully");
    },
    onError: () => toast.error("Failed to delete list"),
  });
}

export function useAddContactsToList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, contactIds }: { listId: string; contactIds: string[] }) => listApi.addContactsToList(listId, contactIds),
    onSuccess: (_, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["lists", listId] });
      toast.success("Contacts added to list");
    },
    onError: () => toast.error("Failed to add contacts to list"),
  });
}

export function useRemoveContactFromList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, contactId }: { listId: string; contactId: string }) => listApi.removeContactFromList(listId, contactId),
    onSuccess: (_, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["lists", listId] });
      toast.success("Contact removed from list");
    },
    onError: () => toast.error("Failed to remove contact"),
  });
}
