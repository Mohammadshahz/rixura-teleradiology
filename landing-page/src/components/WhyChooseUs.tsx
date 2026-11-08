import { Clock, Target, Users, Shield } from 'lucide-react';

const WhyChooseUs = () => {
  const advantages = [
    {
      icon: Clock,
      title: "Turnaround Time",
      description: "Emergency reads in under 10 minutes, routine studies within 20 minutes",
      stats: "20 min avg",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Target,
      title: "Diagnostic Accuracy",
      description: "99.2% accuracy rate with subspecialty-trained radiologists",
      stats: "99.2% accuracy",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Expert Radiologists",
      description: "Board-certified radiologists with average 15+ years experience",
      stats: "15+ years exp",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security with full HIPAA compliance and audit trails",
      stats: "100% compliant",
      color: "from-red-500 to-red-600"
    }
  ];

  const certifications = [
    { name: "HIPAA Compliant", icon: Shield },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Healthcare Leaders Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by over 100 healthcare centers nationwide for our commitment to quality, 
            speed, and patient care excellence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {advantages.map((advantage, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group-hover:bg-white">
                <div className={`bg-gradient-to-r ${advantage.color} p-4 rounded-xl inline-flex mb-6 group-hover:scale-110 transition-transform`}>
                  <advantage.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{advantage.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{advantage.description}</p>
                
                <div className={`text-2xl font-bold bg-gradient-to-r ${advantage.color} bg-clip-text text-transparent`}>
                  {advantage.stats}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Trust Through Compliance & Certification</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We maintain the highest standards of medical practice, data security, and regulatory compliance. 
                Our certifications and accreditations demonstrate our commitment to excellence in teleradiology services.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <cert.icon className="w-8 h-8 text-blue-600 mb-2" />
                    <div className="font-semibold text-gray-900">{cert.name}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics Dashboard</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Patient Satisfaction</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full progress-bar-green"></div>
                      </div>
                      <span className="text-sm font-semibold">96%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Report Accuracy</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full progress-bar-blue"></div>
                      </div>
                      <span className="text-sm font-semibold">99.2%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">On-Time Delivery</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full progress-bar-purple"></div>
                      </div>
                      <span className="text-sm font-semibold">98%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Security Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full w-full"></div>
                      </div>
                      <span className="text-sm font-semibold">100%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h4 className="text-lg font-semibold mb-2">24/7 Support Available</h4>
                <p className="text-blue-100 mb-4">
                  Dedicated support team available around the clock for technical assistance and case prioritization.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Support team online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;