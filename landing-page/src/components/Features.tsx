import { Scan, Brain, Heart, Clock, Shield, Zap } from "lucide-react";

const Features = () => {
  const services = [
    {
      icon: Scan,
      title: "X-Ray Interpretation",
      description:
        "Chest, skeletal, and routine radiography with rapid turnaround times.",
      features: [
        "Chest X-rays",
        "Orthopedic imaging",
      ],
    },
    {
      icon: Brain,
      title: "CT Scanning",
      description:
        "Comprehensive CT interpretation including emergency and routine studies.",
      features: ["Brain CT", "Body CT"],
    },
    {
      icon: Heart,
      title: "MRI Services",
      description:
        "Advanced MRI interpretation across all anatomical regions and sequences.",
      features: [
        "Neuroimaging",
        "Musculoskeletal",
      ],
    },
    {
      icon: Zap,
      title: "Emergency Support",
      description:
        "24/7 emergency radiology coverage with stat reading capabilities.",
      features: [
        "Trauma cases",
        "Stroke protocols",
      ],
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock coverage ensuring no case goes unread.",
      features: [
        "Night coverage",
        "Weekend service",
      ],
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "Comprehensive QA programs with peer review and continuous monitoring.",
      features: [
        "Peer review",
        "Double reads",
      ],
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Imaging Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete teleradiology solutions covering all imaging modalities
            with subspecialty expertise and emergency support when you need it
            most.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-blue-100 text-blue-600 p-4 rounded-xl inline-flex mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <service.icon className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Subspecialty Expertise Available
              </h3>
              <p className="text-blue-100 mb-6">
                Access to subspecialty-trained radiologists for complex cases
                requiring specialized knowledge.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-500/30 rounded-lg p-4">
                  <div className="text-lg font-semibold">Radiology</div>
                  <div className="text-blue-200 text-sm">
                    Diagnosis and treatment through medical imaging.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h4 className="text-lg font-semibold mb-4">
                Performance Metrics
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Emergency Response</span>
                  <span className="font-semibold">{"< 10 minutes"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Routine Studies</span>
                  <span className="font-semibold">{"< 20 minutes"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Subspecialty Reads</span>
                  <span className="font-semibold">{"< 10 minutes"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Quality Score</span>
                  <span className="font-semibold">99.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
