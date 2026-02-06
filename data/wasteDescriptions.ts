// Waste Guide Detail Descriptions
// These are extended descriptions that appear when a waste item card is expanded

export const DETAIL_DESCRIPTIONS: Record<string, { title: string; tips: string[]; warning?: string }> = {
    // GREEN (Azot)
    'Sebze ve Meyve Kabukları': {
        title: 'Sebze ve Meyve Kabukları',
        tips: [
            'Küçük parçalara bölmek ayrışmayı hızlandırır.',
            'Çürümüş olanlar da eklenebilir.',
            'Yıkanmış olması tercih edilir ama zorunlu değil.'
        ]
    },
    'Çay Posası': {
        title: 'Çay Posası',
        tips: [
            'Sentetik poşetleri çöpe atın, sadece posayı ekleyin.',
            'Kağıt poşetler de kompostlanabilir.',
            'Direkt toprağa serpilebilir.'
        ]
    },
    'Kahve Telvesi': {
        title: 'Kahve Telvesi',
        tips: [
            'Mükemmel bir azot kaynağıdır.',
            'Solucanlar için harika bir besindir.',
            'Bitkilerinizin dibine serpin, salyangoz kovucu etkisi var.'
        ]
    },
    'Yumurta Kabuğu': {
        title: 'Yumurta Kabuğu',
        tips: [
            'Kalsiyum ve mineral sağlar.',
            'Mutlaka ezilmeli, aksi halde yıllar sürer.',
            'İç zarını çıkarmaya gerek yok.'
        ]
    },

    // BROWN (Karbon)
    'Kuru Yapraklar': {
        title: 'Kuru Yapraklar',
        tips: [
            'Sonbaharda toplayıp saklayabilirsiniz.',
            'Kompost içinde hava cebi oluşturur.',
            'Parçalanmış olması ayrışmayı hızlandırır.'
        ]
    },
    'Karton ve Kağıt': {
        title: 'Karton ve Kağıt',
        tips: [
            'Parlak olmayan, boyasız kağıtlar uygundur.',
            'Yumurta kartonları idealdir.',
            'Küçük parçalara yırtın.'
        ],
        warning: 'Kuşe kağıt, parlak dergi sayfaları veya fatura kağıtları uygun DEĞİLDİR.'
    },

    // CAUTION
    'Turunçgiller': {
        title: 'Turunçgil Kabukları',
        tips: [
            'Portakal, limon, mandalina kabukları asitli olabilir.',
            'Çok az miktarda ekleyin.',
            'Solucan kompostunda dikkatli olun.'
        ],
        warning: 'Aşırı miktarda eklenmesi pH dengesini bozar ve mikroorganizmaları öldürebilir.'
    },

    // PROHIBITED
    'Et ve Kemik': {
        title: 'Et ve Kemik Atıkları',
        tips: [],
        warning: 'ASLA komposta eklemeyin. Kötü koku yapar, fare ve sinekleri çeker. Ayrışması yıllar alır ve patojen risk taşır.'
    },
    'Süt Ürünleri': {
        title: 'Süt Ürünleri',
        tips: [],
        warning: 'Peynir, yoğurt, tereyağı gibi ürünler çürüyünce koku yapar ve böcek çeker.'
    }
};

// Helper function to get description
export const getWasteDetail = (name: string) => {
    return DETAIL_DESCRIPTIONS[name] || { title: name, tips: ['Detaylı bilgi eklenmemiştir.'] };
};
