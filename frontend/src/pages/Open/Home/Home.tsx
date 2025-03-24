
import { ArrowRight, BookOpen, Code, Layout, CheckCircle, Target, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import girlwithcomputer from '../../../images/girl.jpg';

const Home = () => {
  return (
    <div className="min-h-screen font-sans bg-[#e8dfd3]">
      {/* Hero Section with improved gradient and animation */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div className="container mx-auto px-6 py-24">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-yellow-300 opacity-20 blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-pink-400 opacity-20 blur-xl"></div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">BuildSkills AI
                </h1>
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
               
                  Master Tech Skills Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">AI-Guided</span> Projects
                </h1>
              </div>
              <p className="text-xl mb-8 text-blue-100">
                Skip the tutorials. Learn by building real projects with personalized AI guidance.
                From beginner to advanced, we create your perfect learning path.
              </p>
              <div className="space-x-4 flex flex-wrap gap-4">
                <Link to="/register" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Get Started 
                </Link>
                <Link to="/login" className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-all">
                 Sign in
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-xl opacity-20 blur-xl transform rotate-3"></div>
              <img src={girlwithcomputer} alt="Girl with computer" className="rounded-xl shadow-2xl relative z-10 transform hover:scale-[1.02] transition-transform" />
            </div>
          </div>
        </div>
      </div>

    

      {/* How It Works Section */}
      <div className="py-24 bg-[#e8dfd3]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Our AI-Powered Learning Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our innovative platform uses advanced AI to customize your learning journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Target className="w-8 h-8 text-blue-600" />,
                title: "Choose Your Path",
                description: "Tell us what you want to learn. Our AI creates a personalized roadmap with prerequisites and projects."
              },
              {
                icon: <Code className="w-8 h-8 text-blue-600" />,
                title: "Build Projects",
                description: "Learn by doing. Get step-by-step guidance and real-time help as you build production-grade projects."
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
                title: "Master Skills",
                description: "Gain practical experience and confidence through hands-on project completion."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6 mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="py-24 bg-[#e8dfd3]">
   <div className="container mx-auto px-6">
     <div className="text-center mb-16">
       <span className="text-blue-600 font-semibold px-4 py-1 bg-blue-50 rounded-full mb-4 inline-block">FAQ</span>
       <h2 className="text-4xl font-bold mb-4">Common Questions</h2>
       <p className="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to know about our learning platform</p>
     </div>
     <div className="max-w-4xl mx-auto space-y-6">
       {[
         {
           question: "How is this different from traditional online courses?",
           answer: "Unlike traditional courses that focus on theory, we emphasize practical application through real-world projects. Our AI adapts to your skill level, providing personalized guidance exactly when you need it, similar to having a senior developer mentoring you 24/7."
         },
         {
           question: "Do I need prior coding experience?",
           answer: "No, we have learning paths for complete beginners. Our AI assessment will identify your current level and create a personalized roadmap that starts with the fundamentals you need before advancing to more complex projects."
         },
         {
           question: "How long does it take to learn enough to get hired?",
           answer: "Most of our successful students complete 3-5 projects within 4-6 months before landing their first tech role. However, this varies based on your starting point, time commitment, and career goals. Our platform is designed to accelerate your learning compared to traditional methods."
         },
         {
           question: "What makes the portfolio projects valuable to employers?",
           answer: "Our projects are designed to solve real business problems that employers recognize. You'll build applications that demonstrate your ability to write clean code, implement features, and solve technical challenges—skills that companies actively look for when hiring."
         }
       ].map((item, index) => (
         <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
           <p className="text-gray-600">{item.answer}</p>
         </div>
       ))}
     </div>
   </div>
 </div>

      {/* Features Section */}
      <div className="py-24 bg-[#f0e9e0]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold mb-2 inline-block">BENEFITS</span>
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">We combine AI technology with proven learning methods</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {[
              {
                icon: <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0" />,
                title: "Personalized Learning Paths",
                description: "Our AI analyzes your skill level and goals to create custom learning paths that make sense for you."
              },
              {
                icon: <Layout className="w-6 h-6 text-blue-600 flex-shrink-0" />,
                title: "Real-World Projects",
                description: "Build portfolio-worthy projects that demonstrate your skills to potential employers."
              },
              {
                icon: <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0" />,
                title: "Adaptive Feedback",
                description: "Get intelligent feedback that adapts to your learning style and helps you overcome challenges."
              },
              {
                icon: <Star className="w-6 h-6 text-blue-600 flex-shrink-0" />,
                title: "Expert-Designed Curriculum",
                description: "Follow learning paths created by industry experts and continuously updated with the latest practices."
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-5 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="bg-blue-50 p-3 rounded-lg">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 bg-[#e8dfd3]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold mb-2 inline-block">TESTIMONIALS</span>
            <h2 className="text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Join thousands who have transformed their careers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I went from knowing basics to building a full-stack app in just 3 months. The project-based approach made all the difference.",
                name: "Alex Johnson",
                title: "Frontend Developer"
              },
              {
                quote: "The AI guidance is like having a senior developer by your side. It helped me overcome challenges that would have taken days to solve on my own.",
                name: "Sarah Williams",
                title: "Software Engineer"
              },
              {
                quote: "This platform taught me more practical skills in weeks than I learned in a year of traditional courses. Highly recommended!",
                name: "Michael Chen",
                title: "Data Scientist"
              }
            ].map((item, index) => (
              <div key={index} className="bg-[#f0e9e0] p-8 rounded-2xl border border-gray-100">
                <div className="text-yellow-400 flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 italic">{`"${item.quote}"`}</p>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500 text-sm">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of developers who have accelerated their careers with our AI-guided projects.</p>
          <Link to="/signup" className="bg-white text-blue-700 px-10 py-4 rounded-lg font-semibold inline-flex items-center hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <p className="mt-6 text-sm text-blue-200">No credit card required. Start with our free tier today.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/tutorials" className="hover:text-white transition-colors">Tutorials</Link></li>
                <li><Link to="/webinars" className="hover:text-white transition-colors">Webinars</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><a href="https://twitter.com/company" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="https://linkedin.com/company/company" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>© {new Date().getFullYear()} made with love</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;