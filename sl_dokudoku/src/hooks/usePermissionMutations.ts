import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { DocumentPermission, PermissionLevel } from '@prisma/client'; // Import generated types

// --- Add/Update Permission ---
interface UpsertPermissionVariables {
  documentId: string;
  targetUserId: string;
  level: PermissionLevel;
}

async function upsertPermission(variables: UpsertPermissionVariables): Promise<DocumentPermission> {
  const response = await fetch('/api/share', { // Uses the POST route
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || `Failed to set permission: ${response.statusText}`);
  }
  return response.json();
}

export function useUpsertPermission() {
  const queryClient = useQueryClient();
  return useMutation<DocumentPermission, Error, UpsertPermissionVariables>({
    mutationFn: upsertPermission,
    onSuccess: (newPermission, variables) => {
      toast({ title: 'Success', description: `Permission set for user.` });
      // Invalidate the permissions query for this specific document
      queryClient.invalidateQueries({ queryKey: ['permissions', variables.documentId] }); 
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    },
  });
}

// --- Remove Permission ---
async function removePermission(permissionId: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`/api/share?permissionId=${permissionId}`, { // Uses the DELETE route with query param
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.details || `Failed to remove permission: ${response.statusText}`);
  }
  return response.json();
}

export function useRemovePermission() {
  const queryClient = useQueryClient();
  // We need the documentId to invalidate the correct query, 
  // but the mutationFn only takes permissionId. We can pass documentId via context or onSuccess.
  return useMutation<{ success: boolean; message: string }, Error, { permissionId: string, documentId: string }>({
    mutationFn: ({ permissionId }) => removePermission(permissionId), // Only pass permissionId to the API call
    onSuccess: (data, variables) => {
      toast({ title: 'Success', description: data.message || `Permission removed successfully.` });
      // Invalidate the permissions query for the specific document
      queryClient.invalidateQueries({ queryKey: ['permissions', variables.documentId] }); 
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    },
  });
}
