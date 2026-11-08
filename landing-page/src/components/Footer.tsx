import { Shield, Globe, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/White.svg";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Brand and Description */}
          <div className="lg:col-span-2">
            <img src={logo} alt="Rixura Logo" className="h-10 mb-4" />
            <p className="text-2xl">Teleradiology</p>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Leading provider of teleradiology services, connecting healthcare
              facilities with expert radiologists 24/7 to improve patient
              outcomes and diagnostic accuracy.
            </p>

            {/* Icons */}
            <div className="flex space-x-4 mb-6">
              
             

              <div className="bg-gray-800 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
            </div>

            {/* Legal */}
            <div className="text-sm text-gray-400">
              <p>© 2025 Rixura. All rights reserved.</p>
              <p>Licensed healthcare provider</p>
            </div>

            <div className="text-base">
              <p>
                Powered by <span className="font-semibold">Rixura Services LLP</span>
              </p>
            </div>
          </div>

          {/* Services + Contact + Emergency Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:col-span-2">
            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <span className="hover:text-white cursor-default">
                    X-Ray Interpretation
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-default">
                    CT Scanning
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-default">
                    MRI Services
                  </span>
                </li>
                <li>
                  <span className="hover:text-white cursor-default">
                    Emergency Support
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-3 text-gray-300">
                <a href="tel:+918237767664" className="flex items-center space-x-3 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>+91 82377 67664</span>
                </a>
                <a href="mailto:rixuraai@gmail.com" className="flex items-center space-x-3 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>rixuraai@gmail.com</span>
                </a>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>Serving Maharashtra, Uttar Pradesh, Gujarat &amp; Chennai</span>
                </div>
              </div>
            </div>

            {/* Emergency Highlight */}
            <div className="md:col-span-2">
              <div className="mt-6 md:mt-11 p-4 bg-gray-800 rounded-lg">
                <h5 className="font-semibold mb-2">
                  24/7 and 365 days Emergency Support
                </h5>
                <p className="text-sm text-gray-300">
                  Critical cases receive immediate attention with dedicated
                  emergency radiologists available around the clock.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Links & Copy */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link to="/tos" className="hover:text-white transition-colors">
                Terms &amp; Conditions
              </Link>
              <Link to="/refund" className="hover:text-white transition-colors">
                Refund Policy
              </Link>
              <Link to="/faqs" className="hover:text-white transition-colors">
                FAQs
              </Link>
            </div>
            <div>Serving healthcare providers nationwide since 2025</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
