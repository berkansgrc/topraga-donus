import React, { useState } from 'react';
import Layout from './components/Layout';
import WasteGuide from './components/WasteGuide';
import CompostLab from './components/CompostLab';
import MapMock from './components/MapMock';
import ProjectGoal from './components/ProjectGoal';
import NatureBackground from './components/NatureBackground';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProjectGallery from './components/ProjectGallery';
import Contribute from './components/Contribute';
import { ViewState } from './types';
import {
  ArrowRight, Recycle, Leaf, Map as MapIcon,
  Brain, Workflow, Globe, Layers, Lightbulb, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- NEW DYNAMIC MISSION SECTION ---
const MissionSection = () => {
  return (
    <div className="w-full bg-[#1F4728] text-white py-24 relative overflow-hidden group-hover-container">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-accent-DEFAULT rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary-soft rounded-full mix-blend-overlay filter blur-[128px] opacity-10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium text-yellow-200 mb-2">
            <Lightbulb size={16} className="text-yellow-300" />
            <span>Harezmi Eğitim Modeli</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Geleceği <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 drop-shadow-sm">Tasarlayan</span> Nesiller
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Atığı yok etmeyi değil, doğayla uyumlu bir yaşam döngüsü tasarlamayı öğreniyoruz.
            Sorunlardan kaçan değil, onlara çözüm üreten bireyleriz.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Card 1: Interdisciplinary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Layers className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors">Bütüncül Yaklaşım</h3>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Fen, Matematik, Teknoloji ve Tasarım disiplinlerini harmanlıyoruz.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-xs text-white/80"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>Karbon-Azot Dengesi</li>
              <li className="flex items-center text-xs text-white/80"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>Atık Hacmi Analizi</li>
            </ul>
          </motion.div>

          {/* Card 2: Algorithmic Thinking */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Workflow className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-200 transition-colors">Algoritmik Düşünce</h3>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Atık yönetimi basit bir eylem değil, ölçülebilir bir süreçtir.
            </p>
            <div className="bg-black/20 p-3 rounded-lg font-mono text-xs text-purple-200 border border-purple-500/30">
              Girdi (Atık) <br />↓<br /> İşlem (Kompost) <br />↓<br /> Çıktı (Toprak)
            </div>
          </motion.div>

          {/* Card 3: Production */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-700 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Zap className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-amber-200 transition-colors">Üreten Nesil</h3>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              "Kullan-at" kültürünü reddediyoruz. Pasif tüketici değil, aktif üreticiyiz.
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300 bg-amber-900/30 px-3 py-2 rounded-lg w-fit">
              <span className="line-through opacity-50">Çöp</span>
              <ArrowRight size={12} />
              <span>Ham Madde</span>
            </div>
          </motion.div>

          {/* Card 4: Awareness */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Globe className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-green-200 transition-colors">Çevresel Farkındalık</h3>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Yerel eylemlerin (evdeki atık) küresel sonuçları üzerindeki etkisini biliyoruz.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-200 text-xs border border-green-500/30">Sıfır Atık</span>
              <span className="px-2 py-1 rounded-md bg-green-500/20 text-green-200 text-xs border border-green-500/30">Karbon Ayak İzi</span>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

// Hero Home Component
const HomeHero = ({ setView }: { setView: (v: ViewState) => void }) => (
  <div className="flex flex-col w-full">

    {/* Hero Section */}
    <div className="w-full relative overflow-hidden pt-20 pb-24 px-4 md:px-6">

      {/* Animated Background Layer */}
      <NatureBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <div className="inline-flex items-center space-x-2 bg-primary-soft/80 backdrop-blur-sm text-primary-700 px-3 py-1 rounded-pill text-sm font-semibold mb-6 border border-white/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span>Doğa seninle başlar</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-text-primary mb-6 tracking-tight leading-[1.1]">
          Toprak bir <br className="hidden md:block" />
          <span className="text-primary relative inline-block">
            çöp kutusu değil.
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          Organik atık komposta gider; diğerleri doğru istasyona.
          Haritadan bul, rehberden öğren, döngüye katıl.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView(ViewState.MAP)}
            className="bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-button font-semibold shadow-card hover:shadow-hover transition-all flex items-center"
          >
            Yakınımdaki İstasyonlar <MapIcon size={18} className="ml-2" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView(ViewState.GUIDE)}
            className="bg-background-surface hover:bg-background-subtle text-text-primary border border-border px-8 py-4 rounded-button font-semibold shadow-soft hover:shadow-card transition-all flex items-center"
          >
            Atık Rehberini Aç <ArrowRight size={18} className="ml-2" />
          </motion.button>
        </div>
      </motion.div>
    </div>

    {/* 3 Steps Section */}
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 -mt-8 relative z-20">
      <div className="grid md:grid-cols-3 gap-6">

        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          onClick={() => setView(ViewState.GUIDE)}
          className="bg-background-surface p-8 rounded-card border border-border shadow-card hover:shadow-hover transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-secondary-soft text-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
            <Recycle size={24} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-3">1. Ayırıştır</h3>
          <p className="text-text-muted leading-relaxed">
            Neyin toprağa karışabileceğini, neyin geri dönüşüme gitmesi gerektiğini öğren.
          </p>
          <div className="mt-4 flex items-center text-secondary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
            Rehbere Git <ArrowRight size={14} className="ml-1" />
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onClick={() => setView(ViewState.LAB)}
          className="bg-background-surface p-8 rounded-card border border-border shadow-card hover:shadow-hover transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-primary-soft text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
            <Leaf size={24} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-3">2. Kompostla</h3>
          <p className="text-text-muted leading-relaxed">
            Mutfak atıklarını "siyah altına" dönüştür. Laboratuvarda süreci takip et.
          </p>
          <div className="mt-4 flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
            Laboratuvarı Aç <ArrowRight size={14} className="ml-1" />
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          onClick={() => setView(ViewState.MAP)}
          className="bg-background-surface p-8 rounded-card border border-border shadow-card hover:shadow-hover transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 bg-accent-soft text-accent-DEFAULT rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
            <MapIcon size={24} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-3">3. İstasyona Taşı</h3>
          <p className="text-text-muted leading-relaxed">
            Pil, yağ ve elektronik atıkları doğaya atmadan en yakın toplama noktasına götür.
          </p>
          <div className="mt-4 flex items-center text-accent-DEFAULT font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
            Haritayı Aç <ArrowRight size={14} className="ml-1" />
          </div>
        </motion.div>

      </div>
    </div>

    {/* Integrated Project Goal / Mission Section */}
    <MissionSection />

  </div>
);

function App() {
  const [currentView, setView] = useState<ViewState>(ViewState.HOME);

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <HomeHero setView={setView} />;
      case ViewState.GUIDE:
        return <WasteGuide />;
      case ViewState.LAB:
        return <CompostLab />;
      case ViewState.MAP:
        return <MapMock />;
      case ViewState.GALLERY:
        return <ProjectGallery />;
      case ViewState.CONTRIBUTE:
        return <Contribute />;
      case ViewState.PROJECT_GOAL:
        return <ProjectGoal />;
      case ViewState.ADMIN_LOGIN:
        return <AdminLogin setView={setView} />;
      case ViewState.ADMIN_DASHBOARD:
        return <AdminDashboard setView={setView} />;
      default:
        return <HomeHero setView={setView} />;
    }
  };

  // Don't wrap AdminDashboard in standard layout if we want a different look,
  // but for simplicity and consistency, using Layout is fine.
  if (currentView === ViewState.ADMIN_LOGIN) {
    return <AdminLogin setView={setView} />;
  }

  if (currentView === ViewState.ADMIN_DASHBOARD) {
    return <AdminDashboard setView={setView} />;
  }

  return (
    <Layout currentView={currentView} setView={setView}>
      {renderView()}
    </Layout>
  );
}

export default App;