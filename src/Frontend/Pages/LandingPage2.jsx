import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
// Main Landing Page Component
const SchoolLandingPage = () => {
const token= Cookies.get("token")
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Enhanced Particle Background - higher z-index but still behind content */}
      <ParticleBackground />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto sm:px-16 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-black font-bold text-2xl">
              Katlicherra Central School
            </div>
          </div>
          <div className="hidden md:flex space-x-8">
            <NavLink href="#" label="Home" active />
            <NavLink href="#" label="Learning Programs" />
            <NavLink href="#" label="About Us" />
            <NavLink href="#" label="Admissions" />
          </div>
          <div className="flex items-center space-x-4">
            <Link
             to={token ? "/dashboard" : "/user-options"}
              className="border-2 border-purpleColor text-purpleColor px-6 py-2 rounded-full font-medium transition-all  hover:shadow-md"
            >
             {token?"Dashboard":"Login"} 
            </Link>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="container mx-auto sm:px-16 px-6 sm:py-16 py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6 animate-fadeIn">
              Let's Create a Brilliant Future with Our School
            </h1>
            <p className="text-gray-600 mb-8 text-lg animate-slideUp">
              Katlicherra Central School is a technology-first school that is committed to
              providing high-quality education and employability in real-world
              contexts.
            </p>
            <div
              className="flex flex-col justify-between sm:flex-row gap-4 animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              <Link to={token ? "/dashboard" : "/user-options"}className="bg-purpleColor text-white px-8 py-3 rounded-full font-medium transition-all hover:shadow-md hover:scale-105">
                JOIN WITH US
              </Link>
              <Link to='/know-more'className="border border-purpleColor text-purpleColor px-8 py-3 rounded-full font-medium transition-all hover:bg-blue-50 hover:scale-105">
                Get to know more
              </Link>
            </div>

            <div
              className="flex justify-between mt-12 max-w-md animate-slideUp"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-purpleColor">20+</div>
                <div className="text-gray-600">Schools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purpleColor">10k+</div>
                <div className="text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purpleColor">4.8</div>
                <div className="text-gray-600">TRUSTED RATING</div>
              </div>
            </div>
          </div>
          <div
            className="md:w-1/2 mt-12 md:mt-0 animate-fadeIn"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex justify-center items-center relative rounded-lg overflow-hidden  transform transition-all hover:scale-105 duration-500">
              <img
                src="/3D Vector_landing.png"
                alt="Students learning"
                className="w-72 h-96 auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Curved SVG Divider */}
      <div className="w-full overflow-hidden relative z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          className="w-full"
        >
          <path
            fill="#553c9a"
            fillOpacity="1"
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,53.3C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
          ></path>
        </svg>
      </div>

      {/* Partners Section */}
      <section className="bg-purpleColor py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center sm:px-16 px-6">
            <PartnerLogo name="Inovation" />
            <PartnerLogo name="Technology" />
            <PartnerLogo name="Smart Tech" />
          </div>
        </div>
      </section>

      {/* Quality School Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6">
              <div className="bg-purpleColor text-white py-4 px-6 rounded-lg inline-block mb-6 transform -rotate-1 hover:rotate-0 transition-all duration-300">
                <h2 className="text-2xl font-bold">
                  Choose a Quality Platform for a Bright Future
                </h2>
              </div>
              <p className="text-black-300 mb-8 max-w-lg">
                Katlicherra Central School is a technology-first school management platform that
                is committed to providing high-quality education through digital
                means
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 sm:px-16 px-6 sm:py-16 py-10">
            <FeatureCard
              icon={<SchoolIcon />}
              title="Advanced Scheduling"
              description="Smart timetable management and event planning"
            />
            <FeatureCard
              icon={<MindIcon />}
              title="Analytics Dashboard"
              description="Comprehensive insights into academic performance and trends"
              highlight
            />
            <FeatureCard
              icon={<BenefitIcon />}
              title="Digital Assessment"
              description="Create and grade assessments with automated feedback"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Katlicherra Central School</h3>
              <p className="text-gray-400">
                Technology-first education for a brilliant future.
              </p>
            </div>
        
            <div>
              <h4 className="text-lg font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@katlicherra.com</li>
                <li>+919957052223</li>
                <li>Assam, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Katlicherra Central School. All rights reserved.</p>
            <p>Designed and Developed by SudamaSolutions Technologies and Health Care Pvt Ltd</p>
          </div>        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Enhanced Particle Background Component with more vibrant colors and movement
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colorPalette = [
      "rgba(66, 133, 244, 0.7)", // Blue
      "rgba(219, 68, 55, 0.7)", // Red
      "rgba(244, 180, 0, 0.7)", // Yellow
      "rgba(15, 157, 88, 0.7)", // Green
      "rgba(98, 0, 238, 0.7)", // Purple
    ];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 2; // Larger particles
        this.speedX = Math.random() * 2 - 1; // Faster movement
        this.speedY = Math.random() * 2 - 1; // Faster movement
        this.color =
          colorPalette[Math.floor(Math.random() * colorPalette.length)];
        this.opacity = Math.random() * 0.5 + 0.2; // More visible
      }

      update() {
        // Add some randomness to movement for more natural flow
        this.speedX += (Math.random() - 0.5) * 0.1;
        this.speedY += (Math.random() - 0.5) * 0.1;

        // Limit speed
        this.speedX = Math.max(-1.5, Math.min(1.5, this.speedX));
        this.speedY = Math.max(-1.5, Math.min(1.5, this.speedY));

        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Create particles
    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 10000); // More particles
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add movement effects over time
      const time = Date.now() * 0.0005;
      const waveAmplitude = 0.5;

      for (let i = 0; i < particles.length; i++) {
        // Add wave-like motion
        particles[i].speedX +=
          Math.sin(time + particles[i].y * 0.01) * waveAmplitude * 0.01;
        particles[i].speedY +=
          Math.cos(time + particles[i].x * 0.01) * waveAmplitude * 0.01;

        particles[i].update();
        particles[i].draw();

        // Connect particles with lines - only connect nearby particles
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            // Gradient lines based on particle colors
            const gradient = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            );
            gradient.addColorStop(0, particles[i].color);
            gradient.addColorStop(1, particles[j].color);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.globalAlpha = 0.4 - distance / 300;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Occasionally add new particles
      if (Math.random() > 0.97) {
        particles.push(new Particle());
        // Remove a particle if we have too many
        if (particles.length > 200) {
          particles.shift();
        }
      }

      requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.length = 0;
      createParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0"
    ></canvas>
  );
};

// Navigation Link Component
const NavLink = ({ href, label, active }) => (
  <a
    href={href}
    className={`font-medium transition-colors hover:text-purpleColor ${
      active ? "text-purpleColor" : "text-gray-700"
    }`}
  >
    {label}
  </a>
);

// Stat Counter Component with animation
const StatCounter = ({ number, label }) => {
  const [count, setCount] = useState(0);
  const finalNumber = parseInt(number) || 0;

  useEffect(() => {
    if (isNaN(finalNumber)) {
      setCount(0);
      return;
    }

    let start = 0;
    const duration = 2000;
    const increment = finalNumber / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= finalNumber) {
        setCount(finalNumber);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [finalNumber]);

  return (
    <div className="text-center transform transition-transform hover:scale-110 duration-300">
      <div className="text-3xl font-bold text-purpleColor">
        {isNaN(finalNumber) ? number : count}
      </div>
      <div className="text-sm text-gray-500 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

// Partner Logo Component
const PartnerLogo = ({ name }) => (
  <div className="flex items-center justify-center transform transition-all hover:scale-110 duration-300">
    <span className="text-white font-bold text-xl md:text-2xl">{name}</span>
  </div>
);

// Feature Card Component with hover animation
const FeatureCard = ({ icon, title, description, highlight }) => (
  <div
    className={`rounded-xl p-6 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-xl ${
      highlight
        ? "bg-gradient-to-br from-purpleColor to-blue-700 text-white shadow-lg"
        : "bg-white shadow hover:shadow-md"
    }`}
  >
    <div className="flex items-center mb-4">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full ${
          highlight ? "bg-white/20" : "bg-blue-100"
        }`}
      >
        {icon}
      </div>
      <div className="w-full flex justify-end">
        <button
          className={`rounded-full p-2 transform transition-transform hover:scale-110 ${
            highlight
              ? "bg-white/20 text-white"
              : "bg-gray-100 text-purpleColor"
          }`}
        >
          <ArrowIcon />
        </button>
      </div>
    </div>
    <h3
      className={`text-xl font-semibold mb-3 ${
        highlight ? "text-white" : "text-gray-800"
      }`}
    >
      {title}
    </h3>
    <p className={highlight ? "text-blue-50" : "text-gray-600"}>
      {description}
    </p>
  </div>
);

// Icons
const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

const SchoolIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-purpleColor"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
    />
  </svg>
);

const MindIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const BenefitIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-purpleColor"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default SchoolLandingPage;
