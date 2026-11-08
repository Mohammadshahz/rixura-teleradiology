import { Globe, Clock, UploadCloud, CheckCircle2 } from "lucide-react";

const regions = ["Maharashtra", "Uttar Pradesh", "Gujarat", "Chennai"];

const AboutUs = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white text-slate-800">
      {/* Hero Section */}
      <header className="relative isolate overflow-hidden bg-slate-950 pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />
          <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-7">
            <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300">
              About Rixura
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
              Empowering Possibilities
              <br />
              <span className="text-blue-400">Through Innovation &amp; Simplicity</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              At Rixura, we believe technology should simplify lives, not
              complicate them. From humble beginnings to where we are today,
              our journey has always centered around one thing — impact.
            </p>
            <button
              onClick={scrollToContact}
              className="inline-flex items-center rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-md transition hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            >
              Contact Us
            </button>
          </div>
        </div>
      </header>

      {/* Coverage Section */}
      <section className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-slate-900">
              We’re Closer Than
              <br />
              <span className="text-blue-600">You Think</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              We work remotely with diagnostic centers and hospitals — wherever
              you are, our radiologists are just an upload away.
            </p>
            <ul className="space-y-3">
              {[
                { icon: UploadCloud, text: "Upload scans securely from anywhere" },
                { icon: Clock, text: "24/7 reporting, 365 days a year" },
                { icon: Globe, text: "Nationwide coverage across India" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-slate-700">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 sm:p-10 text-white shadow-2xl shadow-blue-900/20">
            <h3 className="text-2xl font-bold">Where we serve</h3>
            <p className="mt-2 text-blue-100">
              Healthcare centers across these regions trust Rixura for their reporting.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {regions.map((region) => (
                <div
                  key={region}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 font-medium"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-200" />
                  {region}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-blue-100">
              Not on the list? We can still help —{" "}
              <button onClick={scrollToContact} className="font-semibold text-white underline underline-offset-4">
                get in touch
              </button>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
