import { Phone, Mail, Clock, MapPin, Send, MessageSquare, Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { useSubmitForm } from "../hooks/useSubmitForm";
import { useEffect, useState } from "react";
import { onContactIntent, takePendingUserType } from "../utils/contactIntent";
import Modal from "./Modal";
import contactBg from "../assets/contactus.jpg";

const validationSchema = Yup.object({
  name: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  countryCode: Yup.string().required("Country code is required"),
  userType: Yup.string().required("Please select a user type"),
});

const initialValues = {
  name: "",
  email: "",
  phone: "",
  countryCode: "+91",
  message: "",
  userType: "",
};

const countryCodes = [
  ["+91", "🇮🇳"], ["+1", "🇺🇸"], ["+44", "🇬🇧"], ["+61", "🇦🇺"], ["+971", "🇦🇪"],
  ["+81", "🇯🇵"], ["+86", "🇨🇳"], ["+49", "🇩🇪"], ["+33", "🇫🇷"], ["+880", "🇧🇩"],
  ["+94", "🇱🇰"], ["+20", "🇪🇬"], ["+7", "🇷🇺"], ["+55", "🇧🇷"], ["+27", "🇿🇦"],
  ["+34", "🇪🇸"], ["+39", "🇮🇹"], ["+62", "🇮🇩"], ["+65", "🇸🇬"],
];

const fieldBase =
  "px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15";
const inputClass = `w-full ${fieldBase}`;
const labelClass = "block text-sm font-semibold text-slate-700 mb-2";
const errorClass = "text-sm text-red-500 mt-1.5";

// Applies a user type chosen via the navbar's Center / Radiologist buttons.
const UserTypePreselect = () => {
  const { setFieldValue } = useFormikContext<typeof initialValues>();

  useEffect(() => {
    const pending = takePendingUserType();
    if (pending) setFieldValue("userType", pending);
    return onContactIntent((userType) => setFieldValue("userType", userType));
  }, [setFieldValue]);

  return null;
};

interface ContactFormProps {
  requestType: "QUERY" | "DEMO";
  onSuccess?: () => void;
}

const ContactForm = ({ requestType, onSuccess }: ContactFormProps) => {
  const { submitContact, loading } = useSubmitForm();

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm, setSubmitting }: import("formik").FormikHelpers<typeof initialValues>
  ) => {
    setSubmitting(true);
    const combinedPhone = `${values.countryCode}${values.phone}`;
    const result = await submitContact({
      ...values,
      phone: combinedPhone,
      requestType,
    });

    if (result) {
      resetForm();
      onSuccess?.();
    }

    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-5">
        {requestType === "QUERY" && <UserTypePreselect />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor={`${requestType}-name`} className={labelClass}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <Field
              id={`${requestType}-name`}
              name="name"
              type="text"
              className={inputClass}
              placeholder="Dr. John Smith"
            />
            <ErrorMessage name="name" component="div" className={errorClass} />
          </div>

          <div>
            <label htmlFor={`${requestType}-email`} className={labelClass}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <Field
              id={`${requestType}-email`}
              name="email"
              type="email"
              className={inputClass}
              placeholder="john.smith@hospital.com"
            />
            <ErrorMessage name="email" component="div" className={errorClass} />
          </div>
        </div>

        <div>
          <label htmlFor={`${requestType}-phone`} className={labelClass}>
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <Field
              as="select"
              name="countryCode"
              aria-label="Country code"
              className={`${fieldBase} w-28 sm:w-32 shrink-0 cursor-pointer px-3`}
            >
              {countryCodes.map(([code, flag]) => (
                <option key={code} value={code}>
                  {flag} {code}
                </option>
              ))}
            </Field>
            <Field
              id={`${requestType}-phone`}
              name="phone"
              type="tel"
              inputMode="numeric"
              className={`${fieldBase} flex-1 min-w-0`}
              placeholder="10-digit number"
            />
          </div>
          <ErrorMessage name="phone" component="div" className={errorClass} />
        </div>

        <fieldset>
          <legend className={labelClass}>
            I am a <span className="text-red-500">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {["Center", "Radiologist"].map((type) => (
              <label key={type} className="cursor-pointer">
                <Field type="radio" name="userType" value={type} className="peer sr-only" />
                <span className="flex h-full items-center justify-center text-center text-sm sm:text-base px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium transition peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:ring-4 peer-checked:ring-blue-500/15 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-500/30 hover:border-slate-300">
                  {type === "Center" ? "Diagnostic Center" : "Radiologist"}
                </span>
              </label>
            ))}
          </div>
          <ErrorMessage name="userType" component="div" className={errorClass} />
        </fieldset>

        <div>
          <label htmlFor={`${requestType}-message`} className={labelClass}>
            Message
          </label>
          <Field
            id={`${requestType}-message`}
            name="message"
            as="textarea"
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Tell us about your teleradiology needs..."
          />
          <ErrorMessage name="message" component="div" className={errorClass} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:shadow-blue-700/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>{requestType === "DEMO" ? "Request Demo" : "Send Message"}</span>
            </>
          )}
        </button>
      </Form>
    </Formik>
  );
};

