import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search, Leaf, Recycle, MapPin, School, MessageCircle } from 'lucide-react';

// FAQ Verileri
const FAQ_DATA = [
    {
        category: 'kompost',
        categoryLabel: '🌱 Kompost Hakkında',
        icon: Leaf,
        color: 'bg-primary',
        questions: [
            {
                question: 'Kompost yapmak ne kadar sürer?',
                answer: 'Doğru koşullarda (nem, sıcaklık, karbon-azot dengesi) 2-3 ay içinde kullanılabilir kompost elde edebilirsiniz. Sıcak kompost yöntemiyle bu süre 4-6 haftaya kadar kısalabilir. Soğuk kompost ise 6-12 ay arasında sürebilir.'
            },
            {
                question: 'Kötü koku yapmasını nasıl engellerim?',
                answer: 'Kötü koku genellikle fazla nem veya yetersiz havalandırmadan kaynaklanır. Çözüm için: 1) Daha fazla kahverengi malzeme (kuru yaprak, karton) ekleyin, 2) Karışımı düzenli olarak (haftada 1-2 kez) karıştırın, 3) Nem seviyesini kontrol edin - sıkılmış bir sünger kadar nemli olmalı.'
            },
            {
                question: 'Kış aylarında kompost yapmak mümkün mü?',
                answer: 'Evet! Kış aylarında ayrışma yavaşlar ama durmaz. Yalıtımlı bir kompost kabı kullanabilir veya kompostun üzerine saman/yaprak örtüsü serip sıcaklığı koruyabilirsiniz. Mikrobiyal aktivite düşer ama ilkbaharda hızla toparlanır.'
            },
            {
                question: 'Kompost ne zaman hazır olur?',
                answer: 'Hazır kompost koyu kahverengi/siyah renkte, toprak gibi kokar ve orijinal malzemeleri artık tanıyamazsınız. Parmaklarınızla ovaladığınızda ufalanmalı ve yapışkan olmamalıdır.'
            },
            {
                question: 'Karbon-Azot dengesi ne demek?',
                answer: 'Optimal kompost için C:N oranı yaklaşık 25-30:1 olmalıdır. Yeşil malzemeler (sebze artıkları, çim) azot sağlar, kahverengiler (yaprak, karton, saman) karbon sağlar. Genel kural: 2-3 kısım kahverengi + 1 kısım yeşil.'
            }
        ]
    },
    {
        category: 'geridonusum',
        categoryLabel: '♻️ Geri Dönüşüm',
        icon: Recycle,
        color: 'bg-blue-600',
        questions: [
            {
                question: 'Hangi plastikler geri dönüştürülebilir?',
                answer: 'Genellikle 1 (PET) ve 2 (HDPE) numaralı plastikler geri dönüştürülür. Şişe dipleri veya ambalajlardaki üçgen içindeki numaraya bakın. 3-7 arası plastikler belediyenize göre değişir. Styrofoam (6) çoğu yerde kabul edilmez.'
            },
            {
                question: 'Ambalajları yıkamak gerekli mi?',
                answer: 'Evet! Yiyecek kalıntılı ambalajlar geri dönüşüm sürecini bozar ve tüm partiyi kirletebilir. Hafifçe durulama yeterlidir, steril olması gerekmez. Su tasarrufu için bulaşık suyunuzun son kalıntısını bunun için kullanabilirsiniz.'
            },
            {
                question: 'Kağıt ve karton nerelere atılır?',
                answer: 'Temiz kağıt ve karton mavi geri dönüşüm kutularına atılır. Ancak yağlı pizza kutuları, ıslak kağıt veya mum kaplı kartonlar geri dönüştürülemez. Bu tür malzemeler kompost veya çöpe gitmelidir.'
            },
            {
                question: 'Cam şişelerin kapakları ne olacak?',
                answer: 'Metal kapaklar ayrı olarak metal geri dönüşümüne gitmelidir. Plastik kapaklar plastik geri dönüşümüne atılabilir. Cam şişeyi atarken kapağını çıkarmanız önerilir.'
            }
        ]
    },
    {
        category: 'harita',
        categoryLabel: '📍 Harita Kullanımı',
        icon: MapPin,
        color: 'bg-amber-600',
        questions: [
            {
                question: 'Haritadaki istasyonlar nasıl güncelleniyor?',
                answer: 'İstasyonlar topluluk tarafından eklenir ve yöneticiler tarafından doğrulanır. Onaylı istasyonlar yeşil işaretle gösterilir. Siz de "Katkı Yap" sayfasından yeni istasyon önerebilirsiniz.'
            },
            {
                question: 'Yakınımdaki istasyonu nasıl bulurum?',
                answer: 'Harita sayfasını açtığınızda konum iznini verin, otomatik olarak size en yakın istasyonlar gösterilir. Filtre seçenekleriyle pil, cam, kağıt vb. türlere göre arama yapabilirsiniz.'
            },
            {
                question: 'Bir istasyon kapalıysa ne yapmalıyım?',
                answer: 'İstasyon detayına gidip "Sorun Bildir" butonuna tıklayın. Yöneticilerimiz durumu kontrol edip haritayı güncelleyecektir. Topluluk geri bildirimi çok değerli!'
            }
        ]
    },
    {
        category: 'proje',
        categoryLabel: '🏫 Proje Hakkında',
        icon: School,
        color: 'bg-purple-600',
        questions: [
            {
                question: 'Harezmi Eğitim Modeli nedir?',
                answer: 'Harezmi Eğitim Modeli, öğrencileri gerçek dünya problemlerine çözüm üretmeye teşvik eden, disiplinler arası (STEM) bir yaklaşımdır. Bu proje kapsamında çevre sorunları ele alınmakta ve öğrenciler aktif çözüm üreticisi olmaktadır.'
            },
            {
                question: 'Okulumuz nasıl katılabilir?',
                answer: '"Okul Kaydı" sayfasından başvuru formunu doldurun. Ekibimiz sizinle iletişime geçecek ve ücretsiz eğitim materyalleri, kılavuzlar ve takip araçları sağlayacaktır. Türkiye genelinde tüm okullar katılabilir!'
            },
            {
                question: 'Projenin maliyeti var mı?',
                answer: 'Hayır! Toprağa Dönüş projesi tamamen ücretsizdir. Eğitim materyalleri, dijital araçlar ve danışmanlık hizmetleri herhangi bir ücret talep edilmeden sunulmaktadır.'
            },
            {
                question: 'Verileri nasıl kullanıyorsunuz?',
                answer: 'Toplanan veriler yalnızca projenin geliştirilmesi ve istatistiksel raporlama için kullanılır. Kişisel bilgiler üçüncü taraflarla paylaşılmaz. Gizlilik politikamıza footer\'dan ulaşabilirsiniz.'
            }
        ]
    }
];

