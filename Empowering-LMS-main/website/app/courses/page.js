"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Users,
  Star,
  ChevronRight,
  PlayCircle,
  Download,
  Award,
  CheckCircle,
  Calendar,
  Globe,
  Target,
  BarChart,
  Shield,
  Zap,
  TrendingUp,
  BookMarked,
  Video,
  FileText,
  MessageCircle,
  UserCheck,
  FolderOpen,
  BookText,
  GraduationCap,
  Brain,
  Cpu,
  Code,
  Palette,
  PieChart,
  Settings,
  Lock,
  Cloud,
  Database
} from "lucide-react";

// PiCertificateBold fallback for lucide-react (Award is close enough, or import if available)
// Using Award as replacement for PiCertificateBold to avoid external dependency if not installed, or try to import it.
// React Icons might not be installed by default in next app, but I'll use Award for now to be safe or just import it from react-icons/pi if I am sure.
// User didn't specify packages, but fronted had it. I'll use Award to avoid error if react-icons missing.
// Actually, I can use "lucide-react" AwardIcon or similar.
import { Award as PiCertificateBold } from "lucide-react"; 

const CoursesPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Courses", icon: <BookOpen className="w-5 h-5" />, count: 56 },
    { id: "tech", name: "Technology", icon: <Cpu className="w-5 h-5" />, count: 18 },
    { id: "business", name: "Business", icon: <TrendingUp className="w-5 h-5" />, count: 12 },
    { id: "design", name: "Design", icon: <Palette className="w-5 h-5" />, count: 8 },
    { id: "data", name: "Data Science", icon: <PieChart className="w-5 h-5" />, count: 7 },
    { id: "security", name: "Cybersecurity", icon: <Shield className="w-5 h-5" />, count: 6 },
    { id: "cloud", name: "Cloud Computing", icon: <Cloud className="w-5 h-5" />, count: 5 }
  ];

  const popularCourses = [
    {
      id: 1,
      title: "Modern Web Development",
      description: "Master HTML5, CSS3, JavaScript, and modern frameworks like React and Vue.js",
      category: "tech",
      duration: "8 weeks",
      students: 1250,
      rating: 4.8,
      lessons: 42,
      level: "Intermediate",
      instructor: "Alex Johnson",
      instructorRole: "Senior Developer",
      price: "$89",
      originalPrice: "$129",
      featured: true,
      tags: ["JavaScript", "React", "Frontend"],
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Digital Marketing Strategy",
      description: "Learn to create effective digital marketing campaigns and analyze performance metrics",
      category: "business",
      duration: "6 weeks",
      students: 980,
      rating: 4.7,
      lessons: 35,
      level: "Beginner",
      instructor: "Sarah Williams",
      instructorRole: "Marketing Director",
      price: "$79",
      originalPrice: "$99",
      featured: true,
      tags: ["Marketing", "SEO", "Analytics"],
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      description: "Master user-centered design, wireframing, prototyping, and usability testing",
      category: "design",
      duration: "10 weeks",
      students: 2100,
      rating: 4.9,
      lessons: 48,
      level: "All Levels",
      instructor: "Michael Chen",
      instructorRole: "Lead Designer",
      price: "$99",
      originalPrice: "$149",
      featured: true,
      tags: ["UI Design", "UX Research", "Figma"],
      thumbnail: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=250&fit=crop"
    }
  ];

  const courses = [
    ...popularCourses,
    {
      id: 4,
      title: "Data Analytics with Python",
      description: "Learn data analysis, visualization, and statistical modeling using Python",
      category: "data",
      duration: "7 weeks",
      students: 840,
      rating: 4.6,
      lessons: 38,
      level: "Intermediate",
      instructor: "David Miller",
      instructorRole: "Data Scientist",
      price: "$89",
      originalPrice: "$119",
      featured: false,
      tags: ["Python", "Pandas", "Visualization"],
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Cloud Security Fundamentals",
      description: "Understand cloud security principles and implement secure cloud architectures",
      category: "security",
      duration: "5 weeks",
      students: 520,
      rating: 4.5,
      lessons: 28,
      level: "Intermediate",
      instructor: "Lisa Park",
      instructorRole: "Security Engineer",
      price: "$94",
      originalPrice: "$124",
      featured: false,
      tags: ["AWS", "Security", "Compliance"],
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "Project Management Professional",
      description: "Prepare for PMP certification with comprehensive project management training",
      category: "business",
      duration: "12 weeks",
      students: 1560,
      rating: 4.8,
      lessons: 55,
      level: "Advanced",
      instructor: "Robert Davis",
      instructorRole: "Project Director",
      price: "$149",
      originalPrice: "$199",
      featured: false,
      tags: ["PMP", "Agile", "Scrum"],
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop"
    },
    {
      id: 7,
      title: "Machine Learning Basics",
      description: "Introduction to machine learning algorithms and practical implementation",
      category: "data",
      duration: "9 weeks",
      students: 1920,
      rating: 4.7,
      lessons: 45,
      level: "Intermediate",
      instructor: "Emma Wilson",
      instructorRole: "AI Researcher",
      price: "$109",
      originalPrice: "$149",
      featured: false,
      tags: ["ML", "TensorFlow", "Python"],
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop"
    },
    {
      id: 8,
      title: "Mobile App Development",
      description: "Build cross-platform mobile applications using React Native",
      category: "tech",
      duration: "8 weeks",
      students: 1100,
      rating: 4.6,
      lessons: 40,
      level: "Intermediate",
      instructor: "James Taylor",
      instructorRole: "Mobile Developer",
      price: "$89",
      originalPrice: "$119",
      featured: false,
      tags: ["React Native", "iOS", "Android"],
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop"
    },
    {
      id: 9,
      title: "AWS Certified Solutions Architect",
      description: "Prepare for AWS certification with hands-on cloud architecture training",
      category: "cloud",
      duration: "10 weeks",
      students: 1780,
      rating: 4.9,
      lessons: 50,
      level: "Advanced",
      instructor: "Brian Clark",
      instructorRole: "Cloud Architect",
      price: "$129",
      originalPrice: "$179",
      featured: false,
      tags: ["AWS", "Cloud", "Certification"],
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop"
    }
  ];

  const courseFeatures = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Lessons",
      description: "High-quality video content from industry experts"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Downloadable Resources",
      description: "PDFs, templates, and code samples for hands-on learning"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Discussion Forums",
      description: "Connect with instructors and fellow learners"
    },
    {
      icon: <PiCertificateBold  className="w-8 h-8" />,
      title: "Certification",
      description: "Earn recognized certificates upon completion"
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Instructor Support",
      description: "Direct access to course instructors"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Self-Paced Learning",
      description: "Learn at your own pace with lifetime access"
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === "all" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-emerald-700 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Expand Your Knowledge
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Courses
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Browse through our comprehensive library of professional courses designed 
              to enhance your skills and advance your career.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses by title, topic, or instructor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none shadow-lg"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-shadow">
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === category.id
                    ? "bg-white/20"
                    : "bg-gray-300"
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured <span className="text-emerald-600">Courses</span>
              </h2>
              <p className="text-gray-600">Most popular courses selected by our learners</p>
            </div>
            <button className="flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700">
              View All Featured
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                      Featured
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white">
                      <BookMarked className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
                
                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                      {course.category}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {course.level}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Instructor */}
                  <div className="flex items-center gap-3 mb-6 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                      {course.instructor.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{course.instructor}</p>
                      <p className="text-sm text-gray-500">{course.instructorRole}</p>
                    </div>
                  </div>
                  
                  {/* Price & Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{course.originalPrice}</span>
                    </div>
                    <button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Courses Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                All <span className="text-emerald-600">Courses</span>
              </h2>
              <p className="text-gray-600">
                Showing {filteredCourses.length} of {courses.length} courses
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Filter className="w-5 h-5" />
                <select className="bg-transparent border-none focus:outline-none">
                  <option>Sort by: Popularity</option>
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>
          </div>
          
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.slice(3).map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        course.category === 'tech' ? 'bg-blue-100 text-blue-700' :
                        course.category === 'business' ? 'bg-purple-100 text-purple-700' :
                        course.category === 'design' ? 'bg-pink-100 text-pink-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <PlayCircle className="w-3 h-3" />
                          <span>{course.lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span className="text-xs font-medium">{course.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-lg font-bold text-gray-900">{course.price}</span>
                      </div>
                      <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Course Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              What You Get
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Enhanced <span className="text-emerald-600">Learning Experience</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every course includes premium features designed to maximize your learning outcomes
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courseFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-emerald-200 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-emerald-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h2 className="text-4xl font-bold mb-6">
                Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  50,000+
                </span>{" "}
                Successful Learners
              </h2>
              
              <p className="text-lg text-gray-300 mb-8">
                Our graduates have advanced their careers, gained new skills, and achieved 
                professional certifications through our comprehensive course offerings.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold mb-1">95%</div>
                  <div className="text-sm text-gray-300">Course Completion Rate</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold mb-1">4.8/5</div>
                  <div className="text-sm text-gray-300">Average Rating</div>
                </div>
              </div>
              
              <button className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300">
                Start Learning Today
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Need Help Choosing?</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Personalized Recommendations</p>
                    <p className="text-sm text-gray-600">Get course suggestions based on your goals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt=1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Free Preview Lessons</p>
                    <p className="text-sm text-gray-600">Try before you enroll with sample content</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Career Path Guidance</p>
                    <p className="text-sm text-gray-600">Understand which courses align with your career</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                Speak with a Learning Advisor
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
