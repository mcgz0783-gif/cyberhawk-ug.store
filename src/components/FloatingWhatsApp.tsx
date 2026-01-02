import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

const FloatingWhatsApp = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleClick = () => {
    const message = encodeURIComponent("Hello CyberHawk! I'm interested in your cybersecurity services.");
    window.open(`https://wa.me/250788213106?text=${message}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {isTooltipVisible && (
        <div className="absolute bottom-16 right-0 bg-card rounded-xl shadow-elevated p-4 w-64 animate-fade-in">
          <button
            onClick={() => setIsTooltipVisible(false)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="font-display font-bold text-foreground text-sm mb-1">
            Chat with us!
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Get instant support on WhatsApp
          </p>
          <button
            onClick={handleClick}
            className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
          >
            Start Chat
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsTooltipVisible(true)}
        className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        
        {/* Pulse animation */}
        <span className="absolute w-14 h-14 bg-green-500 rounded-full animate-ping opacity-30" />
      </button>
    </div>
  );
};

export default FloatingWhatsApp;
