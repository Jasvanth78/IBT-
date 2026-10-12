import Image from 'next/image';
import styles from './CoreCapabilities.module.css';

const capabilities = [
  { title: 'Carbon Accounting & GHG Emissions', text: 'Measure and manage Scope 1, 2, and all 15 Scope 3 categories. Activity-based and spend-based calculations give you a complete emissions picture.' },
  { title: 'Life Cycle Assessment', text: "Assess environmental impact from raw materials to end of life. Identify hotspots across every stage of your product's journey." },
  { title: 'Sustainability Scenario Analysis', text: 'Compare materials, processes, and alternatives based on potential environmental impact to support better sustainability decisions.' },
  { title: 'Digital Product Passports', text: 'Create digital product information accessible through QR codes. Deliver transparency, traceability, and trust to customers and stakeholders.' },
  { title: 'AI-Powered Sustainability Assistant', text: 'Use AI to support data management, emission factor selection, hotspot identification, and automated report generation.' },
  { title: 'Supplier & Buyer Collaboration', text: 'Collect and share sustainability information with suppliers, buyers, employees, auditors, and other stakeholders in one connected platform.' },
];

export default function CoreCapabilities() {
  return (
    <section className={styles.section} aria-labelledby="capabilities-heading">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.badge}>CORE CAPABILITIES</div>
          <h2 id="capabilities-heading">Everything You Need for<br />Smarter <span>Sustainability Management</span></h2>
        </header>
        <div className={styles.grid}>
          {capabilities.map(({ title, text }, index) => (
            <article className={styles.card} key={title}>
              <div className={styles.art}><Image src={`/images/lca-card-${index + 1}.png`} alt={title} width={400} height={300} sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw" /></div>
              <div className={styles.content}><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
