import React from 'react';
import { Sprout, BookOpen, FlaskConical, Map, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MobileNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { path: '/', label: 'Ana Sayfa', icon: Sprout },
        { path: '/guide', label: 'Rehber', icon: BookOpen },
        { path: '/lab', label: 'Lab', icon: FlaskConical },
        { path: '/map', label: 'Harita', icon: Map },
        { path: '/gallery', label: 'Galeri', icon: ImageIcon },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 pb-safe">
            <div className="flex justify-around items-center h-16 px-1">
                {navItems.map((item) => {
                    const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative
                ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <div className="relative">
                                <item.icon size={isActive ? 24 : 22} className={`transition-all ${isActive ? 'stroke-[2.5px]' : ''}`} />
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-indicator"
                                        className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </div>
                            <span className={`text-[10px] font-medium leading-none ${isActive ? 'font-bold' : ''}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNav;
