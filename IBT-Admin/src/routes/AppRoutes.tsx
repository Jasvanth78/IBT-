import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { hasAdminPanelAccess } from '../features/auth/storage'
import { AdminLayout } from '../layouts/AdminLayout'
import { ProtectedRoute } from './ProtectedRoute'

// Lazy-loaded page components for code-splitting
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })))

const AuditLogsPage = lazy(() => import('../pages/admin/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })))
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })))

// Master pages – Services
const ServicesMasterPage = lazy(() => import('../pages/admin/master/services/ServicesMasterPage').then(m => ({ default: m.ServicesMasterPage })))
const ServicesReorderPage = lazy(() => import('../pages/admin/master/services/ServicesReorderPage').then(m => ({ default: m.ServicesReorderPage })))
const ServicesContentMasterPage = lazy(() => import('../pages/admin/master/services/ServicesContentMasterPage').then(m => ({ default: m.ServicesContentMasterPage })))

// Master pages – Home, About, Contact
const HomeContentMasterPage = lazy(() => import('../pages/admin/master/home/HomeContentMasterPage').then(m => ({ default: m.HomeContentMasterPage })))
const AboutMasterPage = lazy(() => import('../pages/admin/master/about/AboutMasterPage').then(m => ({ default: m.AboutMasterPage })))
const ContactContentMasterPage = lazy(() => import('../pages/admin/master/contacts/ContactContentMasterPage').then(m => ({ default: m.ContactContentMasterPage })))
const ProductsContentMasterPage = lazy(() => import('../pages/admin/master/products/ProductsContentMasterPage').then(m => ({ default: m.ProductsContentMasterPage })))

// Master pages – Stats
const StatsMasterPage = lazy(() => import('../pages/admin/master/stats/StatsMasterPage').then(m => ({ default: m.StatsMasterPage })))
const StatsReorderPage = lazy(() => import('../pages/admin/master/stats/StatsReorderPage').then(m => ({ default: m.StatsReorderPage })))

// Master pages – Testimonials
const TestimonialsMasterPage = lazy(() => import('../pages/admin/master/testimonials/TestimonialsMasterPage').then(m => ({ default: m.TestimonialsMasterPage })))
const TestimonialsReorderPage = lazy(() => import('../pages/admin/master/testimonials/TestimonialsReorderPage').then(m => ({ default: m.TestimonialsReorderPage })))

// Master pages – Partners & Colleges
const PartnersMasterPage = lazy(() => import('../pages/admin/master/partners/PartnersMasterPage').then(m => ({ default: m.PartnersMasterPage })))
const PartnersReorderPage = lazy(() => import('../pages/admin/master/partners/PartnersReorderPage').then(m => ({ default: m.PartnersReorderPage })))
const CollegesMasterPage = lazy(() => import('../pages/admin/master/colleges/CollegesMasterPage').then(m => ({ default: m.CollegesMasterPage })))
const CollegesReorderPage = lazy(() => import('../pages/admin/master/colleges/CollegesReorderPage').then(m => ({ default: m.CollegesReorderPage })))

// Master pages – Branches
const BranchesMasterPage = lazy(() => import('../pages/admin/master/branch/BranchesMasterPage').then(m => ({ default: m.BranchesMasterPage })))
const BranchesReorderPage = lazy(() => import('../pages/admin/master/branch/BranchesReorderPage').then(m => ({ default: m.BranchesReorderPage })))
const BranchTeamPage = lazy(() => import('../pages/admin/master/branch/BranchTeamPage').then(m => ({ default: m.BranchTeamPage })))
const BranchTeamReorderPage = lazy(() => import('../pages/admin/master/branch/BranchTeamReorderPage').then(m => ({ default: m.BranchTeamReorderPage })))

// Master pages – Clients, Members, Contacts
const ClientsMasterPage = lazy(() => import('../pages/admin/master/clients/ClientsMasterPage').then(m => ({ default: m.ClientsMasterPage })))
const ClientsReorderPage = lazy(() => import('../pages/admin/master/clients/ClientsReorderPage').then(m => ({ default: m.ClientsReorderPage })))
const MembersMasterPage = lazy(() => import('../pages/admin/MembersMasterPage').then(m => ({ default: m.MembersMasterPage })))
const MembersReorderPage = lazy(() => import('../pages/admin/master/members/MembersReorderPage').then(m => ({ default: m.MembersReorderPage })))
const ContactsMasterPage = lazy(() => import('../pages/admin/master/contacts/ContactsMasterPage').then(m => ({ default: m.ContactsMasterPage })))
const ContactsReorderPage = lazy(() => import('../pages/admin/master/contacts/ContactsReorderPage').then(m => ({ default: m.ContactsReorderPage })))

// Master pages – Social Links
const SocialLinksMasterPage = lazy(() => import('../pages/admin/master/socialLinks/SocialLinksMasterPage').then(m => ({ default: m.SocialLinksMasterPage })))
const SocialLinksReorderPage = lazy(() => import('../pages/admin/master/socialLinks/SocialLinksReorderPage').then(m => ({ default: m.SocialLinksReorderPage })))

