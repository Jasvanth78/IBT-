import Image from 'next/image';
import Link from 'next/link';

import { FiArrowRight, FiPlay } from 'react-icons/fi';
import styles from './LcaHero.module.css';

export default function LcaHero() {
  return (
    <section className={styles.section} aria-labelledby="lca-hero-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.badge}>AI-POWERED SUSTAINABILITY PLATFORM</div>
          <h1 id="lca-hero-heading">Simplify Sustainability<br />Management with<br /><span>AI-Powered Solutions</span></h1>
          <p>JIVA is an AI-powered sustainability management platform that helps businesses measure carbon emissions, understand environmental impact, improve sustainability performance, and communicate their progress.</p>
          <div className={styles.actions}>
            <Link href="/contact-us?inquiry=lca-demo" className={styles.primary}>Request a Demo <FiArrowRight /></Link>
            <a href="#what-is-jiva" className={styles.secondary}>Explore JIVA <span><FiPlay /></span></a>
          </div>
        </div>
        <div className={styles.art}>
          <Image src="/images/jiva-hero-laptop.png" alt="Laptop displaying the JIVA sustainability analytics dashboard with emissions, energy, water use and sustainability score charts" width={1536} height={1024} sizes="(max-width: 800px) 100vw, 55vw" priority />
        </div>
      </div>
    </section>
  );
}
