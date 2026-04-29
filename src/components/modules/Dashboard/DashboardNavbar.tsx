import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getUserInfo } from "@/services/auth.services"
import DashboardNavbarContent from "./DashboardNavbarContent"
import { NavSection } from "@/types/dashboard.types"
import { getNavItemsByRole } from "@/lib/navItems"


const DashboardNavbar = async () => {
   const userInfo = await getUserInfo()
  
    const dashboardHome = getDefaultDashboardRoute(userInfo.role)
    const navItems : NavSection[] = getNavItemsByRole(userInfo.role)
    
  return (
    // dashboard navbar content
        <DashboardNavbarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome}/>

  )
}

export default DashboardNavbar