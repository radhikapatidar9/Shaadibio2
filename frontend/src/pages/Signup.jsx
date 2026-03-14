import { useState } from "react"
import { signupUser, sendOTP } from "../services/authAPI"
import { useNavigate } from "react-router-dom"

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: ""
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSendOTP = async () => {
    try {
      console.log("Sending email:", formData.email);
      const data = await sendOTP(formData.email);
      if (data.success) {
        alert("OTP sent to email");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.log(err);
      alert("Error sending OTP");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await signupUser(formData);
      if (data.success) {
        alert("Account created successfully");
        navigate("/");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.log(err);
      alert("Error during signup");
    }
  }

return(

<div className="flex items-center justify-center min-h-screen bg-gray-100">

<form
onSubmit={handleSubmit}
className="bg-white p-8 rounded shadow-md w-100"
>

<h2 className="text-2xl font-bold mb-6 text-center">
Signup
</h2>

<input
type="text"
name="firstName"
placeholder="First Name"
value={formData.firstName}
onChange={handleChange}
className="border p-2 w-full mb-3"
/>

<input
type="text"
name="lastName"
placeholder="Last Name"
value={formData.lastName}
onChange={handleChange}
className="border p-2 w-full mb-3"
/>

<input
type="email"
name="email"
placeholder="Email"
value={formData.email}
onChange={handleChange}
className="border p-2 w-full mb-3"
/>

<button
type="button"
disabled={!formData.email}
onClick={handleSendOTP}
className="bg-blue-500 text-white px-3 py-1 mb-3"
>
Send OTP
</button>

<input
name="otp"
placeholder="OTP"
value={formData.otp}
onChange={handleChange}
className="border p-2 w-full mb-3"
/>

<input
name="password"
type="password"
placeholder="Password"
value={formData.password}
onChange={handleChange}
className="border p-2 w-full mb-3"
/>

<input
name="confirmPassword"
type="password"
placeholder="Confirm Password"
value={formData.confirmPassword}
onChange={handleChange}
className="border p-2 w-full mb-3"
/>

<button
type="submit"
className="bg-green-600 text-white w-full py-2"
>
Create Account
</button>

</form>

</div>

)

}

export default Signup