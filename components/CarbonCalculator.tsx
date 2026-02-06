import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator, Leaf, Droplets, Sprout, TrendingDown, TreeDeciduous,
    ChevronDown, Sparkles, Plus, Minus, Share2, RotateCcw, Car, Lightbulb, Zap, Home
} from 'lucide-react';

// Karbon tasarruf değerleri (kg CO₂ / kg atık)
const CARBON_DATA: Record<string, {
    label: string;
    co2PerKg: number;
    waterPerKg: number;
    fertilizerPerKg: number;
    emoji: string;
    color: string;
    bgColor: string;
}> = {
    'vegetable': {
        label: 'Sebze/Meyve Kabukları',
        co2PerKg: 0.46,
        waterPerKg: 3.0,
        fertilizerPerKg: 0.35,
        emoji: '🥕',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
    },
    'coffee': {
        label: 'Kahve Telvesi',
        co2PerKg: 0.52,
        waterPerKg: 2.5,
        fertilizerPerKg: 0.40,
        emoji: '☕',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100'
    },
    'leaves': {
        label: 'Kuru Yapraklar',
        co2PerKg: 0.38,
        waterPerKg: 1.5,
        fertilizerPerKg: 0.45,
        emoji: '🍂',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
    },
    'paper': {
        label: 'Kağıt/Karton',
        co2PerKg: 0.41,
        waterPerKg: 2.0,
        fertilizerPerKg: 0.30,
        emoji: '📄',
        color: 'text-stone-600',
        bgColor: 'bg-stone-100'
    },
    'eggshell': {
        label: 'Yumurta Kabuğu',
        co2PerKg: 0.28,
        waterPerKg: 0.5,
        fertilizerPerKg: 0.50,
        emoji: '🥚',
        color: 'text-orange-500',
        bgColor: 'bg-orange-100'
    },
    'tea': {
        label: 'Çay Posası',
        co2PerKg: 0.48,
        waterPerKg: 2.8,
        fertilizerPerKg: 0.38,
        emoji: '🍵',
        color: 'text-teal-600',
        bgColor: 'bg-teal-100'
    },
    'grass': {
        label: 'Çim Kırpıntıları',
        co2PerKg: 0.42,
        waterPerKg: 2.2,
        fertilizerPerKg: 0.32,
        emoji: '🌿',
        color: 'text-lime-600',
        bgColor: 'bg-lime-100'
    },
    'bread': {
        label: 'Bayat Ekmek',
        co2PerKg: 0.55,
        waterPerKg: 3.2,
        fertilizerPerKg: 0.28,
        emoji: '🍞',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50'
    }
};

// Karşılaştırma sabitleri
const CO2_PER_TREE_YEAR = 21; // kg
const CO2_PER_CAR_KM = 0.12; // kg CO2 per km
const CO2_PER_PHONE_CHARGE = 0.007; // kg
const CO2_PER_LED_HOUR = 0.01; // kg

type WasteEntry = {
    type: string;
    amount: number;
};

interface CarbonCalculatorProps {
    compact?: boolean;
}

