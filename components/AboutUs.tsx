import React from 'react';
import { User, School, Sparkles, Code, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUs: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-base">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary via-primary-700 to-primary-900 text-white py-20 px-4 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-primary-soft/10 rounded-full blur-2xl"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6 ring-4 ring-white/20">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Hakkımızda
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Gelecek nesillere daha yaşanabilir bir dünya bırakmak için teknolojiyi ve eğitimi birleştiriyoruz.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-16 -mt-10 relative z-20">
                <div className="grid gap-8">
                    {/* Developer Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-background-surface border border-border rounded-3xl p-8 shadow-card overflow-hidden relative group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Code size={120} />
                        </div>

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 bg-primary-soft rounded-full flex items-center justify-center border-4 border-background-surface shadow-sm">
                                    <span className="text-4xl">BS</span>
                                </div>
                            </div>

                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-2xl font-bold text-text-primary mb-2">Berkan Sığırcı</h2>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-medium mb-4">
                                    <School size={18} />
                                    <span>Matematik Öğretmeni</span>
                                </div>
                                <p className="text-text-secondary leading-relaxed mb-6">
                                    Güngören Mehmet Akif Ersoy İmam Hatip Ortaokulu'nda Matematik Öğretmeni olarak görev yapmaktayım.
                                    Eğitimde teknolojinin ve disiplinler arası yaklaşımların gücüne inanarak, öğrencilerime sadece
                                    matematiği değil, aynı zamanda çevre bilincini ve problem çözme yeteneklerini de kazandırmayı hedefliyorum.
                                </p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <span className="bg-primary-soft text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium">
                                        Eğitimci
                                    </span>
                                    <span className="bg-primary-soft text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium">
                                        Geliştirici
                                    </span>
                                    <span className="bg-primary-soft text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium">
                                        Doğa Sever
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Project Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-[#1F4728] to-[#2D5A35] rounded-3xl p-8 text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Sparkles size={100} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                <Sparkles className="text-yellow-300" />
                                Harezmi Eğitim Modeli
                            </h3>
                            <p className="text-white/90 leading-relaxed mb-6 text-lg">
                                Bu proje, <strong>Harezmi Eğitim Modeli</strong> kapsamında, öğrencilerimizin çevre bilincini artırmak,
                                atık yönetimi konusunda farkındalık oluşturmak ve sürdürülebilir yaşam alışkanlıkları kazandırmak
                                amacıyla geliştirilmiştir.
                            </p>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <p className="italic text-center">
                                    "Toprağa Dönüş, sadece bir web sitesi değil, aynı zamanda geleceğe atılmış yeşil bir tohumdur."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <a
                        href="mailto:berkan_1225@hotmail.com"
                        className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm"
                    >
                        <Mail size={16} />
                        İletişim: berkan_1225@hotmail.com
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutUs;
