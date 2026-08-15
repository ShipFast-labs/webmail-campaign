import { createFileRoute, Link } from "@tanstack/react-router";
import { useTemplate, useUpdateTemplate } from "@/hooks/use-templates";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, CodeIcon, ViewIcon, FloppyDiskIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Editor from "@monaco-editor/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/templates/$templateId")({
  component: TemplateEditorPage,
});

function TemplateEditorPage() {
  const { templateId } = Route.useParams();
  const { data: template, isLoading } = useTemplate(templateId);
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const updateTemplate = useUpdateTemplate();

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    if (template) {
      setName(template.name);
      setSubject(template.subject);
      setHtmlContent(template.htmlContent);
      setPreviewHtml(template.htmlContent);
    }
  }, [template]);

  useEffect(() => {
    const handler = setTimeout(() => setPreviewHtml(htmlContent), 600);
    return () => clearTimeout(handler);
  }, [htmlContent]);

  const handleSave = () => {
    updateTemplate.mutate({ id: templateId, data: { name, subject, htmlContent } });
  };

  const isDirty = template && (
    name !== template.name ||
    subject !== template.subject ||
    htmlContent !== template.htmlContent
  );

  return (
    <div className={cn(
      "fixed top-14 right-0 bottom-0 z-30 flex flex-col bg-background overflow-hidden",
      sidebarCollapsed ? "left-[60px]" : "left-60",
      "max-md:left-0"
    )}>
      {/* Topbar */}
      <div className="h-14 border-b flex items-center gap-3 px-4 bg-card shrink-0">
        <Button variant="ghost" size="icon" asChild className="shrink-0 text-muted-foreground">
          <Link to="/templates">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Link>
        </Button>

        <div className="h-5 w-px bg-border" />

        {isLoading ? (
          <Skeleton className="h-6 w-36" />
        ) : (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 w-44 border-transparent hover:border-input focus-visible:border-input bg-transparent px-2 font-medium"
          />
        )}

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Subject</span>
          {isLoading ? (
            <Skeleton className="h-7 w-64" />
          ) : (
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Hello {{firstName}}, here's your update"
              className="h-8 max-w-sm text-sm"
            />
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {updateTemplate.isSuccess && !isDirty && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} />
              Saved
            </span>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || updateTemplate.isPending || isLoading}
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={15} className="mr-1.5" />
            {updateTemplate.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          {/* Left — Monaco */}
          <ResizablePanel defaultSize={50} minSize={25} className="bg-[#1e1e1e] flex flex-col">
            <div className="h-9 bg-[#252526] border-b border-[#333] flex items-center px-4 shrink-0">
              <span className="flex items-center gap-1.5 text-xs text-[#858585] font-medium">
                <HugeiconsIcon icon={CodeIcon} size={13} />
                HTML
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                language="html"
                theme="vs-dark"
                value={htmlContent}
                onChange={(val) => setHtmlContent(val || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineHeight: 22,
                  wordWrap: "on",
                  padding: { top: 12 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right — Preview */}
          <ResizablePanel defaultSize={50} minSize={25} className="flex flex-col bg-muted/30">
            <div className="h-9 border-b flex items-center px-4 shrink-0 bg-card">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <HugeiconsIcon icon={ViewIcon} size={13} />
                Preview
              </span>
            </div>
            <div className="flex-1 overflow-auto p-6 flex items-start justify-center">
              <div className="bg-white w-full max-w-[600px] shadow-lg rounded border overflow-hidden min-h-[500px] flex flex-col">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full flex-1 border-0 min-h-[500px]"
                  title="Email Preview"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
