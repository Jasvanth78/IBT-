'use client';

import { motion, type Variants } from 'framer-motion';
import { FaCubes, FaIndustry, FaTruck, FaShoppingCart, FaRecycle } from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';

export default function LifecycleAnimatedBoxes() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <>
      {/* Desktop view */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="absolute inset-0 pointer-events-none hidden md:block"
      >
        {/* 1. Raw Materials */}
        <motion.div variants={itemVariants} className="absolute top-[2%] left-[50%] -translate-x-1/2 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f0f7f3] rounded-[16px] px-[20px] py-[16px] flex items-center gap-[14px] w-[270px] z-20 pointer-events-auto">
          <div className="w-[42px] h-[42px] shrink-0 bg-[#EAF8F0] rounded-[10px] flex items-center justify-center text-[#188A52]">
              <FaCubes className="w-[20px] h-[20px]" />
          </div>
          <div className="flex flex-col">
              <span className="text-[15px] font-[800] text-[#142B45] leading-tight">Raw Materials</span>
              <span className="text-[12px] text-[#536779] mt-[4px]">(extraction and sourcing)</span>
          </div>
          <div className="absolute border-l-[2px] border-dashed border-[#4ADE80] h-[40px] lg:h-[70px] bottom-[-40px] lg:bottom-[-70px] left-[50%]">
              <div className="absolute w-[8px] h-[8px] bg-[#38A169] rounded-full bottom-[-4px] left-[-5px]"></div>
          </div>
        </motion.div>

        {/* 2. Manufacturing */}
        <motion.div variants={itemVariants} className="absolute top-[22%] right-[0%] lg:right-[2%] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f0f7f3] rounded-[16px] px-[20px] py-[16px] flex items-center gap-[14px] w-[270px] z-20 pointer-events-auto">
          <div className="w-[42px] h-[42px] shrink-0 bg-[#EAF8F0] rounded-[10px] flex items-center justify-center text-[#188A52]">
              <FaIndustry className="w-[20px] h-[20px]" />
          </div>
          <div className="flex flex-col">
              <span className="text-[15px] font-[800] text-[#142B45] leading-tight">Manufacturing</span>
              <span className="text-[12px] text-[#536779] mt-[4px]">(production and processing)</span>
          </div>
          <div className="absolute border-t-[2px] border-dashed border-[#4ADE80] w-[60px] lg:w-[100px] right-[100%] top-[50%]">
              <div className="absolute w-[8px] h-[8px] bg-[#38A169] rounded-full left-[-4px] top-[-5px]"></div>
          </div>
        </motion.div>

        {/* 3. Transportation */}
        <motion.div variants={itemVariants} className="absolute top-[55%] right-[-5%] lg:right-[-2%] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f0f7f3] rounded-[16px] px-[20px] py-[16px] flex items-center gap-[14px] w-[270px] z-20 pointer-events-auto">
          <div className="w-[42px] h-[42px] shrink-0 bg-[#EAF8F0] rounded-[10px] flex items-center justify-center text-[#188A52]">
              <FaTruck className="w-[20px] h-[20px]" />
          </div>
          <div className="flex flex-col">
              <span className="text-[15px] font-[800] text-[#142B45] leading-tight">Transportation</span>
              <span className="text-[12px] text-[#536779] mt-[4px]">(logistics and distribution)</span>
          </div>
          <div className="absolute border-t-[2px] border-dashed border-[#4ADE80] w-[70px] lg:w-[110px] right-[100%] top-[50%]">
              <div className="absolute w-[8px] h-[8px] bg-[#38A169] rounded-full left-[-4px] top-[-5px]"></div>
          </div>
        </motion.div>

        {/* 4. Use */}
        <motion.div variants={itemVariants} className="absolute top-[80%] right-[10%] lg:right-[15%] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f0f7f3] rounded-[16px] px-[20px] py-[16px] flex items-center gap-[14px] w-[270px] z-20 pointer-events-auto">
          <div className="w-[42px] h-[42px] shrink-0 bg-[#EAF8F0] rounded-[10px] flex items-center justify-center text-[#188A52]">
              <FaShoppingCart className="w-[20px] h-[20px]" />
          </div>
          <div className="flex flex-col">
              <span className="text-[15px] font-[800] text-[#142B45] leading-tight">Use</span>
              <span className="text-[12px] text-[#536779] mt-[4px]">(product in operation)</span>
          </div>
          <div className="absolute border-t-[2px] border-dashed border-[#4ADE80] w-[60px] lg:w-[90px] right-[100%] top-[50%]">
              <div className="absolute w-[8px] h-[8px] bg-[#38A169] rounded-full left-[-4px] top-[-5px]"></div>
          </div>
        </motion.div>

        {/* 5. End of Life */}
        <motion.div variants={itemVariants} className="absolute top-[55%] left-[0%] lg:left-[0%] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f0f7f3] rounded-[16px] px-[20px] py-[16px] flex items-center gap-[14px] w-[270px] z-20 pointer-events-auto">
          <div className="w-[42px] h-[42px] shrink-0 bg-[#EAF8F0] rounded-[10px] flex items-center justify-center text-[#188A52]">
              <FaRecycle className="w-[20px] h-[20px]" />
          </div>
          <div className="flex flex-col">
              <span className="text-[15px] font-[800] text-[#142B45] leading-tight">End of Life</span>
              <span className="text-[12px] text-[#536779] mt-[4px]">(disposal or recycling)</span>
          </div>
          <div className="absolute border-t-[2px] border-dashed border-[#4ADE80] w-[60px] lg:w-[100px] left-[100%] top-[50%]">
              <div className="absolute w-[8px] h-[8px] bg-[#38A169] rounded-full right-[-4px] top-[-5px]"></div>
          </div>
        </motion.div>

        {/* 6. Feedback Loop */}
        <motion.div variants={itemVariants} className="absolute top-[22%] left-[2%] lg:left-[5%] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#f0f7f3] rounded-[16px] px-[20px] py-[16px] flex items-center gap-[14px] w-[270px] z-20 pointer-events-auto">
          <div className="w-[42px] h-[42px] shrink-0 bg-[#EAF8F0] rounded-[10px] flex items-center justify-center text-[#188A52]">
              <FiTrendingUp className="w-[20px] h-[20px]" />
          </div>
          <div className="flex flex-col">
              <span className="text-[15px] font-[800] text-[#142B45] leading-tight">Feedback Loop</span>
              <span className="text-[12px] text-[#536779] mt-[4px]">(continuous improvement)</span>
          </div>
          <div className="absolute border-t-[2px] border-dashed border-[#4ADE80] w-[50px] lg:w-[80px] left-[100%] top-[50%]">
              <div className="absolute w-[8px] h-[8px] bg-[#38A169] rounded-full right-[-4px] top-[-5px]"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile view */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="w-full flex flex-col gap-[16px] md:hidden mt-[40px]"
      >
        {[
          { title: "Raw Materials", desc: "(extraction and sourcing)", icon: FaCubes },
          { title: "Manufacturing", desc: "(production and processing)", icon: FaIndustry },
          { title: "Transportation", desc: "(logistics and distribution)", icon: FaTruck },
          { title: "Use", desc: "(product in operation)", icon: FaShoppingCart },
          { title: "End of Life", desc: "(disposal or recycling)", icon: FaRecycle },
          { title: "Feedback Loop", desc: "(continuous improvement)", icon: FiTrendingUp },
        ].map((item, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#f0f7f3] rounded-[16px] px-[20px] py-[16px] flex items-center gap-[14px] w-full">
            <div className="w-[42px] h-[42px] shrink-0 bg-[#EAF8F0] rounded-[10px] flex items-center justify-center text-[#188A52]">
                <item.icon className="w-[20px] h-[20px]" />
            </div>
            <div className="flex flex-col">
                <span className="text-[15px] font-[800] text-[#142B45] leading-tight">{item.title}</span>
                <span className="text-[12px] text-[#536779] mt-[4px]">{item.desc}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
