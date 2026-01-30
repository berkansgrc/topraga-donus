import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Leaf, Droplets, Sprout, TrendingDown, TreeDeciduous, ChevronDown, Sparkles } from 'lucide-react';

// Karbon tasarruf değerleri (kg CO₂ / kg atık)
const CARBON_DATA: Record<string, {
    label: string;
    co2PerKg: number;
    waterPerKg: number;
    fertilizerPerKg: number;
    emoji: string;
    color: string;
}> = {
    'vegetable': {
        label: 'Sebze/Meyve Kabukları',
        co2PerKg: 0.46,
        waterPerKg: 3.0,
        fertilizerPerKg: 0.35,
        emoji: '🥕',
        color: 'from-green-500 to-emerald-600'
    },
    'coffee': {
        label: 'Kahve Telvesi',
        co2PerKg: 0.52,
        waterPerKg: 2.5,
        fertilizerPerKg: 0.40,
        emoji: '☕',
        color: 'from-amber-600 to-orange-700'
    },
    'leaves': {
        label: 'Kuru Yapraklar',
        co2PerKg: 0.38,
        waterPerKg: 1.5,
        fertilizerPerKg: 0.45,
        emoji: '🍂',
        color: 'from-yellow-500 to-amber-600'
    },
    'paper': {
        label: 'Kağıt/Karton',
        co2PerKg: 0.41,
        waterPerKg: 2.0,
        fertilizerPerKg: 0.30,
        emoji: '📄',
        color: 'from-stone-500 to-stone-700'
    },
    'eggshell': {
        label: 'Yumurta Kabuğu',
        co2PerKg: 0.28,
        waterPerKg: 0.5,
        fertilizerPerKg: 0.50,
        emoji: '🥚',
        color: 'from-orange-300 to-orange-500'
    },
    'tea': {
        label: 'Çay Posası',
        co2PerKg: 0.48,
        waterPerKg: 2.8,
        fertilizerPerKg: 0.38,
        emoji: '🍵',
        color: 'from-green-600 to-teal-700'
    }
};

// Ağaç karşılaştırması: 1 ağaç yılda yaklaşık 21 kg CO₂ emer
const CO2_PER_TREE_YEAR = 21;

const CarbonCalculator: React.FC = () => {
    const [selectedWaste, setSelectedWaste] = useState<string>('vegetable');
    const [amount, setAmount] = useState<number>(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hasCalculated, setHasCalculated] = useState(false);

    const wasteData = CARBON_DATA[selectedWaste];

    const results = useMemo(() => {
        const co2Saved = wasteData.co2PerKg * amount;
        const waterSaved = wasteData.waterPerKg * amount;
        const fertilizerProduced = wasteData.fertilizerPerKg * amount;
        const treeDays = (co2Saved / CO2_PER_TREE_YEAR) * 365;

        return {
            co2Saved: co2Saved.toFixed(2),
            waterSaved: waterSaved.toFixed(1),
            fertilizerProduced: fertilizerProduced.toFixed(2),
            treeDays: Math.round(treeDays)
        };
    }, [selectedWaste, amount, wasteData]);

    const handleCalculate = () => {
        setHasCalculated(true);
    };

    return (
        <div className="rounded-card p-6 md:p-8 bg-white border border-border shadow-card">

            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-primary-soft text-primary">
                    <Calculator size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-text-primary">
                        Karbon Ayak İzi Hesaplayıcı
                    </h3>
                    <p className="text-sm text-text-muted">
                        Kompostladığın atıkların çevresel etkisini keşfet
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="space-y-4 mb-6">

                {/* Waste Type Selector */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-text-secondary">
                        Atık Türü
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full p-3 rounded-input border bg-white border-border text-text-primary hover:border-primary flex items-center justify-between transition-all ${isDropdownOpen ? 'ring-2 ring-primary-soft' : ''}`}
                        >
                            <span className="flex items-center space-x-2">
                                <span className="text-xl">{wasteData.emoji}</span>
                                <span>{wasteData.label}</span>
                            </span>
                            <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 rounded-input bg-white border border-border shadow-lg z-20 overflow-hidden"
                                >
                                    {Object.entries(CARBON_DATA).map(([key, data]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setSelectedWaste(key);
                                                setIsDropdownOpen(false);
                                                setHasCalculated(false);
                                            }}
                                            className={`w-full p-3 flex items-center space-x-3 transition-colors ${selectedWaste === key
                                                    ? 'bg-primary-soft text-primary-700'
                                                    : 'hover:bg-background-subtle text-text-primary'
                                                }`}
                                        >
                                            <span className="text-xl">{data.emoji}</span>
                                            <span className="font-medium">{data.label}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Amount Input */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-text-secondary">
                        Miktar (kg)
                    </label>
                    <div className="flex items-center space-x-3">
                        <input
                            type="number"
                            min="0.1"
                            max="100"
                            step="0.1"
                            value={amount}
                            onChange={(e) => {
                                setAmount(parseFloat(e.target.value) || 0);
                                setHasCalculated(false);
                            }}
                            className="flex-1 p-3 rounded-input border bg-white border-border text-text-primary focus:ring-2 focus:ring-primary-soft focus:border-primary transition-all outline-none"
                        />
                        <span className="text-sm font-medium text-text-muted">kg</span>
                    </div>

                    {/* Quick Select */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {[0.5, 1, 2, 5].map((val) => (
                            <button
                                key={val}
                                onClick={() => {
                                    setAmount(val);
                                    setHasCalculated(false);
                                }}
                                className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-all ${amount === val
                                        ? 'bg-primary text-white'
                                        : 'bg-background-subtle text-text-secondary hover:bg-background-surface'
                                    }`}
                            >
                                {val} kg
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calculate Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCalculate}
                    className="w-full py-4 rounded-button font-bold flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-green-500 text-white shadow-soft hover:shadow-card transition-all"
                >
                    <Sparkles size={18} />
                    <span>Hesapla</span>
                </motion.button>
            </div>

            {/* Results */}
            <AnimatePresence>
                {hasCalculated && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-border pt-6">

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-6">

                                {/* CO2 Saved */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-center p-4 rounded-xl bg-green-50 border border-green-100"
                                >
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                                        <TrendingDown size={20} />
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {results.co2Saved}
                                    </div>
                                    <div className="text-xs text-green-700/70">kg CO₂ tasarrufu</div>
                                </motion.div>

                                {/* Water Saved */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-center p-4 rounded-xl bg-blue-50 border border-blue-100"
                                >
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                        <Droplets size={20} />
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {results.waterSaved}
                                    </div>
                                    <div className="text-xs text-blue-700/70">litre su korundu</div>
                                </motion.div>

                                {/* Fertilizer Produced */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-center p-4 rounded-xl bg-amber-50 border border-amber-100"
                                >
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center bg-amber-100 text-amber-600">
                                        <Sprout size={20} />
                                    </div>
                                    <div className="text-2xl font-bold text-amber-600">
                                        {results.fertilizerProduced}
                                    </div>
                                    <div className="text-xs text-amber-700/70">kg gübre üretildi</div>
                                </motion.div>
                            </div>

                            {/* Fun Fact */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-start space-x-3 p-4 rounded-xl bg-background-subtle border border-border"
                            >
                                <div className="p-2 rounded-lg shrink-0 bg-primary-soft text-primary">
                                    <TreeDeciduous size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-text-primary">
                                        🌳 Biliyor muydun?
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                        Bu kadar CO₂ tasarrufu, bir ağacın <strong className="text-primary">{results.treeDays} gün</strong> boyunca emdiği karbona eşdeğer!
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CarbonCalculator;
