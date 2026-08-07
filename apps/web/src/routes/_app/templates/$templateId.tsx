import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useTemplate, useUpdateTemplate, usePreviewTemplate } from "@/hooks/use-templates";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, CodeIcon, ViewIcon, FloppyDiskIcon, CheckmarkCircle01Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import Editor from "@monaco-editor/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/templates/$templateId")({
  component: TemplateEditorPage,
});

function TemplateEditorPage() {
  const { templateId } = Route.useParams();
  const { data: template, isLoading } = useTemplate(templateId);
  const updateTemplate = useUpdateTemplate();
  const previewTemplate = usePreviewTemplate();

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
    const handler = setTimeout(() => {
      setPreviewHtml(htmlContent);
    }, 600);
    return () => clearTimeout(handler);
  }, [htmlContent]);

  const handleSave = () => {
    updateTemplate.mutate({
      id: templateId,
      data: { name, subject, htmlContent },
    });
  };

  const isDirty = template && (
    name !== template.name || 
    subject !== template.subject || 
    htmlContent !== template.htmlContent
  );

  return (
    <div className="flex flex-col bg-background -m-6 w-[calc(100%+48px)] h-[calc(100%+48px)] overflow-hidden">
      <div className="h-14 border-b flex items-center justify-between px-4 bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 text-muted-foreground">
            <Link to="/templates">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </Link>
          </Button>
          
          <div className="h-6 w-px bg-border mx-1" />
          
          {isLoading ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="h-8 border-transparent hover:border-input focus-visible:border-input bg-transparent px-2 -ml-2 font-medium max-w-[200px]"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          {updateTemplate.isSuccess && !isDirty && (
            <span className="text-sm text-green-600 flex items-center mr-2">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} className="mr-1" />
              Saved
            </span>
          )}
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={!isDirty || updateTemplate.isPending || isLoading}
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={16} className="mr-2" />
            {updateTemplate.isPending ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <HugeiconsIcon icon={CodeIcon} size={32} className="animate-pulse" />
              <p>Loading editor...</p>
            </div>
          </div>
        ) : (
          <ResizablePanelGroup className="h-full w-full">
            <ResizablePanel defaultSize={50} minSize={30} className="bg-[#1e1e1e] flex flex-col">
              <div className="h-10 bg-[#252526] border-b border-[#333] flex items-center px-4 shrink-0 justify-between">
                <div className="flex items-center text-xs text-[#ccc] uppercase font-semibold tracking-wider">
                  <HugeiconsIcon icon={CodeIcon} size={14} className="mr-2" />
                  HTML Editor
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <Editor
                  height="100%"
                  language="html"
                  theme="vs-dark"
                  value={htmlContent}
                  onChange={(val) => setHtmlContent(val || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    padding: { top: 16 },
                  }}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30} className="bg-muted/10 flex flex-col">
              <Tabs defaultValue="preview" className="flex flex-col h-full">
                <div className="h-10 border-b flex items-center px-2 shrink-0 bg-card justify-between">
                  <TabsList className="h-8 bg-transparent p-0">
                    <TabsTrigger value="preview" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">
                      <HugeiconsIcon icon={ViewIcon} size={14} className="mr-2" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">
                      <HugeiconsIcon icon={Settings01Icon} size={14} className="mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="preview" className="flex-1 p-0 m-0 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
                  <div className="h-full w-full flex items-center justify-center p-4 lg:p-8 overflow-auto">
                    <div className="bg-white w-full max-w-[600px] shadow-xl border rounded-md overflow-hidden min-h-[600px] flex flex-col">
                      <iframe 
                        srcDoc={previewHtml}
                        className="w-full flex-1 border-0"
                        title="Email Preview"
                        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="flex-1 p-6 m-0 overflow-auto">
                  <div className="max-w-md space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Template Settings</h3>
                      <p className="text-sm text-muted-foreground">Configure the metadata for this email template.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Default Subject Line</Label>
                        <Input 
                          id="subject" 
                          value={subject} 
                          onChange={(e) => setSubject(e.target.value)} 
                          placeholder="e.g. You won't believe this..."
                        />
                        <p className="text-xs text-muted-foreground">
                          This is used as the default subject line when creating a campaign with this template.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}