const contactItems = [
  {
    icon: Phone,
    title: "24/7 Emergency Line",
    lines: ["+91 82377 67664"],
    href: "tel:+918237767664",
  },
  {
    icon: FaWhatsapp,
    title: "WhatsApp",
    lines: ["Chat with our team"],
    href: "https://wa.me/918237767664",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["rixuraai@gmail.com"],
    href: "mailto:rixuraai@gmail.com",
  },
  {
    icon: Clock,
    title: "Business Hours",
    lines: ["Mon – Sun: 9:00 AM – 12:00 AM IST", "Emergency support: 24/7, 365 days"],
  },
  {
    icon: MapPin,
    title: "Coverage",
    lines: ["Nationwide coverage across India"],
  },
];

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="contact" className="relative isolate overflow-hidden bg-slate-950 py-20 md:py-28">
      {/* Background image with dark overlay for readable text */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img src={contactBg} alt="" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-blue-950/90" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300">
            Contact Us
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Get Started <span className="text-blue-400">Today</span>
          </h2>
          <p className="mt-5 text-lg text-slate-300 leading-relaxed">
            Ready to enhance your diagnostic capabilities? Contact us for a
            personalized demo or to discuss how our teleradiology services can
            benefit your practice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          {/* Left: contact info + demo */}
          <div className="lg:col-span-2 space-y-4">
            {contactItems.map(({ icon: Icon, title, lines, href }) => {
              const content = (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300 ring-1 ring-inset ring-blue-400/20 transition group-hover:bg-blue-500 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-white">{title}</span>
                    {lines.map((line) => (
                      <span key={line} className="block text-sm text-slate-400 break-words">
                        {line}
                      </span>
                    ))}
                  </span>
                </>
              );
              const cardClass =
                "group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition";
              return href ? (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`${cardClass} hover:border-blue-400/40 hover:bg-white/10`}
                >
                  {content}
                </a>
              ) : (
                <div key={title} className={cardClass}>
                  {content}
                </div>
              );
            })}

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 shadow-xl shadow-blue-900/40">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" aria-hidden="true" />
              <h3 className="relative text-lg font-bold text-white">Quick Demo Request</h3>
              <p className="relative mt-2 text-sm text-blue-100 leading-relaxed">
                See our platform in action with a personalized 15-minute demo
                tailored to your facility's needs.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 shadow-md transition hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Schedule Demo</span>
              </button>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3 rounded-3xl bg-white p-6 sm:p-10 shadow-2xl shadow-black/40">
            <h3 className="text-2xl font-bold text-slate-900">Send Us a Message</h3>
            <p className="mt-2 mb-8 text-slate-500">
              Fill in the form and our team will get back to you shortly.
            </p>
            <ContactForm requestType="QUERY" />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Schedule a Demo</h2>
        <p className="text-slate-500 mb-6">A 15-minute walkthrough tailored to your facility.</p>
        <ContactForm requestType="DEMO" onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </section>
  );
};

export default Contact;
