"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaFacebook, FaInstagram, FaSnapchat, FaPinterest, FaLinkedin, FaYoutube, FaReddit, FaGlobe } from "react-icons/fa";


const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const IMAGE_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNMywFeSr7gp6UoAu-Mw37ie975Ybr3iuewg&s";

export default function Page() {
  const { id } = useParams(); // ✅ slug from URL
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getSocialIcon = (url) => {
    if (url.includes("facebook")) return <FaFacebook className="text-blue-600" />;
    if (url.includes("instagram")) return <FaInstagram className="text-pink-500" />;
    if (url.includes("snapchat")) return <FaSnapchat className="text-yellow-400" />;
    if (url.includes("pinterest")) return <FaPinterest className="text-red-600" />;
    if (url.includes("linkedin")) return <FaLinkedin className="text-blue-700" />;
    if (url.includes("youtube")) return <FaYoutube className="text-red-500" />;
    if (url.includes("reddit")) return <FaReddit className="text-orange-500" />;
    return <FaGlobe className="text-gray-400" />; 
  };
  useEffect(() => {
    if (!id) return;

    const fetchPage = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/pages/${id}`,{
            method: 'GET',
            credentials : 'include'
        });
        const data = await res.json();
        setPageData(data);
      } catch (err) {
        console.error("Error fetching page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        Page not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-white px-4">
      
      <div className="flex flex-col items-center mb-10">
        <img src = {IMAGE_URL} className="w-28 h-28 flex items-center justify-center rounded-full bg-gray-800 text-4xl"/>
        <h1 className="text-3xl font-bold mt-4">{pageData.name}</h1>
        <p className="text-gray-400">{pageData.title}</p>
        <p className="text-gray-500 text-sm mt-2">{pageData.description}</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {pageData.links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 px-5 py-3 rounded-2xl shadow-lg transition transform hover:scale-[1.02]"
          >
            <span className="text-xl">{getSocialIcon(link.url)}</span>
            <span className="flex-1 text-lg">{link.title}</span>
          </a>
        ))}
      </div>

      <footer className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} {pageData.name}
      </footer>
    </div>
  );
}
