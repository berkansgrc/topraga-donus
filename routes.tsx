import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import WasteGuide from './components/WasteGuide';
import CompostLab from './components/CompostLab';
import InteractiveMap from './components/InteractiveMap';
import ProjectGoal from './components/ProjectGoal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProjectGallery from './components/ProjectGallery';
import Contribute from './components/Contribute';
import Blog from './components/Blog';
import FAQ from './components/FAQ';
import SchoolRegister from './components/SchoolRegister';
import PrivacyPolicy from './components/PrivacyPolicy';
import NotFound from './components/NotFound';
import Games from './components/Games';
import AboutUs from './components/AboutUs';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guide" element={<WasteGuide />} />
            <Route path="/lab" element={<CompostLab />} />
            <Route path="/map" element={<InteractiveMap />} />
            <Route path="/gallery" element={<ProjectGallery />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/project-goal" element={<ProjectGoal />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/games" element={<Games />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/school-register" element={<SchoolRegister />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
