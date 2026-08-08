package com.example.emailcampaign.template.service;

import com.example.emailcampaign.common.exception.ApiException;
import com.example.emailcampaign.template.dto.TemplatePreviewResponse;
import freemarker.cache.StringTemplateLoader;
import freemarker.template.Configuration;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.util.Map;
import java.util.function.Function;

@Service
public class TemplateRenderer {

    /**
     * Renders Freemarker variables for the preview endpoint (no link rewriting).
     */
    public TemplatePreviewResponse renderPreview(String htmlContent, String textContent, Map<String, String> variables) {
        String renderedHtml = renderFreemarker(htmlContent, variables);
        String renderedText = textContent != null ? renderFreemarker(textContent, variables) : null;
        return new TemplatePreviewResponse(renderedHtml, renderedText);
    }

    /**
     * Full render for the sending pipeline: Freemarker → Jsoup link rewrite → open pixel inject.
     *
     * @param linkTransformer  maps an original href to its tracking redirect URL (provided by Day-7 TrackingTokenService)
     * @param openPixelUrl     the 1×1 pixel URL to inject before </body> (provided by Day-7 TrackingTokenService)
     */
    public String renderForSend(String htmlContent, Map<String, String> variables,
                                Function<String, String> linkTransformer, String openPixelUrl) {
        String rendered = renderFreemarker(htmlContent, variables);
        return rewriteAndInject(rendered, linkTransformer, openPixelUrl);
    }

    private String rewriteAndInject(String html, Function<String, String> linkTransformer, String openPixelUrl) {
        Document doc = Jsoup.parse(html);

        for (Element link : doc.select("a[href]")) {
            String href = link.attr("href");
            if (!href.isBlank() && !href.startsWith("#") && !href.startsWith("mailto:")) {
                link.attr("href", linkTransformer.apply(href));
            }
        }

        if (openPixelUrl != null) {
            doc.body().append(
                "<img src=\"" + openPixelUrl + "\" width=\"1\" height=\"1\" alt=\"\" style=\"display:none;\">"
            );
        }

        return doc.outputSettings(new Document.OutputSettings().prettyPrint(false)).html();
    }

    private String renderFreemarker(String content, Map<String, String> variables) {
        try {
            StringTemplateLoader loader = new StringTemplateLoader();
            loader.putTemplate("tpl", content);

            Configuration cfg = new Configuration(Configuration.VERSION_2_3_33);
            cfg.setTemplateLoader(loader);
            cfg.setDefaultEncoding("UTF-8");
            cfg.setLogTemplateExceptions(false);

            StringWriter out = new StringWriter();
            cfg.getTemplate("tpl").process(variables, out);
            return out.toString();
        } catch (Exception e) {
            throw ApiException.badRequest("TEMPLATE_RENDER_ERROR", "Template rendering failed: " + e.getMessage());
        }
    }
}
