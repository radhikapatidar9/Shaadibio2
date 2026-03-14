import homepageImg from '../assets/homepageImg.png'
import { useNavigate } from 'react-router-dom'

function Dashboard(){

const user = JSON.parse(localStorage.getItem("user"))
const navigate = useNavigate();

return(

<div className='w-full min-h-screen overflow-x-hidden'>

    {/* hero section */}
    <div className='relative py-7 sm:py-20 lg:py-30 overflow-x-hidden'>

        <img
        src={homepageImg}
        alt="homepageImg"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        />

        <div className='flex flex-col gap-6 items-center justify-center py-16 text-center px-6'>

            <h1 className='text-3xl sm:text-4xl md:text-5xl text-gray-900 font-bold'>
                Your journey to the perfect <br/> match starts here.
            </h1>

            <p className='text-lg sm:text-xl md:text-2xl text-gray-700 pb-8'>
                Create a beautiful biodata that highlights your personality,
                values, and aspirations in a simple and elegant way.
            </p>

            <button className="bg-gray-700 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 cursor-pointer"
            onClick={() => navigate('/create-biodata')}>
            Create Biodata
            </button>

        </div>

    </div>

    <div className="w-full h-75 bg-gray-700 flex flex-col items-center justify-center text-center text-white">

            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-white px-2">
                Select the perfect design to present your story.
            </h2>

            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold shadow hover:bg-gray-200  transition"
            onClick={() => navigate('/templates')}>
                View All Templates
            </button>

    </div>

    <div className="w-full py-16 bg-gray-100 text-center">

            <h2 className="text-3xl font-bold mb-2">
                How to make Shaadi biodata?
            </h2>

            <p className="text-gray-600 mb-10">
                In just 3 easy steps
            </p>

            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 px-6">

                <div className="flex-1 bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">
                        Choose the Template
                    </h3>
                    <p className="text-gray-600">
                        Select a beautiful biodata design from our templates.
                    </p>
                </div>

                <div className="flex-1 bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">
                        Enter Information
                    </h3>
                    <p className="text-gray-600">
                        Fill in your personal, family and professional details.
                    </p>
                </div>

                <div className="flex-1 bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-red-700 mb-2">
                        Preview & Download
                    </h3>
                    <p className="text-gray-600">
                        Preview your biodata and download it as a PDF.
                    </p>
                </div>

        </div>

    </div>

    {/* FAQS */}
    <div className="w-full bg-gray-100 py-16">

        <h2 className="text-3xl font-bold text-center mb-10">
        Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-4 px-6">

            <details className="bg-white p-5 rounded-lg shadow cursor-pointer">
                <summary className="font-semibold text-lg">
                How do I create a biodata?
                </summary>
                <p className="mt-2 text-gray-600">
                Click on the "Create Biodata" button in the dashboard, select template,  fill in your personal and family details, then preview and download your biodata.
                </p>
            </details>

            <details className="bg-white p-5 rounded-lg shadow cursor-pointer">
                <summary className="font-semibold text-lg">
                Can I create multiple biodatas?
                </summary>
                <p className="mt-2 text-gray-600">
                Yes. You can make multiple Biodatas, Go to "My Biodatas", check all your Biodatas.
                </p>
            </details>

            <details className="bg-white p-5 rounded-lg shadow cursor-pointer">
                <summary className="font-semibold text-lg">
                How can I download my biodata?
                </summary>
                <p className="mt-2 text-gray-600">
                After previewing your biodata, click on the "Download PDF" button to save it to your device.
                </p>
            </details>

            <details className="bg-white p-5 rounded-lg shadow cursor-pointer">
                <summary className="font-semibold text-lg">
                Are the templates customizable?
                </summary>
                <p className="mt-2 text-gray-600">
                No. You can choose different templates but cannot customize them.
                </p>
            </details>

        </div>

    </div>

    <div className="w-full bg-gray-900 text-white py-8 ">

        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">

            <p className="text-sm">
            © 2026 ShaadiBio. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
            </div>

        </div>

    </div>

</div>

)

}

export default Dashboard




{/* <h1>Dashboard</h1>

<p className="text-3xl font-bold underline">Welcome {user?.firstName} 🎉</p> */}