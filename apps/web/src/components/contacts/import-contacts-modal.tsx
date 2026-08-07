import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useImportContacts, useImportProgress } from "@/hooks/use-contacts";
import { FileUploadStruc } from "@/components/shadcn-space/radix/file-upload/file-upload-01";

interface ImportContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportContactsModal({ open, onOpenChange }: ImportContactsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const importMutation = useImportContacts();
  const { data: progress } = useImportProgress(jobId);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setFile(null);
        setJobId(null);
      }, 300); // Wait for exit animation
    }
  }, [open]);

  // If completed, optionally auto-close after a delay
  useEffect(() => {
    if (progress?.status === "COMPLETED") {
      const t = setTimeout(() => {
        onOpenChange(false);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [progress?.status, onOpenChange]);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleImport = () => {
    if (!file) return;
    importMutation.mutate(file, {
      onSuccess: (data) => {
        setJobId(data.importJobId);
      },
    });
  };

  const isUploading = importMutation.isPending || (jobId != null && progress?.status !== "COMPLETED" && progress?.status !== "FAILED");
  const percent = progress?.totalRows ? Math.round((progress.processedRows / progress.totalRows) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isUploading && onOpenChange(isOpen)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import contacts in bulk. The file should contain an 'email' column.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {!jobId ? (
            <div className="w-full mx-auto min-h-64 border border-dashed bg-background border-muted rounded-xl flex flex-col items-center justify-center p-4">
              <FileUploadStruc onChange={handleFileChange} />
            </div>
          ) : (
            <div className="space-y-4 py-8">
              <h4 className="text-sm font-medium text-center">
                {progress?.status === "COMPLETED" ? "Import Complete!" : "Importing Contacts..."}
              </h4>
              <Progress value={percent} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progress?.processedRows || 0} / {progress?.totalRows || 0} processed</span>
                <span>{percent}%</span>
              </div>
              {progress?.status === "COMPLETED" && (
                <div className="text-center text-sm mt-4 text-green-600 dark:text-green-500">
                  Successfully imported {progress.successCount} contacts.
                  {progress.errorCount > 0 && ` Failed to import ${progress.errorCount} contacts.`}
                </div>
              )}
            </div>
          )}
        </div>

        {!jobId && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file || importMutation.isPending}>
              {importMutation.isPending ? "Starting..." : "Import CSV"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
