'use client';

import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiSend, FiUsers, FiAward, FiPlayCircle, FiSearch, FiBell, FiMenu, FiActivity } from 'react-icons/fi';
import { SiteButton } from '@/src/shared/ui';
import { HomeSections } from './HomeSections';

export function LandingPage() {
  return (
    <div className="relative flex flex-col bg-white text-slate-900 pb-0 overflow-hidden font-sans">

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-20 overflow-visible bg-slate-50/50">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-blue-50/50 blur-3xl" />
          <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-50/50 blur-3xl" />
          {/* Subtle dot grid pattern on right */}
          <div className="absolute top-10 right-10 w-48 h-48 opacity-20 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] hidden lg:block" />
        </div>

        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 max-w-2xl xl:max-w-none xl:pr-8"
            >
              <h1 className="text-[24px] sm:text-[28px] lg:text-[40px] font-extrabold leading-[1.1] text-[#1d3557] tracking-tight mb-6">
                Building Intelligent <br className="hidden lg:block" />
                <span className="text-[#e63946] inline-block mt-1 sm:mt-0">
                  Software for a Digital Future
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-500 mb-8 max-w-none lg:max-w-[480px] leading-relaxed font-medium">
                We design and develop custom software, AI-powered solutions, data analytics platforms, and enterprise applications that help businesses stay ahead in a rapidly evolving world.
              </p>

              <div className="flex flex-wrap gap-4 items-center mt-6 md:mt-8">
                <SiteButton
                  href="/contact-us"
                  className="w-full sm:w-auto bg-[#e63946] hover:bg-[#c1121f] text-white rounded-md px-7 py-3.5 font-bold text-sm transition-all shadow-md shadow-red-500/20"
                  rightIcon={<FiArrowRight size={16} />}
                >
                  Get Free Consultation
                </SiteButton>
                <SiteButton
                  href="/services"
                  variant="secondary"
                  className="w-full sm:w-auto border border-slate-200 text-[#1d3557] bg-white hover:bg-slate-50 rounded-md px-7 py-3.5 font-bold text-sm transition-all shadow-sm"
                  rightIcon={<FiPlayCircle size={18} />}
                >
                  View Our Work
                </SiteButton>
              </div>
            </motion.div>

            {/* Right Content - Laptop + Mobile Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-6 relative w-full flex items-center justify-center py-6"
            >
              {/* Green Plant */}
              <div className="absolute bottom-[20px] left-[10px] z-20 hidden md:flex flex-col items-center pointer-events-none">
                {/* Leaves */}
                <div className="relative w-24 h-24">
                  <div className="absolute bottom-4 left-4 w-5 h-12 bg-emerald-500 rounded-full origin-bottom rotate-[-35deg] opacity-90 shadow-sm" />
                  <div className="absolute bottom-5 left-8 w-5 h-14 bg-emerald-600 rounded-full origin-bottom rotate-[-10deg] opacity-95 shadow-sm" />
                  <div className="absolute bottom-6 left-12 w-5 h-14 bg-emerald-500 rounded-full origin-bottom rotate-[10deg] opacity-95 shadow-sm" />
                  <div className="absolute bottom-4 left-15 w-5 h-12 bg-emerald-600 rounded-full origin-bottom rotate-[35deg] opacity-90 shadow-sm" />
                </div>
                {/* Pot */}
                <div className="w-10 h-11 bg-white rounded-b-lg border-t-2 border-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.05)]" />
              </div>

              {/* Laptop & Mobile Container */}
              <div className="relative w-full max-w-[540px] mt-8 lg:mt-0">
                {/* Laptop Screen */}
                <div className="relative w-full aspect-[16/10] bg-[#161c2d] rounded-t-[1.25rem] rounded-b-sm shadow-xl border-[8px] border-[#1e2536] overflow-hidden flex shrink-0">
                  {/* Sidebar */}
                  <div className="w-12 border-r border-[#262f45] bg-[#1a2235] flex flex-col items-center py-4 gap-4">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold shadow-md">C</div>
                    <div className="w-6 h-6 rounded-md bg-[#232d42] flex items-center justify-center text-slate-400 hover:text-white transition-colors"><FiMenu size={12} /></div>
                    <div className="w-6 h-6 rounded-md bg-[#232d42] flex items-center justify-center text-slate-400 hover:text-white transition-colors"><FiActivity size={12} /></div>
                    <div className="w-6 h-6 rounded-md bg-[#232d42] flex items-center justify-center text-slate-400 hover:text-white transition-colors"><FiUsers size={12} /></div>
                  </div>
                  {/* Main Screen Content */}
                  <div className="flex-1 flex flex-col bg-[#161c2d]">
                    {/* Navbar */}
                    <div className="h-10 border-b border-[#262f45] px-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                      </div>
                      <div className="w-40 h-6 rounded-full bg-[#1e2536] flex items-center px-3 gap-2 text-[10px] text-slate-400 border border-[#262f45]">
                        <FiSearch size={10} />
                        <span>Search</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiBell className="text-slate-400" size={12} />
                        <div className="w-6 h-6 rounded-full bg-indigo-500 text-[8px] text-white flex items-center justify-center font-bold">U</div>
                      </div>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="flex-1 p-4 space-y-3 overflow-hidden">
                      {/* Top Metrics Cards */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#1e2536] p-3 rounded-xl border border-[#262f45]">
                          <div className="text-[8px] text-slate-400 font-medium mb-1">Total Users</div>
                          <div className="text-[14px] font-black text-white">12,645</div>
                          <div className="text-[7px] text-emerald-400 font-bold mt-1">▲ 12.5% <span className="text-slate-500 ml-1">vs last month</span></div>
                        </div>
                        <div className="bg-[#1e2536] p-3 rounded-xl border border-[#262f45]">
                          <div className="text-[8px] text-slate-400 font-medium mb-1">Revenue</div>
                          <div className="text-[14px] font-black text-white">₹68,945</div>
                          <div className="text-[7px] text-emerald-400 font-bold mt-1">▲ 6.2% <span className="text-slate-500 ml-1">vs last month</span></div>
                        </div>
                        <div className="bg-[#1e2536] p-3 rounded-xl border border-[#262f45]">
                          <div className="text-[8px] text-slate-400 font-medium mb-1">Projects</div>
                          <div className="text-[14px] font-black text-white">78</div>
                          <div className="text-[7px] text-indigo-400 font-bold mt-1">▲ 16.0% <span className="text-slate-500 ml-1">vs last month</span></div>
                        </div>
                      </div>

                      {/* Middle Charts */}
                      <div className="grid grid-cols-5 gap-3 h-[110px]">
                        {/* Performance */}
                        <div className="col-span-3 bg-[#1e2536] p-3 rounded-xl border border-[#262f45] flex flex-col">
                          <span className="text-[8px] text-slate-400 font-medium mb-2">Performance</span>
                          <div className="flex-1 w-full relative mt-1">
                            <svg className="w-full h-full text-indigo-500 stroke-current fill-none" viewBox="0 0 100 40" preserveAspectRatio="none">
                              <path d="M0,35 Q15,10 30,25 T60,5 T90,30 L100,10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                        {/* Top Services */}
                        <div className="col-span-2 bg-[#1e2536] p-3 rounded-xl border border-[#262f45] flex flex-col justify-between items-center">
                          <span className="text-[8px] text-slate-400 font-medium w-full mb-1">Top Services</span>
                          <div className="flex items-center gap-3 w-full justify-center">
                            <div className="w-12 h-12 rounded-full border-[6px] border-[#262f45] border-t-indigo-500 border-r-emerald-500 border-b-amber-500 border-l-rose-500 shrink-0" />
                            <div className="space-y-1">
                              <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /><span className="text-[6px] text-slate-300">Web Dev</span></div>
                              <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="text-[6px] text-slate-300">AI Sol.</span></div>
                              <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /><span className="text-[6px] text-slate-300">Mobile Apps</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Laptop Base */}
                <div className="h-4 w-[110%] -ml-[5%] bg-[#e2e8f0] rounded-b-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex justify-center border-t border-white relative z-0">
                  <div className="w-1/4 h-1.5 bg-[#cbd5e1] rounded-b-md" />
                </div>

                {/* Smartphone Mockup */}
                <div className="absolute -bottom-6 -right-6 w-[120px] h-[240px] bg-white rounded-[24px] shadow-2xl border-[6px] border-slate-800 p-2 overflow-hidden flex flex-col z-20 hidden sm:flex">
                  <div className="w-12 h-4 bg-slate-800 rounded-b-2xl mx-auto -mt-2 shrink-0 relative z-20 flex justify-center">
                    <div className="w-2 h-1 bg-slate-700 rounded-full mt-1.5" />
                  </div>
                  <div className="flex items-center justify-between px-1 mt-1 mb-2">
                    <div className="text-[8px] font-black text-[#0f172a]">Dashboard</div>
                    <FiSearch size={8} className="text-slate-400" />
                  </div>

                  {/* Circle Progress */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 flex flex-col items-center justify-center gap-1.5 shadow-sm">
                    <div className="text-[6px] font-bold text-slate-400">Monthly Progress</div>
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-200 stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-indigo-600 stroke-current" strokeWidth="3" strokeDasharray="78, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800">
                        78%
                      </div>
                    </div>
                  </div>

                  {/* Activity List */}
                  <div className="flex-1 mt-3 space-y-2">
                    <div className="text-[6px] font-bold text-slate-400 ml-1">Recent Activity</div>
                    <div className="flex items-center gap-1.5 px-1">
                      <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center"><FiUsers size={6} className="text-indigo-500" /></div>
                      <div className="flex-1 space-y-1"><div className="h-1 bg-slate-200 rounded w-full" /><div className="h-1 bg-slate-100 rounded w-1/2" /></div>
                    </div>
                    <div className="flex items-center gap-1.5 px-1">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center"><FiSend size={6} className="text-emerald-500" /></div>
                      <div className="flex-1 space-y-1"><div className="h-1 bg-slate-200 rounded w-4/5" /><div className="h-1 bg-slate-100 rounded w-2/3" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="relative z-20 mt-[-30px] mb-6 lg:mb-10 mx-auto max-w-[1100px] w-full px-4">
        <HomeSections isFloating={true} />
      </div>

      {/* <SolutionsSection />
      
      <WhyChooseUsSection />

      <RecentWorkSection />
      
      <HowWeWorkSection />

      <StatsDarkSection />

      <PartnersClientsSection />

      <TestimonialsSection />

      <CTASection />
       */}
    </div>
  );
}
