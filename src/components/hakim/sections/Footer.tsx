'use client';

import { Heart, ChatCircle, Phone, EnvelopeSimple, CaretRight, Ambulance, Shield } from '@phosphor-icons/react';
import type { ViewType } from '../routes';

interface AmbulanceInfo {
  primaryNumber: string;
  primaryName: string;
  secondaryNumber?: string;
  secondaryName?: string;
}

interface FooterProps {
  t: Record<string, string>;
  selectedRegion: string;
  getAmbulanceInfo: () => AmbulanceInfo;
  onNavigate: (view: ViewType) => void;
  stats?: {
    facilities?: number;
    departments?: number;
    regions?: number;
  };
}

export function Footer({ t, selectedRegion, getAmbulanceInfo, onNavigate, stats }: FooterProps) {
  return (
    <footer className="relative bg-background text-gray-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#2D4B32]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#2D4B32]/5 rounded-full blur-3xl" />
      </div>

      <div className="h-1 bg-gradient-to-r from-[#2D4B32] via-[#2D4B32] to-[#2D4B32]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-11 h-11 bg-gradient-to-br from-[#2D4B32] to-[#2D4B32] rounded-xl flex items-center justify-center shadow-lg shadow-[#2D4B32]/20">
                <Heart weight="fill" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#2D4B32] to-[#2D4B32] bg-clip-text text-transparent">Hakim</span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {t.footerDesc}
            </p>
            <div className="flex gap-3">
              <button onClick={() => onNavigate('contact')} className="w-10 h-10 bg-background border border-gray-300/60 rounded-xl flex items-center justify-center hover:border-[#2D4B32] transition-all group">
                <ChatCircle size={18} className="text-gray-600 group-hover:text-[#2D4B32] transition" />
              </button>
              <a href="tel:+251911000000" className="w-10 h-10 bg-background border border-gray-300/60 rounded-xl flex items-center justify-center hover:border-[#2D4B32] transition-all group">
                <Phone size={18} className="text-gray-600 group-hover:text-[#2D4B32] transition" />
              </a>
              <a href="mailto:support@hakim.et" className="w-10 h-10 bg-background border border-gray-300/60 rounded-xl flex items-center justify-center hover:border-[#2D4B32] transition-all group">
                <EnvelopeSimple size={18} className="text-gray-600 group-hover:text-[#2D4B32] transition" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#2D4B32] rounded-full"></span>
              {t.quickLinks}
            </h4>
            <ul className="space-y-3">
              <li><button onClick={() => onNavigate('hospitals')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{t.bookQueue}</button></li>
              <li><button onClick={() => onNavigate('emergency')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{t.emergencyAssist}</button></li>
              <li><button onClick={() => onNavigate('features')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{t.features}</button></li>
              <li><button onClick={() => onNavigate('about')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{t.about}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#2D4B32] rounded-full"></span>
              {t.support}
            </h4>
            <ul className="space-y-3">
              <li><button onClick={() => onNavigate('contact')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{t.contactUs}</button></li>
              <li><button onClick={() => onNavigate('faq')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{t.faq}</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{t.privacyPolicy}</button></li>
              <li><button onClick={() => onNavigate('terms')} className="text-gray-600 hover:text-[#2D4B32] transition flex items-center gap-2 group"><CaretRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />{t.termsOfService}</button></li>
              <li><button onClick={() => onNavigate('admin-login')} className="text-gray-600 hover:text-[#2D4B32] transition text-sm mt-2">{t.hospitalAdminPortal} →</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#2D4B32] rounded-full"></span>
              {t.emergencyContact}
            </h4>
            <div className="space-y-4">
              <div className="p-3 bg-[#2D4B32]/10 border border-[#2D4B32]/20 rounded-xl">
                <p className="text-xs text-[#2D4B32] mb-2">{t.localAmbulance} ({selectedRegion})</p>
                <a href={`tel:${getAmbulanceInfo().primaryNumber}`} className="group flex items-center gap-3 hover:bg-[#2D4B32]/10 rounded-lg transition -mx-1 px-1 py-1">
                  <div className="w-10 h-10 bg-[#2D4B32]/10 rounded-lg flex items-center justify-center group-hover:bg-[#2D4B32]/10 transition">
                    <Ambulance size={20} className="text-[#2D4B32]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2D4B32]">{getAmbulanceInfo().primaryNumber}</p>
                    <p className="text-xs text-gray-500">{getAmbulanceInfo().primaryName}</p>
                  </div>
                </a>
                {getAmbulanceInfo().secondaryNumber && (
                  <a href={`tel:${getAmbulanceInfo().secondaryNumber}`} className="group flex items-center gap-3 hover:bg-[#2D4B32]/10 rounded-lg transition -mx-1 px-1 py-1 mt-2">
                    <div className="w-8 h-8 bg-[#2D4B32]/10 rounded-lg flex items-center justify-center">
                      <Phone size={16} className="text-[#2D4B32]/70" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2D4B32]/80 text-sm">{getAmbulanceInfo().secondaryNumber}</p>
                      <p className="text-xs text-gray-600">{getAmbulanceInfo().secondaryName}</p>
                    </div>
                  </a>
                )}
              </div>

              <a href="tel:911" className="group flex items-center gap-3 p-3 bg-[#2D4B32]/10 border border-[#2D4B32]/20 rounded-xl hover:bg-[#2D4B32]/10 transition">
                <div className="w-10 h-10 bg-[#2D4B32]/10 rounded-lg flex items-center justify-center group-hover:bg-[#2D4B32]/10 transition">
                  <Phone size={20} className="text-[#2D4B32]" />
                </div>
                <div>
                  <p className="font-semibold text-[#2D4B32]">911</p>
                  <p className="text-xs text-gray-600">{t.nationalEmergency}</p>
                </div>
              </a>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t.emergencyDesc}
              </p>
            </div>
          </div>
        </div>

        <div className="py-8 border-y border-gray-400/60 grid grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats?.facilities ? stats.facilities.toLocaleString() : '1,600+'}</p>
            <p className="text-gray-600 text-sm">Facilities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats?.departments ? stats.departments.toLocaleString() : '8,000+'}</p>
            <p className="text-gray-600 text-sm">{t.departments}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats?.regions && stats.regions > 0 ? stats.regions : 13}</p>
            <p className="text-gray-600 text-sm">{t.regions}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm flex items-center gap-2">
            © 2026 Hakim Health. {t.madeWith}
            <Heart size={14} weight="fill" className="text-red-500" />
            {t.forEthiopia}
            <span className="text-lg">🇪🇹</span>
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full text-gray-700 text-sm border border-gray-300/60">
            <Shield size={14} className="text-[#2D4B32]" />
            <span>{t.hipaaCompliant}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
