'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaLeaf, FaCubes, FaIndustry, FaTruck, FaShoppingCart, FaRecycle, FaCloud, FaBolt, FaTint, FaTrash } from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';
import styles from './LifecycleSection.module.css';

const stages = [
  { title: 'Raw Materials', description: 'Extraction and sourcing', icon: FaCubes },
  { title: 'Manufacturing', description: 'Production and processing', icon: FaIndustry },
  { title: 'Transportation', description: 'Logistics and distribution', icon: FaTruck },
  { title: 'Use', description: 'Product in operation', icon: FaShoppingCart },
  { title: 'End of Life', description: 'Disposal or recycling', icon: FaRecycle },
  { title: 'Feedback Loop', description: 'Continuous improvement', icon: FiTrendingUp },
];

export default function LifecycleSection() {
  const reduceMotion = useReducedMotion();
  const diagramRef = useRef<HTMLDivElement>(null);
  const [connections, setConnections] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;
    const update = () => {
      const bounds = diagram.getBoundingClientRect();
      const globe = diagram.querySelector(`.${styles.globe}`)?.getBoundingClientRect();
      if (!globe) return;
      const targets = [[0.5, 0.1], [0.79, 0.3], [0.88, 0.61], [0.66, 0.84], [0.13, 0.61], [0.21, 0.3]];
      setConnections(stages.map((_, index) => {
        const card = diagram.querySelector(`.${styles[`stage${index}`]}`)!.getBoundingClientRect();
        const isTop = index === 0;
        const isBottom = index === 3;
        const isRight = index === 1 || index === 2;
        return {
          x1: (isTop || isBottom ? card.left + card.width / 2 : isRight ? card.left : card.right) - bounds.left,
          y1: (isTop ? card.bottom : isBottom ? card.top : card.top + card.height / 2) - bounds.top,
          x2: globe.left - bounds.left + globe.width * targets[index][0],
          y2: globe.top - bounds.top + globe.height * targets[index][1],
        };
      }));
    };
    const observer = new ResizeObserver(update);
    observer.observe(diagram);
    update();
    return () => observer.disconnect();
  }, []);
  return (
    <section className={styles.section} aria-labelledby="lifecycle-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.badge}>LIFE CYCLE THINKING</div>
          <h2 id="lifecycle-heading">Understand Environmental Impact Across the Entire <span>Life Cycle</span></h2>
          <p>Identify hotspots. Compare alternatives. Make better sustainability decisions. JIVA helps you look beyond individual operations and understand environmental impact across the entire product or business life cycle.</p>
          <div className={styles.metrics}>
            {[{ title: 'Carbon', icon: FaCloud }, { title: 'Energy', icon: FaBolt }, { title: 'Water', icon: FaTint }, { title: 'Materials', icon: FaLeaf }, { title: 'Waste', icon: FaTrash }].map(({ title, icon: Icon }) => <div key={title}><Icon /><span>{title}</span></div>)}
          </div>
        </div>
        <motion.div ref={diagramRef} className={styles.diagram} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.15 } } }}>
          <div className={styles.globe}><Image src="/images/Circular Eco Lifecycle Globe Infographic.png" alt="Circular product lifecycle showing raw materials, manufacturing, transport, use and recycling around a green globe" fill sizes="(max-width: 700px) 80vw, 360px" /></div>
          <svg className={styles.connections} aria-hidden="true">
            {connections.map((line, index) => <g key={index}><line {...line} stroke="#35bd78" strokeWidth="1" strokeDasharray="4 3" /><circle cx={line.x2} cy={line.y2} r="3.5" fill="#0b9b58" /></g>)}
          </svg>
          {stages.map(({ title, description, icon: Icon }, index) => (
            <motion.article key={title} className={`${styles.card} ${styles[`stage${index}`]}`}
              variants={{ hidden: { opacity: reduceMotion ? 1 : 0 }, visible: { opacity: 1, transition: { duration: reduceMotion ? 0 : 0.5 } } }}>
              <span className={styles.icon}><Icon /></span><div><h3>{title}</h3><p>{description}</p></div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
