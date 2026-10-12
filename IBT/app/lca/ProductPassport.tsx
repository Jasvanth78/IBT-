import Image from 'next/image';
import { FaCloud, FaIndustry } from 'react-icons/fa';
import { FiFileText, FiBarChart2 } from 'react-icons/fi';
import styles from './ProductPassport.module.css';

const features = [
  { title: 'Product Information', description: 'Specifications, materials, and manufacturing details accessible at a glance.', icon: FiFileText },
  { title: 'Carbon Footprint', description: "Verified emissions data across the product's full life cycle.", icon: FaCloud },
  { title: 'Supply-Chain Data', description: 'Origin, sourcing, and supplier sustainability information.', icon: FaIndustry },
  { title: 'Environmental Impact', description: 'LCA results, water use, energy consumption, and waste metrics.', icon: FiBarChart2 },
];

export default function ProductPassport() {
  return (
    <section className={styles.section} aria-labelledby="passport-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.badge}>DIGITAL PRODUCT PASSPORTS</div>
          <h2 id="passport-heading">Bring Product<br /><span>Transparency</span> to Life</h2>
          <p className={styles.description}>JIVA enables businesses to create Digital Product Passports that customers and stakeholders can access using a QR code – delivering the transparency, traceability, and trust that modern markets demand.</p>
          <div className={styles.cards}>
            {features.map(({ title, description, icon: Icon }, index) => (
              <article className={styles.card} key={title}>
                <div className={styles.icon}>
                  <Icon />
                  {index === 1 && <b className={styles.co2}>CO₂</b>}
                </div>
                <div className={styles.cardCopy}><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </div>
        <div className={styles.art}>
          <div className={styles.orbit} aria-hidden="true" />
          <Image src="/images/product-passport.png" alt="Leaf-decorated product package with a QR code beside a phone displaying its product sustainability profile" width={1024} height={1024} sizes="(max-width: 760px) 100vw, 48vw" />
        </div>
      </div>
      <div className={styles.cornerLeaves} aria-hidden="true"><i /><i /><i /><i /></div>
    </section>
  );
}
