import React from 'react';
import { Sprout, Brain, Workflow, Globe, Layers, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const ProjectGoal: React.FC = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 md:px-6 py-12"
    >
      
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-primary-soft rounded-full text-primary mb-6 shadow-soft">
          <Sprout size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight mb-6">
          Toprağa Dönüş ve <br />
          <span className="text-primary">Sürdürülebilir Yaşam</span>
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Harezmi Eğitim Modeli çatısı altında; atığı yok etmeyi değil, doğayla uyumlu bir yaşam döngüsü tasarlamayı öğreniyoruz.
        </p>
      </motion.div>

      {/* Main Intro Card */}
      <motion.div 
        variants={itemVariants}
        className="bg-background-surface rounded-card shadow-card border border-border p-8 mb-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-soft rounded-full -mr-10 -mt-10 opacity-50 blur-2xl"></div>
        <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center relative z-10">
          <Lightbulb className="mr-3 text-secondary" size={24} />
          Projenin Temel Amacı
        </h2>
        <p className="text-text-muted leading-relaxed relative z-10">
          Bu proje, öğrencilerimizin günlük hayatın en somut sorunlarından biri olan <span className="font-semibold text-text-primary">"Evsel atıkların yönetimi ve toprağa geri kazandırılması"</span> problemini ele alarak çözüm üretmelerini hedefler. Öğrenciler, disiplinler arası bir yaklaşımla çalışarak, sadece teorik bilgi edinmekle kalmaz, aynı zamanda gerçek dünya sorunlarına sürdürülebilir çözümler üretirler.
        </p>
      </motion.div>

      {/* 4 Pillars Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid md:grid-cols-2 gap-6 mb-16"
      >
        
        {/* Pillar 1 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-background-surface p-6 rounded-card border border-border transition-all group"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Layers size={24} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-3">1. Disiplinler Arası Bütüncül Yaklaşım</h3>
          <p className="text-text-muted text-sm leading-relaxed mb-4">
            Bilgiyi harmanlayarak kullanmayı hedefleriz:
          </p>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 shrink-0"></span><span><strong>Fen:</strong> Karbon-azot dengesi ve mikroorganizmalar.</span></li>
            <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 shrink-0"></span><span><strong>Matematik:</strong> Atık hacmi ve dönüşüm oranı analizi.</span></li>
            <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 shrink-0"></span><span><strong>Teknoloji:</strong> Isı ve nem takip sistemleri.</span></li>
            <li className="flex items-start"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 shrink-0"></span><span><strong>Tasarım:</strong> Ergonomik kompost üniteleri.</span></li>
          </ul>
        </motion.div>

        {/* Pillar 2 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-background-surface p-6 rounded-card border border-border transition-all group"
        >
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Workflow size={24} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-3">2. Algoritmik ve Sistematik Düşünme</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Atık yönetimi basit bir eylemden çıkarılıp ölçülebilir bir süreç olarak ele alınır:
            <br/><br/>
            <code className="bg-background-base px-2 py-1 rounded text-purple-700 font-medium">Girdi (Atık) → İşlem (Kompost) → Çıktı (Toprak)</code>
            <br/><br/>
            Öğrenciler, süreçteki hataları (koku, bozulma) bir "bug" gibi tespit edip parametreleri düzelterek (debugging) analitik düşünme becerilerini geliştirirler.
          </p>
        </motion.div>

        {/* Pillar 3 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-background-surface p-6 rounded-card border border-border transition-all group"
        >
          <div className="w-12 h-12 bg-secondary-soft text-secondary rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
            <Sprout size={24} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-3">3. Tüketimden Üretime Geçiş</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            "Kullan-at" kültürüne karşı "çöp" kavramını sorguluyoruz. Atıklar yok edilmesi gereken bir yük değil, toprağı besleyen değerli bir ham maddedir.
            <br/><br/>
            Öğrenci, pasif bir tüketiciden, döngüye katkı sağlayan <strong>aktif bir üreticiye</strong> dönüşür.
          </p>
        </motion.div>

        {/* Pillar 4 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-background-surface p-6 rounded-card border border-border transition-all group"
        >
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <Globe size={24} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-3">4. Çevresel Farkındalık</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Sıfır atık prensibiyle karbon ayak izini azaltmak ve doğanın yenilenme döngüsüne katkıda bulunmak nihai hedeftir.
            <br/><br/>
            Yerel eylemlerin (evdeki atık) küresel sonuçları (iklim değişikliği) üzerindeki etkisini kavrayan sorumlu bireyler yetiştiriyoruz.
          </p>
        </motion.div>

      </motion.div>

      {/* Summary Footer */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-primary-700 to-primary-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-card relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <Brain size={48} className="mx-auto mb-6 text-primary-soft opacity-80" />
          <h3 className="text-2xl font-bold mb-4">Geleceği Tasarlayan Nesiller</h3>
          <p className="text-primary-soft text-lg leading-relaxed opacity-90">
            Doğadaki dengeyi bilimsel yöntemlerle taklit eden, teknolojiyi doğanın onarımı için kullanan, sorunlardan kaçmak yerine onlara yaratıcı çözümler üreten nesillerin temellerini atıyoruz.
          </p>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default ProjectGoal;