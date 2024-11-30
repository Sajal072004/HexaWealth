'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiUsers, FiBookOpen } from "react-icons/fi";



export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-white p-4 shadow-md flex justify-between items-center relative z-10 md:px-8">
        <h1 className="text-xl md:text-3xl font-bold text-black"><span className="text-blue-600 ">Hexa</span>Wealth</h1>
        <div className="flex items-center space-x-1 md:space-x-4">
          { (
            <button
            onClick={()=> router.push('/signup')}
              
              className="bg-white px-4 py-2 rounded-lg hover:bg-gray-200 text-black border border-black "
            >
             SignUp
            </button>
          )}
          <button
            onClick={()=>router.push('/login')}
            className=" text-black px-4 py-2 rounded-lg hover:bg-gray-300 border border-black"
          >
            Login
          </button>
          
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white h-[85vh] flex items-center">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-12 text-center md:text-left">
    {/* Left Content */}
    <div className="flex flex-col justify-center space-y-6 mt-48 mx-16 md:mx-0 md:mt-0">
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-black">
        Take Control of Your Finances with Hexawealth
      </h1>
      <p className="text-lg md:text-xl text-gray-600">
        Join our platform for expert financial advice, community interaction,
        and a wealth of resources to empower your journey.
      </p>
      <div className="flex flex-col md:flex-row justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-6">
        <Link href="#know-more">
          <div className="border-2 border-blue-500 px-6 py-3 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white transition">
            Learn More
          </div>
        </Link>
        <Link href="/signup">
          <div className="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-400 transition">
            Get Started
          </div>
        </Link>
      </div>
    </div>

    {/* Right Content */}
    <div className="flex justify-center items-center">
      <img
        src="/bg.jpg"
        alt="Finance Illustration"
        className="w-full max-w-md rounded-lg shadow-lg"
      />
    </div>
  </div>
</section>


      {/* Know More Section */}
<section id="know-more" className="py-16 bg-gray-100">
  <div className="max-w-6xl mx-auto text-center px-4 md:px-8">
    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black">
      Why Choose Hexawealth?
    </h2>
    <p className="text-gray-700 mb-12 max-w-3xl mx-auto text-sm md:text-base">
      We provide expert guidance, a supportive community, and extensive
      resources to help you succeed in your financial journey.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {/* Feature 1 */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition border border-gray-500">
        <div className="flex justify-center mb-4 text-blue-500">
          <FiUser className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-black">Expert Guidance</h3>
        <p className="text-gray-600 text-sm md:text-base">
          Access personalized advice from experienced financial professionals.
        </p>
      </div>
      {/* Feature 2 */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition border border-gray-500">
        <div className="flex justify-center mb-4 text-green-500">
          <FiUsers className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-black">Thriving Community</h3>
        <p className="text-gray-600 text-sm md:text-base">
          Interact with like-minded individuals and share your journey.
        </p>
      </div>
      {/* Feature 3 */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition border border-gray-500">
        <div className="flex justify-center mb-4 text-yellow-500">
          <FiBookOpen className="w-10 h-10 md:w-12 md:h-12" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-black">Comprehensive Resources</h3>
        <p className="text-gray-600 text-sm md:text-base">
          Access tools and insights to make informed decisions.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Testimonials */}
<section className="py-16 bg-white">
  <div className="max-w-6xl mx-auto text-center px-4 md:px-8">
    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-black">What Our Users Say</h2>
    <div className="flex gap-4 md:gap-8 overflow-x-auto md:flex-nowrap px-2 md:px-6">
      <div className="bg-white border border-black p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition min-w-[250px] md:min-w-[300px]">
        <p className="text-gray-600 mb-4">
          &quot;Hexawealth gave me the confidence to make smarter financial decisions!&quot;
        </p>
        <h4 className="text-lg md:text-xl font-semibold text-black">John Doe</h4>
      </div>
      <div className="bg-white border border-black p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition min-w-[250px] md:min-w-[300px]">
        <p className="text-gray-600 mb-4">
          &quot;The community support and expert advice are incredible!&quot;
        </p>
        <h4 className="text-lg md:text-xl font-semibold text-black">Jane Smith</h4>
      </div>
      <div className="bg-white border border-black p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition min-w-[250px] md:min-w-[300px]">
        <p className="text-gray-600 mb-4">
          &quot;The resources helped me start investing with confidence.&quot;
        </p>
        <h4 className="text-lg md:text-xl font-semibold text-black">Alice Brown</h4>
      </div>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="bg-gray-200 py-8">
        <div className="max-w-6xl mx-auto text-center space-y-4 px-4 md:px-8">
          <p className="text-sm md:text-base text-gray-800">&copy; 2024 Hexawealth. All Rights Reserved.</p>
          
        </div>
      </footer>
    </div>
  );
}
