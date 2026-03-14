import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"
// Outlet renders the child pages inside the layout

function DashboardLayout() {

  return (
    <div>

      <Sidebar />

      <div>
        <Outlet />  
      </div>

    </div>
  )

}

export default DashboardLayout;

