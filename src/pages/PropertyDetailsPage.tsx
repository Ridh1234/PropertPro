import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Tag,
  Check,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Property, User } from '../types/database';
import PropertyMap from '../components/PropertyMap';

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [message, setMessage] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
    checkCurrentUser();
  }, [id]);

  const openInGoogleMaps = () => {
    if (property?.latitude && property?.longitude) {
      const url = `https://www.google.com/maps?q=${property.latitude},${property.longitude}`;
      window.open(url, '_blank');
    }
  };

  const fetchPropertyDetails = async () => {
    try {
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (propertyError) throw propertyError;
      setProperty(propertyData);

      if (propertyData.agent_id) {
        const { data: agentData, error: agentError } = await supabase
          .from('users')
          .select('*')
          .eq('id', propertyData.agent_id)
          .single();

        if (agentError) throw agentError;
        setAgent(agentData);
      }

      // Check if property is in user's favorites
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: favoriteData } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', authUser.id)
          .eq('property_id', id)
          .single();

        setIsFavorite(!!favoriteData);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      toast.error('Error loading property details');
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setCurrentUser(userData);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !agent) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: currentUser.id,
            receiver_id: agent.id,
            property_id: id,
            content: message,
          },
        ]);

      if (error) throw error;
      toast.success('Message sent successfully');
      setMessage('');
      setShowContactForm(false);
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  const handleScheduleAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !agent) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            property_id: id,
            user_id: currentUser.id,
            agent_id: agent.id,
            appointment_date: appointmentDate,
          },
        ]);

      if (error) throw error;
      toast.success('Appointment scheduled successfully');
      setAppointmentDate('');
      setShowAppointmentForm(false);
    } catch (error) {
      toast.error('Error scheduling appointment');
    }
  };

  const toggleFavorite = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('property_id', id);

        if (error) throw error;
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([
            {
              user_id: currentUser.id,
              property_id: id,
            },
          ]);

        if (error) throw error;
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Error updating favorites');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Property not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Property Images */}
      <div className="relative mb-8">
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
          <img
            src={property.images[activeImage] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}
            alt={property.title}
            className="w-full h-[600px] object-cover"
          />
        </div>
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-3 h-3 rounded-full ${
                  activeImage === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <p className="text-xl text-primary-600 font-bold">
                  ${property.price.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full ${
                    isFavorite
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => {
                    navigator.share({
                      title: property.title,
                      text: `Check out this property: ${property.title}`,
                      url: window.location.href,
                    });
                  }}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Bed className="w-5 h-5" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Bath className="w-5 h-5" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Square className="w-5 h-5" />
                <span>{property.square_feet} sqft</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="w-5 h-5" />
                <span className="capitalize">{property.property_type}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600">{property.description}</p>
            </div>

            {property.features && property.features.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                <ul className="grid grid-cols-2 gap-4">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-5 h-5 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Map Section */}
            {property.latitude && property.longitude && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                <div className="h-[400px] w-full rounded-lg overflow-hidden">
                  <PropertyMap
                    latitude={property.latitude}
                    longitude={property.longitude}
                    title={property.title}
                    address={`${property.address}, ${property.city}, ${property.state} ${property.zip_code}`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Agent Contact and Appointment Scheduling */}
        <div className="space-y-6">
          {agent && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary-100 mx-auto mb-4 flex items-center justify-center">
                  {agent.avatar_url ? (
                    <img
                      src={agent.avatar_url}
                      alt={agent.full_name || ''}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-primary-600">
                      {(agent.full_name || 'A')[0]}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{agent.full_name}</h3>
                <p className="text-gray-600">Real Estate Agent</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Contact Agent
                </button>
                <button
                  onClick={() => setShowAppointmentForm(true)}
                  className="w-full bg-white text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Viewing
                </button>
              </div>
            </div>
          )}

          {/* Contact Form Modal */}
          {showContactForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h3>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={4}
                    required
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Appointment Form Modal */}
          {showAppointmentForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule Viewing</h3>
                <form onSubmit={handleScheduleAppointment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date and Time
                    </label>
                    <input
                      type="datetime-local"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowAppointmentForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Schedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}