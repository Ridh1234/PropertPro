import  { useState } from 'react';
import { MapPin, Phone, Mail,  Bath, Bed, Maximize2, X } from 'lucide-react';

// Define a local interface that matches our hardcoded data structure
interface LuxuryProperty {
  id: number;
  image: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  description: string;
  propertyType: string;
  features: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function SearchPage() {
  const [selectedProperty, setSelectedProperty] = useState<LuxuryProperty | null>(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    location: ''
  });

  // Predefined luxury properties
  const luxuryProperties: LuxuryProperty[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      title: "Modern Villa with Pool",
      price: 12500000,
      location: "Beverly Hills, CA",
      bedrooms: 6,
      bathrooms: 7,
      square_feet: 8500,
      description: "Stunning modern villa with infinity pool and city views",
      propertyType: "Villa",
      features: [
        "Infinity Pool", 
        "Home Theater", 
        "Wine Cellar", 
        "Smart Home System", 
        "Gourmet Kitchen", 
        "Outdoor Kitchen", 
        "3-Car Garage"
      ],
      agent: {
        name: "Sarah Johnson",
        phone: "+1-310-555-0123",
        email: "sarah.j@luxuryestates.com"
      }
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      title: "Luxury Penthouse",
      price: 21000000,
      location: "Manhattan, NY",
      bedrooms: 4,
      bathrooms: 4.5,
      square_feet: 5200,
      description: "Exclusive penthouse with panoramic views of Central Park",
      propertyType: "Penthouse",
      features: [
        "Private Elevator", 
        "Panoramic Views", 
        "Marble Floors", 
        "Chef's Kitchen", 
        "Home Office", 
        "Concierge Service", 
        "Rooftop Terrace"
      ],
      agent: {
        name: "Michael Chen",
        phone: "+1-212-555-0124",
        email: "m.chen@luxuryestates.com"
      }
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f",
      title: "Waterfront Estate",
      price: 35000000,
      location: "Miami Beach, FL",
      bedrooms: 8,
      bathrooms: 10,
      square_feet: 12000,
      description: "Magnificent waterfront estate with private dock",
      propertyType: "Mansion",
      features: [
        "Private Beach", 
        "Yacht Dock", 
        "Infinity Pool", 
        "Tennis Court", 
        "Guest House", 
        "Home Spa", 
        "Outdoor Entertainment Area"
      ],
      agent: {
        name: "Isabella Martinez",
        phone: "+1-305-555-0125",
        email: "i.martinez@luxuryestates.com"
      }
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
      title: "Alpine Luxury Chalet",
      price: 18500000,
      location: "Aspen, CO",
      bedrooms: 5,
      bathrooms: 6,
      square_feet: 7200,
      description: "Ski-in/ski-out luxury chalet with mountain views",
      propertyType: "Chalet",
      features: [
        "Ski-in/Ski-out Access", 
        "Hot Tub", 
        "Sauna", 
        "Stone Fireplace", 
        "Game Room", 
        "Heated Floors", 
        "Mountain Views"
      ],
      agent: {
        name: "Robert Wilson",
        phone: "+1-970-555-0126",
        email: "r.wilson@luxuryestates.com"
      }
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      title: "Santorini Villa",
      price: 15800000,
      location: "Santorini, Greece",
      bedrooms: 5,
      bathrooms: 6,
      square_feet: 6000,
      description: "Stunning villa with Aegean Sea views",
      propertyType: "Villa",
      features: [
        "Infinity Pool", 
        "Private Terrace", 
        "Sea Views", 
        "Outdoor Dining Area", 
        "Wine Cellar", 
        "Guest House", 
        "Traditional Architecture"
      ],
      agent: {
        name: "Elena Papadopoulos",
        phone: "+30-2286-555-127",
        email: "e.papadopoulos@luxuryestates.com"
      }
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      title: "Dubai Penthouse",
      price: 42000000,
      location: "Dubai Marina, UAE",
      bedrooms: 6,
      bathrooms: 7,
      square_feet: 10000,
      description: "Ultra-luxury penthouse with Dubai skyline views",
      propertyType: "Penthouse",
      features: [
        "Private Pool", 
        "Helipad Access", 
        "Smart Home System", 
        "Private Cinema", 
        "Gym", 
        "Spa", 
        "360° City Views"
      ],
      agent: {
        name: "Ahmed Al-Sayed",
        phone: "+971-4-555-0128",
        email: "a.alsayed@luxuryestates.com"
      }
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
      title: "Lake Como Villa",
      price: 28000000,
      location: "Lake Como, Italy",
      bedrooms: 7,
      bathrooms: 8,
      square_feet: 9500,
      description: "Historic villa with private lakefront access",
      propertyType: "Villa",
      features: [
        "Lakefront Access", 
        "Historic Architecture", 
        "Boat Dock", 
        "Garden", 
        "Wine Cellar", 
        "Frescoed Ceilings", 
        "Guest House"
      ],
      agent: {
        name: "Marco Rossi",
        phone: "+39-031-555-0129",
        email: "m.rossi@luxuryestates.com"
      }
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e",
      title: "Malibu Beach House",
      price: 45000000,
      location: "Malibu, CA",
      bedrooms: 6,
      bathrooms: 8,
      square_feet: 8800,
      description: "Contemporary beachfront mansion with private beach access",
      propertyType: "Mansion",
      features: [
        "Private Beach Access", 
        "Infinity Pool", 
        "Home Theater", 
        "Wine Cellar", 
        "Gym", 
        "Spa", 
        "Outdoor Entertainment Area"
      ],
      agent: {
        name: "Jennifer Taylor",
        phone: "+1-310-555-0130",
        email: "j.taylor@luxuryestates.com"
      }
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      title: "Monaco Apartment",
      price: 38000000,
      location: "Monte Carlo, Monaco",
      bedrooms: 4,
      bathrooms: 5,
      square_feet: 4200,
      description: "Prestigious apartment overlooking Monaco Harbor",
      propertyType: "Apartment",
      features: [
        "Harbor Views", 
        "Private Terrace", 
        "Concierge Service", 
        "Smart Home System", 
        "Wine Cellar", 
        "Marble Floors", 
        "Designer Furnishings"
      ],
      agent: {
        name: "Pierre Dubois",
        phone: "+377-555-0131",
        email: "p.dubois@luxuryestates.com"
      }
    },
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      title: "Sydney Harbor Mansion",
      price: 32000000,
      location: "Sydney, Australia",
      bedrooms: 7,
      bathrooms: 8,
      square_feet: 9000,
      description: "Luxurious mansion with Opera House views",
      propertyType: "Mansion",
      features: [
        "Harbor Views", 
        "Infinity Pool", 
        "Home Theater", 
        "Wine Cellar", 
        "Tennis Court", 
        "Gym", 
        "Guest House"
      ],
      agent: {
        name: "James Wilson",
        phone: "+61-2-555-0132",
        email: "j.wilson@luxuryestates.com"
      }
    },
    {
      id: 11,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      title: "Paris Luxury Apartment",
      price: 24000000,
      location: "Paris, France",
      bedrooms: 5,
      bathrooms: 6,
      square_feet: 4800,
      description: "Elegant apartment near the Eiffel Tower",
      propertyType: "Apartment",
      features: [
        "Eiffel Tower Views", 
        "Historic Building", 
        "Balcony", 
        "Parquet Floors", 
        "Fireplace", 
        "High Ceilings", 
        "Concierge Service"
      ],
      agent: {
        name: "Sophie Laurent",
        phone: "+33-1-555-0133",
        email: "s.laurent@luxuryestates.com"
      }
    },
    {
      id: 12,
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
      title: "Bali Resort Villa",
      price: 15000000,
      location: "Bali, Indonesia",
      bedrooms: 6,
      bathrooms: 7,
      square_feet: 7500,
      description: "Tropical paradise with private beach access",
      propertyType: "Villa",
      features: [
        "Private Beach Access", 
        "Infinity Pool", 
        "Open-air Living", 
        "Tropical Garden", 
        "Outdoor Shower", 
        "Yoga Pavilion", 
        "Staff Quarters"
      ],
      agent: {
        name: "Made Wijaya",
        phone: "+62-361-555-0134",
        email: "m.wijaya@luxuryestates.com"
      }
    },
    {
      id: 13,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      title: "Swiss Alps Mansion",
      price: 29000000,
      location: "Zermatt, Switzerland",
      bedrooms: 7,
      bathrooms: 8,
      square_feet: 8800,
      description: "Luxury mountain retreat with Matterhorn views",
      propertyType: "Mansion",
      features: [
        "Matterhorn Views", 
        "Indoor Pool", 
        "Sauna", 
        "Wine Cellar", 
        "Home Theater", 
        "Ski Room", 
        "Heated Driveway"
      ],
      agent: {
        name: "Hans Mueller",
        phone: "+41-27-555-0135",
        email: "h.mueller@luxuryestates.com"
      }
    },
    {
      id: 14,
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
      title: "London Townhouse",
      price: 27000000,
      location: "Mayfair, London",
      bedrooms: 5,
      bathrooms: 6,
      square_feet: 6200,
      description: "Historic townhouse in prestigious Mayfair",
      propertyType: "Townhouse",
      features: [
        "Period Features", 
        "Garden", 
        "Wine Cellar", 
        "Library", 
        "Home Office", 
        "Staff Quarters", 
        "Elevator"
      ],
      agent: {
        name: "Elizabeth Bennett",
        phone: "+44-20-555-0136",
        email: "e.bennett@luxuryestates.com"
      }
    },
    {
      id: 15,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      title: "Shanghai Penthouse",
      price: 31000000,
      location: "Shanghai, China",
      bedrooms: 5,
      bathrooms: 6,
      square_feet: 7000,
      description: "Ultra-modern penthouse in Pudong district",
      propertyType: "Penthouse",
      features: [
        "Skyline Views", 
        "Private Elevator", 
        "Smart Home System", 
        "Home Theater", 
        "Wine Cellar", 
        "Gym", 
        "Rooftop Garden"
      ],
      agent: {
        name: "Li Wei",
        phone: "+86-21-555-0137",
        email: "l.wei@luxuryestates.com"
      }
    }
  ];

  const handleSearch = () => {
    // Filter logic would go here
  };

  const handlePropertyClick = (property: LuxuryProperty) => {
    setSelectedProperty(property);
  };

  const closePropertyDetails = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Compact Search Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            placeholder="Location"
            className="px-3 py-2 border rounded"
          />
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            className="px-3 py-2 border rounded"
          >
            <option value="">Property Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="villa">Villa</option>
            <option value="mansion">Mansion</option>
            <option value="penthouse">Penthouse</option>
            <option value="chalet">Chalet</option>
            <option value="townhouse">Townhouse</option>
          </select>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            placeholder="Min Price"
            className="px-3 py-2 border rounded"
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            placeholder="Max Price"
            className="px-3 py-2 border rounded"
          />
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {luxuryProperties.map((property) => (
          <div 
            key={property.id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handlePropertyClick(property)}
          >
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{property.title}</h3>
                <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {property.propertyType}
                </span>
              </div>
              <p className="text-primary-600 text-xl font-bold mb-2">
                ${property.price.toLocaleString()}
              </p>
              <p className="text-gray-600 mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {property.location}
              </p>
              <div className="flex justify-between text-gray-600 mb-4">
                <span><Bed className="w-4 h-4 inline mr-1" />{property.bedrooms} beds</span>
                <span><Bath className="w-4 h-4 inline mr-1" />{property.bathrooms} baths</span>
                <span><Maximize2 className="w-4 h-4 inline mr-1" />{property.square_feet.toLocaleString()} sqft</span>
              </div>
              <p className="text-gray-600 mb-4">{property.description}</p>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Contact Agent:</h4>
                <p className="text-gray-600">{property.agent.name}</p>
                <div className="flex items-center gap-4 mt-2">
                  <a href={`tel:${property.agent.phone}`} className="flex items-center text-primary-600">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </a>
                  <a href={`mailto:${property.agent.email}`} className="flex items-center text-primary-600">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full h-80 object-cover"
              />
              <button 
                onClick={closePropertyDetails}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-4 bg-primary-600 text-white px-4 py-1 rounded-full">
                {selectedProperty.propertyType}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold text-gray-900">{selectedProperty.title}</h2>
                <p className="text-primary-600 text-2xl font-bold">
                  ${selectedProperty.price.toLocaleString()}
                </p>
              </div>
              <p className="text-gray-600 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {selectedProperty.location}
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <Bed className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-gray-900 font-semibold">{selectedProperty.bedrooms} Bedrooms</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <Bath className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-gray-900 font-semibold">{selectedProperty.bathrooms} Bathrooms</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <Maximize2 className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-gray-900 font-semibold">{selectedProperty.square_feet.toLocaleString()} sq ft</p>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedProperty.description}</p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedProperty.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3">Contact Agent</h3>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <p className="text-gray-900 font-medium text-lg">{selectedProperty.agent.name}</p>
                    <p className="text-gray-600">{selectedProperty.agent.email}</p>
                    <p className="text-gray-600">{selectedProperty.agent.phone}</p>
                  </div>
                  <div className="flex gap-4 mt-4 md:mt-0">
                    <a 
                      href={`tel:${selectedProperty.agent.phone}`} 
                      className="bg-primary-600 text-white px-4 py-2 rounded flex items-center"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Agent
                    </a>
                    <a 
                      href={`mailto:${selectedProperty.agent.email}`} 
                      className="bg-white border border-primary-600 text-primary-600 px-4 py-2 rounded flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Agent
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}