import { Link, useNavigate } from "react-router-dom"

function Sidebar(){

const navigate = useNavigate()

const handleLogout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")

}

return(

<div className="w-full bg-gray-900 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center">

<h2 className="text-2xl font-bold pb-4 sm:pb-0">
ShaadiBio
</h2>

<nav className="flex  gap-4 flex-col sm:flex-row justify-center items-center">

<Link to="/dashboard" className="hover:font-bold">Dashboard</Link>

<Link to="/templates" className="hover:font-bold">Templates</Link>

<Link to="/create-biodata" className="hover:font-bold">Create Biodata</Link>

<Link to="/my-biodatas" className="hover:font-bold">My Biodatas</Link>

<button onClick={handleLogout} className="hover:font-bold">Logout</button>

</nav>

</div>

)

}

export default Sidebar