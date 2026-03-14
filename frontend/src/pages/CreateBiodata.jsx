import { useState } from "react"
import { createBiodata } from "../services/biodataAPI"
import { useSearchParams, useNavigate } from "react-router-dom"

function CreateBiodata(){

const navigate = useNavigate();

const [formData,setFormData] = useState({
firstName:"",
lastName:"",
gender:"",
dob:"",
height:"",
religion:"",
caste:"",
motherTongue:"",
phone:"",
contactEmail:"",
address:"",
education:"",
profession:"",
fatherName:"",
motherName:"",
nativePlace:"",
rashi:"",
nakshatra:"",
gotra:"",
birthPlace:"",
birthTime:"",
})

const [image,setImage] = useState(null)
const [searchParams] = useSearchParams()

const templateId = searchParams.get("template")

const handleChange = (e) => {

setFormData({
...formData,
[e.target.name]: e.target.value
})

}

const handleImage = (e) => {
setImage(e.target.files[0])
}

const handleSubmit = async (e) => {

e.preventDefault()

if(!templateId){
alert("Please select a template first")
return
}

try{

const data = new FormData()

Object.keys(formData).forEach(key=>{
data.append(key,formData[key])
})

data.append("profileImage",image)
data.append("templateId", templateId)

const response = await createBiodata(data);
console.log(response)
alert("Biodata Created!")
navigate("/my-biodatas")

}catch(err){
  console.log("ERROR RESPONSE:", err.response?.data)
  alert(err.response?.data?.message || "Error creating biodata")
}

}

return(

<div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">

<div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">

<h1 className="text-2xl font-bold text-center mb-6">
Create Biodata
</h1>

<button onClick={() => navigate('/templates')} 
className="col-span-2 bg-green-600 text-white p-2 rounded mb-6 cursor-pointer hover:bg-green-700">Select Template first</button>

<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

<input name="firstName" onChange={handleChange} placeholder="First Name" className="border p-2 rounded"/>

<input name="lastName" onChange={handleChange} placeholder="Last Name" className="border p-2 rounded"/>

<select name="gender" onChange={handleChange} className="border p-2 rounded">

<option value="">Select Gender</option>
<option value="Male">Male</option>
<option value="Female">Female</option>

</select>

<input type="date" name="dob" onChange={handleChange} className="border p-2 rounded"/>

<input name="height" onChange={handleChange} placeholder="Height" className="border p-2 rounded"/>

<input name="religion" onChange={handleChange} placeholder="Religion" className="border p-2 rounded"/>

<input name="caste" onChange={handleChange} placeholder="Caste" className="border p-2 rounded"/>

<input name="motherTongue" onChange={handleChange} placeholder="Mother Tongue" className="border p-2 rounded"/>

<input name="phone" onChange={handleChange} placeholder="Phone" className="border p-2 rounded"/>

<input name="contactEmail" onChange={handleChange} placeholder="Contact Email" className="border p-2 rounded"/>

<input name="address" onChange={handleChange} placeholder="Address" className="border p-2 rounded"/>

<input name="education" onChange={handleChange} placeholder="Education" className="border p-2 rounded"/>

<input name="profession" onChange={handleChange} placeholder="Profession" className="border p-2 rounded"/>

<input name="fatherName" onChange={handleChange} placeholder="Father Name" className="border p-2 rounded"/>

<input name="motherName" onChange={handleChange} placeholder="Mother Name" className="border p-2 rounded"/>

<input name="nativePlace" onChange={handleChange} placeholder="Native Place" className="border p-2 rounded"/>

<input name="rashi" onChange={handleChange} placeholder="Rashi" className="border p-2 rounded"/>

<input name="nakshatra" onChange={handleChange} placeholder="Nakshatra" className="border p-2 rounded"/>

<input name="gotra" onChange={handleChange} placeholder="Gotra" className="border p-2 rounded"/>

<input name="birthPlace" onChange={handleChange} placeholder="Birth Place" className="border p-2 rounded"/>

<input type="time" name="birthTime" onChange={handleChange} className="border p-2 rounded"/>

<input type="file" onChange={handleImage} className="border p-2 rounded"/>

<button
type="submit"
className="col-span-2 bg-blue-600 text-white p-2 rounded"
>
Create Biodata
</button>

</form>

</div>

</div>

)

}

export default CreateBiodata