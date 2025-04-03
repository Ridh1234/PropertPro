import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Search, User, LogIn, LogOut } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import Loader from "./Loader"; // Import Loader component

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Logout function with loading effect
  const handleLogout = async () => {
    setIsLoading(true); // Show loader
    await supabase.auth.signOut();
    setUser(null);

    setTimeout(() => {
      setIsLoading(false); // Hide loader after 2s
      navigate("/");
    }, 2000);
  };

  return (
    <>
      {isLoading && <Loader />} {/* Show loader if loading */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">
                PropertyPro
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/search"
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Link>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 text-gray-600 hover:text-primary-600"
                  >
                    <User className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
