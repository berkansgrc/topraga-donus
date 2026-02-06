import React from 'react';
import { Sprout, Map, BookOpen, FlaskConical, Menu, X, Image as ImageIcon, Newspaper, HelpCircle, School } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Navigasyon elemanları
  const navItems = [
    { path: '/', label: 'Ana Sayfa', icon: Sprout },
    { path: '/guide', label: 'Atık Rehberi', icon: BookOpen },
    { path: '/lab', label: 'Kompost Lab', icon: FlaskConical },
    { path: '/map', label: 'İstasyon Haritası', icon: Map },
    { path: '/gallery', label: 'Galeri', icon: ImageIcon },
    { path: '/blog', label: 'Haberler', icon: Newspaper },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background-base flex flex-col font-sans bg-texture selection:bg-primary-soft selection:text-primary-700">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background-base/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => handleNavigate('/')}
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
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
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
              onClick={() => handleNavigate('/contribute')}
              className={`ml-4 px-4 py-2 text-sm font-medium rounded-button transition-colors shadow-soft flex items-center space-x-2
                ${currentPath === '/contribute'
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
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full text-left px-4 py-3 rounded-button flex items-center space-x-3 transition-colors
                      ${currentPath === item.path
                        ? 'bg-primary-soft text-primary-700 font-medium'
                        : 'text-text-secondary hover:bg-background-subtle'}`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="border-t border-border my-2 pt-2">
                  <button
                    onClick={() => handleNavigate('/contribute')}
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
          key={currentPath}
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
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className="bg-primary text-white p-1.5 rounded-lg">
                  <Sprout size={18} />
                </div>
                <h4 className="font-bold text-text-primary">Toprağa Dönüş</h4>
              </div>
              <p className="text-sm text-text-muted">
                Ev atıklarını doğru yönetmeyi öğreten, kompost takibi ve geri dönüşüm rehberi.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-semibold text-text-primary mb-3 text-sm">Hızlı Erişim</h5>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleNavigate('/guide')} className="text-sm text-text-muted hover:text-primary transition-colors">
                    Atık Rehberi
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('/lab')} className="text-sm text-text-muted hover:text-primary transition-colors">
                    Kompost Lab
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('/map')} className="text-sm text-text-muted hover:text-primary transition-colors">
                    İstasyon Haritası
                  </button>
                </li>
              </ul>
            </div>

            {/* New Pages */}
            <div>
              <h5 className="font-semibold text-text-primary mb-3 text-sm">Keşfet</h5>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleNavigate('/blog')} className="text-sm text-text-muted hover:text-primary transition-colors flex items-center">
                    <Newspaper size={14} className="mr-2" /> Blog & Haberler
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('/faq')} className="text-sm text-text-muted hover:text-primary transition-colors flex items-center">
                    <HelpCircle size={14} className="mr-2" /> Sık Sorulan Sorular
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('/school-register')} className="text-sm text-text-muted hover:text-primary transition-colors flex items-center">
                    <School size={14} className="mr-2" /> Okul Kaydı
                  </button>
                </li>
              </ul>
            </div>

            {/* Contribute */}
            <div>
              <h5 className="font-semibold text-text-primary mb-3 text-sm">Katkıda Bulun</h5>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleNavigate('/contribute')} className="text-sm text-text-muted hover:text-primary transition-colors">
                    Katkı Yap
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('/gallery')} className="text-sm text-text-muted hover:text-primary transition-colors">
                    Proje Galerisi
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-text-muted/60 select-none">
              <span
                onDoubleClick={() => handleNavigate('/admin/login')}
                className="cursor-default hover:text-text-secondary transition-colors"
                title=""
              >
                © 2026 Harezmi Eğitim Modeli
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <button
                onClick={() => handleNavigate('/privacy-policy')}
                className="hover:text-primary transition-colors"
              >
                Gizlilik Politikası
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => handleNavigate('/about-us')}
                className="hover:text-primary transition-colors"
              >
                Hakkımızda
              </button>
              <span className="text-border">|</span>
              <span>Türkiye genelinde sürdürülebilir eğitim</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export default Layout;