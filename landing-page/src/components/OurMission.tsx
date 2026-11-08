import { Heart, Users, Award, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { value: '90K+', label: 'Studies Read', color: 'from-blue-500 to-blue-600' },
  { value: '99.2%', label: 'Accuracy Rate', color: 'from-emerald-500 to-teal-600' },
  { value: '100+', label: 'Healthcare Centers', color: 'from-purple-500 to-indigo-600' },
  { value: '2M+', label: 'Diagnostics', color: 'from-rose-500 to-pink-600' }
];

const features = [
  {
    icon: Heart,
    title: 'Patient-Centric Care',
    description: 'Compassionate diagnostics focused on individual patient needs',
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10'
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Board-certified radiologists with specialized expertise',
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10'
  },
  {
    icon: Award,
    title: 'Quality Assurance',
    description: 'Rigorous quality control and continuous peer review processes',
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Serving healthcare providers from clinics to major hospitals',
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
  }
];

const OurMission = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6 max-w-2xl">
              <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                Our Mission
              </span>
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 leading-tight">
                Advancing Healthcare Through <br />Precision Radiology
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We bridge the gap between healthcare providers and expert radiologists, ensuring every patient 
                receives timely, accurate diagnoses regardless of location or time of day.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Since 2015, our network of board-certified radiologists has been trusted by healthcare facilities 
                nationwide, delivering millions of diagnostic reads with industry-leading accuracy.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-auto">
              {stats.slice(0, 2).map((stat) => (
                <motion.div 
                  key={stat.label}
                  className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700/50"
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 gap-5 self-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {features.map((feature) => (
              <motion.div 
                key={feature.title}
                className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700/50"
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;