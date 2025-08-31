"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"

const ArtisanMarketplaceLanding: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isVisible, setIsVisible] = useState(false)
  const [time, setTime] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()

  const [starData, setStarData] = useState<Array<{width: number, height: number, left: number, top: number, opacity: number, delay: number}>>([])
  const [debrisData, setDebrisData] = useState<Array<{left: string, top: string, duration: number, delay: number}>>([])
  const [satelliteData, setSatelliteData] = useState<Array<{animation: string, duration: number, delay: number}>>([])

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Generate star data once on client
    const stars = Array(150).fill(0).map(() => ({
      width: Math.random() * 2 + 0.5,
      height: Math.random() * 2 + 0.5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 3
    }))
    setStarData(stars)

    // Generate debris data once on client
    const debris = Array(6).fill(0).map((_, i) => ({
      left: `${10 + i * 15}%`,
      top: `${20 + Math.sin(i) * 30}%`,
      duration: 10 + i * 2,
      delay: i * 2
    }))
    setDebrisData(debris)

    // Generate satellite data once on client
    const satellites = Array(4).fill(0).map((_, i) => ({
      animation: `satellite${i % 3}`,
      duration: 18 + i * 3,
      delay: i * 2.5
    }))
    setSatelliteData(satellites)
  }, [])

  const animate = useCallback((timestamp: number) => {
    setTime(timestamp * 0.001)
    requestRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    setIsVisible(true)
    requestRef.current = requestAnimationFrame(animate)
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      if (container) container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [animate])

  return (
    <>
     {!isClient ? null : (
    <div ref={containerRef} className="min-h-screen bg-black text-white relative overflow-hidden">
      
      {/* Star Field */}
      <div className="absolute inset-0 z-0">
        {starData.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity,
              animation: `twinkle ${2 + star.delay}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
        
        {/* Nebula Clouds */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-purple-300 rounded-full blur-3xl" style={{ left: '70%', top: '20%', animation: 'nebulaDrift 20s ease-in-out infinite' }} />
          <div className="absolute w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-blue-300 rounded-full blur-3xl" style={{ left: '10%', bottom: '30%', animation: 'nebulaDrift 25s ease-in-out infinite reverse' }} />
          <div className="absolute w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-amber-300 rounded-full blur-3xl" style={{ right: '5%', bottom: '10%', animation: 'nebulaDrift 30s ease-in-out infinite' }} />
        </div>
      </div>

      
      {/* Satellites - representing AI-powered tools */}
      <div className="absolute inset-0 z-10">
        {satelliteData.map((sat, i) => (
          <div key={i} className="absolute" style={{ left: '50%', top: '50%', animation: `${sat.animation} ${sat.duration}s linear infinite`, animationDelay: `${sat.delay}s` }}>
            <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-br from-purple-400 to-blue-400 relative -ml-2 -mt-2 sm:-ml-2.5 sm:-mt-2.5 md:-ml-3 md:-mt-3 rounded-full" style={{ filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.6))' }}>
              <div className="absolute inset-0">
                <div className="absolute border border-purple-300/30 rounded-full animate-ping w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 lg:w-12 lg:h-12" style={{ left: '-14px', top: '-14px', animationDuration: '4s' }} />
              </div>
            </div>
          </div>
        ))}

        {/* Floating artisan symbols */}
        {debrisData.map((deb, i) => (
          <div key={i} className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" style={{ left: deb.left, top: deb.top, animation: `debris ${deb.duration}s linear infinite`, animationDelay: `${deb.delay}s`, filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))' }} />
        ))}
      </div>

      {/* Floating Feature Icons */}
      <div className="absolute inset-0 z-15">
        {/* NFT/Digital Twin Icon */}
        <div 
          className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-black/80 border border-purple-400/40 rounded-full backdrop-blur-sm flex items-center justify-center"
          style={{
            right: '8%',
            top: '15%',
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
            animation: 'stationFloat 6s ease-in-out infinite'
          }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 border-purple-400 rounded" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}>
            <div className="w-full h-full bg-purple-400/20 animate-pulse rounded"></div>
          </div>
        </div>

        {/* AI Generative Icon */}
        <div 
          className="absolute w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-black/80 border border-blue-400/40 rounded-lg backdrop-blur-sm flex items-center justify-center"
          style={{
            left: '5%',
            top: '25%',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
            animation: 'stationFloat 7s ease-in-out infinite reverse'
          }}
        >
          <div className="relative">
            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border border-blue-400 rounded-full animate-spin" style={{ animationDuration: '4s' }}>
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full -translate-x-1/2"></div>
            </div>
          </div>
        </div>

        {/* 360° View Icon */}
        <div 
          className="absolute w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black/80 border border-amber-400/40 rounded-full backdrop-blur-sm flex items-center justify-center"
          style={{
            right: '15%',
            bottom: '20%',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)',
            animation: 'stationFloat 8s ease-in-out infinite'
          }}
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-amber-400 rounded-full relative">
            <div className="absolute inset-1 border border-amber-400/60 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-start px-4 sm:px-6 md:px-8 lg:px-20 max-w-7xl pt-16 sm:pt-20">
        
        {/* Status Badge */}
        <div className={`mb-6 sm:mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-black/80 backdrop-blur-md border border-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full">
            <div className="relative mr-3">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-ping absolute"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-white/90 tracking-wider">AI_MARKETPLACE: LIVE</span>
            <div className="ml-4 px-3 py-1 bg-gradient-to-r from-purple-400/20 to-blue-400/20 border border-purple-400/30 rounded text-xs text-white font-medium">
              BETA
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className={`mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4"
            style={{
              textShadow: '0 0 40px rgba(147, 51, 234, 0.4)',
              letterSpacing: '0.02em',
              background: 'linear-gradient(45deg, #ffffff, #a855f7, #3b82f6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            ARTISAN
          </h1>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-white/80 tracking-[0.2em] sm:tracking-[0.3em] mb-2">
            AI_MARKETPLACE
          </div>
          <div className="text-base sm:text-lg md:text-xl text-purple-300/70 font-light tracking-wider">
            WHERE_HERITAGE_MEETS_INNOVATION
          </div>
        </div>

        {/* Mission Description */}
        <div className={`mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6">
            <div className="w-24 sm:w-32 md:w-40 h-px bg-gradient-to-r from-purple-400 via-blue-400 to-transparent mr-4"></div>
            <span className="text-xs text-white/70 tracking-wider">MISSION_OVERVIEW</span>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-white/90 max-w-4xl leading-relaxed">
            Empowering local artisans with AI-driven tools to showcase their heritage crafts to the world. 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-medium"> Transform tradition through technology.</span>
          </p>
        </div>

        {/* Feature Grid */}
        <div className={`mb-12 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: "🔗", 
                title: "NFT Authentication", 
                desc: "Mint crafts as digital twins with verified cultural provenance",
                color: "from-purple-400 to-purple-600"
              },
              { 
                icon: "👁", 
                title: "360° Exhibitions", 
                desc: "Immersive galleries with global reach and enhanced visibility",
                color: "from-blue-400 to-blue-600"
              },
              { 
                icon: "🎨", 
                title: "AI Design Previews", 
                desc: "Generate custom variations before ordering",
                color: "from-amber-400 to-orange-500"
              },
              { 
                icon: "🌐", 
                title: "Smart Marketing", 
                desc: "Auto-generated content in multiple languages and tones",
                color: "from-green-400 to-emerald-500"
              },
              { 
                icon: "🤝", 
                title: "Collaborative Design", 
                desc: "Co-create with customers using generative AI",
                color: "from-pink-400 to-rose-500"
              },
              { 
                icon: "🏺", 
                title: "Heritage Preservation", 
                desc: "Digital archives preserving cultural techniques",
                color: "from-indigo-400 to-purple-500"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group cursor-pointer"
                style={{ 
                  animation: `fadeInUp 0.8s ease-out ${0.3 + index * 0.1}s both`
                }}
              >
                <div className={`relative p-6 bg-black/70 backdrop-blur-sm border border-white/20 rounded-xl hover:border-white/50 hover:bg-black/90 transition-all duration-300 group-hover:scale-105`}>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                    <div className={`w-full h-full bg-gradient-to-br ${feature.color} rounded-xl`}></div>
                  </div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 w-full sm:w-auto shadow-lg shadow-purple-500/25">
            <span className="flex items-center justify-center">
              JOIN_MARKETPLACE
              <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          
          <button className="px-8 py-4 bg-transparent border border-white/40 text-white rounded-xl font-semibold hover:bg-white/10 hover:border-white/60 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
            EXPLORE_GALLERIES
          </button>
        </div>
        </div>
      

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        
        @keyframes nebulaDrift {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(30px) translateY(-15px); }
        }
        
        @keyframes satellite0 {
          from { transform: rotate(0deg) translateX(180px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
        }
        
        @keyframes satellite1 {
          from { transform: rotate(0deg) translateX(220px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(220px) rotate(-360deg); }
        }
        
        @keyframes satellite2 {
          from { transform: rotate(0deg) translateX(160px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(160px) rotate(-360deg); }
        }
        
        @keyframes debris {
          0% { transform: translateX(-20px) translateY(0px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 20px)) translateY(-40px); opacity: 0; }
        }
        
        @keyframes stationFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
     )
    }
     </>
  );
};

export default ArtisanMarketplaceLanding