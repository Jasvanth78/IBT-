'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { SiteButton } from '@/src/shared/ui';
import Link from 'next/link';
import { useSocketSettings } from '@/src/providers/SocketSettingsProvider';

interface StrategyStep {
  step: string;
  title: string;
  desc: string;
}

export function StrategySection() {
  const { settings, loading } = useSocketSettings();

  const steps = useMemo((): StrategyStep[] => {
    const defaultSteps = [
      { step: '01', title: 'Collect Ideas', desc: 'Nulla vitae elit libero pharetra augue dapibus.' },
      { step: '02', title: 'Data Analysis', desc: 'Vivamus sagittis lacus vel augue laoreet.' },
      { step: '03', title: 'Finalize Product', desc: 'Cras mattis consectetur purus sit amet.' }
    ];

    if (!settings?.servicesProcessSteps) return defaultSteps;

    try {
      const parsed = typeof settings.servicesProcessSteps === 'string'
        ? JSON.parse(settings.servicesProcessSteps)
        : settings.servicesProcessSteps;
      
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultSteps;
    } catch (e) {
      console.warn('Failed to parse strategy steps:', e);
      return defaultSteps;
    }
  }, [settings?.servicesProcessSteps]);

  if (loading && steps.length === 0) {
    return null;
  }

  const title = settings?.servicesProcessTitle || "Here are 3 working steps to organize our business projects.";
  const badge = settings?.servicesProcessBadge || "OUR STRATEGY";
  const description = settings?.servicesProcessDescription || "Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit. Nullam quis risus eget urna mollis.";
  
  return (
    <section className="bg-white py-10 lg:py-14 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#e63946] mb-4">
              {badge}
            </h3>
            <h2 className="font-bold tracking-tight text-[#1d3557] mb-6">
              {title}
            </h2>
            <div 
              className="text-[16px] leading-relaxed text-[#60697b] mb-8 space-y-3 prose prose-slate"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            
            <div className="flex justify-center lg:justify-start">
              <SiteButton 
                href="/about-us" 
                variant="primary" 
                className="bg-[#e63946] hover:bg-[#c1121f] text-white rounded-full px-7 py-3 text-sm font-bold transition-all shadow-md shadow-red-100"
              >
                Learn More
              </SiteButton>
            </div>
          </motion.div>

          {/* Right Staggered Cards */}
          <div className="flex-1 relative w-full max-w-xl mx-auto lg:max-w-none">
            <div className="relative flex flex-col gap-4">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{
                    marginLeft: `${idx * 8}%`,
                    maxWidth: '92%'
                  }}
                  className="bg-white rounded-xl p-5 shadow-[0_5px_25px_rgba(30,34,40,0.03)] border border-slate-50 flex items-start gap-5 group hover:translate-y-[-3px] transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#f1f4f9] flex items-center justify-center text-[16px] font-bold text-[#e63946] transition-colors group-hover:bg-[#e63946] group-hover:text-white">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-[#1d3557] mb-1 group-hover:text-[#e63946] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-[14px] text-[#60697b] leading-relaxed line-clamp-2">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
