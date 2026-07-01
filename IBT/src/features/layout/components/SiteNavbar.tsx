'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiInfo } from 'react-icons/fi';
import { SiteButton } from '@/src/shared/ui';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about-us', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/internship', label: 'Internship' },
  { href: '/ibt-labs', label: 'IBT Labs' },

  { href: '/contact-us', label: 'Contact Us' }

];

export function SiteNavbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setMobileOpen(false);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-nav-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-nav-open');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('mobile-nav-open');
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center">
            <Image
              src="/logo.png"
              alt="IBT Website"
              width={180}
              height={50}
              priority
              className="block h-16 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
            />
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => {
              // Avoid hydration mismatch by waiting for client mount to set active state
              const isActive = mounted && pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'px-4 py-2 text-[15px] font-bold transition-all duration-300 relative',
                    isActive
                      ? 'text-[#e63946] after:absolute after:bottom-1 after:left-4 after:right-4 after:h-[2px] after:bg-[#e63946]'
                      : 'text-[#1d3557] hover:text-[#e63946]',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <SiteButton
              href="/contact-us"
              className="bg-[#e63946] hover:bg-[#c1121f] text-white rounded-md px-6 py-2.5 text-[14px] font-bold transition-all shadow-md"
              rightIcon={<FiArrowRight size={16} />}
            >
              Get In Touch
            </SiteButton>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-[#1d3557] lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <div
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
        className={[
          'fixed inset-0 z-60 bg-slate-900/35 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden',
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />

      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        className={[
          'fixed inset-y-0 right-0 z-70 flex h-[100dvh] w-[86vw] max-w-sm flex-col overflow-y-auto border-l border-(--ui-border) bg-white shadow-[-24px_0_50px_rgba(35,24,21,0.15)] transition-transform duration-300 ease-out lg:hidden',
          mobileOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none',
        ].join(' ')}
      >
        <div className="flex items-center justify-between border-b border-(--ui-border) px-4 py-4">
          <Image src="/logo.png" alt="IBT Website" width={180} height={50} className="block h-10 w-auto object-contain" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-(--ui-border) text-(--ui-text) transition-colors hover:bg-(--ui-surface-muted)"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto p-4">
          <div className="flex flex-1 flex-col">
            {navItems.map((item) => {
              const isActive = mounted && pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'rounded-xl px-4 py-3 text-base sm:text-lg font-semibold transition-colors',
                    isActive
                      ? 'bg-(--ui-primary) text-white'
                      : 'text-(--ui-text) hover:bg-(--ui-surface-muted)',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="sticky bottom-0 mt-auto -mx-4 border-t border-(--ui-border) bg-white px-4 pb-8 pt-4 sm:pb-4">
            <SiteButton href="/contact-us" variant="primary" size="md" fullWidth>
              Get In Touch
            </SiteButton>
          </div>
        </nav>
      </aside>
    </>
  );
}