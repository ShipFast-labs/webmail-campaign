import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
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

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ImportModal({ open, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const importMutation = useImportContacts();
  const { data: progress } = useImportProgress(jobId);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    disabled: !!jobId,
  });

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
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50",
              )}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB — click or drop to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Drop a CSV file here</p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse — columns: email, first_name, last_name, tags
                  </p>
                </div>
              )}
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
