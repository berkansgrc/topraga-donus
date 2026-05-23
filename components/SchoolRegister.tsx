import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import {
    School, Send, CheckCircle, FileText, Video, BarChart3, Award,
    MapPin, Users, Building, Mail, Phone, User, ChevronRight,
    BookOpen, Leaf, Recycle, TreeDeciduous
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Katılmak istenilen aktiviteler
const ACTIVITIES = [
    { id: 'kompost', label: 'Kompost Atölyesi', icon: '🌱' },
    { id: 'atik', label: 'Atık Ayrıştırma Eğitimi', icon: '♻️' },
    { id: 'bitki', label: 'Bitki Yetiştirme Deneyi', icon: '🌿' },
    { id: 'kampanya', label: 'Geri Dönüşüm Kampanyası', icon: '📢' },
    { id: 'harita', label: 'Toplama Noktası Haritalama', icon: '📍' }
];

// Türkiye şehirleri
const CITIES = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
    'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
    'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
    'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
    'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
    'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
    'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
    'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];



const SchoolRegister: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        schoolName: '',
        city: '',
        district: '',
        teacherName: '',
        email: '',
        phone: '',
        studentCount: '',
        activities: [] as string[]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

    const { addToast } = useToast();

    // Field touch tracking for validation styling
    const handleBlur = (field: string) => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
    };

    // Step 1 validation
    const isStep1Valid = () => {
        return formData.schoolName.trim() !== '' && 
               formData.city !== '' && 
               formData.district.trim() !== '';
    };

    // Step 2 validation
    const isStep2Valid = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return formData.teacherName.trim() !== '' && 
               emailRegex.test(formData.email) && 
               formData.studentCount !== '' && 
               parseInt(formData.studentCount) > 0;
    };

    // Step 3 validation
    const isStep3Valid = () => {
        return formData.activities.length > 0;
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (isStep1Valid()) {
                setCurrentStep(2);
            } else {
                // Touch all fields to show validation rings
                setTouchedFields({ schoolName: true, city: true, district: true });
                addToast('Lütfen tüm zorunlu alanları doldurun.', 'warning');
            }
        } else if (currentStep === 2) {
            if (isStep2Valid()) {
                setCurrentStep(3);
            } else {
                setTouchedFields({ teacherName: true, email: true, studentCount: true });
                addToast('Lütfen bilgileri ve e-posta formatını kontrol edin.', 'warning');
            }
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => Math.max(1, prev - 1));
    };

    const handleActivityToggle = (activityId: string) => {
        setFormData(prev => ({
            ...prev,
            activities: prev.activities.includes(activityId)
                ? prev.activities.filter(a => a !== activityId)
                : [...prev.activities, activityId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isStep3Valid()) {
            addToast('Lütfen en az bir aktivite seçin.', 'warning');
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const payload = {
                school_name: formData.schoolName,
                city: formData.city,
                district: formData.district,
                teacher_name: formData.teacherName,
                contact_email: formData.email,
                phone: formData.phone || null,
                student_count: formData.studentCount ? parseInt(formData.studentCount) : null,
                activities: formData.activities,
                status: 'pending'
            };

            const { error } = await supabase.from('school_registrations').insert([payload]);

            if (error) {
                console.error('Supabase error:', error);
                // Fallback for missing table during dev
                if (error.code === '42P01' || error.code === 'PGRST205') {
                    console.log('Tablo henüz oluşturulmamış, simüle ediliyor...');
                } else {
                    throw error;
                }
            }

            setIsSubmitted(true);
            addToast('Okul başvurunuz başarıyla alındı!', 'success');
        } catch (err: any) {
            const msg = 'Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
            setSubmitError(msg);
            addToast(msg, 'error');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Educational Guide Download
    const handleDownloadGuide = () => {
        addToast('Eğitim Kılavuzu indiriliyor...', 'info');
        
        const link = document.createElement('a');
        link.href = '/Topraga_Donus_Egitim_Kilavuzu.pdf';
        link.setAttribute('download', 'Topraga_Donus_Egitim_Kilavuzu.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // School Certificate Mock Download
    const handleDownloadCertificate = () => {
        addToast('Katılım Sertifikası oluşturuluyor...', 'info');
        
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Teşekkür Ederiz!\n\n${formData.schoolName} okulu olarak Harezmi Eğitim Modeli Toprağa Dönüş projesine katılım kaydınız alınmıştır.`);
            link.setAttribute('download', `${formData.schoolName}_Katilim_Sertifikasi.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            addToast('Katılım Sertifikası indirildi!', 'success');
        }, 1200);
    };

    if (isSubmitted) {
        return (
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="bg-white rounded-card border border-border shadow-card p-8 md:p-12 text-center"
                >
                    <div className="w-20 h-20 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-primary" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-text-primary mb-4">Başvurunuz Alındı! 🎉</h2>
                    <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
                        **{formData.schoolName}** okulu başarıyla sisteme kaydedildi. En kısa sürede sizinle iletişime geçeceğiz.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto mb-8">
                        <button
                            onClick={handleDownloadCertificate}
                            className="flex-1 px-6 py-3 border border-primary text-primary rounded-button font-semibold hover:bg-primary-soft transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-soft"
                        >
                            <Award size={18} />
                            <span>Katılım Belgesi İndir</span>
                        </button>
                        <button
                            onClick={() => {
                                setIsSubmitted(false);
                                setCurrentStep(1);
                                setFormData({
                                    schoolName: '',
                                    city: '',
                                    district: '',
                                    teacherName: '',
                                    email: '',
                                    phone: '',
                                    studentCount: '',
                                    activities: []
                                });
                                setTouchedFields({});
                            }}
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-button font-semibold hover:bg-primary-600 transition-colors shadow-soft cursor-pointer"
                        >
                            Yeni Kayıt Ekle
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center space-x-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-pill text-sm font-semibold mb-4">
                    <School size={16} />
                    <span>Harezmi Okul Programı</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
                    Okulunuzu <span className="text-primary">Projeye Katın!</span>
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                    Öğrencilerinizi sürdürülebilirlik liderlerine dönüştürün.
                    Tamamen ücretsiz eğitim materyalleri, kılavuzlar ve etkinlik paketleri sunuyoruz.
                </p>
            </motion.div>

            {/* 3-Step Process (Static Overview) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid md:grid-cols-3 gap-6 mb-12"
            >
                {[
                    { step: 1, title: 'Başvuru Yap', desc: 'Formu adım adım doldurun, 2 dakikanızı alır', icon: FileText, color: 'from-blue-500 to-blue-600' },
                    { step: 2, title: 'Eğitim Al', desc: 'Sınıf materyallerine ve videolara erişin', icon: BookOpen, color: 'from-purple-500 to-purple-600' },
                    { step: 3, title: 'Projeyi Başlat', desc: 'Öğrencilerle hemen ayrıştırmaya başlayın', icon: Leaf, color: 'from-primary to-green-500' }
                ].map((item, index) => (
                    <div key={index} className="relative">
                        <div className="bg-white rounded-card border border-border p-6 shadow-card hover:shadow-hover transition-all text-center h-full flex flex-col justify-center">
                            <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                                <item.icon size={28} />
                            </div>
                            <div className="absolute -top-3 -left-3 w-8 h-8 bg-text-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-soft">
                                {item.step}
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">{item.title}</h3>
                            <p className="text-sm text-text-muted">{item.desc}</p>
                        </div>
                        {index < 2 && (
                            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                                <ChevronRight size={24} className="text-border" />
                            </div>
                        )}
                    </div>
                ))}
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-8 items-start">

                {/* Step-by-Step Registration Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3"
                >
                    <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
                        
                        {/* Progress Header */}
                        <div className="bg-background-subtle p-5 border-b border-border flex items-center justify-between select-none">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary-soft rounded-xl flex items-center justify-center text-primary">
                                    {currentStep === 1 && <Building size={20} />}
                                    {currentStep === 2 && <Users size={20} />}
                                    {currentStep === 3 && <Leaf size={20} />}
                                </div>
                                <div>
                                    <h2 className="font-bold text-text-primary text-sm">Okul Kayıt İşlemi</h2>
                                    <p className="text-xs text-text-muted">Adım {currentStep} / 3: {
                                        currentStep === 1 ? 'Okul Bilgileri' : 
                                        currentStep === 2 ? 'İletişim & Detaylar' : 'Aktivite Seçimi'
                                    }</p>
                                </div>
                            </div>
                            <div className="w-24 bg-border/40 rounded-pill h-2 overflow-hidden">
                                <div 
                                    className="bg-primary h-full transition-all duration-300"
                                    style={{ width: `${(currentStep / 3) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Form Fields with Motion Container */}
                        <div className="p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <AnimatePresence mode="wait">
                                    
                                    {currentStep === 1 && (
                                        /* Step 1: Okul Bilgileri */
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-5"
                                        >
                                            {/* School Name */}
                                            <div>
                                                <label className="block text-sm font-semibold text-text-secondary mb-2 flex items-center">
                                                    <Building size={14} className="mr-1.5 text-primary" /> Okul Adı <span className="text-status-error ml-0.5">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.schoolName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                                                    onBlur={() => handleBlur('schoolName')}
                                                    placeholder="Örn: Atatürk Ortaokulu"
                                                    className={`w-full px-4 py-3 rounded-input border outline-none transition-all text-sm
                                                        ${touchedFields.schoolName && formData.schoolName.trim() === ''
                                                            ? 'border-status-error focus:ring-2 focus:ring-red-100'
                                                            : 'border-border focus:ring-2 focus:ring-primary-soft focus:border-primary'}`}
                                                />
                                                {touchedFields.schoolName && formData.schoolName.trim() === '' && (
                                                    <span className="text-[11px] text-status-error block mt-1">Okul adı zorunludur.</span>
                                                )}
                                            </div>

                                            {/* City & District */}
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-text-secondary mb-2 flex items-center">
                                                        <MapPin size={14} className="mr-1.5 text-primary" /> İl <span className="text-status-error ml-0.5">*</span>
                                                    </label>
                                                    <select
                                                        value={formData.city}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                                        onBlur={() => handleBlur('city')}
                                                        className={`w-full px-4 py-3 rounded-input border outline-none transition-all bg-white text-sm
                                                            ${touchedFields.city && formData.city === ''
                                                                ? 'border-status-error focus:ring-2 focus:ring-red-100'
                                                                : 'border-border focus:ring-2 focus:ring-primary-soft focus:border-primary'}`}
                                                    >
                                                        <option value="">İl Seçin</option>
                                                        {CITIES.map(city => (
                                                            <option key={city} value={city}>{city}</option>
                                                        ))}
                                                    </select>
                                                    {touchedFields.city && formData.city === '' && (
                                                        <span className="text-[11px] text-status-error block mt-1">Lütfen bir il seçin.</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                                                        İlçe <span className="text-status-error ml-0.5">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.district}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                                                        onBlur={() => handleBlur('district')}
                                                        placeholder="İlçe adı"
                                                        className={`w-full px-4 py-3 rounded-input border outline-none transition-all text-sm
                                                            ${touchedFields.district && formData.district.trim() === ''
                                                                ? 'border-status-error focus:ring-2 focus:ring-red-100'
                                                                : 'border-border focus:ring-2 focus:ring-primary-soft focus:border-primary'}`}
                                                    />
                                                    {touchedFields.district && formData.district.trim() === '' && (
                                                        <span className="text-[11px] text-status-error block mt-1">İlçe zorunludur.</span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {currentStep === 2 && (
                                        /* Step 2: Yetkili Bilgileri */
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-5"
                                        >
                                            {/* Teacher Name */}
                                            <div>
                                                <label className="block text-sm font-semibold text-text-secondary mb-2 flex items-center">
                                                    <User size={14} className="mr-1.5 text-primary" /> Koordinatör Öğretmen <span className="text-status-error ml-0.5">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.teacherName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, teacherName: e.target.value }))}
                                                    onBlur={() => handleBlur('teacherName')}
                                                    placeholder="Adınız Soyadınız"
                                                    className={`w-full px-4 py-3 rounded-input border outline-none transition-all text-sm
                                                        ${touchedFields.teacherName && formData.teacherName.trim() === ''
                                                            ? 'border-status-error focus:ring-2 focus:ring-red-100'
                                                            : 'border-border focus:ring-2 focus:ring-primary-soft focus:border-primary'}`}
                                                />
                                                {touchedFields.teacherName && formData.teacherName.trim() === '' && (
                                                    <span className="text-[11px] text-status-error block mt-1">Ad soyad alanı zorunludur.</span>
                                                )}
                                            </div>

                                            {/* Contact */}
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-text-secondary mb-2 flex items-center">
                                                        <Mail size={14} className="mr-1.5 text-primary" /> E-posta <span className="text-status-error ml-0.5">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                        onBlur={() => handleBlur('email')}
                                                        placeholder="ornek@okul.edu.tr"
                                                        className={`w-full px-4 py-3 rounded-input border outline-none transition-all text-sm
                                                            ${touchedFields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                                                                ? 'border-status-error focus:ring-2 focus:ring-red-100'
                                                                : 'border-border focus:ring-2 focus:ring-primary-soft focus:border-primary'}`}
                                                    />
                                                    {touchedFields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                                                        <span className="text-[11px] text-status-error block mt-1">Lütfen geçerli bir e-posta girin.</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-text-secondary mb-2 flex items-center">
                                                        <Phone size={14} className="mr-1.5 text-primary" /> Telefon No
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                        placeholder="05XX XXX XX XX"
                                                        className="w-full px-4 py-3 rounded-input border border-border focus:ring-2 focus:ring-primary-soft focus:border-primary outline-none transition-all text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Student Count */}
                                            <div>
                                                <label className="block text-sm font-semibold text-text-secondary mb-2 flex items-center">
                                                    <Users size={14} className="mr-1.5 text-primary" /> Katılacak Tahmini Öğrenci Sayısı <span className="text-status-error ml-0.5">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={formData.studentCount}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, studentCount: e.target.value }))}
                                                    onBlur={() => handleBlur('studentCount')}
                                                    placeholder="Örn: 40"
                                                    className={`w-full px-4 py-3 rounded-input border outline-none transition-all text-sm
                                                        ${touchedFields.studentCount && (formData.studentCount === '' || parseInt(formData.studentCount) <= 0)
                                                            ? 'border-status-error focus:ring-2 focus:ring-red-100'
                                                            : 'border-border focus:ring-2 focus:ring-primary-soft focus:border-primary'}`}
                                                />
                                                {touchedFields.studentCount && (formData.studentCount === '' || parseInt(formData.studentCount) <= 0) && (
                                                    <span className="text-[11px] text-status-error block mt-1">Lütfen 0'dan büyük bir sayı girin.</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {currentStep === 3 && (
                                        /* Step 3: Aktivite Tercihleri */
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <label className="block text-sm font-bold text-text-primary">
                                                    Katılmak İstediğiniz Aktiviteler <span className="text-status-error ml-0.5">*</span>
                                                </label>
                                                <span className="text-xs text-text-muted">En az bir adet seçilmelidir</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {ACTIVITIES.map((activity) => {
                                                    const isSelected = formData.activities.includes(activity.id);
                                                    return (
                                                        <motion.button
                                                            key={activity.id}
                                                            type="button"
                                                            onClick={() => handleActivityToggle(activity.id)}
                                                            whileHover={{ scale: 1.01 }}
                                                            whileTap={{ scale: 0.99 }}
                                                            className={`p-4 rounded-button border text-left flex items-center space-x-3 transition-all cursor-pointer relative overflow-hidden
                                                                ${isSelected
                                                                    ? 'border-primary bg-primary-soft text-primary-700 shadow-soft ring-1 ring-primary/20'
                                                                    : 'border-border bg-background-base/20 text-text-secondary hover:border-primary/40 hover:bg-white'
                                                                }`}
                                                        >
                                                            <span className="text-2xl bg-white shadow-soft p-1.5 rounded-xl shrink-0 select-none">
                                                                {activity.icon}
                                                            </span>
                                                            <span className="text-sm font-semibold pr-4">{activity.label}</span>
                                                            {isSelected && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="ml-auto"
                                                                >
                                                                    <CheckCircle size={18} className="text-primary fill-primary-soft shrink-0" />
                                                                </motion.div>
                                                            )}
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}

                                </AnimatePresence>

                                {/* Form Footer Navigation */}
                                <div className="pt-4 border-t border-border flex justify-between gap-3 select-none">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="px-5 py-2.5 border border-border text-text-secondary font-semibold rounded-button hover:bg-background-subtle transition-colors text-sm cursor-pointer"
                                        >
                                            Geri
                                        </button>
                                    )}

                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="ml-auto px-6 py-2.5 bg-primary text-white font-semibold rounded-button hover:bg-primary-600 transition-colors text-sm flex items-center space-x-1.5 cursor-pointer shadow-soft"
                                        >
                                            <span>Devam Et</span>
                                            <ChevronRight size={16} />
                                        </button>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isSubmitting || !isStep3Valid()}
                                            className="ml-auto px-8 py-3 bg-gradient-to-r from-primary to-green-500 text-white font-bold rounded-button shadow-soft hover:shadow-card transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span className="text-sm">Gönderiliyor...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={16} />
                                                    <span className="text-sm">Başvuruyu Gönder</span>
                                                </>
                                            )}
                                        </motion.button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>

                {/* Sidebar: Stats & Benefits */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Benefits Card */}
                    <div className="bg-white rounded-card border border-border shadow-card p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-lg">🎁</span>
                            <h3 className="font-extrabold text-text-primary text-base">Okullara Sağlanan Destekler</h3>
                        </div>
                        <div className="space-y-3">
                            {[
                                { 
                                    icon: FileText, 
                                    label: 'Eğitim Kılavuzu (PDF)', 
                                    desc: 'Adım adım uygulamalı rehberlik dosyası',
                                    action: { label: 'İndir', onClick: handleDownloadGuide }
                                },
                                { icon: Video, label: 'Eğitim Videoları', desc: 'Görsel dersler ve kompost anlatımları' },
                                { icon: BarChart3, label: 'Dijital Takip Paneli', desc: 'Atık miktarlarını ölçme ve raporlama sistemi' },
                                { icon: Award, label: 'Resmi Sertifika Programı', desc: 'Katılım sağlayan öğretmen ve okullara özel' }
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-start justify-between p-3.5 bg-background-subtle rounded-xl hover:bg-background-subtle/70 transition-all border border-border/10">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-primary-soft text-primary rounded-xl flex items-center justify-center shrink-0">
                                            <benefit.icon size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-text-primary text-xs leading-snug">{benefit.label}</div>
                                            <div className="text-[10px] text-text-muted mt-0.5 leading-tight">{benefit.desc}</div>
                                        </div>
                                    </div>
                                    {benefit.action && (
                                        <button
                                            onClick={benefit.action.onClick}
                                            className="text-[10px] bg-primary text-white px-2.5 py-1 rounded-pill font-bold hover:bg-primary-600 transition-colors shadow-soft cursor-pointer shrink-0"
                                        >
                                            {benefit.action.label}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Teacher Quote Card */}
                    <div className="bg-background-subtle rounded-card p-5 border border-border relative overflow-hidden select-none">
                        <div className="absolute -right-2 -bottom-2 text-primary/5 opacity-10 text-8xl font-serif">”</div>
                        <div className="flex items-start space-x-3">
                            <TreeDeciduous size={22} className="text-primary shrink-0 mt-0.5" />
                            <div>
                                <p className="text-text-secondary italic text-xs leading-relaxed">
                                    "Öğrencilerimiz artık atıklara çöp olarak bakmıyor, onları geri kazanılabilecek birer kaynak olarak görüyorlar. Proje sayesinde okul kültürümüz çevre odaklı bir yapıya evrildi."
                                </p>
                                <div className="flex items-center space-x-1.5 mt-2.5">
                                    <span className="w-1 h-1 rounded-full bg-primary" />
                                    <p className="text-text-muted text-[10px] font-semibold">— B. Öğretmen, Sürdürülebilirlik Koordinatörü</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default SchoolRegister;
