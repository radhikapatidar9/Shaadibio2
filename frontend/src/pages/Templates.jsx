import { useEffect, useState } from "react"
import { getTemplates } from "../services/templateAPI"
import { useNavigate } from "react-router-dom"

function Templates(){

const [templates,setTemplates] = useState([])
const navigate = useNavigate()

useEffect(()=>{

fetchTemplates()

},[])

const fetchTemplates = async ()=>{

try{

const res = await getTemplates()

setTemplates(res.data)

}catch(err){

console.log(err)

}

}

return(

<div className="p-6 max-w-5xl mx-auto">

    <h1 className="text-2xl font-bold mb-6 text-center">
    Choose Biodata Template
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

        {templates.map((template)=>(

        <div
            key={template._id}
            className="rounded-lg p-4 shadow-lg hover:shadow-xl transition"
            >

            <img
            src={template.previewImage}
            className="w-full h-50 object-cover rounded"
            />

            <h2 className="text-lg font-bold mt-3">
                {template.name}
            </h2>

            <p className="text-gray-500">
                {template.templateType}
            </p>

            <button
                onClick={()=>navigate(`/create-biodata?template=${template._id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-3 rounded shadow hover:scale-105 transition"
                >

                Use Template

            </button>

        </div>

        ))}

    </div>

</div>

)

}

export default Templates