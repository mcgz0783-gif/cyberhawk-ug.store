import React from "react";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, Mail } from "lucide-react";
import cyberHawkLogo from "@/assets/cyberhawk-logo.png";

const Footer = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    const currentYear = new Date().getFullYear();

    return (
      <footer ref={ref} className="bg-hawk-dark text-white" {...props}>
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={cyberHawkLogo}
                alt="CyberHawk UG"
                className="w-12 h-12 object-contain"
              />
              <div>
                <span className="font-display font-bold text-lg">CyberHawk</span>
                <span className="text-white/70 ml-1">UG</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm">
              Sharp Vision in Cybersecurity. Protecting your digital assets with precision and care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/60 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-white/60 hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/60 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/60 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-white/60 hover:text-primary transition-colors">Network Security</Link></li>
              <li><Link to="/services" className="text-white/60 hover:text-primary transition-colors">Penetration Testing</Link></li>
              <li><Link to="/services" className="text-white/60 hover:text-primary transition-colors">Security Audits</Link></li>
              <li><Link to="/services" className="text-white/60 hover:text-primary transition-colors">Incident Response</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-white/60 hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/ebooks" className="text-white/60 hover:text-primary transition-colors">Ebooks</Link></li>
              <li><Link to="/shop" className="text-white/60 hover:text-primary transition-colors">Shop</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:0788213106"
                  className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  0788213106
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/250788213106"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp: 0788213106
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@cyberhawk.ug"
                  className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@cyberhawk.ug
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © {currentYear} CyberHawk UG. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
      </footer>
    );
  }
);

Footer.displayName = "Footer";

export default Footer;
