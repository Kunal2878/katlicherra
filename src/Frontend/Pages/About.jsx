  import React from 'react';
  import { GraduationCap, School, LineChart, Cloud } from 'lucide-react';

  const About = () => {
    return (
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-10">Welcome to Katlicherra Central School</h1>
          <p className="text-xl text-center text-gray-600 mb-16">
            Transforming education through digital innovation and seamless connectivity
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <Cloud className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Cloud-Based Learning</h3>
                <p className="text-gray-600">Access educational resources anytime, anywhere through our secure cloud platform</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <GraduationCap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Student Success</h3>
                <p className="text-gray-600">Track academic progress and achieve educational goals with personalized learning paths</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <School className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Teacher Empowerment</h3>
                <p className="text-gray-600">Powerful tools for educators to manage classes and enhance teaching effectiveness</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <LineChart className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
                <p className="text-gray-600">Comprehensive analytics and reporting for data-driven educational decisions</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                Katlicherra Central School is committed to revolutionizing education by providing a comprehensive digital
                platform that connects students, teachers, and schools. We believe in making quality
                education accessible and manageable through innovative technology solutions.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Why Choose Katlicherra Central School?</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Seamless integration of learning management tools
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Real-time performance tracking and analytics
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Interactive virtual classrooms and resources
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Secure and reliable cloud-based infrastructure
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Customizable solutions for different educational needs
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold text-blue-500 mb-2">20+</h3>
                <p className="text-gray-600">Schools Connected</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-blue-500 mb-2">10k+</h3>
                <p className="text-gray-600">Active Students</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-blue-500 mb-2">95%</h3>
                <p className="text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default About;