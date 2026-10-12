import { FiBookOpen, FiBriefcase, FiCpu, FiFileText, FiGrid, FiHome, FiLayers, FiList, FiMapPin, FiPhone, FiSettings, FiStar, FiUsers, FiX, FiLock, FiUnlock, FiHexagon, FiChevronDown, FiShare2, FiLogOut } from 'react-icons/fi'
import type { ReactNode } from 'react'
import { useState, useMemo } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { cx } from '../../utils/cx'
import { clearAuthStorage } from '../../features/auth/storage'
import { queryClient } from '../../lib/queryClient'

type AdminSidebarProps = {
  collapsed: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
  locked: boolean
  onToggleLocked: () => void
}

type NavItem = {
  label: string
  icon: ReactNode
  to?: string
  children?: NavItem[]
  id?: string
}

// Configure your navigation here - easily add more modules or subpages
const NAV_LINKS: NavItem[] = [
  { label: 'Dashboard', icon: <FiGrid />, to: '/admin/dashboard' },
  
  {
    label: 'Master Data',
    icon: <FiLayers />,
    id: 'master-data',
    children: [
      { label: 'Home Content', icon: <FiHome />, to: '/admin/master/home/content' },
      { label: 'About Content', icon: <FiFileText />, to: '/admin/master/about/content' },
      { label: 'Services Master', icon: <FiBriefcase />, to: '/admin/master/services' },
      { label: 'Product Page', icon: <FiFileText />, to: '/admin/master/products/content' },
      { label: 'Stats', icon: <FiFileText />, to: '/admin/master/stats' },
      { label: 'Testimonials', icon: <FiStar />, to: '/admin/master/testimonials' },
      { label: 'Partners', icon: <FiLayers />, to: '/admin/master/partners' },
      { label: 'Colleges', icon: <FiLayers />, to: '/admin/master/colleges' },
      { label: 'Clients', icon: <FiLayers />, to: '/admin/master/clients' },
      { label: 'Branches', icon: <FiMapPin />, to: '/admin/master/branches' },
      { label: 'Contacts', icon: <FiPhone />, to: '/admin/master/contacts' },
      { label: 'Social Links', icon: <FiShare2 />, to: '/admin/master/social-links' },
      { label: 'Lab Projects', icon: <FiCpu />, to: '/admin/master/lab-projects' },
      { label: 'Lab Ideas', icon: <FiFileText />, to: '/admin/master/lab-projects/submissions' },
      { label: 'Internship', icon: <FiBriefcase />, to: '/admin/master/internship' },
      { label: 'Applications', icon: <FiFileText />, to: '/admin/master/internship/applications' },
    ],
  },

  { label: 'Team Members', icon: <FiUsers />, to: '/admin/master/members' },
  { label: 'Blogs', icon: <FiBookOpen />, to: '/admin/master/blogs' },
  { label: 'Audit Logs', icon: <FiList />, to: '/admin/audit-logs' },

  { label: 'Settings', icon: <FiSettings />, to: '/admin/settings' },
]

// Helper: Check if item has children
function hasChildren(item: NavItem): boolean {
  return !!(item.children && item.children.length > 0)
}

// Helper: Find active parent item
function findActiveParent(items: NavItem[], pathname: string): NavItem | null {
  for (const item of items) {
    if (hasChildren(item) && item.children) {
      const activeChild = item.children.some(child => child.to === pathname)
      if (activeChild) {
        return item
      }
    }
  }
  return null
}

// Helper: Get parent ID for state management
function getParentId(item: NavItem): string {
  return item.id || item.label
}

