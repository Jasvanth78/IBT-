'use client'

import { useSocketSettings } from '@/src/providers/SocketSettingsProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiArrowUp } from 'react-icons/fi'
import { useEffect, useState } from 'react'

export function WhatsappButton() {
  const { settings } = useSocketSettings()
  const phoneNumber = settings.whatsappNumber
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    // We use a small delay to ensure the DOM is fully painted and the anchor is present
    const timer = setTimeout(() => {
      const anchor = document.getElementById('scroll-anchor');
      if (!anchor) return;

      const observer = new IntersectionObserver((entries) => {
        // If the anchor at the very top is no longer intersecting, we have scrolled down
        setShowScrollTop(!entries[0].isIntersecting);
      }, {
        root: null, // use the viewport
        threshold: 0
      });

      observer.observe(anchor);

      return () => observer.disconnect();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    // Try scrolling both window and any potential internal scroll container
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Also scroll the main layout container if it's the one scrolling
    const mainContainers = document.querySelectorAll('.min-h-screen, .h-screen, main, [class*="overflow-y"]');
    mainContainers.forEach(container => {
      if (container.scrollTop > 0) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  // Remove any non-numeric characters from the phone number for the link
  const cleanNumber = phoneNumber ? phoneNumber.replace(/\D/g, '') : ''

  return (
    <div className="whatsapp-btn-wrapper fixed bottom-20 right-6 z-[999999] flex flex-col items-center gap-3 transition-opacity duration-300">
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-slate-800 text-white shadow-xl transition-colors hover:bg-slate-700"
            aria-label="Scroll to top"
          >
            <FiArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phoneNumber && (
          <motion.a
            href={`https://wa.me/${cleanNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all hover:bg-[#128C7E] active:scale-95"
            aria-label="Contact us on WhatsApp"
          >
            <FaWhatsapp className="text-2xl md:text-3xl" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white/20"></span>
            </span>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  )
}
