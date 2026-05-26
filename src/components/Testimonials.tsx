import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import React, { useState, useEffect, useCallback } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    text: "Neuvěřitelný přístup a profesionalita. Moje zuby nikdy nevypadaly lépe. Doporučuji všem, kdo hledají kvalitu bez kompromisů.",
    author: "Martin Dvořák",
    role: "IT Specialista",
    rating: 5,
    treatmentPeriod: "2024 – 2026"
  },
  {
    text: "Moderní prostředí, krátké čekací doby a velmi milý personál. Celý proces ortodontické léčby byl naprosto bezproblémový.",
    author: "Alena Procházková",
    role: "Architektka",
    rating: 5,
    treatmentPeriod: "2023 – 2025"
  },
  {
    text: "Před deseti lety jsem měl rovnátka jinde a zuby se mi vrátily. Tady mi udělali skvělou retenci a vše drží, jak má. Profesionálové.",
    author: "Tomáš Marek",
    role: "Podnikatel",
    rating: 5,
    treatmentPeriod: "2022 – 2024"
  }
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Motion values for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for motion values - responsive timing of exactly 0.5s hover latency
  const springConfig = { damping: 20, stiffness: 80, mass: 1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-200, 200], [15, -15]);
  const rotateY = useTransform(springX, [-200, 200], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const next = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 8000);
    return () => clearInterval(timer);
  }, [index, next]);

  // Reset tilt state instantly when card changes
  useEffect(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [index, mouseX, mouseY]);

  const goTo = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
      rotateY: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
      rotateY: 0
    })
  };

  return (
    <section className="py-32 bg-[#F8FAFC] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <Quote size={48} className="text-brand-blue/20 mb-6" />
          <h2 className="text-4xl md:text-5xl font-display font-medium text-[#0F172A]">Co o nás říkají naši pacienti</h2>
        </div>

        <div className="max-w-4xl mx-auto relative group">
          <div 
            className="relative h-[500px] md:h-[420px] flex items-center justify-center perspective-[1000px]"
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d"
                }}
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  rotateY: { duration: 0.6 }
                }}
                className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-900/10 text-center w-full absolute transform-gpu flex flex-col justify-between min-h-[440px] md:min-h-[360px]"
              >
                <div>
                  <div className="flex justify-center gap-1 mb-6 md:mb-8">
                    {[...Array(testimonials[index].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                      >
                        <Star size={18} className="fill-brand-blue text-brand-blue" />
                      </motion.div>
                    ))}
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-display font-medium text-slate-700 leading-relaxed mb-6 md:mb-8">
                    "{testimonials[index].text}"
                  </blockquote>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100 mt-auto">
                  <div className="flex flex-col items-center sm:items-start gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                      Počátek a ukončení léčby
                    </span>
                    <span className="text-brand-blue text-sm md:text-base font-bold font-sans">
                      {testimonials[index].treatmentPeriod}
                    </span>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="text-lg font-display font-bold text-[#0F172A]">{testimonials[index].author}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">{testimonials[index].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons - Aligned to center of the h-[400px] container */}
            <div className="absolute top-1/2 -left-4 md:-left-20 -translate-y-1/2 z-30">
              <button 
                onClick={prev}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-brand-blue hover:scale-110 transition-all cursor-pointer border border-slate-100"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            <div className="absolute top-1/2 -right-4 md:-right-20 -translate-y-1/2 z-30">
              <button 
                onClick={next}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-brand-blue hover:scale-110 transition-all cursor-pointer border border-slate-100"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Progress dots - moved down */}
          <div className="mt-20 flex justify-center gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${i === index ? 'w-12 bg-brand-blue' : 'w-3 bg-slate-200 hover:bg-slate-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