export function AdminSidebar({ collapsed, mobileOpen, onCloseMobile, locked, onToggleLocked }: AdminSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['master-data']))

  // Find which parent item has an active child
  const activeParent = useMemo(() => findActiveParent(NAV_LINKS, location.pathname), [location.pathname])

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const handleLogout = () => {
    clearAuthStorage()
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  // Render navigation items recursively
  const renderNavItem = (item: NavItem, isChild = false) => {
    const itemId = getParentId(item)
    const isExpanded = expandedItems.has(itemId)
    const isItemActive = activeParent === item

    if (hasChildren(item)) {
      // Item with children - render as collapsible
      return (
        <div key={itemId} className="space-y-1">
          {/* Module Toggle Button */}
          <button
            type="button"
            onClick={() => toggleItem(itemId)}
            className={cx(
              'w-full justify-between cursor-pointer group flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200',
              collapsed ? 'justify-center' : 'gap-3 px-3',
              isItemActive
                ? 'bg-[var(--ui-primary-soft)] text-[var(--ui-primary-strong)] shadow-sm'
                : 'text-[var(--ui-muted)] hover:bg-[var(--ui-surface-muted)] hover:text-[var(--ui-text)]',
            )}
            title={collapsed ? item.label : undefined}
            aria-expanded={isExpanded}
          >
            <div className={cx('flex items-center gap-3', collapsed ? 'justify-center w-full' : '')}>
              <span className="text-base">{item.icon}</span>
              <span className={cx('flex-1 text-left whitespace-nowrap transition-opacity', collapsed ? 'hidden' : 'block')}>
              {item.label}
            </span>
            </div>
            {!collapsed && (
              <span className={cx('text-base transition-transform duration-300', isExpanded ? 'rotate-180' : 'rotate-0')}>
                <FiChevronDown />
              </span>
            )}
          </button>

          {/* Children - Show when not collapsed and expanded */}
          {!collapsed && isExpanded && item.children && (
            <div className="space-y-1 border-l border-[var(--ui-border-strong)] ml-5 pl-2">
              {item.children.map(child => renderNavItem(child, true))}
            </div>
          )}

          {/* Collapsed indicator - Show active state dot */}
          {collapsed && isItemActive && (
            <div className="flex justify-center pt-1">
              <div className="h-1 w-1 rounded-full bg-[var(--ui-primary-strong)]" title={item.label} />
            </div>
          )}
        </div>
      )
    }

    // Simple item - render as NavLink
    return (
      <NavLink
        key={itemId}
        to={item.to!}
        className={({ isActive }) =>
          cx(
            'group flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200',
            isChild ? 'rounded-lg py-2 text-sm gap-2 px-3' : (collapsed ? 'lg:justify-center lg:px-0' : 'gap-3 px-3'),
            isActive
              ? 'bg-[var(--ui-primary-soft)] text-[var(--ui-primary-strong)] shadow-sm'
              : 'text-[var(--ui-muted)] hover:bg-[var(--ui-surface-muted)] hover:text-[var(--ui-text)]',
          )
        }
        onClick={onCloseMobile}
        title={collapsed && !isChild ? item.label : undefined}
      >
        <span className={cx('text-base', isChild && 'text-sm')}>{item.icon}</span>
        <span className={cx('whitespace-nowrap transition-opacity', collapsed && !isChild ? 'lg:hidden' : 'block')}>
          {item.label}
        </span>
      </NavLink>
    )
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar"
        className={cx(
          'fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onCloseMobile}
      />

      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--ui-border)] bg-white/95 shadow-[var(--ui-shadow-md)] backdrop-blur-sm transition-all duration-300',
          collapsed ? 'lg:w-[4.5rem]' : 'lg:w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Header */}
        <div className="flex h-[4.5rem] items-center justify-between border-b border-[var(--ui-border)] px-4">
          <div className={cx('overflow-hidden transition-all', collapsed ? 'lg:hidden' : 'opacity-100')}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ui-primary)]">IBT Admin</p>
            <p className="text-xs text-[var(--ui-muted)]">Operations Panel</p>
          </div>

          {/* Collapsed Logo */}
          {collapsed && (
            <div className="hidden lg:flex h-8 w-8 m-auto items-center justify-center rounded-lg text-[var(--ui-primary)]">
              <FiHexagon size={24} />
            </div>
          )}

          <button
            type="button"
            aria-label="Close sidebar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--ui-border)] text-[var(--ui-muted)] hover:bg-[var(--ui-surface-muted)] lg:hidden"
            onClick={onCloseMobile}
          >
            <FiX />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_LINKS.map(item => renderNavItem(item))}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--ui-border)] p-3 flex flex-col gap-2">
          <button
            type="button"
            className={cx(
              'w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium transition-all duration-200',
              'text-[var(--ui-danger)] hover:bg-red-50 hover:text-red-700',
            )}
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
          >
            <FiLogOut size={16} />
            <span className={cx('transition-opacity', collapsed ? 'lg:hidden' : 'block')}>
              Logout
            </span>
          </button>

          <button
            type="button"
            className={cx(
              'w-full cursor-pointer flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200',
              locked
                ? 'border-[var(--ui-primary)] bg-[var(--ui-primary-soft)] text-[var(--ui-primary-strong)]'
                : 'border-[var(--ui-border)] text-[var(--ui-muted)] hover:bg-[var(--ui-surface-muted)] hover:text-[var(--ui-text)]',
            )}
            onClick={onToggleLocked}
            title={locked ? 'Unpin sidebar' : 'Pin sidebar open'}
            aria-label={locked ? 'Unpin sidebar' : 'Pin sidebar open'}
          >
            {locked ? <FiLock size={16} /> : <FiUnlock size={16} />}
            <span className={cx('transition-opacity', collapsed ? 'lg:hidden' : 'block')}>
              {locked ? 'Pinned' : 'Pin'}
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}
