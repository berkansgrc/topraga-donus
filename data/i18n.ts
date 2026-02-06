// Turkish translations and static text content
// Centralized for easy maintenance and potential i18n support

export const UI_TEXT = {
    // Navigation
    nav: {
        home: 'Ana Sayfa',
        guide: 'Atık Rehberi',
        lab: 'Kompost Lab',
        map: 'Harita',
        gallery: 'Galeri',
        contribute: 'Katkı Yap',
        schools: 'Okullar',
        blog: 'Blog',
        faq: 'SSS',
        admin: 'Yönetim'
    },

    // Common
    common: {
        loading: 'Yükleniyor...',
        save: 'Kaydet',
        cancel: 'İptal',
        delete: 'Sil',
        edit: 'Düzenle',
        add: 'Ekle',
        search: 'Ara',
        filter: 'Filtrele',
        all: 'Tümü',
        back: 'Geri',
        next: 'İleri',
        submit: 'Gönder',
        close: 'Kapat',
        yes: 'Evet',
        no: 'Hayır',
        success: 'Başarılı',
        error: 'Hata',
        warning: 'Uyarı'
    },

    // Waste Guide
    wasteGuide: {
        title: 'Atık Rehberi',
        subtitle: 'Hangi atık nereye? Organik atıkların kompost rehberi.',
        searchPlaceholder: 'Atık adı ara...',
        categories: {
            green: 'Yeşil (Azot)',
            brown: 'Kahverengi (Karbon)',
            caution: 'Dikkatli Kullan',
            prohibited: 'Yasak'
        },
        goesToSoil: 'Toprağa gider',
        notGoToSoil: 'Toprağa ATMAYINIZ',
        prepSteps: 'Hazırlık',
        method: 'Yöntem'
    },

    // Map
    map: {
        title: 'Geri Dönüşüm Haritası',
        searchPlaceholder: 'İstasyon ara...',
        goToMyLocation: 'Konumuma Git',
        getDirections: 'Yol Tarifi Al',
        verified: 'Doğrulanmış',
        distance: 'uzaklıkta'
    },

    // Admin
    admin: {
        dashboard: 'Yönetim Paneli',
        logout: 'Çıkış Yap',
        addNew: 'Yeni Ekle',
        tabs: {
            waste: 'Atık Rehberi',
            stations: 'İstasyonlar',
            lab: 'Deney / Lab',
            gallery: 'Galeri',
            suggestions: 'Gelen Kutusu',
            schools: 'Okul Başvuruları',
            blog: 'Blog / Haberler',
            map: 'Harita Görünümü'
        }
    },

    // Forms
    forms: {
        required: 'Bu alan zorunludur',
        invalidEmail: 'Geçerli bir e-posta adresi girin',
        optional: 'Opsiyonel',
        selectImage: 'Görsel Seç',
        uploadProgress: 'Yükleniyor...'
    },

    // Toast Messages
    toasts: {
        saveSuccess: 'Başarıyla kaydedildi!',
        saveError: 'Kaydetme sırasında hata oluştu.',
        deleteSuccess: 'Başarıyla silindi.',
        deleteError: 'Silme sırasında hata oluştu.',
        loginSuccess: 'Giriş başarılı!',
        loginError: 'Giriş başarısız. Bilgilerinizi kontrol edin.',
        submitSuccess: 'Gönderildi! Teşekkürler.',
        submitError: 'Gönderim sırasında hata oluştu.'
    }
} as const;

export type UITextKey = keyof typeof UI_TEXT;
