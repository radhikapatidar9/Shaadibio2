import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./components/PrivateRoute"
import DashboardLayout from "./layout/DashboardLayout"
import CreateBiodata from "./pages/CreateBiodata"
import MyBiodatas from "./pages/MyBiodatas"
import Templates from "./pages/Templates"
import Preview from "./pages/Preview"
import EmailSubscribe from "./pages/EmailSubscribe"

function App() {

  return (

    <Routes>

      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/subscribe" element={<EmailSubscribe />} />

      {/* Protected routes with sidebar */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/create-biodata" element={<CreateBiodata/>}/>
        <Route path="/templates" element={<div><Templates/></div>} />
        <Route path="/my-biodatas" element={<MyBiodatas/>} />
        <Route path="/biodata/:id"element={<Preview/>}/>

      </Route>

    </Routes>

  )

}

export default App;