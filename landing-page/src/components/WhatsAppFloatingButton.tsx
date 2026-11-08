import { FaWhatsapp } from "react-icons/fa";

const WhatsAppFloatingButton = () => {
  return (
    <a
      href="https://wa.me/918237767664"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-9 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 transition-all duration-300"
      title="Chat with us on WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8" />
    </a>
  );
};

export default WhatsAppFloatingButton;
