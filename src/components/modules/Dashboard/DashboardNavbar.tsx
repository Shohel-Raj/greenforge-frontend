import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getUserInfo } from "@/services/auth.services"


const DashboardNavbar = async () => {
   const userInfo = await getUserInfo()
  
    const dashboardHome = getDefaultDashboardRoute(userInfo.role)
    console.log(dashboardHome)
    
  return (
    // dashboard navbar content
    <div>content </div>
  )
}

export default DashboardNavbar