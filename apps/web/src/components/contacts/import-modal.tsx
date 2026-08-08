import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { contactKeys } from "@/hooks/use-contacts";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useImportContacts, useImportProgress } from "@/hooks/use-contacts";
import { cn } from "@/lib/utils";
import { FileUploadStruc } from "@/components/shadcn-space/radix/file-upload/file-upload-01";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ImportModal({ open, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const importMutation = useImportContacts();
  const { data: progress } = useImportProgress(jobId);
  const qc = useQueryClient();

  useEffect(() => {
    if (progress?.status === "COMPLETED") {
      qc.invalidateQueries({ queryKey: contactKeys.all });
    }
  }, [progress?.status, qc]);

  const handleImport = async () => {
    if (!file) return;
    const res = await importMutation.mutateAsync(file);
    setJobId(res.importJobId);
  };

  const handleClose = () => {
    setFile(null);
    setJobId(null);
    importMutation.reset();
    onClose();
  };

  const isDone = progress?.status === "COMPLETED" || progress?.status === "FAILED";
  const percent = progress && progress.totalRows > 0
    ? Math.round((progress.processedRows / progress.totalRows) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Drop zone */}
          {!jobId && (
            <div className="w-full py-4">
              <FileUploadStruc 
                accept=".csv"
                acceptDropzone={{ "text/csv": [".csv"] }}
                onChange={(files) => {
                  if (files.length > 0) setFile(files[0]);
                }} 
              />
            </div>
          )}

          {/* Progress */}
          {jobId && progress && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium capitalize">{progress.status.toLowerCase().replace("_", " ")}</span>
                <span className="text-muted-foreground">
                  {progress.processedRows} / {progress.totalRows} rows
                </span>
              </div>
              <Progress value={percent} className="h-2" />
              {isDone && (
                <div className="text-sm space-y-0.5">
                  <p className="text-green-600 dark:text-green-400">
                    ✓ {progress.successCount} contacts imported
                  </p>
                  {progress.errorCount > 0 && (
                    <p className="text-destructive">✗ {progress.errorCount} rows failed</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Waiting for first progress data */}
          {jobId && !progress && (
            <p className="text-sm text-muted-foreground text-center">Starting import…</p>
          )}

          <div className="flex justify-end gap-2">
            {isDone ? (
              <Button onClick={handleClose}>Done</Button>
            ) : jobId ? (
              <Button variant="outline" onClick={handleClose}>Close</Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button
                  onClick={handleImport}
                  disabled={!file || importMutation.isPending}
                >
                  {importMutation.isPending ? "Uploading…" : "Import"}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
