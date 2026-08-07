import type { ApiResponse } from "./auth";

export interface Template {
  id: string;
  workspaceId: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplatePreviewRequest {
  htmlContent: string;
  variables: Record<string, string>;
}

export interface TemplatePreviewResponse {
  htmlContent: string;
}

const defaultHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f4f4f5; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; border: 1px solid #e4e4e7; border-top: none; border-radius: 0 0 8px 8px; }
    .btn { display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Welcome to our Newsletter!</h2>
    </div>
    <div class="content">
      <p>Hi \${firstName},</p>
      <p>This is a placeholder template showing how you can use variables and standard HTML in your emails.</p>
      <a href="\${ctaUrl}" class="btn">Learn More</a>
    </div>
  </div>
</body>
</html>`;

let mockTemplates: Template[] = [
  {
    id: "tpl-1",
    workspaceId: "ws-1",
    name: "Welcome Email v1",
    subject: "Welcome to our platform!",
    htmlContent: defaultHtml,
    textContent: "Hi \${firstName}, Welcome to our platform! Learn more: \${ctaUrl}",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "tpl-2",
    workspaceId: "ws-1",
    name: "Monthly Newsletter",
    subject: "Your Monthly Update",
    htmlContent: "<div><h1>Monthly Update</h1><p>Here is what happened this month...</p></div>",
    textContent: "Monthly Update. Here is what happened this month...",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  }
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const templateApi = {
  getTemplates: async (): Promise<ApiResponse<Template[]>> => {
    await delay(600);
    return { success: true, message: null, data: [...mockTemplates] };
  },

  getTemplate: async (id: string): Promise<ApiResponse<Template>> => {
    await delay(400);
    const tpl = mockTemplates.find(t => t.id === id);
    if (!tpl) throw new Error("Template not found");
    return { success: true, message: null, data: tpl };
  },

  createTemplate: async (data: Partial<Template>): Promise<ApiResponse<Template>> => {
    await delay(800);
    const newTemplate: Template = {
      id: `tpl-${Date.now()}`,
      workspaceId: "ws-1",
      name: data.name || "Untitled Template",
      subject: data.subject || "No Subject",
      htmlContent: data.htmlContent || "<div>Hello world</div>",
      textContent: data.textContent || "Hello world",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTemplates.unshift(newTemplate);
    return { success: true, message: null, data: newTemplate };
  },

  updateTemplate: async (id: string, data: Partial<Template>): Promise<ApiResponse<Template>> => {
    await delay(700);
    const tpl = mockTemplates.find(t => t.id === id);
    if (!tpl) throw new Error("Template not found");
    
    if (data.name !== undefined) tpl.name = data.name;
    if (data.subject !== undefined) tpl.subject = data.subject;
    if (data.htmlContent !== undefined) tpl.htmlContent = data.htmlContent;
    if (data.textContent !== undefined) tpl.textContent = data.textContent;
    tpl.updatedAt = new Date().toISOString();
    
    return { success: true, message: null, data: tpl };
  },

  deleteTemplate: async (id: string): Promise<ApiResponse<void>> => {
    await delay(600);
    mockTemplates = mockTemplates.filter(t => t.id !== id);
    return { success: true, message: null, data: undefined as any };
  },

  duplicateTemplate: async (id: string): Promise<ApiResponse<Template>> => {
    await delay(600);
    const tpl = mockTemplates.find(t => t.id === id);
    if (!tpl) throw new Error("Template not found");
    
    const newTemplate: Template = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      name: `${tpl.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTemplates.unshift(newTemplate);
    return { success: true, message: null, data: newTemplate };
  },

  previewTemplate: async (id: string, request: TemplatePreviewRequest): Promise<ApiResponse<TemplatePreviewResponse>> => {
    await delay(300);
    let html = request.htmlContent;
    for (const [key, value] of Object.entries(request.variables || {})) {
      html = html.replace(new RegExp(`\\\\\\$\\\\{${key}\\\\}`, 'g'), value);
    }
    return { success: true, message: null, data: { htmlContent: html } };
  }
};
