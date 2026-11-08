
const Tutorial = () => {
  return (
    <section id="tutorial" className="relative py-20 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            How Rixura Works – Step-by-Step
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Watch this quick tutorial to understand how to connect your center,
            submit cases, and receive reports using Rixura's teleradiology
            platform.
          </p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto mb-8">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              src="https://www.youtube.com/embed/RAnBD_OV858?si=4xJZ0_XpS-SZ-xbb"
              title="Rixura Tutorial Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>

        <p className="text-center text-white">
          Still have questions? Contact our support team anytime or request a
          personalized demo to explore advanced features.
        </p>
      </div>
    </section>
  );
};

export default Tutorial;
