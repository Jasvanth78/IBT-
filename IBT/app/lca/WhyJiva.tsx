import { FiLayers, FiBarChart2, FiTag, FiTarget, FiClock, FiArrowUpCircle } from 'react-icons/fi';

import styles from './WhyJiva.module.css';

const benefits = [
  { title: 'Make Sustainability Easier', text: 'Manage all sustainability activities through one platform instead of multiple tools and spreadsheets.', icon: FiLayers },
  { title: 'Make Data-Driven Decisions', text: 'Use sustainability data and AI-powered insights to identify improvement opportunities with confidence.', icon: FiBarChart2 },
  { title: 'Improve Product Transparency', text: 'Share relevant sustainability information through Digital Product Passports accessible to customers and stakeholders.', icon: FiTag },
  { title: 'Identify Environmental Hotspots', text: 'Find the processes, materials, or activities contributing most to environmental impact.', icon: FiTarget },
  { title: 'Prepare for a Sustainable Future', text: 'Build a structured approach to carbon management, environmental assessment, ESG reporting, and continuous improvement.', icon: FiClock },
];

export default function WhyJiva() {
  return (
    <section className={styles.section} aria-labelledby="why-jiva-heading">
      <div className={styles.leavesTop} aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className={styles.leavesBottom} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.inner}>
        <div className={styles.badge}>WHY JIVA</div>
        <h2 id="why-jiva-heading">Why Choose <span>JIVA?</span></h2>
        <div className={styles.grid}>
          {benefits.map(({ title, text, icon: Icon }, index) => (
            <article className={styles.card} key={title}>
              <div className={styles.icon} aria-hidden="true"><Icon />{index === 4 && <FiArrowUpCircle className={styles.future} />}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