const CarbonCalculator: React.FC<CarbonCalculatorProps> = ({ compact = false }) => {
    const [wasteEntries, setWasteEntries] = useState<WasteEntry[]>([
        { type: 'vegetable', amount: 1 }
    ]);
    const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('week');
    const [hasCalculated, setHasCalculated] = useState(false);

    // Toplam sonuçları hesapla
    const results = useMemo(() => {
        let totalCO2 = 0;
        let totalWater = 0;
        let totalFertilizer = 0;

        wasteEntries.forEach(entry => {
            const data = CARBON_DATA[entry.type];
            if (data) {
                totalCO2 += data.co2PerKg * entry.amount;
                totalWater += data.waterPerKg * entry.amount;
                totalFertilizer += data.fertilizerPerKg * entry.amount;
            }
        });

        // Zaman dilimine göre çarp
        const multiplier = timeFrame === 'week' ? 1 : timeFrame === 'month' ? 4 : 52;
        totalCO2 *= multiplier;
        totalWater *= multiplier;
        totalFertilizer *= multiplier;

        const treeDays = (totalCO2 / CO2_PER_TREE_YEAR) * 365;
        const carKm = totalCO2 / CO2_PER_CAR_KM;
        const phoneCharges = totalCO2 / CO2_PER_PHONE_CHARGE;
        const ledHours = totalCO2 / CO2_PER_LED_HOUR;

        return {
            co2Saved: totalCO2.toFixed(2),
            waterSaved: totalWater.toFixed(1),
            fertilizerProduced: totalFertilizer.toFixed(2),
            treeDays: Math.round(treeDays),
            carKm: Math.round(carKm),
            phoneCharges: Math.round(phoneCharges),
            ledHours: Math.round(ledHours),
            totalWaste: wasteEntries.reduce((sum, e) => sum + e.amount, 0) * multiplier
        };
    }, [wasteEntries, timeFrame]);

    const addWasteEntry = () => {
        const unusedTypes = Object.keys(CARBON_DATA).filter(
            type => !wasteEntries.some(e => e.type === type)
        );
        if (unusedTypes.length > 0) {
            setWasteEntries([...wasteEntries, { type: unusedTypes[0], amount: 0.5 }]);
            setHasCalculated(false);
        }
    };

    const removeWasteEntry = (index: number) => {
        if (wasteEntries.length > 1) {
            setWasteEntries(wasteEntries.filter((_, i) => i !== index));
            setHasCalculated(false);
        }
    };

    const updateWasteEntry = (index: number, field: 'type' | 'amount', value: string | number) => {
        const updated = [...wasteEntries];
        if (field === 'type') {
            updated[index].type = value as string;
        } else {
            updated[index].amount = Math.max(0, value as number);
        }
        setWasteEntries(updated);
        setHasCalculated(false);
    };

    const resetCalculator = () => {
        setWasteEntries([{ type: 'vegetable', amount: 1 }]);
        setTimeFrame('week');
        setHasCalculated(false);
    };

    const shareResults = () => {
        const text = `🌱 Kompostlama ile ${timeFrame === 'week' ? 'haftalık' : timeFrame === 'month' ? 'aylık' : 'yıllık'} ${results.co2Saved} kg CO₂ tasarrufu sağlıyorum! Bu, ${results.carKm} km araç yolculuğuna eşdeğer. #TopragaDonus #Kompost`;
        if (navigator.share) {
            navigator.share({ text });
        } else {
            navigator.clipboard.writeText(text);
            alert('Sonuç panoya kopyalandı!');
        }
    };

    return (
        <div className={`rounded-card bg-white border border-border shadow-card h-full flex flex-col ${compact ? 'p-5' : 'p-6 md:p-8'}`}>

            {/* Header */}
            <div className={`flex items-center justify-between ${compact ? 'mb-4' : 'mb-6'}`}>
                <div className="flex items-center space-x-3">
                    <div className={`rounded-xl bg-gradient-to-br from-primary to-green-500 text-white shadow-soft ${compact ? 'p-2' : 'p-3'}`}>
                        <Calculator size={compact ? 18 : 24} />
                    </div>
                    <div>
                        <h3 className={`font-bold text-text-primary ${compact ? 'text-base' : 'text-xl'}`}>
                            Karbon Ayak İzi
                        </h3>
                        {!compact && (
                            <p className="text-sm text-text-muted">
                                Kompostladığın atıkların çevresel etkisini keşfet
                            </p>
                        )}
                    </div>
                </div>
                <button
                    onClick={resetCalculator}
                    className="p-2 rounded-full hover:bg-background-subtle text-text-muted hover:text-text-primary transition-colors"
                    title="Sıfırla"
                >
                    <RotateCcw size={16} />
                </button>
            </div>

            {/* Time Frame Selector */}
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-text-secondary">
                    Zaman Dilimi
                </label>
                <div className="flex rounded-input border border-border overflow-hidden">
                    {[
                        { key: 'week', label: 'Haftalık' },
                        { key: 'month', label: 'Aylık' },
                        { key: 'year', label: 'Yıllık' }
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => { setTimeFrame(key as any); setHasCalculated(false); }}
                            className={`flex-1 py-2.5 text-sm font-medium transition-all ${timeFrame === key
                                ? 'bg-primary text-white'
                                : 'bg-white text-text-secondary hover:bg-background-subtle'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Waste Entries */}
            <div className="space-y-3 mb-4">
                <label className="block text-sm font-semibold text-text-secondary">
                    Atık Türleri ve Miktarları
                </label>

                {wasteEntries.map((entry, index) => {
                    const wasteData = CARBON_DATA[entry.type];
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-3 rounded-input bg-background-subtle border border-border"
                        >
                            {/* Waste Type */}
                            <div className="flex-1 relative">
                                <select
                                    value={entry.type}
                                    onChange={(e) => updateWasteEntry(index, 'type', e.target.value)}
                                    className="w-full appearance-none bg-white border border-border rounded-button p-2.5 pr-8 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-primary-soft outline-none"
                                >
                                    {Object.entries(CARBON_DATA).map(([key, data]) => (
                                        <option key={key} value={key}>
                                            {data.emoji} {data.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                            </div>

                            {/* Amount Controls */}
                            <div className="flex items-center gap-1 bg-white rounded-button border border-border">
                                <button
                                    onClick={() => updateWasteEntry(index, 'amount', entry.amount - 0.5)}
                                    className="p-2 hover:bg-background-subtle rounded-l-button transition-colors"
                                >
                                    <Minus size={14} />
                                </button>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={entry.amount}
                                    onChange={(e) => updateWasteEntry(index, 'amount', parseFloat(e.target.value) || 0)}
                                    className="w-14 text-center text-sm font-bold border-0 focus:ring-0 outline-none"
                                />
                                <button
                                    onClick={() => updateWasteEntry(index, 'amount', entry.amount + 0.5)}
                                    className="p-2 hover:bg-background-subtle rounded-r-button transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                            <span className="text-xs text-text-muted w-6">kg</span>

                            {/* Remove Button */}
                            {wasteEntries.length > 1 && (
                                <button
                                    onClick={() => removeWasteEntry(index)}
                                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Minus size={14} />
                                </button>
                            )}
                        </motion.div>
                    );
                })}

                {/* Add More Button */}
                {wasteEntries.length < Object.keys(CARBON_DATA).length && (
                    <button
                        onClick={addWasteEntry}
                        className="w-full py-2.5 border-2 border-dashed border-border rounded-button text-sm font-medium text-text-muted hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Atık Türü Ekle
                    </button>
                )}
            </div>

            {/* Calculate Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setHasCalculated(true)}
                className="w-full py-4 rounded-button font-bold flex items-center justify-center space-x-2 bg-gradient-to-r from-primary via-green-500 to-emerald-500 text-white shadow-soft hover:shadow-card transition-all"
            >
                <Sparkles size={18} />
                <span>Çevresel Etkiyi Hesapla</span>
            </motion.button>

            {/* Results */}
            <AnimatePresence>
                {hasCalculated && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-border pt-6 mt-6">

                            {/* Summary Header */}
                            <div className="text-center mb-6">
                                <p className="text-sm text-text-muted mb-1">
                                    {timeFrame === 'week' ? 'Haftalık' : timeFrame === 'month' ? 'Aylık' : 'Yıllık'} toplam {results.totalWaste.toFixed(1)} kg kompost ile:
                                </p>
                            </div>

                            {/* Main Stats Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100"
                                >
                                    <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                                        <TrendingDown size={22} />
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {results.co2Saved}
                                    </div>
                                    <div className="text-xs text-green-700/70 font-medium">kg CO₂ tasarrufu</div>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100"
                                >
                                    <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                                        <Droplets size={22} />
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {results.waterSaved}
                                    </div>
                                    <div className="text-xs text-blue-700/70 font-medium">litre su korundu</div>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100"
                                >
                                    <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-amber-100 text-amber-600">
                                        <Sprout size={22} />
                                    </div>
                                    <div className="text-2xl font-bold text-amber-600">
                                        {results.fertilizerProduced}
                                    </div>
                                    <div className="text-xs text-amber-700/70 font-medium">kg gübre üretildi</div>
                                </motion.div>
                            </div>

                            {/* Comparisons */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-gradient-to-r from-primary-soft via-green-50 to-emerald-50 rounded-xl p-4 mb-4"
                            >
                                <p className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                                    <Lightbulb size={16} className="text-primary" />
                                    Bu Tasarruf Neye Eşdeğer?
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2.5">
                                        <Car size={18} className="text-indigo-500" />
                                        <span className="text-sm"><strong>{results.carKm}</strong> km araç yolculuğu</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2.5">
                                        <TreeDeciduous size={18} className="text-green-600" />
                                        <span className="text-sm"><strong>{results.treeDays}</strong> günlük ağaç etkisi</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2.5">
                                        <Zap size={18} className="text-yellow-500" />
                                        <span className="text-sm"><strong>{results.phoneCharges}</strong> telefon şarjı</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2.5">
                                        <Home size={18} className="text-purple-500" />
                                        <span className="text-sm"><strong>{results.ledHours}</strong> saat LED aydınlatma</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Share Button */}
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                onClick={shareResults}
                                className="w-full py-3 rounded-button font-medium flex items-center justify-center gap-2 bg-background-subtle hover:bg-secondary-soft text-text-secondary hover:text-secondary transition-colors border border-border"
                            >
                                <Share2 size={16} />
                                Sonuçları Paylaş
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CarbonCalculator;
