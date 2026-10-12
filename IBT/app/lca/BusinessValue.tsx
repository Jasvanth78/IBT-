'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { FaLeaf, FaRuler, FaLightbulb, FaChartBar, FaBullhorn, FaCogs } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import styles from './BusinessValue.module.css';

const benefits = [
  { title: 'Measure Impact', text: 'Understand your full environmental footprint with precision and confidence.', icon: FaRuler },
  { title: 'Identify Opportunities', text: 'Find the biggest areas for improvement across your operations and supply chain.', icon: FaLightbulb },
  { title: 'Improve Performance', text: 'Use data and AI-powered insights to make better, faster sustainability decisions.', icon: FaChartBar },
  { title: 'Communicate Progress', text: 'Share verified sustainability information with customers, investors, and stakeholders.', icon: FaBullhorn },
];

export default function BusinessValue() {
  const reduceMotion = useReducedMotion();
  return (
    <section className={styles.section} aria-labelledby="business-value-heading">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <div className={styles.badge}>BUSINESS VALUE</div>
          <h2 id="business-value-heading">Turn Sustainability Data into<br /><span>Business Value</span></h2>
          <p>Sustainability is more than simply measuring carbon emissions. Businesses today need to understand their environmental impact, respond to growing sustainability expectations, improve transparency, and communicate their progress effectively. JIVA helps turn sustainability data into practical insights and better business decisions.</p>
          <Image className={styles.dashboard} src="/images/jiva-business-value.png" alt="Sustainability dashboard showing an ascending green chart and lower emissions, higher efficiency, better decisions and greater transparency" width={1536} height={1024} sizes="(max-width: 700px) 100vw, 42vw" />
        </div>
        <div className={styles.grid}>
          {benefits.map(({ title, text, icon: Icon }) => (
            <article className={styles.card} key={title}>
              <span className={styles.icon} aria-hidden="true"><Icon /></span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
        <div className={styles.cta}>
          <Image src="/images/jiva-get-started.png" alt="" fill sizes="100vw" className={styles.ctaBackground} />
          <div className={styles.ctaCopy}>
            <div className={styles.badge}>GET STARTED</div>
            <h2>Ready to Make<br /><span>Sustainability Smarter?</span></h2>
            <p>Whether you want to measure your carbon footprint, assess your product&apos;s environmental impact, improve supply-chain transparency, or communicate your sustainability efforts – JIVA provides an AI-powered approach to sustainability management.</p>
            <Link href="/contact-us?inquiry=lca-demo" className={styles.button}>Request a Demo <FiArrowRight /></Link>
          </div>
          <div className={styles.ctaArt}>
            <svg className={styles.stagePath} viewBox="0 0 500 120" fill="none" aria-hidden="true">
              <path d="M62 86 Q245 -53 434 86" stroke="#82ce39" strokeWidth="1" strokeDasharray="3 3" />
              {[ [100,61], [151,32], [245,15], [345,35], [396,62] ].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="2.5" fill="#71c827" />)}
            </svg>
            <motion.div className={styles.stages} aria-hidden="true"
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.6 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.3 } } }}>
              {[{ title: 'Measure', icon: FaLeaf }, { title: 'Understand', icon: FaCogs }, { title: 'Improve', icon: FaChartBar }, { title: 'Communicate', icon: FaBullhorn }].map(({ title, icon: Icon }) => (
                <motion.div key={title} variants={{
                  hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : 0.85 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: reduceMotion ? 0 : 0.45, ease: 'easeOut' } },
                }}><span><Icon /></span><b>{title}</b></motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
