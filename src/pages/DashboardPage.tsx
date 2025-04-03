import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Home, Calendar, MessageSquare, Heart, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { User, Property } from '../types/database';

// Extend the types to match the actual data structure from Supabase
interface AppointmentWithRelations {
  id: string;
  appointment_date: string;
  status: string;
  property: Property;
  user: User;
  agent: User;
}

interface MessageWithRelations {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender: User;
  receiver: User;
  property?: Property;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [messages, setMessages] = useState<MessageWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate('/login');
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError) throw userError;
      setUser(userData);

      // Fetch data based on user role
      if (userData.role === 'agent') {
        await Promise.all([
          fetchAgentProperties(authUser.id),
          fetchAgentAppointments(authUser.id),
          fetchAgentMessages(authUser.id)
        ]);
      } else {
        await Promise.all([
          fetchUserFavorites(authUser.id),
          fetchUserAppointments(authUser.id),
          fetchUserMessages(authUser.id)
        ]);
      }
    } catch (error) {
      toast.error('Error loading dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentProperties = async (userId: string) => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('agent_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setProperties(data || []);
  };

  const fetchAgentAppointments = async (userId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        property:properties(*),
        user:users!appointments_user_id_fkey(*)
      `)
      .eq('agent_id', userId)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    setAppointments(data || []);
  };

  const fetchAgentMessages = async (userId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(*),
        receiver:users!messages_receiver_id_fkey(*),
        property:properties(*)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setMessages(data || []);
  };

  const fetchUserFavorites = async (userId: string) => {
    const { error } = await supabase
      .from('favorites')
      .select(`
        property:properties(*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
  };

  const fetchUserAppointments = async (userId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        property:properties(*),
        agent:users!appointments_agent_id_fkey(*)
      `)
      .eq('user_id', userId)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    setAppointments(data || []);
  };

  const fetchUserMessages = async (userId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(*),
        receiver:users!messages_receiver_id_fkey(*),
        property:properties(*)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setMessages(data || []);
  };

  const handleUpdateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;
      toast.success(`Appointment ${status}`);
      fetchUserData();
    } catch (error) {
      toast.error('Error updating appointment');
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
      toast.success('Property deleted');
      fetchUserData();
    } catch (error) {
      toast.error('Error deleting property');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'properties':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user?.role === 'agent' && (
              <div className="col-span-full mb-6">
                <button
                  onClick={() => navigate('/properties/new')}
                  className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
                >
                  <Plus className="w-5 h-5" />
                  Add New Property
                </button>
              </div>
            )}
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                  <p className="text-primary-600 font-bold">${property.price.toLocaleString()}</p>
                  <p className="text-gray-600">{property.address}</p>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/properties/${property.id}/edit`)}
                      className="p-2 text-gray-600 hover:text-primary-600"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'appointments':
        // If no appointments from database, show sample data for UI purposes
        const displayAppointments = appointments.length > 0 ? appointments : [
          {
            id: 'sample-1',
            appointment_date: new Date().toISOString(),
            status: 'pending',
            property: {
              id: 'prop-1',
              title: 'Luxury Condo Downtown',
              images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
              price: 750000,
              address: '123 Main St, Downtown',
            } as Property,
            user: {
              id: 'user-1',
              full_name: 'John Smith',
            } as User,
            agent: {
              id: 'agent-1',
              full_name: 'Sarah Johnson',
            } as User,
          },
          {
            id: 'sample-2',
            appointment_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            status: 'approved',
            property: {
              id: 'prop-2',
              title: 'Suburban Family Home',
              images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994'],
              price: 450000,
              address: '456 Oak Lane, Suburbia',
            } as Property,
            user: {
              id: 'user-2',
              full_name: 'Emily Davis',
            } as User,
            agent: {
              id: 'agent-1',
              full_name: 'Sarah Johnson',
            } as User,
          },
          {
            id: 'sample-3',
            appointment_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            status: 'rejected',
            property: {
              id: 'prop-3',
              title: 'Beachfront Villa',
              images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
              price: 1200000,
              address: '789 Ocean Drive, Beachside',
            } as Property,
            user: {
              id: 'user-3',
              full_name: 'Michael Wilson',
            } as User,
            agent: {
              id: 'agent-1',
              full_name: 'Sarah Johnson',
            } as User,
          }
        ];
        
        return (
          <div className="space-y-6">
            {displayAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {appointment.property.title}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(appointment.appointment_date).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      {user?.role === 'agent'
                        ? `Client: ${appointment.user.full_name}`
                        : `Agent: ${appointment.agent.full_name}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {user?.role === 'agent' && appointment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateAppointmentStatus(appointment.id, 'approved')}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateAppointmentStatus(appointment.id, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'messages':
        // If no messages from database, show sample data for UI purposes
        const displayMessages = messages.length > 0 ? messages : [
          {
            id: 'msg-1',
            content: "Hi, I'm interested in scheduling a viewing for the Luxury Condo Downtown. Is it available this weekend?",
            created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            read: false,
            sender: {
              id: 'user-1',
              full_name: 'John Smith',
            } as User,
            receiver: {
              id: user?.id || 'agent-1',
              full_name: user?.full_name || 'Sarah Johnson',
            } as User,
            property: {
              id: 'prop-1',
              title: 'Luxury Condo Downtown',
            } as Property,
          },
          {
            id: 'msg-2',
            content: "Thank you for the tour yesterday. I'd like to make an offer on the property. Can we discuss the details?",
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            read: true,
            sender: {
              id: 'user-2',
              full_name: 'Emily Davis',
            } as User,
            receiver: {
              id: user?.id || 'agent-1',
              full_name: user?.full_name || 'Sarah Johnson',
            } as User,
            property: {
              id: 'prop-2',
              title: 'Suburban Family Home',
            } as Property,
          },
          {
            id: 'msg-3',
            content: "I noticed you have a few questions about the financing options. I'd be happy to connect you with our mortgage specialist.",
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            read: true,
            sender: {
              id: user?.id || 'agent-1',
              full_name: user?.full_name || 'Sarah Johnson',
            } as User,
            receiver: {
              id: 'user-3',
              full_name: 'Michael Wilson',
            } as User,
            property: {
              id: 'prop-3',
              title: 'Beachfront Villa',
            } as Property,
          }
        ];
        
        return (
          <div className="space-y-6">
            {displayMessages.map((message) => (
              <div key={message.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        {message.sender.id === user?.id ? 'To: ' : 'From: '}
                        {message.sender.id === user?.id
                          ? message.receiver.full_name
                          : message.sender.full_name}
                      </span>
                      {!message.read && message.receiver.id === user?.id && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    {message.property && (
                      <p className="text-sm text-gray-600 mb-2">
                        Re: {message.property.title}
                      </p>
                    )}
                    <p className="text-gray-800">{message.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'favorites':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                  <p className="text-primary-600 font-bold">${property.price.toLocaleString()}</p>
                  <p className="text-gray-600">{property.address}</p>
                  <button
                    onClick={() => navigate(`/properties/${property.id}`)}
                    className="mt-4 w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary-100 mx-auto mb-4 flex items-center justify-center">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name || ''}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-primary-600">
                  {(user?.full_name || 'U')[0]}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.full_name}</h2>
            <p className="text-gray-600 capitalize">{user?.role}</p>
          </div>

          <nav className="space-y-2">
            {user?.role === 'agent' ? (
              <>
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors
                    ${activeTab === 'properties'
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Home className="w-5 h-5" />
                  Properties
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors
                    ${activeTab === 'appointments'
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Calendar className="w-5 h-5" />
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors
                    ${activeTab === 'messages'
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <MessageSquare className="w-5 h-5" />
                  Messages
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors
                    ${activeTab === 'favorites'
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Heart className="w-5 h-5" />
                  Favorites
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors
                    ${activeTab === 'appointments'
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Calendar className="w-5 h-5" />
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors
                    ${activeTab === 'messages'
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <MessageSquare className="w-5 h-5" />
                  Messages
                </button>
              </>
            )}
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}