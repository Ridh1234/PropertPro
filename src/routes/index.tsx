import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PropertyDetailsPage from '../pages/PropertyDetailsPage';
import PropertyFormPage from '../pages/PropertyFormPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      <Route path="/properties/new" element={<PropertyFormPage />} />
      <Route path="/properties/:id/edit" element={<PropertyFormPage />} />
    </Routes>
  );
};

export default AppRoutes;