// Master pages – Blogs
const BlogsMasterPage = lazy(() => import('../pages/admin/BlogsMasterPage').then(m => ({ default: m.BlogsMasterPage })))
const BlogFormPage = lazy(() => import('../pages/admin/BlogFormPage').then(m => ({ default: m.BlogFormPage })))

// Master pages – Lab Projects
const LabProjectsMasterPage = lazy(() => import('../pages/admin/master/labprojects/LabProjectsMasterPage').then(m => ({ default: m.LabProjectsMasterPage })))
const LabProjectsReorderPage = lazy(() => import('../pages/admin/master/labprojects/LabProjectsReorderPage').then(m => ({ default: m.LabProjectsReorderPage })))
const LabContentMasterPage = lazy(() => import('../pages/admin/master/labprojects/LabContentMasterPage').then(m => ({ default: m.LabContentMasterPage })))
const LabIdeaSubmissionsPage = lazy(() => import('../pages/admin/master/labprojects/LabIdeaSubmissionsPage').then(m => ({ default: m.LabIdeaSubmissionsPage })))

// Master pages – Internship
const InternshipContentMasterPage = lazy(() => import('../pages/admin/master/internship/InternshipContentMasterPage').then(m => ({ default: m.InternshipContentMasterPage })))
const InternshipApplicationsPage = lazy(() => import('../pages/admin/master/internship/InternshipApplicationsPage').then(m => ({ default: m.InternshipApplicationsPage })))

// Loading fallback for lazy routes
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-[3px] border-slate-200 border-t-[#e63946] rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-400 tracking-wide">Loading...</span>
      </div>
    </div>
  )
}

export function AppRoutes() {
  const defaultRoute = hasAdminPanelAccess() ? '/admin/dashboard' : '/login'

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to={defaultRoute} replace />} />
        <Route
          path="/login"
          element={hasAdminPanelAccess() ? <Navigate to="/admin/dashboard" replace /> : <LoginPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />

            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="master" element={<Navigate to="/admin/master/services" replace />} />
            <Route path="master/services" element={<ServicesMasterPage />} />
            <Route path="master/services/reorder" element={<ServicesReorderPage />} />
            <Route path="master/services/content" element={<ServicesContentMasterPage />} />
            <Route path="master/home/content" element={<HomeContentMasterPage />} />
            <Route path="master/about/content" element={<AboutMasterPage />} />
            <Route path="master/products/content" element={<ProductsContentMasterPage />} />
            <Route path="master/stats" element={<StatsMasterPage />} />
            <Route path="master/stats/reorder" element={<StatsReorderPage />} />
            <Route path="master/testimonials" element={<TestimonialsMasterPage />} />
            <Route path="master/testimonials/reorder" element={<TestimonialsReorderPage />} />
            <Route path="master/partners" element={<PartnersMasterPage />} />
            <Route path="master/partners/reorder" element={<PartnersReorderPage />} />
            <Route path="master/colleges" element={<CollegesMasterPage />} />
            <Route path="master/colleges/reorder" element={<CollegesReorderPage />} />
            <Route path="master/branches" element={<BranchesMasterPage />} />
            <Route path="master/branches/reorder" element={<BranchesReorderPage />} />
            <Route path="master/branches/:branchId/team" element={<BranchTeamPage />} />
            <Route path="master/branches/:branchId/team/reorder" element={<BranchTeamReorderPage />} />
            <Route path="master/clients" element={<ClientsMasterPage />} />
            <Route path="master/clients/reorder" element={<ClientsReorderPage />} />
            <Route path="master/members" element={<MembersMasterPage />} />
            <Route path="master/members/reorder" element={<MembersReorderPage />} />
            <Route path="master/contacts" element={<ContactsMasterPage />} />
            <Route path="master/contacts/reorder" element={<ContactsReorderPage />} />
            <Route path="master/contacts/content" element={<ContactContentMasterPage />} />
            <Route path="master/social-links" element={<SocialLinksMasterPage />} />
            <Route path="master/social-links/reorder" element={<SocialLinksReorderPage />} />
            <Route path="master/blogs" element={<BlogsMasterPage />} />
            <Route path="master/blogs/create" element={<BlogFormPage />} />
            <Route path="master/blogs/:blogId/edit" element={<BlogFormPage />} />
            <Route path="master/lab-projects" element={<LabProjectsMasterPage />} />
            <Route path="master/lab-projects/reorder" element={<LabProjectsReorderPage />} />
            <Route path="master/lab-projects/content" element={<LabContentMasterPage />} />
            <Route path="master/lab-projects/submissions" element={<LabIdeaSubmissionsPage />} />
            <Route path="master/internship" element={<InternshipContentMasterPage />} />
            <Route path="master/internship/applications" element={<InternshipApplicationsPage />} />
            <Route path="clients" element={<AdminDashboardPage />} />
            <Route path="projects" element={<AdminDashboardPage />} />
            <Route path="analytics" element={<AdminDashboardPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      </Routes>
    </Suspense>
  )
}
