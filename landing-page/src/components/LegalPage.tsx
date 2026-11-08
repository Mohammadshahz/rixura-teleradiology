import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const legalLinks = [
  { to: "/tos", label: "Terms & Conditions" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/refund", label: "Refund Policy" },
  { to: "/faqs", label: "FAQs" },
];

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const PageHeader = ({ eyebrow, title, subtitle }: PageHeaderProps) => (
  <header className="relative isolate overflow-hidden bg-slate-950 pt-36 pb-20 md:pt-40 md:pb-24">
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />
      <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
    </div>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300">
        {eyebrow}
      </span>
      <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
        {title}
      </h1>
      <p className="mt-5 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">{subtitle}</p>
    </div>
  </header>
);

export const PageNav = () => {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Policies" className="flex flex-wrap justify-center gap-2">
      {legalLinks.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            pathname === to
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
              : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export const ContactCard = ({ heading }: { heading: string }) => (
  <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/20">
    <h2 className="text-xl font-bold">{heading}</h2>
    <p className="mt-2 text-blue-100">Our team is happy to help.</p>
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <a
        href="mailto:rixuraai@gmail.com"
        className="flex items-center gap-3 rounded-xl bg-white/10 p-4 transition hover:bg-white/20"
      >
        <Mail className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium break-all">rixuraai@gmail.com</span>
      </a>
      <a
        href="tel:+918237767664"
        className="flex items-center gap-3 rounded-xl bg-white/10 p-4 transition hover:bg-white/20"
      >
        <Phone className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium">+91 82377 67664</span>
      </a>
      <a
        href="https://wa.me/918237767664"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl bg-white/10 p-4 transition hover:bg-white/20"
      >
        <FaWhatsapp className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium">Chat on WhatsApp</span>
      </a>
    </div>
  </div>
);

interface LegalPageProps extends PageHeaderProps {
  contactHeading: string;
  children: ReactNode;
}

const LegalPage = ({ eyebrow, title, subtitle, contactHeading, children }: LegalPageProps) => (
  <>
    <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
      <PageNav />
      <article
        className="rounded-3xl bg-white p-6 sm:p-10 shadow-sm ring-1 ring-slate-200 text-slate-600 leading-relaxed
          [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2:first-child]:mt-0
          [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ul]:pl-1
          [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em] [&_li]:before:h-2 [&_li]:before:w-2 [&_li]:before:rounded-full [&_li]:before:bg-blue-500
          [&_strong]:text-slate-900 [&_a]:text-blue-600 [&_a]:font-medium hover:[&_a]:underline"
      >
        {children}
      </article>
      <ContactCard heading={contactHeading} />
    </div>
  </>
);

export default LegalPage;
