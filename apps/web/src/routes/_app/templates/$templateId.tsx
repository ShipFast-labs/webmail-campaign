import { createFileRoute, Link } from "@tanstack/react-router";
import { useTemplate, useUpdateTemplate } from "@/hooks/use-templates";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, CodeIcon, ViewIcon, FloppyDiskIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export const Route = createFileRoute("/_app/templates/$templateId")({
  component: TemplateEditorPage,
});

function TemplateEditorPage() {
  const { templateId } = Route.useParams();
  const { data: template, isLoading } = useTemplate(templateId);
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0 text-muted-foreground">
          <Link to="/templates">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Link>
        </Button>

        {isLoading ? (
          <Skeleton className="h-7 w-40" />
        ) : (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 w-44 font-semibold bg-transparent border-transparent hover:border-input focus-visible:border-input px-2"
          />
        )}

        <div className="h-5 w-px bg-border" />

        <span className="text-xs text-muted-foreground whitespace-nowrap">Subject</span>
        {isLoading ? (
          <Skeleton className="h-7 w-64" />
        ) : (
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Hello {{firstName}}, here's your update"
            className="h-8 max-w-xs text-sm"
          />
        )}

        <div className="ml-auto flex items-center gap-2">
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
      <div className="rounded-xl border overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left — Code editor */}
          <ResizablePanel defaultSize={50} minSize={25} className="flex flex-col min-h-0">
            <div className="h-9 bg-[#282c34] border-b border-[#3e4451] flex items-center px-4 shrink-0">
              <span className="flex items-center gap-1.5 text-xs text-[#abb2bf] font-medium">
                <HugeiconsIcon icon={CodeIcon} size={13} />
                HTML
              </span>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <CodeMirror
                value={htmlContent}
                height="100%"
                theme={oneDark}
                extensions={[html()]}
                onChange={(val) => setHtmlContent(val)}
                style={{ height: "100%" }}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: false,
                  highlightActiveLine: true,
                  autocompletion: true,
                }}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right — Preview */}
          <ResizablePanel defaultSize={50} minSize={25} className="flex flex-col bg-muted/40">
            <div className="h-9 border-b flex items-center px-4 shrink-0 bg-card">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <HugeiconsIcon icon={ViewIcon} size={13} />
                Preview
              </span>
            </div>
            <div className="flex-1 overflow-auto p-6 flex justify-center">
              <div className="bg-white w-full max-w-[600px] shadow-md rounded-lg border overflow-hidden min-h-[400px] flex flex-col">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full flex-1 border-0 min-h-[400px]"
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
