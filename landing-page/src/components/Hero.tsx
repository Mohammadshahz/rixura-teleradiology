import { Shield } from "lucide-react";
import heroImage from "../assets/hero2.jpg";

const Hero = () => {
  return (
    <div className="relative overflow-hidden text-white min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-200">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Compliant • 24/7 Available
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Fast, Reliable
                <span className="text-blue-300"> Teleradiology</span>
                <br />
                Services
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-blue-100 leading-relaxed max-w-lg">
                Expert radiologists delivering accurate diagnoses within hours,
                not days. Supporting healthcare providers with cutting-edge
                technology and unmatched expertise.
              </p>
            </div>

            <div className="flex items-center space-x-8 pt-8 border-t border-blue-700/50">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">24/7</div>
                <div className="text-blue-200 text-xs sm:text-sm">Availability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">20 mins</div>
                <div className="text-blue-200 text-xs sm:text-sm">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">500+</div>
                <div className="text-blue-200 text-xs sm:text-sm">Healthcare Partners</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
