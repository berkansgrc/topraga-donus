import React from 'react';
import { Sprout, Map, BookOpen, FlaskConical, Menu, X, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { ViewState } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import MobileNav from './MobileNav';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Navigasyon elemanları
  const navItems = [
    { id: ViewState.HOME, label: 'Ana Sayfa', icon: Sprout },
    { id: ViewState.GUIDE, label: 'Atık Rehberi', icon: BookOpen },
    { id: ViewState.LAB, label: 'Kompost Lab', icon: FlaskConical },
    { id: ViewState.MAP, label: 'İstasyon Haritası', icon: Map },
    { id: ViewState.GALLERY, label: 'Galeri', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-background-base flex flex-col font-sans bg-texture selection:bg-primary-soft selection:text-primary-700">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background-base/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => setView(ViewState.HOME)}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="bg-primary text-white p-1.5 rounded-lg shadow-soft"
            >
              <Sprout size={20} />
            </motion.div>
            <span className="font-bold text-xl tracking-tight text-text-primary">Toprağa Dönüş</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className="relative px-4 py-2 rounded-button text-sm font-medium transition-colors flex items-center space-x-2 group"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary-soft rounded-button"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center space-x-2 ${isActive ? 'text-primary-700' : 'text-text-secondary group-hover:text-text-primary'}`}>
                    <item.icon size={16} className={isActive ? "stroke-[2.5px]" : "stroke-[2px]"} />
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView(ViewState.CONTRIBUTE)}
              className={`ml-4 px-4 py-2 text-sm font-medium rounded-button transition-colors shadow-soft flex items-center space-x-2
                ${currentView === ViewState.CONTRIBUTE
                  ? 'bg-text-primary text-white ring-2 ring-offset-2 ring-text-primary'
                  : 'bg-text-primary text-white hover:bg-black'}`}
            >
              <span>Katkı Yap</span>
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:bg-background-subtle rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-background-surface border-t border-border shadow-card absolute w-full left-0 top-16 z-50 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-button flex items-center space-x-3 transition-colors
                      ${currentView === item.id
                        ? 'bg-primary-soft text-primary-700 font-medium'
                        : 'text-text-secondary hover:bg-background-subtle'}`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="border-t border-border my-2 pt-2">
                  <button
                    onClick={() => {
                      setView(ViewState.CONTRIBUTE);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-button bg-text-primary text-white font-medium"
                  >
                    Katkı Yap
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content with Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentView}
          initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -15, filter: 'blur(5px)' }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-grow content-relative w-full"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-background-surface border-t border-border py-12 px-4 mt-auto pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-bold text-text-primary mb-2">Toprağa Dönüş</h4>
            <p className="text-sm text-text-muted max-w-xs">
              Ev atıklarını doğru yönetmeyi öğreten, kompost takibi ve geri dönüşüm rehberi.
            </p>
          </div>

          <div className="text-xs text-text-muted/60 flex items-center space-x-2 select-none">
            {/* GİZLİ TETİKLEYİCİ: Telif hakkı metnine ÇİFT TIKLANIRSA admin girişi açılır */}
            <span
              onDoubleClick={() => setView(ViewState.ADMIN_LOGIN)}
              className="cursor-default hover:text-text-secondary transition-colors"
              title=""
            >
              © 2026 Harezmi Eğitim Modeli
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentView={currentView} setView={setView} />
    </div>
  );
};

export default Layout;