import { useState } from "react"
import { loginUser } from "../services/authAPI"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

function Login(){

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const navigate = useNavigate()

const handleLogin = async (e) => {

    e.preventDefault()
try{

const data = await loginUser({
email,
password
})

console.log(data)

if(data.success){

// store token
localStorage.setItem("token", data.token)
localStorage.setItem("user", JSON.stringify(data.user))

// redirect
navigate("/dashboard")

}

}catch(err){
console.log("Login error:",err)
}

}

return(
<div className="flex items-center justify-center min-h-screen bg-gray-100">

<form className="bg-white p-8 rounded-lg shadow-md w-[350px]">

<h2 className="text-2xl font-bold mb-6 text-center">
Login
</h2>

<input
type="email"
placeholder="Email"
className="border p-2 w-full mb-3"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border p-2 w-full mb-4"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={handleLogin}
className="bg-blue-600 text-white w-full py-2 rounded"
>
Login
</button>

<p className="text-center mt-4">

Don't have an account?

<Link
to="/signup"
className="text-blue-600 ml-2"
>
Signup
</Link>

</p>

</form>

</div>

)

}

export default Login