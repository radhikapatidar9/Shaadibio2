import { useEffect, useState } from "react"
import { getMyBiodatas, downloadPDF, deleteBiodata } from "../services/biodataAPI"
import { useNavigate } from "react-router-dom"

function MyBiodatas(){

const [biodatas,setBiodatas] = useState([])
const navigate = useNavigate()

useEffect(()=>{

fetchBiodatas()

},[])

const fetchBiodatas = async ()=>{
  try {
    const res = await getMyBiodatas()
    setBiodatas(res.data)
  } catch (err) {
    console.log(err)
  }
}

const handleDownloadPDF = async (id) => {
  try {
    const data = await downloadPDF(id)
    const url = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "biodata.pdf")
    document.body.appendChild(link)
    link.click()
  } catch (err) {
    console.log(err)
  }
}

const handleDeleteBiodata = async (id) => {
  try {
    if (window.confirm("Are you sure you want to delete this biodata?")) {
      await deleteBiodata(id)
      alert("Biodata Deleted")
      fetchBiodatas() // reload list
    }
  } catch (err) {
    console.log(err)
  }
}

return(

<div className="p-10">

<h1 className="text-2xl font-bold mb-6 text-center">
My Biodatas
</h1>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

{biodatas.map((bio)=>(
<div key={bio._id} className="shadow-lg p-4 rounded-lg hover:shadow-xl transition">

<img
src={bio.profileImage}
className="h-40 w-40 object-cover mx-auto rounded"
/>

<h2 className="font-bold mt-3 text-center">
{bio.firstName} {bio.lastName}
</h2>

<div className="flex flex-wrap gap-2 mt-4 justify-center">

<button
className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 hover:scale-105 transition"
onClick={()=>navigate(`/biodata/${bio._id}`)}
>
Preview
</button>

<button
onClick={()=>handleDeleteBiodata(bio._id)}
className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 hover:scale-105 transition"
>
Delete
</button>

<button
className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600 hover:scale-105 transition"
onClick={()=>handleDownloadPDF(bio._id)}
>
Download PDF
</button>

</div>

</div>
))}

</div>

</div>

)

}

export default MyBiodatas