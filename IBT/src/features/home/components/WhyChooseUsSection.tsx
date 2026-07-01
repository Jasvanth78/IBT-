'use client';

import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { SiteButton } from '@/src/shared/ui';

const benefits = [
  {
    title: 'Experienced & Skilled Team',
    description: 'Experts with years of industry experience.'
  },
  {
    title: 'Security First Approach',
    description: 'We follow best practices for top security.'
  },
  {
    title: 'Agile & Transparent Process',
    description: 'We keep you informed at every step.'
  },
  {
    title: 'On-Time Delivery',
    description: 'We value time and commit to deadlines.'
  },
  {
    title: 'AI-Powered Solutions',
    description: 'Leverage AI to drive innovation and growth.'
  },
  {
    title: 'Dedicated Support',
    description: "We're always here when you need us."
  }
];

export function WhyChooseUsSection() {
  return (
    <section className="bg-[#f8faff] py-8 lg:py-12 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr_1fr] gap-8 lg:gap-10 xl:gap-14 items-center mx-auto">

          {/* Column 1: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start"
          >
            <h3 className="text-[16px] font-bold uppercase tracking-wider !text-red-500 mb-2">
              WHY CHOOSE I BACUS TECH?
            </h3>
            <h2 className="text-[28px] sm:text-[32px] font-extrabold text-[#0f172a] leading-tight mb-3 pr-4">
              Exceeding Expectations <br className="hidden lg:block" /> Every Time
            </h2>
            <p className="text-[13px] font-medium text-slate-500 mb-6 max-w-none lg:max-w-[300px] leading-relaxed">
              We combine technology, creativity and strategy to build solutions that create real impact.
            </p>
            <SiteButton
              href="/about-us"
              className="w-full sm:w-auto bg-[#e63946] text-white rounded-md px-5 py-2.5 font-bold text-[12px] hover:bg-[#c1121f] transition-colors shadow-sm"
            >
              Know More About Us <FiArrowRight className="inline-block ml-1" />
            </SiteButton>
          </motion.div>

          {/* Column 2: Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 relative z-10">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-[#1d4ed8] flex items-center justify-center">
                      <FiCheckCircle className="text-white text-[12px]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-[#0f172a] mb-0.5 leading-tight">{benefit.title}</h4>
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed max-w-none">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Column 3: Illustration */}
          <div
            className="relative w-full max-w-[380px] mx-auto lg:ml-auto hidden lg:block"
          >
            <img
              src="/analytics_illustration.png"
              alt="Analytics Dashboard Illustration"
              className="w-full h-auto drop-shadow-xl rounded-xl object-cover"
            />
            {/* Floating Checkmark Badge */}
            <div className="absolute top-1/2 -right-3 bg-emerald-500 text-white rounded-full p-1.5 shadow-md border-[3px] border-white transform -translate-y-1/2">
              <FiCheckCircle className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
