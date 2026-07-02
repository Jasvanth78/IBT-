'use client';

import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { SiteButton } from '@/src/shared/ui';

export function CTASection() {
  return (
    <section className="bg-white py-10 lg:py-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl"
        >
          {/* Abstract Dark Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] items-center px-8 py-8 md:px-12 md:py-10 gap-6">

            {/* Left Graphic - Rocket */}
            <div className="hidden md:flex justify-center items-center relative h-full">
              <div className="relative w-36 h-36">
                {/* Rocket SVG */}
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl translate-y-4">
                  {/* Cloud Base */}
                  <path d="M40 160 Q60 140 80 160 Q100 130 130 160 Q160 140 180 160 Q190 180 160 190 H60 Q30 180 40 160" fill="#f8fafc" opacity="0.9" />
                  {/* Rocket Fire */}
                  <path d="M100 130 L90 180 Q100 200 110 180 Z" fill="#ef4444" />
                  <path d="M100 140 L95 170 Q100 185 105 170 Z" fill="#fbbf24" />
                  {/* Rocket Body */}
                  <path d="M100 30 Q120 70 120 120 L80 120 Q80 70 100 30" fill="#f8fafc" />
                  <path d="M80 120 L60 140 L80 130 Z" fill="#3b82f6" />
                  <path d="M120 120 L140 140 L120 130 Z" fill="#3b82f6" />
                  {/* Window */}
                  <circle cx="100" cy="80" r="10" fill="#3b82f6" />
                  <circle cx="100" cy="80" r="6" fill="#60a5fa" />
                </svg>
                {/* Floating elements */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-10 right-10 w-3 h-3 bg-red-400 rounded-full" />
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full" />
              </div>
            </div>

            {/* Center Content */}
            <div className="text-center md:text-left z-10">
              <h2 className="font-bold !text-white leading-tight  !text-center md:!text-left">
                Ready to Transform<br />Your Business?
              </h2>
            </div>

            {/* Right Content */}
            <div className="text-center md:text-right z-10 flex flex-col items-center md:items-end">
              <p
                className="w-full !text-center md:!text-right pt-1 text-slate-300 text-[13px] md:text-sm mb-5 max-w-xs mx-auto md:mx-0"
                style={{ textAlign: 'inherit' }}
              >
                Let's build something amazing together. Get a free consultation with our experts.
              </p>
              <SiteButton
                href="/contact-us"
                className="w-full md:w-auto bg-[#e63946] text-white rounded-[6px] px-6 py-3 font-bold text-[13px] hover:bg-[#c1121f] transition-colors shadow-lg shadow-[#e63946]/30 whitespace-nowrap"
              >
                Schedule Free Consultation <FiArrowRight className="inline-block ml-1" />
              </SiteButton>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
