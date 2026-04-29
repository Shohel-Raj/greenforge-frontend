import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getUserInfo } from "@/services/auth.services"


const DashboardSidebar = async () => {
  const userInfo = await getUserInfo()

  const dashboardHome = getDefaultDashboardRoute(userInfo.role)
  console.log(dashboardHome)
  return (
    // dashboard sidebar content
    <div>content </div>
    
  )
}

export default DashboardSidebar