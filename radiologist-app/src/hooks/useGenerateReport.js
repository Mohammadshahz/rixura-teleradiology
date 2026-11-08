// Updated: useGenerateReport.js
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TemplateService } from "../services/Templates.service";
import { ReportService } from "../services/Reports.service";
import { toast } from "react-toastify";

/**
 * Hook for managing report template data and report submission
 */
const useGenerateReport = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const radiologistId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!radiologistId) return;

    setLoading(true);
    TemplateService.getTemplatesByRadiologist(radiologistId)
      .then((data) => {
        setTemplates(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Template loading error:", err);
        toast.error("Unable to load templates.");
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [radiologistId]);

  const templateTitles = templates.map((t) => t.title);

  const getDescriptionByTitle = (title) => {
    const found = templates.find((t) => t.title === title);
    return found?.description || "";
  };

  const applyTemplateToReport = async (reportId, content, templateId, title) => {
    if (!content || !radiologistId) {
      toast.error("Missing content or user information.");
      return;
    }

    try {
      await ReportService.generateReportContent(reportId, radiologistId, {
        reportGeneratedContent: content,
        templateId,
      });

      if (title) {
        await ReportService.updateReportTitle(reportId, title);
      }
    } catch (err) {
      console.error("Failed to apply report content:", err);
      toast.error("Report generation failed.");
      throw err;
    }
  };

  const saveAsNewTemplate = async (description, title) => {
    if (!description || !title || !radiologistId) {
      toast.error("Template data missing.");
      return;
    }

    const payload = {
      title,
      description,
      radiologistId,
      type: "CUSTOM",
    };

    try {
      await TemplateService.addTemplate(payload);
      toast.success("Template saved.");

      // Optionally refresh the list
      const updated = await TemplateService.getTemplatesByRadiologist(radiologistId);
      setTemplates(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error("Template save failed:", err);
      toast.error("Unable to save template.");
    }
  };

  return {
    templates,
    templateTitles,
    getDescriptionByTitle,
    applyTemplateToReport,
    saveAsNewTemplate,
    loading,
    error,
  };
};

export default useGenerateReport;
