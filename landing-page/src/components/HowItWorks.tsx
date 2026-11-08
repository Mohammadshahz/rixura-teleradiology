import { Upload, Search, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './HowItWorks.module.css';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Scan",
      description: "Securely upload medical images through our HIPAA-compliant portal or direct PACS integration.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Search,
      title: "Radiologist Reviews",
      description: "Board-certified radiologists analyze your studies using advanced diagnostic workstations.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: FileText,
      title: "Report Delivered",
      description: "Receive comprehensive, structured reports with preliminary reads available within 30 minutes.",
      gradient: "from-purple-500 to-indigo-600"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div 
        className={`absolute inset-0 ${styles.backgroundImage}`}
      >
        <div className="absolute inset-0 bg-black/40 dark:bg-gray-900/80 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-white bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
            Our Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-6">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our streamlined workflow ensures fast, accurate diagnoses with minimal disruption to your practice.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative group"
              variants={item}
            >
              <div className="h-full bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${step.gradient} mb-6 text-white`}>
                  <step.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{step.description}</p>
                
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                  <span className="text-sm font-semibold">Step {index + 1}</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-md">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;