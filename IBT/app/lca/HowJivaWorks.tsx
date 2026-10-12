'use client';

import { FaFolderOpen, FaSearch, FaCloud, FaCalculator, FaBullseye, FaThermometerHalf, FaCogs, FaLightbulb, FaFileAlt, FaChartBar } from 'react-icons/fa';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import styles from './HowJivaWorks.module.css';

const steps = [
  { number: '05', title: 'Report and Communicate', text: 'Generate sustainability insights and reports and share with customers and stakeholders.', icon: FaFileAlt, accent: FaChartBar, className: 'report' },
  { number: '04', title: 'Explore Improvements', text: 'Compare different options and identify ways to reduce emissions.', icon: FaCogs, accent: FaLightbulb, className: 'improve' },
  { number: '03', title: 'Identify Hotspots', text: 'Find the areas contributing most to environmental impact.', icon: FaBullseye, accent: FaThermometerHalf, className: 'hotspots' },
  { number: '02', title: 'Measure Your Impact', text: 'Calculate carbon emissions and assess environmental footprint.', icon: FaCalculator, accent: FaCloud, className: 'measure' },
  { number: '01', title: 'Collect Your Data', text: 'Bring together information about operations, products, energy, materials, transportation, and suppliers.', icon: FaFolderOpen, accent: FaSearch, className: 'collect' },
];

export default function HowJivaWorks() {
  const reduceMotion = useReducedMotion();
  return (
    <section className={styles.section} aria-labelledby="how-jiva-heading">
      <div className={styles.inner}>
        <div className={styles.badge}>HOW IT WORKS</div>
        <h2 id="how-jiva-heading">From Sustainability Data<br />to <span>Better Decisions</span></h2>
        <div className={styles.journey}>
          <svg className={styles.path} viewBox="0 0 900 475" fill="none" aria-hidden="true">
            <defs><filter id="jiva-path-shadow"><feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#80d999" floodOpacity=".2" /></filter></defs>
            <path d="M410 -24 C410 22 302 1 302 67 C302 170 541 9 584 107 C635 224 310 72 296 216 C285 355 593 143 593 299 C593 432 297 246 297 382 C297 440 360 422 421 475" stroke="#e8faee" strokeWidth="26" filter="url(#jiva-path-shadow)" />
            <path d="M410 -24 C410 22 302 1 302 67 C302 170 541 9 584 107 C635 224 310 72 296 216 C285 355 593 143 593 299 C593 432 297 246 297 382 C297 440 360 422 421 475" stroke="#38bd73" strokeWidth="1.2" strokeDasharray="5 4" />
            {[67,216,382].map(y => <path key={y} d={`M262 ${y} H302`} stroke="#16994d" strokeDasharray="3 3" />)}
            {[133,299].map(y => <path key={y} d={`M593 ${y} H650`} stroke="#16994d" strokeDasharray="3 3" />)}
            {[[262,67],[302,67],[262,216],[302,216],[262,382],[302,382],[593,133],[650,133],[593,299],[650,299]].map(([cx,cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="#00994b" />)}
          </svg>
          {steps.map(({ number, title, text, icon: Icon, accent: Accent, className }) => (
            <motion.div className={`${styles.step} ${styles[className]}`} key={number}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : (5 - Number(number)) * 0.14 }}>
              <article className={styles.card}>
                <span className={styles.number}>{number}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
              <div className={styles.illustration} aria-hidden="true">
                <Icon className={styles.mainIcon} /><Accent className={styles.accent} />
                {number === '02' && <b className={styles.co2}>CO₂</b>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className={styles.hills} aria-hidden="true">
        <Image src="/images/how-jiva-landscape.png" alt="" fill sizes="100vw" priority className={styles.landscape} />
      </div>
      <div className={styles.leavesBottom} aria-hidden="true"><i /><i /><i /></div>
    </section>
  );
}
