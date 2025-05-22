import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaBookOpen, FaBrain, FaGraduationCap, FaChalkboardTeacher, FaFileUpload, FaSearch } from "react-icons/fa";
import { RiTeamLine} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home({ onSearch }) {
  const [query, setQuery] = useState("");
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      try {
        if (auth && auth.user && auth.token) {
          await axios.post(
            `http://localhost:5000/api/user/${auth.user._id}/add-search`,
            { query },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`,
              },
            }
          );
          console.log('Search saved successfully');
        }
      } catch (err) {
        console.error('Error saving search:', err);
      }

      navigate(`/results?query=${query}`);
    }
  };

  const popularTopics = [
    "Data Structures",
    "Artificial Intelligence",
    "Machine Learning",
    "Web Development",
    "Cybersecurity",
    "Probability",
    "Psychology",
    "Business Management",
    "Cloud Computing",
    "Blockchain Technology"
  ];

  const creators = [
    {
      name: "Ideathon Team",
      role: "Founding Team",
      description: "Born from an ideathon, Syllabus Scout was created by passionate students and educators with a shared vision to make learning accessible and engaging for everyone.",
      icon: <RiTeamLine className="text-4xl" />
    },
    {
      name: "Educational Experts",
      role: "Content Curators & Advisors",
      description: "Our platform is supported by experienced educators who ensure all study materials are accurate, up-to-date, and aligned with current educational standards and syllabi.",
      icon: <FaChalkboardTeacher className="text-4xl" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-radial from-background-light to-primary-50 dark:from-background-dark dark:to-primary-900/10 text-foreground-light dark:text-foreground-dark px-4 py-16 overflow-hidden">
      {/* Hero Section with enhanced animations */}
      <div 
        className={`w-full max-w-6xl mb-16 text-center relative ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 dark:opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-300 dark:bg-primary-700 blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-accent-300 dark:bg-accent-800 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          <span className="inline-block animate-slide-up" style={{ animationDelay: "0.1s" }}>Syllabus</span>{" "}
          <span className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: "0.3s" }}>Scout</span>
        </h1>

        <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.5s" }}>
          Your ultimate companion for <span className="font-semibold text-primary-600 dark:text-primary-400">smarter study sessions</span>.
        </p>
        
        <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.7s" }}>
          Effortlessly discover high-quality learning resources tailored to your syllabus, whether you're gearing up for exams, 
          diving into new topics, or leveling up your class prep.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-slide-up" style={{ animationDelay: "0.9s" }}>
          <span className="px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-800 shadow-sm hover:shadow-md transition-shadow">Quality Resources</span>
          <span className="px-4 py-1.5 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-sm font-medium border border-accent-200 dark:border-accent-800 shadow-sm hover:shadow-md transition-shadow">Accessible Learning</span>
          <span className="px-4 py-1.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-sm font-medium border border-secondary-200 dark:border-secondary-800 shadow-sm hover:shadow-md transition-shadow">Master Concepts</span>
        </div>
      </div>

      {auth ? (
        <div className="w-full max-w-6xl mb-16">
          {/* Search Section with floating effect */}
          <div 
            className={`mb-12 w-full ${isLoaded ? 'animate-zoom-in' : 'opacity-0 scale-95'}`}
            style={{ animationDelay: "0.7s" }}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-10 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-primary-900/20 animate-float">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Find Your Perfect Learning Resources</h2>
              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter a topic from your syllabus..."
                      className="w-full py-4 px-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-glow"
                    />
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  </div>
                  <button
                    type="submit"
                    className="py-4 px-8 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-xl transition duration-300 font-medium text-lg shadow-md hover:shadow-glow transform hover:-translate-y-1 active:translate-y-0"
                  >
                    Search
                  </button>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 text-center">
                  Search for any topic for tailored recommendations
                </p>
              </form>
            </div>
          </div>

          {/* Popular Topics with staggered animation */}
          <div 
            className={`text-center ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
            style={{ animationDelay: "1s" }}
          >
            <h2 className="text-xl font-semibold mb-5">Popular Subject Areas</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {popularTopics.map((topic, index) => (
                <button
                  key={topic}
                  onClick={() => {
                    if (auth && auth.user && auth.token) {
                      axios.post(
                        `http://localhost:5000/api/user/${auth.user._id}/add-search`,
                        { query: topic },
                        {
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${auth.token}`,
                          },
                        }
                      ).catch(err => console.error('Error saving search:', err));
                    }
                    navigate(`/results?query=${encodeURIComponent(topic)}`);
                  }}
                  className={`px-5 py-2.5 bg-white/90 dark:bg-gray-700/90 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-full text-gray-800 dark:text-gray-200 text-sm font-medium transition-all duration-300 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transform hover:-translate-y-1 active:translate-y-0 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${1 + (index * 0.1)}s` }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 p-10 rounded-3xl w-full max-w-3xl mb-16 border border-primary-100 dark:border-primary-800 shadow-xl dark:shadow-primary-900/20 ${isLoaded ? 'animate-zoom-in' : 'opacity-0 scale-95'}`}
          style={{ animationDelay: "0.8s" }}
        >
          <p className="text-center text-lg mb-6 font-medium">
            Join us and make learning easy and effective with curated books, videos, and more!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl transition duration-300 font-medium text-center shadow-md hover:shadow-glow transform hover:-translate-y-1 active:translate-y-0"
            >
              Log In
            </a>
            <a
              href="/register"
              className="px-8 py-4 border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition duration-300 font-medium text-center shadow-sm hover:shadow-md transform hover:-translate-y-1 active:translate-y-0"
            >
              Sign Up
            </a>
          </div>
        </div>
      )}

      {/* About Section with staggered animations */}
      <div 
        className={`w-full max-w-6xl mb-20 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
        style={{ animationDelay: "1.2s" }}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">How Syllabus Scout Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Syllabus Scout helps students find high-quality study resources in just a few clicks. Whether you're studying for exams 
            or exploring new topics, we've got your back with curated recommendations based on your input.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <FaGraduationCap className="text-3xl" />,
              title: "Search Your Topic",
              description: "Simply enter any topic or subject area, our platform will instantly show you tailored study materials to boost your learning."
            },
            {
              icon: <FaFileUpload className="text-3xl" />,
              title: "Upload Your Syllabus",
              description: "Want even more precision? Upload your course syllabus, and we'll analyze it to deliver resources that match your curriculum.",
              badge: "Coming soon!"
            },
            {
              icon: <FaBookOpen className="text-3xl" />,
              title: "Get Curated Resources",
              description: "Within seconds, receive a handpicked list of books, videos, and materials that align with your learning goals."
            },
            {
              icon: <FaBrain className="text-3xl" />,
              title: "Join The Community",
              description: "Engage in discussions, ask questions, and share knowledge with fellow students and educators in our upcoming community space.",
              badge: "Coming soon!"
            }
          ].map((item, index) => (
            <div 
              key={item.title}
              className={`p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-center transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${1.4 + (index * 0.2)}s` }}
            >
              <div className="bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <div className="text-gradient bg-gradient-to-r from-primary-600 to-accent-600">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {item.description}
              </p>
              {item.badge && (
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-800">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlights with hover effects */}
      <div 
        className={`mt-8 max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
        style={{ animationDelay: "2s" }}
      >
        {[
          {
            // icon: <FaBookOpen className="text-4xl" />,
            title: "Quality Resources",
            description: "Access accurate, up-to-date, and easy-to-understand content across a wide range of subjects from textbooks to video tutorials. Every resource is curated for maximum relevance and credibility."
          },
          {
            // icon: <RiGlobalLine className="text-4xl" />,
            title: "Accessible Learning",
            description: "We believe education should be accessible to everyone, everywhere. Our platform delivers high-quality, curated study materials from around the globe."
          },
          {
            // icon: <RiLightbulbLine className="text-4xl" />,
            title: "Smart Resource Matching",
            description: "We match you with the most relevant study materials, books, and videos based on your topic or uploaded syllabus. Skip the clutter and find what matters most, faster."
          }
        ].map((feature, index) => (
          <div
            key={feature.title}
            className={`p-8 rounded-3xl shadow-lg dark:shadow-none border dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:bg-gradient-to-br hover:from-white hover:to-primary-50 dark:hover:from-gray-800 dark:hover:to-primary-900/20 group ${isLoaded ? 'animate-zoom-in' : 'opacity-0 scale-95'}`}
            style={{ animationDelay: `${2.2 + (index * 0.2)}s` }}
          >
            <div className="text-primary-500 dark:text-primary-400 group-hover:text-gradient group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-accent-500 mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Creator Section with new design */}
      <div 
        className={`w-full max-w-6xl mb-16 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
        style={{ animationDelay: "2.6s" }}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Our Story</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Born from an ideathon, Syllabus Scout is the result of passionate individuals 
            coming together with a shared vision
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {creators.map((creator, index) => (
            <div
              key={creator.name}
              className={`bg-gradient-to-br from-white to-primary-50 dark:from-gray-800 dark:to-primary-900/10 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row group hover:shadow-glow transition-all duration-500 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
              style={{ animationDelay: `${2.8 + (index * 0.2)}s` }}
            >
              <div className="md:w-1/3 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 flex items-center justify-center p-8">
                <div className="w-28 h-28 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-xl transform transition-transform duration-500 group-hover:rotate-12">
                  <div className="text-gradient bg-gradient-to-r from-primary-600 to-accent-600">
                    {creator.icon}
                  </div>
                </div>
              </div>
              <div className="p-8 md:w-2/3">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{creator.name}</h3>
                <p className="text-accent-600 dark:text-accent-400 text-sm mb-4 font-medium">{creator.role}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {creator.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Section with glow effect */}
      <div 
        className={`w-full max-w-6xl mb-16 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10 rounded-3xl p-10 border border-primary-100 dark:border-primary-800 shadow-lg transition-all duration-500 hover:shadow-glow ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
        style={{ animationDelay: "3.2s" }}
      >
        <div className="text-center">
          <div className="text-5xl text-primary-500 dark:text-primary-400 mb-6 animate-pulse-slow inline-block">
            <RiTeamLine />
          </div>
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Our Community</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Forums, discussions, and collaboration features are <span className="font-semibold text-primary-600 dark:text-primary-400">coming soon</span>. Stay tuned!
          </p>
        </div>
      </div>

      {/* Call to Action with gradient and animations */}
      {!auth && (
        <div 
          className={`w-full max-w-4xl text-center mb-12 ${isLoaded ? 'animate-zoom-in' : 'opacity-0 scale-95'}`}
          style={{ animationDelay: "3.4s" }}
        >
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-10 rounded-3xl shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Join us in shaping a brighter future through the power of learning
            </h2>
            
            <a
              href="/register"
              className="px-8 py-4 bg-white text-primary-600 rounded-xl inline-block transition-all duration-300 font-medium text-lg shadow-md hover:shadow-glow transform hover:-translate-y-1 active:translate-y-0"
            >
              Get Started Now <span className="ml-2 inline-block animate-bounce-slow">→</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating decoration elements */}
      <div className="fixed bottom-0 left-0 w-full h-32 overflow-hidden opacity-20 dark:opacity-10 -z-10 pointer-events-none">
        <div className="absolute bottom-10 left-1/4 w-40 h-40 rounded-full bg-primary-300 dark:bg-primary-700 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-32 h-32 rounded-full bg-accent-300 dark:bg-accent-800 blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      </div>
    </div>
  );
}

export default Home;