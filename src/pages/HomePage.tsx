import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Home, Building2, Building, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedPropertyProps {
  image: string;
  title: string;
  price: number;
  location: string;
  latitude: number;
  longitude: number;
}

const FeaturedProperty = ({ image, title, price, location, latitude, longitude }: FeaturedPropertyProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl group">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 bg-white py-1 px-3 rounded-full text-sm font-semibold text-teal-700 shadow-md">
          ${price.toLocaleString()}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 text-teal-600 mr-1" />
          <p className="text-sm">{location}</p>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-teal-800 font-medium text-sm flex items-center mt-2 group-hover:underline"
          >
            View on Map
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

interface PropertyTypeCardProps {
  icon: React.ElementType;
  type: string;
  count: number;
}

const PropertyTypeCard = ({ icon: Icon, type, count }: PropertyTypeCardProps) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] border-b-4 border-teal-500">
    <div className="bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
      <Icon className="w-10 h-10 text-teal-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{type}</h3>
    <p className="text-teal-600 font-semibold text-center">{count.toLocaleString()} Properties</p>
  </div>
);

interface CircularCarouselProps {
  properties: FeaturedPropertyProps[];
}

const CircularCarousel = ({ properties }: CircularCarouselProps) => {
  const [position, setPosition] = useState(0);
  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Display 3x the properties to create infinite loop effect
  const extendedProperties = [...properties, ...properties, ...properties];
  
  useEffect(() => {
    if (isPaused) return;
    
    // Animation timing (slower for smoother effect)
    const animationDuration = 30000; // 30 seconds for one complete cycle
    const frameRate = 60;
    const totalFrames = animationDuration / (1000 / frameRate);
    const increment = properties.length / totalFrames;
    
    let animationId: number;
    let currentPosition = position;
    
    const animate = () => {
      currentPosition = (currentPosition + increment) % properties.length;
      setPosition(currentPosition);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [properties.length, position, isPaused]);
  
  const calculateTransform = () => {
    // Calculate the percentage to translate based on the position
    const percentage = (position / properties.length) * 100;
    return `translateX(-${percentage}%)`;
  };

  const handleNext = () => {
    setPosition((prev) => (prev + 1) % properties.length);
  };

  const handlePrev = () => {
    setPosition((prev) => (prev - 1 + properties.length) % properties.length);
  };

  return (
    <div 
      className="overflow-hidden relative rounded-xl shadow-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        ref={carouselRef}
        className="flex" 
        style={{
          transform: calculateTransform(),
          transition: 'transform 0.5s ease-out'
        }}
      >
        {extendedProperties.map((property, index) => (
          <div key={index} className="w-full md:w-1/3 flex-shrink-0 px-4 py-6">
            <FeaturedProperty {...property} />
          </div>
        ))}
      </div>
      
      <button 
        onClick={handlePrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-teal-700 p-2 rounded-full shadow-lg z-10 transition-all duration-300 hover:scale-110"
        aria-label="Previous property"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-teal-700 p-2 rounded-full shadow-lg z-10 transition-all duration-300 hover:scale-110"
        aria-label="Next property"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default function HomePage() {
  const featuredProperties = [
    {
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3",
      title: "Modern Villa with Pool",
      price: 1250000,
      location: "Beverly Hills, CA",
      latitude: 34.073620,
      longitude: -118.400356
    },
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3",
      title: "Luxury Penthouse",
      price: 2100000,
      location: "Manhattan, NY", 
      latitude: 40.712776,
      longitude: -74.005974
    },
    {
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3",
      title: "Waterfront Estate",
      price: 3500000,
      location: "Miami Beach, FL",
      latitude: 25.790654,
      longitude: -80.1300455
    },
    {
      image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3", 
      title: "Mountain Retreat",
      price: 875000,
      location: "Aspen, CO",
      latitude: 39.1911,
      longitude: -106.8175
    },
    {
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3",
      title: "Beachfront Cottage",
      price: 1450000,
      location: "Malibu, CA",
      latitude: 34.0259,
      longitude: -118.7798
    },
    {
      image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3",
      title: "Urban Loft",
      price: 985000,
      location: "Chicago, IL",
      latitude: 41.8781,
      longitude: -87.6298
    },
    {
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3",
      title: "Lakeside Mansion",
      price: 2850000,
      location: "Lake Tahoe, NV",
      latitude: 39.0968,
      longitude: -120.0324
    },
    {
      image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3",
      title: "Historic Brownstone",
      price: 1750000,
      location: "Boston, MA",
      latitude: 42.3601,
      longitude: -71.0589
    },
    {
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3",
      title: "Desert Oasis",
      price: 1125000,
      location: "Scottsdale, AZ",
      latitude: 33.4942,
      longitude: -111.9261
    },
    {
      image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83",
      title: "Dubai Marina Penthouse",
      price: 8500000,
      location: "Dubai, UAE",
      latitude: 25.0657,
      longitude: 55.1713
    },
    {
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1",
      title: "Tuscan Villa Estate",
      price: 4750000,
      location: "Florence, Italy",
      latitude: 43.7696,
      longitude: 11.2558
    },
    {
      image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
      title: "Sydney Harbor View Apartment",
      price: 6200000,
      location: "Sydney, Australia",
      latitude: -33.8688,
      longitude: 151.2093
    },
    {
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
      title: "Alpine Luxury Chalet",
      price: 5800000,
      location: "Zermatt, Switzerland",
      latitude: 46.0207,
      longitude: 7.7491
    },
    {
      image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f",
      title: "Santorini Villa",
      price: 3900000,
      location: "Santorini, Greece",
      latitude: 36.3932,
      longitude: 25.4615
    },
    {
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      title: "Paris Luxury Apartment",
      price: 4200000,
      location: "Paris, France",
      latitude: 48.8566,
      longitude: 2.3522
    },
    {
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
      title: "Tokyo Sky Residence",
      price: 7100000,
      location: "Tokyo, Japan",
      latitude: 35.6762,
      longitude: 139.6503
    },
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      title: "Bali Beachfront Villa",
      price: 2900000,
      location: "Bali, Indonesia",
      latitude: -8.3405,
      longitude: 115.0920
    }
  ];

  const propertyTypes = [
    { icon: Home, type: "Houses", count: 1234 },
    { icon: Building2, type: "Apartments", count: 891 },
    { icon: Building, type: "Commercial", count: 456 }
  ];

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-teal-100/80 via-emerald-50 to-teal-50 bg-fixed">
      {/* Decorative Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-96 -right-96 w-192 h-192 bg-teal-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-96 -left-96 w-192 h-192 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-emerald-300/20 rounded-full blur-2xl"></div>
      </div>

      {/* Hero Section with Enhanced Design */}
      <div className="relative h-screen -mt-8 z-10">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-white max-w-2xl space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight drop-shadow-md">
                Discover Your <span className="text-teal-400">Perfect</span> Home
              </h1>
              <p className="text-xl md:text-2xl font-light max-w-xl leading-relaxed">
                Exclusive properties curated for those with discerning taste and appreciation for exceptional living spaces.
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="fill-current text-transparent">
            <path d="M0,128L60,138.7C120,149,240,171,360,192C480,213,600,235,720,229.3C840,224,960,192,1080,176C1200,160,1320,160,1380,160L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Property Types with Enhanced Design */}
      <section className="container mx-auto px-4 py-16 relative z-20">
        <div className="text-center mb-12">
          <h5 className="text-teal-600 font-semibold uppercase tracking-wider mb-2">Diverse Options</h5>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Browse by Property Type</h2>
          <div className="w-20 h-1 bg-teal-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {propertyTypes.map((type, index) => (
            <PropertyTypeCard key={index} {...type} />
          ))}
        </div>
      </section>

      {/* Featured Properties with Enhanced Design */}
      <section className="relative py-20 z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-600/5 to-teal-600/10 skew-y-3 z-0"></div>
        <div className="container mx-auto px-4 py-10 relative z-10">
          <div className="text-center mb-12">
            <h5 className="text-teal-600 font-semibold uppercase tracking-wider mb-2">Handpicked For You</h5>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Properties</h2>
            <div className="w-20 h-1 bg-teal-600 mx-auto mt-4 rounded-full"></div>
          </div>
          <CircularCarousel properties={featuredProperties} />
          <div className="flex justify-center mt-8">
            <Link 
              to="/search" 
              className="text-teal-600 hover:text-teal-800 font-semibold flex items-center group"
            >
              View All Properties
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Leaflet Map with Enhanced Design */}
      <section className="container mx-auto px-4 py-16 relative z-20">
        <div className="text-center mb-12">
          <h5 className="text-teal-600 font-semibold uppercase tracking-wider mb-2">Explore Locations</h5>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Property Locations</h2>
          <div className="w-20 h-1 bg-teal-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="h-96 rounded-xl shadow-xl overflow-hidden border-4 border-white relative">
          <div className="absolute inset-0 bg-white/40  z-10 pointer-events-none"></div>
          <MapContainer 
            center={[39.8283, -98.5795]} // Center of US
            zoom={4} 
            className="h-full w-full z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {featuredProperties.map((property, index) => (
              <Marker key={index} position={[property.latitude, property.longitude]}>
                <Popup className="custom-popup">
                  <div className="text-center">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-32 h-24 object-cover mx-auto mb-2 rounded"
                    />
                    <strong className="text-teal-700">{property.title}</strong>
                    <br />
                    <span className="font-medium text-teal-600">${property.price.toLocaleString()}</span>
                    <br />
                    {property.location}
                    <br />
                    <a
                      href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block mt-1 text-sm"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>

      {/* New Quality Section */}
      <section className="py-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-teal-900 to-emerald-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-10 md:p-16 flex flex-col justify-center">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  Uncompromising Quality & <span className="text-teal-300">Exceptional Service</span>
                </h3>
                <p className="text-teal-100 text-lg mb-8 leading-relaxed">
                  At LuxuryEstates, we believe that finding your perfect home should be an extraordinary experience. We curate only the finest properties and provide concierge-level service to each of our valued clients.
                </p>
                <div className="grid grid-cols-2 gap-6 text-white">
                  <div>
                    <div className="text-4xl font-bold text-teal-300 mb-2">25+</div>
                    <div className="text-sm uppercase tracking-wider">Years of Experience</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-teal-300 mb-2">4,500+</div>
                    <div className="text-sm uppercase tracking-wider">Properties Sold</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-teal-300 mb-2">98%</div>
                    <div className="text-sm uppercase tracking-wider">Client Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-teal-300 mb-2">42</div>
                    <div className="text-sm uppercase tracking-wider">Expert Agents</div>
                  </div>
                </div>
              </div>
              <div className="relative min-h-96">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3" 
                  alt="Luxury Property" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-900/20 to-transparent md:bg-gradient-to-l"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Custom CSS for the app */}
      <style>{`
        :root {
          --color-teal-50: #f0fdfa;
          --color-teal-100: #ccfbf1;
          --color-teal-200: #99f6e4;
          --color-teal-300: #5eead4;
          --color-teal-400: #2dd4bf;
          --color-teal-500: #14b8a6;
          --color-teal-600: #0d9488;
          --color-teal-700: #0f766e;
          --color-teal-800: #115e59;
          --color-teal-900: #134e4a;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: var(--color-teal-400);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: var(--color-teal-600);
        }
        
        /* Enhanced map popup styles */
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 0;
          overflow: hidden;
        }
        
        .leaflet-popup-content {
          margin: 0;
          padding: 12px;
        }
        
        .leaflet-popup-tip {
          background: white;
        }
        
        /* Animation for property cards */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .property-card {
          animation: fadeIn 0.5s ease-out forwards;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Glass background for components */
        .glass-bg {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* Animated gradient background */
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientFlow 15s ease infinite;
        }
      `}</style>
    </div>
  );
}