import { motion } from 'motion/react';
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function MapSection() {
  return (
    <section id="kontakty-mapa" className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-start gap-1.5 mt-6 mb-8 lg:mt-6 lg:mb-10">
          <span className="text-brand-blue text-xs font-bold uppercase tracking-widest">
            Kde nás najdete
          </span>
          <div className="h-0.5 w-12 bg-brand-blue" />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          {/* Map Column */}
          <div className="lg:col-span-7 rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-slate-100 min-h-[360px] bg-slate-100">
            {/* Embedded Google Map with custom beautiful aesthetics and crop to hide Google's top-left place card and bottom controls */}
            <div className="absolute inset-0 z-0 overflow-hidden w-full h-full rounded-[2.5rem]">
              <iframe 
                src="https://maps.google.com/maps?q=49.18419369172415,15.454958222425363&z=17&ie=UTF8&iwloc=addr&output=embed" 
                width="100%" 
                height="100%" 
                style={{ 
                  border: 0, 
                  filter: 'grayscale(0.1) contrast(1.05) saturate(1.1)',
                  position: 'absolute',
                  top: '-120px',
                  left: '-10px',
                  width: 'calc(100% + 20px)',
                  height: 'calc(100% + 240px)'
                }} 
                allowFullScreen={true} 
                loading="eager" 
                referrerPolicy="no-referrer-when-downgrade"
                className="min-h-[450px]"
              ></iframe>
            </div>

            {/* Float overlay: Clickable K-Derma, Telč bubble in top left linking to Google Maps */}
            <a 
              href="https://maps.app.goo.gl/G7ybEYggaRy23Jvn7"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-md px-5 py-3 rounded-full border border-slate-100 flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all text-brand-blue"
            >
              <MapPin size={16} className="text-brand-blue flex-shrink-0" />
              <span className="text-sm font-bold tracking-wider uppercase">K-Derma, Telč ↗</span>
            </a>
          </div>

          {/* Contact Information Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8 h-full">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-900/5 flex flex-col justify-between h-full">
              <div>
                <div className="mb-8">
                  <h3 className="font-display font-bold text-slate-900 text-2xl uppercase tracking-tight">K-DERMA Telč</h3>
                  <p className="text-sm font-medium text-brand-blue mt-1.5">Ordinace čelistní ortodontie (rovnátka)</p>
                </div>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 flex flex-shrink-0 items-center justify-center text-brand-blue">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Adresa ordinace</p>
                      <p className="text-slate-800 font-medium text-sm leading-relaxed">
                        nám. Zachariáše z Hradce 50<br />
                        588 56 Telč-Vnitřní Město
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 flex flex-shrink-0 items-center justify-center text-brand-blue">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Telefonní kontakt</p>
                      <a href="tel:+420607653315" className="text-slate-800 hover:text-brand-blue font-bold text-base transition-colors">
                        607 653 315
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 flex flex-shrink-0 items-center justify-center text-brand-blue">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">E-mailová adresa</p>
                      <a href="mailto:ordinace.telc@outlook.cz" className="text-slate-800 hover:text-brand-blue font-bold text-base transition-colors">
                        ordinace.telc@outlook.cz
                      </a>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/50 flex flex-shrink-0 items-center justify-center text-brand-blue">
                      <Clock size={18} />
                    </div>
                    <div className="w-full">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-3">Ordinační hodiny</p>
                      <div className="space-y-1 text-sm font-medium">
                        <div className="flex justify-between items-center text-slate-800 py-2.5">
                          <span className="text-slate-500 font-normal">Pondělí</span>
                          <span className="text-[#0F172A] font-medium font-sans">7:30 – 12:00 &nbsp;&nbsp; 12:30 – 15:30</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-800 py-2.5 border-t border-slate-50">
                          <span className="text-slate-500 font-normal">Úterý</span>
                          <span className="text-[#0F172A] font-medium font-sans">12:30 – 18:00</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-800 py-2.5 border-t border-slate-50">
                          <span className="text-slate-500 font-normal">Středa</span>
                          <span className="text-[#0F172A] font-medium font-sans">7:00 – 13:00</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-800 py-2.5 border-t border-slate-50">
                          <span className="text-slate-500 font-normal">Čtvrtek</span>
                          <span className="text-[#0F172A] font-medium font-sans">8:00 – 12:00 &nbsp;&nbsp; 12:30 – 15:30</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-800 py-2.5 border-t border-slate-50">
                          <span className="text-slate-500 font-normal">Pátek</span>
                          <span className="text-[#0F172A] font-medium font-sans">9:30 – 13:00</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-800 py-2.5 border-t border-slate-50">
                          <span className="text-slate-500 font-normal">Sobota</span>
                          <span className="text-brand-blue font-bold uppercase text-xs">Zavřeno</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-800 py-2.5 border-t border-slate-50">
                          <span className="text-slate-500 font-normal">Neděle</span>
                          <span className="text-brand-blue font-bold uppercase text-xs">Zavřeno</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
