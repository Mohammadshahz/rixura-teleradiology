import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader, PageNav, ContactCard } from "../../LegalPage";

const faqs = [
  {
    question: "What is Rixura and what services do you offer?",
    answer:
      "Rixura is a leading teleradiology platform connecting healthcare providers with certified radiologists 24/7. We provide X-ray, CT, MRI interpretations, and emergency support.",
  },
  {
    question: "Are your services available 24/7?",
    answer:
      "Yes, we operate 24/7, 365 days a year. Emergency cases are prioritized and handled immediately by our dedicated radiologists.",
  },
  {
    question: "How do I request a radiology report?",
    answer:
      "Upload your images and patient details through our secure portal or integrated PACS. Our team begins processing your case instantly.",
  },
  {
    question: "What is the average turnaround time?",
    answer:
      "Emergency cases are reported in under 10 minutes and routine studies in under 20 minutes, with an average turnaround of about 20 minutes.",
  },
  {
    question: "Do you support international clients?",
    answer:
      "Yes, we serve healthcare centers globally. Time zones and regional compliance are considered in all our operations.",
  },
  {
    question: "Can I schedule a demo of your platform?",
    answer:
      "Absolutely! You can request a personalized 15-minute demo using our contact form or via the ‘Schedule Demo’ button on our site.",
  },
  {
    question: "How secure is patient data with Rixura?",
    answer:
      "We adhere to international standards for data protection, including HIPAA and GDPR. All data is encrypted in transit and at rest.",
  },
  {
    question: "Is there a minimum contract period?",
    answer:
      "No, we offer flexible service options including per-report billing, monthly subscriptions, and enterprise partnerships.",
  },
  {
    question: "What imaging modalities do you support?",
    answer:
      "We support X-ray, CT, MRI, and Ultrasound. Other modalities can be discussed based on the center’s needs.",
  },
  {
    question: "What happens if there's a delay in reporting?",
    answer:
      "If a delay occurs without prior communication or valid reason, and it affects patient care, you may be eligible for a refund based on our Refund Policy.",
  },
];

// FAQPage structured data so Google can show these questions in search results.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <PageHeader
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Rixura's teleradiology services."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
        <PageNav />

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`rounded-2xl bg-white ring-1 transition ${
                  isOpen ? "ring-blue-300 shadow-md shadow-blue-900/5" : "ring-slate-200 hover:ring-slate-300"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${index}`}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 rounded-2xl"
                >
                  <h2 className={`text-base sm:text-lg font-semibold ${isOpen ? "text-blue-700" : "text-slate-900"}`}>
                    {faq.question}
                  </h2>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                      isOpen ? "bg-blue-600 text-white rotate-180" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                {isOpen && (
                  <p id={`faq-${index}`} className="px-5 sm:px-6 pb-6 -mt-1 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <ContactCard heading="Still have questions?" />
      </div>
    </>
  );
};

export default FAQs;
