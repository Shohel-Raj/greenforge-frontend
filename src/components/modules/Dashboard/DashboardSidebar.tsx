import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getUserInfo } from "@/services/auth.services"
import { getNavItemsByRole } from "@/lib/navItems"
import { NavSection } from "@/types/dashboard.types"
import DashboardSidebarContent from "./DashboardSidebarContent"


const DashboardSidebar = async () => {
  const userInfo = await getUserInfo()

  const dashboardHome = getDefaultDashboardRoute(userInfo.role)
  const navItems : NavSection[] = getNavItemsByRole(userInfo.role)
  return (
    
    // dashboard sidebar content
    <DashboardSidebarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome}/>
    
  )
}

export default DashboardSidebar