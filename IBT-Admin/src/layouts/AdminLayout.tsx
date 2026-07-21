import { useState, useRef, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { cx } from '../utils/cx'
import { MaintenanceStatusBanner } from '../component/MaintenanceStatusBanner'
import { AdminNavbar } from './admin/AdminNavbar'
import { AdminSidebar } from './admin/AdminSidebar'

export function AdminLayout() {
  const [collapsed] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [locked, setLocked] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)


  const sidebarExpanded = locked || hovered

  useEffect(() => {
    const handleMouseEnter = () => {
      setHovered(true)
    }

    const handleMouseLeave = () => {
      setHovered(false)
    }

    const sidebar = sidebarRef.current
    if (sidebar) {
      sidebar.addEventListener('mouseenter', handleMouseEnter)
      sidebar.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        sidebar.removeEventListener('mouseenter', handleMouseEnter)
        sidebar.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-transparent">
      <div ref={sidebarRef}>
        <AdminSidebar
          collapsed={!sidebarExpanded && collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          locked={locked}
          onToggleLocked={() => setLocked((prev) => !prev)}
        />
      </div>

      <AdminNavbar
        collapsed={!sidebarExpanded && collapsed}
        onOpenMobileSidebar={() => setMobileOpen(true)}
        onCloseMobileSidebar={() => setMobileOpen(false)}
      />

      <div
        className={cx(
          'transition-all duration-300',
          !sidebarExpanded && collapsed ? 'lg:pl-18' : 'lg:pl-64',
        )}
      >
        <main className="pt-18">
          <MaintenanceStatusBanner />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
