import Image from 'next/image';
import { FaTshirt, FaIndustry, FaBoxOpen, FaPizzaSlice, FaMicrochip, FaCapsules, FaFlask, FaShoppingCart, FaTruck, FaHotel, FaDesktop, FaGraduationCap, FaBuilding, FaSatellite, FaUsers, FaHandHoldingHeart } from 'react-icons/fa';
import styles from './IndustriesServed.module.css';

const industries = [
  { name: 'Textile & Apparel', icon: FaTshirt },
  { name: 'Steel Manufacturing', icon: FaIndustry },
  { name: 'Packaging', icon: FaBoxOpen },
  { name: 'Food Processing', icon: FaPizzaSlice },
  { name: 'Electronics & Electrical', icon: FaMicrochip },
  { name: 'Pharmaceuticals', icon: FaCapsules },
  { name: 'Chemicals', icon: FaFlask },
  { name: 'Consumer Products', icon: FaShoppingCart },
  { name: 'Logistics & Warehousing', icon: FaTruck },
  { name: 'Hospitality', icon: FaHotel },
  { name: 'IT & Software', icon: FaDesktop },
  { name: 'Education', icon: FaGraduationCap },
  { name: 'Construction', icon: FaBuilding },
  { name: 'Aerospace & Satellite', icon: FaSatellite },
  { name: 'Events & Conferences', icon: FaUsers },
  { name: 'ESG & Sustainability Consulting', icon: FaHandHoldingHeart },
];

export default function IndustriesServed() {
  return (
    <section className={styles.section} aria-labelledby="industries-heading">
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.badge}>INDUSTRIES SERVED</div>
          <h2 id="industries-heading">Sustainability Solutions<br /><span>Across Industries</span></h2>
          <p className={styles.description}>JIVA serves sustainability teams across diverse sectors – from manufacturing and logistics to technology and consulting.</p>
          <ul className={styles.grid}>
            {industries.map(({ name, icon: Icon }) => (
              <li className={styles.card} key={name}>
                <span className={styles.icon} aria-hidden="true"><Icon /></span>
                <span className={styles.name}>{name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.art}>
          <Image src="/images/industries-sustainability.png" alt="Green globe surrounded by industry symbols above a sustainable city with factories, trees, solar panels and a wind turbine" width={1024} height={1536} sizes="(max-width: 760px) 100vw, 40vw" />
        </div>
      </div>
    </section>
  );
}
