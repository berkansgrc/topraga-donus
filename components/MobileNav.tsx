import React from 'react';
import { Sprout, BookOpen, FlaskConical, Map, Image as ImageIcon } from 'lucide-react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';

interface MobileNavProps {
    currentView: ViewState;
    setView: (view: ViewState) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, setView }) => {
    const navItems = [
        { id: ViewState.HOME, label: 'Ana Sayfa', icon: Sprout },
        { id: ViewState.GUIDE, label: 'Rehber', icon: BookOpen },
        { id: ViewState.LAB, label: 'Lab', icon: FlaskConical },
        { id: ViewState.MAP, label: 'Harita', icon: Map },
        { id: ViewState.GALLERY, label: 'Galeri', icon: ImageIcon },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 pb-safe">
            <div className="flex justify-around items-center h-16 px-1">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id)}
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
