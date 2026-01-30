import React from 'react';
import { Shield, Mail, Cookie, Eye, Lock, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
    const [showEmail, setShowEmail] = React.useState(false);

    const sections = [
        {
            icon: Eye,
            title: "Toplanan Bilgiler",
            content: `Toprağa Dönüş platformu olarak, hizmetlerimizi sunabilmek için minimum düzeyde bilgi topluyoruz:

• **Okul Kayıt Formu:** Okul adı, şehir/ilçe bilgisi, iletişim e-postası ve öğretmen/danışman bilgileri
• **Katkı Formu:** Ad-soyad (isteğe bağlı), e-posta adresi ve mesaj içeriği
• **Teknik Veriler:** Cihaz türü, tarayıcı bilgisi ve ziyaret istatistikleri (anonim olarak)`
        },
        {
            icon: Lock,
            title: "Bilgilerin Kullanımı",
            content: `Topladığımız bilgileri aşağıdaki amaçlarla kullanıyoruz:

• Okul kayıt taleplerinin değerlendirilmesi ve iletişim kurulması
• Platform hizmetlerinin iyileştirilmesi ve geliştirilmesi
• Kullanıcı sorularına ve geri bildirimlerine cevap verilmesi
• Eğitim içeriklerinin ve haberlerin paylaşılması
• Yasal yükümlülüklerin yerine getirilmesi`
        },
        {
            icon: Shield,
            title: "Veri Güvenliği",
            content: `Kişisel verilerinizin güvenliği bizim için son derece önemlidir:

• Tüm veriler güvenli sunucularda şifreli olarak saklanır
• Firebase altyapısı ile endüstri standardı güvenlik önlemleri uygulanır
• Verilere yalnızca yetkili personel erişebilir
• Düzenli güvenlik denetimleri ve güncellemeler yapılır
• Üçüncü taraflarla kişisel veriler paylaşılmaz`
        },
        {
            icon: Cookie,
            title: "Çerezler (Cookies)",
            content: `Web sitemiz, deneyiminizi iyileştirmek için çerezler kullanmaktadır:

• **Zorunlu Çerezler:** Sitenin düzgün çalışması için gerekli temel çerezler
• **Analitik Çerezler:** Sayfa görüntüleme ve kullanım istatistikleri (anonim)
• **Tercih Çerezleri:** Dil ve görünüm tercihlerinizin saklanması

Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.`
        },
        {
            icon: FileText,
            title: "Haklarınız",
            content: `6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aşağıdaki haklara sahipsiniz:

• Kişisel verilerinizin işlenip işlenmediğini öğrenme
• İşlenen verileriniz hakkında bilgi talep etme
• Verilerin düzeltilmesini veya silinmesini isteme
• Verilerin aktarıldığı üçüncü tarafları öğrenme
• İşleme faaliyetine itiraz etme
• Veri taşınabilirliği talep etme`
        },
        {
            icon: AlertTriangle,
            title: "Çocukların Gizliliği",
            content: `Toprağa Dönüş, eğitim amaçlı bir platform olarak çocukların gizliliğine özel önem vermektedir:

• 13 yaşından küçük çocuklardan doğrudan kişisel bilgi toplamıyoruz
• Okul kayıtları yalnızca öğretmen/danışman aracılığıyla yapılır
• Öğrenci bilgileri doğrudan platformda saklanmaz
• Ebeveyn/veli onayı olmadan çocuklarla doğrudan iletişim kurulmaz`
        }
    ];

    return (
        <div className="min-h-screen bg-background-base">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#1F4728] via-[#2D5A35] to-[#1F4728] text-white py-16 px-4 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-primary-soft/10 rounded-full blur-2xl"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Gizlilik Politikası
                        </h1>
                        <p className="text-white/70 text-lg max-w-2xl mx-auto">
                            Toprağa Dönüş platformu olarak kişisel verilerinizin korunmasına büyük önem veriyoruz.
                            Bu politika, verilerinizi nasıl topladığımızı ve koruduğumuzu açıklar.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">

                {/* Last Updated */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-2 text-sm text-text-muted mb-12 bg-background-subtle px-4 py-2 rounded-full w-fit mx-auto"
                >
                    <Calendar size={14} />
                    <span>Son Güncelleme: 30 Ocak 2026</span>
                </motion.div>

                {/* Intro */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-primary-soft/30 border border-primary/20 rounded-2xl p-6 mb-10"
                >
                    <p className="text-text-secondary leading-relaxed">
                        <strong className="text-text-primary">Toprağa Dönüş</strong>, Harezmi Eğitim Modeli kapsamında
                        geliştirilen bir çevre eğitimi platformudur. Bu gizlilik politikası, platformumuzu
                        kullanırken kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu
                        açıklamaktadır. Platformumuzu kullanarak bu politikayı kabul etmiş sayılırsınız.
                    </p>
                </motion.div>

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (index + 4) }}
                            className="bg-background-surface border border-border rounded-2xl p-6 hover:shadow-card transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center">
                                    <section.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-text-primary mb-3">
                                        {section.title}
                                    </h2>
                                    <div className="text-text-secondary leading-relaxed whitespace-pre-line prose prose-sm max-w-none">
                                        {section.content.split('\n').map((line, i) => (
                                            <p key={i} className="mb-2" dangerouslySetInnerHTML={{
                                                __html: line
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                    .replace(/•/g, '<span class="text-primary mr-2">•</span>')
                                            }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 bg-gradient-to-br from-primary-soft/50 to-secondary-soft/30 border border-primary/20 rounded-2xl p-8 text-center"
                >
                    <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                        İletişim
                    </h3>
                    <p className="text-text-secondary mb-4">
                        Gizlilik politikamız veya kişisel verileriniz hakkında sorularınız için
                        bizimle iletişime geçebilirsiniz.
                    </p>
                    {!showEmail ? (
                        <button
                            onClick={() => setShowEmail(true)}
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-button font-medium transition-colors"
                        >
                            <Mail size={18} />
                            E-posta Adresini Göster
                        </button>
                    ) : (
                        <motion.a
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            href="mailto:berkansigirci@gmail.com"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-button font-medium transition-colors"
                        >
                            <Mail size={18} />
                            berkansigirci@gmail.com
                        </motion.a>
                    )}
                </motion.div>

                {/* Disclaimer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 text-center text-sm text-text-muted"
                >
                    <p>
                        Bu gizlilik politikası, önceden haber vermeksizin güncellenebilir.
                        Güncellemeler bu sayfada yayınlanacaktır.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
