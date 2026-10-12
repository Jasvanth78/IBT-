'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { FaLeaf, FaFolderOpen, FaTachometerAlt, FaSearch, FaCubes, FaFileAlt } from 'react-icons/fa';
import styles from './PlatformOverview.module.css';

const steps = [
  { title: 'Collect Data', text: 'Gather sustainability information from operations, products, and supply chain.', icon: FaFolderOpen },
  { title: 'Measure Impact', text: 'Calculate GHG emissions and environmental footprint.', icon: FaTachometerAlt },
  { title: 'Identify Hotspots', text: 'Find areas contributing most to environmental impact.', icon: FaSearch },
  { title: 'Improve', text: 'Explore alternatives and implement reduction strategies.', icon: FaCubes },
  { title: 'Report', text: 'Generate sustainability reports and communicate progress to stakeholders.', icon: FaFileAlt },
];

export default function PlatformOverview() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="what-is-jiva" className={styles.section} aria-labelledby="platform-overview-heading">
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.copy}>
            <div className={styles.badge}>PLATFORM OVERVIEW</div>
            <h2 id="platform-overview-heading">What Is <span>JIVA?</span></h2>
            <p>JIVA is a sustainability intelligence platform designed to help businesses understand and reduce their environmental impact. It helps organizations collect sustainability data, calculate greenhouse gas emissions, assess the environmental impact of products and processes, identify areas for improvement, and create meaningful sustainability reports. JIVA follows a Life Cycle Thinking approach, helping businesses look beyond individual operations and understand environmental impact across the entire product or business life cycle.</p>
          </div>
          <Image className={styles.globe} src="/images/jiva-overview-world.png" alt="Green world globe surrounded by leaves with chart, leaf and recycling symbols" width={1024} height={768} sizes="(max-width: 700px) 85vw, 28vw" />
        </div>
        <motion.ol className={styles.steps} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.22 } } }}>
          {steps.map(({ title, text, icon: Icon }, index) => (
            <motion.li className={styles.step} key={title} variants={{
              hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 24 },
              visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' } },
            }}>
              <div className={styles.tile}>
                <svg className={styles.outline} viewBox="0 0 200 112" preserveAspectRatio="none" aria-hidden="true"><path d="M8 1 H155 Q162 1 167 8 L197 51 Q201 56 197 61 L167 104 Q162 111 155 111 H8 Q1 111 5 104 L31 61 Q35 56 31 51 L5 8 Q1 1 8 1Z" fill="currentColor" stroke="var(--outline)" /></svg>
                <span className={styles.number}>0{index + 1}</span>
                <Icon className={styles.stepIcon} />
                {index < 4 && <span className={styles.connector} aria-hidden="true"><i /></span>}
              </div>
              <div className={styles.stepCopy}><h3>{title}</h3><p>{text}</p></div>
            </motion.li>
          ))}
        </motion.ol>
        <div className={styles.note}><FaLeaf aria-hidden="true" /><p>JIVA&apos;s five-step process turns complex sustainability data into actionable insights – from initial data collection through to stakeholder communication.</p></div>
      </div>
    </section>
  );
}
