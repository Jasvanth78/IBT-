import Link from 'next/link';

import { FiArrowRight, FiPlay, FiBarChart2, FiPieChart, FiSettings, FiGrid, FiFeather, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { FaLeaf, FaWhatsapp, FaCloud, FaBolt, FaTint, FaTrash, FaCubes, FaIndustry, FaTruck, FaShoppingCart, FaRecycle } from 'react-icons/fa';
import LifecycleSection from './LifecycleSection';
import ProductPassport from './ProductPassport';
import WhyJiva from './WhyJiva';
import IndustriesServed from './IndustriesServed';
import HowJivaWorks from './HowJivaWorks';
import BusinessValue from './BusinessValue';
import PlatformOverview from './PlatformOverview';
import LcaHero from './LcaHero';
import CoreCapabilities from './CoreCapabilities';
import styles from './LcaPage.module.css';
export const metadata = {
  title: 'LCA - AI Powered Sustainability Platform | IBT',
  description: 'JIVA is an AI-powered sustainability management platform that helps businesses measure carbon emissions and understand environmental impact.',
};

export default function LCAPage() {
  return (
    <main className={`${styles.page} min-h-screen relative font-sans overflow-hidden`}>
      <LcaHero />

      <PlatformOverview />

      <CoreCapabilities />

      {/* AI That Makes Sustainability Easier SECTION */}
      <section className="w-full bg-[#f6fcf9] relative py-[80px] lg:py-[100px] overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#EAF8F0 2px, transparent 2px)', backgroundSize: '40px 40px', opacity: 0.5 }}></div>
        <div className="absolute top-0 right-0 opacity-20 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <FaLeaf className="text-[#188A52] w-96 h-96" />
        </div>
        <div className="absolute bottom-0 left-0 opacity-20 pointer-events-none transform -translate-x-1/2 translate-y-1/4 rotate-45">
          <FaLeaf className="text-[#188A52] w-64 h-64" />
        </div>

        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-[40px] relative z-10">
          {/* Header */}
          <div className="flex flex-col items-start mb-[50px]">
            <div className="flex items-center gap-[8px] bg-[#F4FBF7] border border-[#EAF8F0] text-[#176B45] px-[16px] py-[6px] rounded-full text-[13px] font-[700] tracking-wider mb-[24px] uppercase shadow-sm">
              
              AI INTELLIGENCE
            </div>
            <h2 className="text-[36px] md:text-[46px] lg:text-[50px] font-[750] text-[#142B45] leading-[1.15] tracking-[-1px] mb-[20px]">
              AI That Makes <span className="text-[#188A52]">Sustainability Easier</span>
            </h2>
            <p className="text-[#536779] text-[16px] md:text-[18px] leading-[1.6] max-w-[900px]">
              JIVA&apos;s AI-powered assistant helps businesses understand complex sustainability information, identify environmental hotspots, and turn sustainability data into practical insights - without requiring deep sustainability expertise.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
            
            {/* Card 1 */}
            <div className="bg-white rounded-[24px] p-[24px] md:p-[32px] border-[2px] border-[#EAF8F0] border-l-[6px] border-l-[#188A52] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-[24px] hover:shadow-[0_8px_30px_rgba(24,138,82,0.08)] transition-all">
              <div className="w-[120px] md:w-[140px] shrink-0 flex items-center justify-center">
                <img src="/images/lca-ai-hotspots.png" alt="Carbon hotspots" className="w-full h-auto object-contain rounded-[12px] drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[20px] font-[750] text-[#142B45] mb-[12px] leading-[1.3]">What are our biggest <br/> carbon hotspots?</h3>
                <p className="text-[#536779] text-[15px] leading-[1.6]">
                  JIVA analyzes your emissions data and highlights the processes and activities contributing most to your carbon footprint.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[24px] p-[24px] md:p-[32px] border-[2px] border-[#EAF8F0] border-l-[6px] border-l-[#188A52] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-[24px] hover:shadow-[0_8px_30px_rgba(24,138,82,0.08)] transition-all">
              <div className="w-[120px] md:w-[140px] shrink-0 flex items-center justify-center">
                <img src="/images/lca-card-3.png" alt="Environmental impact" className="w-full h-auto object-contain rounded-[12px] drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[20px] font-[750] text-[#142B45] mb-[12px] leading-[1.3]">Which material has the <br/> lowest environmental impact?</h3>
                <p className="text-[#536779] text-[15px] leading-[1.6]">
                  Compare material alternatives using life cycle data to find the option with the smallest environmental footprint.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[24px] p-[24px] md:p-[32px] border-[2px] border-[#EAF8F0] border-l-[6px] border-l-[#188A52] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-[24px] hover:shadow-[0_8px_30px_rgba(24,138,82,0.08)] transition-all">
              <div className="w-[120px] md:w-[140px] shrink-0 flex items-center justify-center">
                <img src="/images/lca-ai-scope3.png" alt="Scope 3 emissions" className="w-full h-auto object-contain rounded-[12px] drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[20px] font-[750] text-[#142B45] mb-[12px] leading-[1.3]">How can we reduce our <br/> Scope 3 emissions?</h3>
                <p className="text-[#536779] text-[15px] leading-[1.6]">
                  Get targeted recommendations across your supply chain to address the most impactful Scope 3 categories.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-[24px] p-[24px] md:p-[32px] border-[2px] border-[#EAF8F0] border-l-[6px] border-l-[#188A52] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-[24px] hover:shadow-[0_8px_30px_rgba(24,138,82,0.08)] transition-all">
              <div className="w-[120px] md:w-[140px] shrink-0 flex items-center justify-center">
                <img src="/images/lca-ai-insights.png" alt="Sustainability insights" className="w-full h-auto object-contain rounded-[12px] drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[20px] font-[750] text-[#142B45] mb-[12px] leading-[1.3]">Generate sustainability <br/> insights from this data.</h3>
                <p className="text-[#536779] text-[15px] leading-[1.6]">
                  Upload your data and let JIVA&apos;s AI surface patterns, trends, and actionable sustainability recommendations.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
      
      <LifecycleSection />

      <ProductPassport />
      <WhyJiva />
      <IndustriesServed />
      <HowJivaWorks />
      <BusinessValue />

    </main>
  );
}
