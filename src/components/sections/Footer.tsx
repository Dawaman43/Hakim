'use client';

import { Heart, Phone, ChatCircle, EnvelopeSimple, Shield } from '@phosphor-icons/react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

/**
 * Footer component
 */
export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2D4B32] to-teal-600 rounded-xl flex items-center justify-center">
                <Heart weight="fill" className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold">Hakim</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transforming Ethiopian healthcare with smart queue management.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#2D4B32] transition">
                <ChatCircle size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#2D4B32] transition">
                <Phone size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#2D4B32] transition">
                <EnvelopeSimple size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('hospitals')} className="text-gray-400 hover:text-white transition">Book Queue</button></li>
              <li><button onClick={() => onNavigate('emergency')} className="text-gray-400 hover:text-white transition">Emergency</button></li>
              <li><button onClick={() => onNavigate('features')} className="text-gray-400 hover:text-white transition">Features</button></li>
              <li><button onClick={() => onNavigate('about')} className="text-gray-400 hover:text-white transition">About Us</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('contact')} className="text-gray-400 hover:text-white transition">Contact Us</button></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="font-semibold mb-4">Emergency Contact</h4>
            <div className="space-y-3">
              <a href="tel:911" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                <Phone size={20} className="text-red-500" />
                <span>911 - National Emergency</span>
              </a>
              <p className="text-sm text-gray-500">
                For life-threatening emergencies, please call 911 or go to the nearest emergency room immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Hakim Health. Made with ❤️ for Ethiopia 🇪🇹
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Shield size={16} />
            <span>HIPAA Compliant & Data Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
