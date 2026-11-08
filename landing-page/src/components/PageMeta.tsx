import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://rixura.pages.dev";

const pages: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Rixura | Fast, Reliable Teleradiology Services",
    description:
      "Rixura provides fast, reliable 24/7 teleradiology services. Board-certified radiologists read X-ray, CT and MRI studies with emergency reports in under 10 minutes.",
  },
  "/about": {
    title: "About Us | Rixura Teleradiology",
    description:
      "Learn about Rixura's mission and our team of board-certified radiologists delivering accurate, timely diagnoses to healthcare providers.",
  },
  "/faqs": {
    title: "FAQs | Rixura Teleradiology",
    description:
      "Answers to common questions about Rixura teleradiology: turnaround times, supported modalities, security and getting started.",
  },
  "/privacy": {
    title: "Privacy Policy | Rixura",
    description: "How Rixura collects, uses and protects your data.",
  },
  "/tos": {
    title: "Terms & Conditions | Rixura",
    description: "Terms and conditions for using Rixura's website and teleradiology services.",
  },
  "/refund": {
    title: "Refund Policy | Rixura",
    description: "Rixura's refund policy for teleradiology services.",
  },
};

const PageMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = pages[pathname] ?? pages["/"];
    document.title = meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", SITE_URL + (pathname === "/" ? "/" : pathname));
  }, [pathname]);

  return null;
};

export default PageMeta;