const FAQ: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openCategory, setOpenCategory] = useState<string | null>('kompost');
    const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

    const toggleQuestion = (questionId: string) => {
        setOpenQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };

    const filteredData = FAQ_DATA.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0);

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-pill text-sm font-semibold mb-4">
                    <HelpCircle size={16} />
                    <span>Yardım Merkezi</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
                    Sık Sorulan <span className="text-primary">Sorular</span>
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                    Merak ettiklerinizi yanıtlıyoruz. Aradığınızı bulamazsanız bize ulaşın!
                </p>
            </motion.div>

            {/* Search */}
            <div className="relative mb-8">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    type="text"
                    placeholder="Sorularda ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-card border border-border bg-white focus:ring-2 focus:ring-primary-soft focus:border-primary outline-none transition-all shadow-soft"
                />
            </div>

            {/* FAQ Categories */}
            <div className="space-y-4">
                {filteredData.map((category, catIndex) => (
                    <motion.div
                        key={category.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: catIndex * 0.1 }}
                        className="bg-white rounded-card border border-border shadow-card overflow-hidden"
                    >
                        {/* Category Header */}
                        <button
                            onClick={() => setOpenCategory(openCategory === category.category ? null : category.category)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-background-subtle transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 ${category.color} rounded-xl flex items-center justify-center text-white`}>
                                    <category.icon size={20} />
                                </div>
                                <span className="text-lg font-bold text-text-primary">{category.categoryLabel}</span>
                                <span className="px-2 py-0.5 bg-background-subtle rounded-pill text-xs text-text-muted">
                                    {category.questions.length} soru
                                </span>
                            </div>
                            <ChevronDown
                                size={20}
                                className={`text-text-muted transition-transform duration-300 ${openCategory === category.category ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {/* Questions */}
                        <AnimatePresence>
                            {openCategory === category.category && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-border"
                                >
                                    <div className="divide-y divide-border">
                                        {category.questions.map((q, qIndex) => {
                                            const questionId = `${category.category}-${qIndex}`;
                                            const isOpen = openQuestions.has(questionId);

                                            return (
                                                <div key={qIndex} className="px-6">
                                                    <button
                                                        onClick={() => toggleQuestion(questionId)}
                                                        className="w-full py-4 flex items-center justify-between text-left group"
                                                    >
                                                        <span className={`font-medium pr-4 ${isOpen ? 'text-primary' : 'text-text-primary group-hover:text-primary'} transition-colors`}>
                                                            {q.question}
                                                        </span>
                                                        <ChevronDown
                                                            size={16}
                                                            className={`shrink-0 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''
                                                                }`}
                                                        />
                                                    </button>

                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <p className="pb-4 text-text-secondary leading-relaxed pl-0 border-l-2 border-primary/20 ml-0 pl-4">
                                                                    {q.answer}
                                                                </p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredData.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-background-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                        <HelpCircle size={32} className="text-text-muted" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Sonuç Bulunamadı</h3>
                    <p className="text-text-muted">Arama kriterlerinize uygun soru bulunamadı.</p>
                </div>
            )}

            {/* Contact CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 bg-gradient-to-br from-primary to-green-600 rounded-card p-8 text-center text-white"
            >
                <MessageCircle size={40} className="mx-auto mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">Hâlâ sorunuz mu var?</h3>
                <p className="text-white/80 mb-6">
                    Aradığınız cevabı bulamadıysanız bize e-posta gönderin, en kısa sürede yanıtlayalım.
                </p>
                <a
                    href="mailto:berkan_12225@hotmail.com"
                    className="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-button hover:bg-background-subtle transition-colors shadow-soft"
                >
                    <MessageCircle size={18} className="mr-2" />
                    Bize Ulaşın
                </a>
            </motion.div>

        </div>
    );
};

export default FAQ;
