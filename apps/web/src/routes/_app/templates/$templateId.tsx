import { createFileRoute, Link } from "@tanstack/react-router";
import { useTemplate, useUpdateTemplate } from "@/hooks/use-templates";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, CodeIcon, ViewIcon, FloppyDiskIcon, CheckmarkCircle01Icon, UserIcon, Megaphone01Icon, News01Icon } from "@hugeicons/core-free-icons";
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

const PRESETS = [
  {
    label: "Welcome",
    icon: UserIcon,
    subject: "Welcome to the family, {{firstName}}!",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="background:#1a3300;padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#ffe95c;font-size:26px;font-weight:700;">NamiSend</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 12px;color:#1a1a1a;font-size:22px;">Hey {{firstName}} 👋</h2>
          <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.7;">Welcome aboard! We're so glad you're here. Your account is ready and waiting.</p>
          <p style="margin:0 0 28px;color:#555;font-size:15px;line-height:1.7;">Click below to get started:</p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="border-radius:8px;background:#1a3300;">
              <a href="https://namisend.com" style="display:inline-block;padding:14px 32px;color:#ffe95c;font-size:15px;font-weight:600;text-decoration:none;">Get Started →</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #eee;text-align:center;">
          <p style="margin:0;color:#999;font-size:12px;">You're receiving this because you signed up at NamiSend.<br/>
          <a href="https://namisend.com" style="color:#999;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  },
  {
    label: "Announcement",
    icon: Megaphone01Icon,
    subject: "Big news for you, {{firstName}}",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="background:#ffe95c;padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#1a3300;font-size:26px;font-weight:700;">NamiSend</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 8px;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Announcement</p>
          <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:24px;line-height:1.3;">We just launched something big 🚀</h2>
          <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.7;">Hi {{firstName}}, we've been working hard behind the scenes and we're excited to share what's new with you.</p>
          <p style="margin:0 0 28px;color:#555;font-size:15px;line-height:1.7;">This update includes improvements you've been asking for. We can't wait for you to try it out.</p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="border-radius:8px;background:#1a3300;">
              <a href="https://namisend.com" style="display:inline-block;padding:14px 32px;color:#ffe95c;font-size:15px;font-weight:600;text-decoration:none;">See What's New →</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #eee;text-align:center;">
          <p style="margin:0;color:#999;font-size:12px;">You're receiving this because you're subscribed to our updates.<br/>
          <a href="https://namisend.com" style="color:#999;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  },
  {
    label: "Newsletter",
    icon: News01Icon,
    subject: "Your monthly update, {{firstName}}",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="background:#1a3300;padding:32px 40px;">
          <h1 style="margin:0;color:#ffe95c;font-size:26px;font-weight:700;">NamiSend</h1>
          <p style="margin:8px 0 0;color:#a8e5e5;font-size:13px;">Monthly Newsletter</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.7;">Hi {{firstName}}, here's your monthly roundup of what's been happening.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="background:#f9f9f9;border-left:4px solid #ffe95c;border-radius:4px;padding:20px;">
              <h3 style="margin:0 0 8px;color:#1a1a1a;font-size:16px;">📈 This Month's Highlights</h3>
              <p style="margin:0;color:#555;font-size:14px;line-height:1.6;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr><td style="background:#f9f9f9;border-left:4px solid #a8e5e5;border-radius:4px;padding:20px;">
              <h3 style="margin:0 0 8px;color:#1a1a1a;font-size:16px;">🔧 What's Coming Next</h3>
              <p style="margin:0;color:#555;font-size:14px;line-height:1.6;">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </td></tr>
          </table>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="border-radius:8px;background:#1a3300;">
              <a href="https://namisend.com" style="display:inline-block;padding:14px 32px;color:#ffe95c;font-size:15px;font-weight:600;text-decoration:none;">Read More →</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f9f9f9;padding:24px 40px;border-top:1px solid #eee;text-align:center;">
          <p style="margin:0;color:#999;font-size:12px;">You're receiving this monthly newsletter from NamiSend.<br/>
          <a href="https://namisend.com" style="color:#999;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  },
];

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

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setHtmlContent(preset.html);
    setPreviewHtml(preset.html);
    if (!subject) setSubject(preset.subject);
  };

  const isDirty = template && (
    name !== template.name ||
    subject !== template.subject ||
    htmlContent !== template.htmlContent
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
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

      {/* Starter presets */}
      {!htmlContent && (
        <div className="rounded-xl border bg-card p-6 text-center space-y-4">
          <div>
            <p className="font-medium text-sm text-foreground">Start from a template</p>
            <p className="text-xs text-muted-foreground mt-1">Pick a preset to get started quickly, or write your own HTML below.</p>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
                className="gap-2"
              >
                <HugeiconsIcon icon={preset.icon} size={14} />
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Editor + Preview */}
      <div className="rounded-xl border overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left — Code editor */}
          <ResizablePanel defaultSize={50} minSize={25} className="flex flex-col min-h-0">
            <div className="h-9 bg-[#282c34] border-b border-[#3e4451] flex items-center justify-between px-4 shrink-0">
              <span className="flex items-center gap-1.5 text-xs text-[#abb2bf] font-medium">
                <HugeiconsIcon icon={CodeIcon} size={13} />
                HTML
              </span>
              {htmlContent && (
                <div className="flex gap-1">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => applyPreset(preset)}
                      className="flex items-center gap-1 text-[10px] text-[#636d83] hover:text-[#abb2bf] px-2 py-0.5 rounded hover:bg-[#3e4451] transition-colors"
                    >
                      <HugeiconsIcon icon={preset.icon} size={11} />
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}
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
                  srcDoc={previewHtml || "<div style='height:400px'></div>"}
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
