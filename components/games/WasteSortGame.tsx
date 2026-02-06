import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trophy, RotateCcw, ArrowLeft, Star, Zap, CheckCircle, XCircle } from 'lucide-react';

// Kutu tipleri
type BinType = 'compost' | 'recycle' | 'paper' | 'trash';

interface WasteItem {
    id: string;
    name: string;
    emoji: string;
    correctBin: BinType;
    tip: string;
}

interface Bin {
    id: BinType;
    name: string;
    emoji: string;
    color: string;
    bgColor: string;
    borderColor: string;
}

// Kutular
const BINS: Bin[] = [
    { id: 'compost', name: 'Kompost', emoji: '🌱', color: 'text-primary', bgColor: 'bg-primary-soft', borderColor: 'border-primary' },
    { id: 'recycle', name: 'Geri Dönüşüm', emoji: '♻️', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-400' },
    { id: 'paper', name: 'Kağıt', emoji: '📦', color: 'text-secondary', bgColor: 'bg-secondary-soft', borderColor: 'border-secondary' },
    { id: 'trash', name: 'Çöp', emoji: '🚫', color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-400' }
];

// 20 Atık - her biri 1 kez gözükecek
const ALL_WASTE_ITEMS: WasteItem[] = [
    // Kompost (5)
    { id: 'apple', name: 'Elma Kabuğu', emoji: '🍎', correctBin: 'compost', tip: 'Meyve kabukları harika kompost malzemesidir!' },
    { id: 'coffee', name: 'Kahve Telvesi', emoji: '☕', correctBin: 'compost', tip: 'Kahve telvesi azot açısından zengindir.' },
    { id: 'egg', name: 'Yumurta Kabuğu', emoji: '🥚', correctBin: 'compost', tip: 'Ezilmiş yumurta kabukları kalsiyum sağlar.' },
    { id: 'leaves', name: 'Kuru Yaprak', emoji: '🍂', correctBin: 'compost', tip: 'Yapraklar karbon kaynağıdır.' },
    { id: 'banana', name: 'Muz Kabuğu', emoji: '🍌', correctBin: 'compost', tip: 'Muz kabukları potasyum içerir.' },
    // Geri Dönüşüm (5)
    { id: 'plastic', name: 'Plastik Şişe', emoji: '🥤', correctBin: 'recycle', tip: 'Plastiği yıkayıp atın.' },
    { id: 'can', name: 'Konserve Kutusu', emoji: '🥫', correctBin: 'recycle', tip: 'Metal kutular sonsuz geri dönüştürülebilir!' },
    { id: 'glass', name: 'Cam Şişe', emoji: '🍾', correctBin: 'recycle', tip: 'Cam %100 geri dönüştürülebilir.' },
    { id: 'shampoo', name: 'Şampuan Şişesi', emoji: '🧴', correctBin: 'recycle', tip: 'Plastik kapları boşaltıp atın.' },
    { id: 'aluminum', name: 'Alüminyum Kutu', emoji: '🥫', correctBin: 'recycle', tip: 'Alüminyum en değerli geri dönüşüm malzemesidir.' },
    // Kağıt (5)
    { id: 'newspaper', name: 'Gazete', emoji: '📰', correctBin: 'paper', tip: 'Kağıt 7 kez geri dönüştürülebilir.' },
    { id: 'cardboard', name: 'Karton Kutu', emoji: '📦', correctBin: 'paper', tip: 'Kartonları düzleştirerek atın.' },
    { id: 'envelope', name: 'Zarf', emoji: '✉️', correctBin: 'paper', tip: 'Pencereli zarfların plastiğini ayırın.' },
    { id: 'notebook', name: 'Defter', emoji: '📓', correctBin: 'paper', tip: 'Spiralli defterlerin metalini ayırın.' },
    { id: 'magazine', name: 'Dergi', emoji: '📖', correctBin: 'paper', tip: 'Parlak kağıtlar da geri dönüştürülebilir.' },
    // Çöp (5)
    { id: 'battery', name: 'Pil', emoji: '🔋', correctBin: 'trash', tip: 'Piller özel atık kutularına atılmalı!' },
    { id: 'pizza', name: 'Yağlı Pizza Kutusu', emoji: '🍕', correctBin: 'trash', tip: 'Yağlı kağıt geri dönüştürülemez.' },
    { id: 'diaper', name: 'Bebek Bezi', emoji: '👶', correctBin: 'trash', tip: 'Hijyenik atıklar çöpe atılmalı.' },
    { id: 'sponge', name: 'Kullanılmış Sünger', emoji: '🧽', correctBin: 'trash', tip: 'Kirli süngerler geri dönüştürülemez.' },
    { id: 'styrofoam', name: 'Strafor', emoji: '🧊', correctBin: 'trash', tip: 'Strafor geri dönüştürülemiyor.' }
];

// Oyun durumu
type GameState = 'menu' | 'playing' | 'win' | 'lose';

interface WasteSortGameProps {
    onBack: () => void;
}

const WasteSortGame: React.FC<WasteSortGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [gameItems, setGameItems] = useState<WasteItem[]>([]);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; message: string } | null>(null);
    const [draggedOver, setDraggedOver] = useState<BinType | null>(null);
    const [streak, setStreak] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('wasteSortHighScore');
        return saved ? parseInt(saved) : 0;
    });

    // Yeni oyun başlat - 20 atık karıştır
    const startGame = useCallback(() => {
        const shuffled = [...ALL_WASTE_ITEMS].sort(() => Math.random() - 0.5);
        setGameItems(shuffled);
        setCurrentItemIndex(0);
        setScore(0);
        setLives(3);
        setStreak(0);
        setCorrectCount(0);
        setGameState('playing');
    }, []);

    // Kutuya bırakma
    const handleDrop = (binId: BinType) => {
        if (gameState !== 'playing' || currentItemIndex >= gameItems.length) return;

        const currentItem = gameItems[currentItemIndex];
        const isCorrect = currentItem.correctBin === binId;

        if (isCorrect) {
            const streakBonus = streak >= 3 ? 5 : 0;
            const points = 10 + streakBonus;
            setScore(prev => prev + points);
            setStreak(prev => prev + 1);
            setCorrectCount(prev => prev + 1);
            setFeedback({ type: 'correct', message: streakBonus > 0 ? `+${points} 🔥 Seri Bonus!` : `+${points} Doğru!` });
        } else {
            setScore(prev => Math.max(0, prev - 5));
            setLives(prev => prev - 1);
            setStreak(0);
            setFeedback({ type: 'wrong', message: `Yanlış! ${currentItem.tip}` });
        }

        // Sonraki atık veya oyun sonu
        setTimeout(() => {
            setFeedback(null);

            const newLives = isCorrect ? lives : lives - 1;
            const nextIndex = currentItemIndex + 1;

            // Can bitti
            if (newLives <= 0) {
                if (score > highScore) {
                    const finalScore = isCorrect ? score + 10 : score;
                    setHighScore(finalScore);
                    localStorage.setItem('wasteSortHighScore', finalScore.toString());
                }
                setGameState('lose');
                return;
            }

            // Tüm atıklar tamamlandı
            if (nextIndex >= gameItems.length) {
                const finalScore = isCorrect ? score + 10 : score;
                if (finalScore > highScore) {
                    setHighScore(finalScore);
                    localStorage.setItem('wasteSortHighScore', finalScore.toString());
                }
                setGameState('win');
                return;
            }

            // Sonraki atık
            setCurrentItemIndex(nextIndex);
        }, 1000);

        setDraggedOver(null);
    };

    // Drag handlers
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, binId: BinType) => {
        e.preventDefault();
        setDraggedOver(binId);
    };

    const handleDragLeave = () => {
        setDraggedOver(null);
    };

    // Touch handlers for mobile
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
    const itemRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart) return;

        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const binElement = element?.closest('[data-bin]');

        if (binElement) {
            const binId = binElement.getAttribute('data-bin') as BinType;
            handleDrop(binId);
        }

        setTouchStart(null);
    };

    const currentItem = gameItems[currentItemIndex];

    // MENU
    if (gameState === 'menu') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-card border border-border shadow-card p-8 max-w-md w-full text-center"
                >
                    <div className="text-7xl mb-4">🗑️</div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Atığı Doğru Kutuya At!</h1>
                    <p className="text-text-muted mb-6">
                        20 atığı doğru kutulara sürükle ve bırak!<br />
                        <span className="text-sm">3 canın var, dikkatli ol!</span>
                    </p>

                    {highScore > 0 && (
                        <div className="bg-secondary-soft rounded-lg p-3 mb-6 flex items-center justify-center gap-2">
                            <Trophy className="text-secondary" size={20} />
                            <span className="font-bold text-secondary-700">En Yüksek Skor: {highScore}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-4 gap-2 mb-6">
                        {BINS.map(bin => (
                            <div key={bin.id} className={`p-3 rounded-lg ${bin.bgColor} text-center`}>
                                <span className="text-2xl">{bin.emoji}</span>
                                <p className={`text-xs font-medium ${bin.color} mt-1`}>{bin.name}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={startGame}
                        className="w-full py-4 bg-gradient-to-r from-primary to-primary-600 text-white font-bold text-lg rounded-button shadow-soft hover:shadow-card transition-all flex items-center justify-center gap-2"
                    >
                        <Zap size={20} />
                        Oyuna Başla
                    </button>

                    <button
                        onClick={onBack}
                        className="mt-4 text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={16} />
                        Oyunlara Dön
                    </button>
                </motion.div>
            </div>
        );
    }

    // KAZANDIN (WIN)
    if (gameState === 'win') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-card border border-border shadow-card p-8 max-w-md w-full text-center"
                >
                    <div className="text-7xl mb-4">🎉</div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Tebrikler!</h1>
                    <p className="text-text-muted mb-6">
                        20 atığın hepsini başarıyla tamamladın!<br />
                        <span className="text-primary font-medium">Harika bir çevre kahramanısın! 🌍</span>
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-primary-soft rounded-xl p-4">
                            <div className="text-3xl font-bold text-primary">{score}</div>
                            <div className="text-sm text-primary-700">Toplam Puan</div>
                        </div>
                        <div className="bg-secondary-soft rounded-xl p-4">
                            <div className="text-3xl font-bold text-secondary">{correctCount}/20</div>
                            <div className="text-sm text-secondary-700">Doğru Cevap</div>
                        </div>
                    </div>

                    {score >= highScore && score > 0 && (
                        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg p-3 mb-6 flex items-center justify-center gap-2 border border-yellow-200">
                            <Star className="text-yellow-500 fill-yellow-500" size={20} />
                            <span className="font-bold text-yellow-700">🏆 Yeni Rekor!</span>
                            <Star className="text-yellow-500 fill-yellow-500" size={20} />
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={startGame}
                            className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-button flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={18} />
                            Tekrar Oyna
                        </button>
                        <button
                            onClick={onBack}
                            className="flex-1 py-3 bg-background-subtle text-text-secondary font-bold rounded-button flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Çık
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // KAYBETTİN (LOSE)
    if (gameState === 'lose') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-card border border-border shadow-card p-8 max-w-md w-full text-center"
                >
                    <div className="text-7xl mb-4">💪</div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Üzülme!</h1>
                    <p className="text-text-muted mb-6">
                        Bu sefer olmadı ama bir dahaki sefere<br />
                        <span className="text-primary font-medium">mutlaka başaracaksın! 🌱</span>
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-primary-soft rounded-xl p-4">
                            <div className="text-3xl font-bold text-primary">{score}</div>
                            <div className="text-sm text-primary-700">Toplam Puan</div>
                        </div>
                        <div className="bg-secondary-soft rounded-xl p-4">
                            <div className="text-3xl font-bold text-secondary">{correctCount}/20</div>
                            <div className="text-sm text-secondary-700">Doğru Cevap</div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-blue-700 font-medium mb-2">💡 İpucu:</p>
                        <p className="text-sm text-blue-600">
                            Organik atıklar (meyve kabukları, kahve) → Kompost 🌱<br />
                            Plastik, cam, metal → Geri Dönüşüm ♻️<br />
                            Kağıt, karton → Kağıt 📦<br />
                            Geri dönüştürülemeyen → Çöp 🚫
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={startGame}
                            className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-button flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={18} />
                            Tekrar Dene
                        </button>
                        <button
                            onClick={onBack}
                            className="flex-1 py-3 bg-background-subtle text-text-secondary font-bold rounded-button flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Çık
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // PLAYING
    return (
        <div className="min-h-[70vh] p-4 max-w-2xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-card border border-border shadow-card p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Trophy className="text-secondary" size={20} />
                            <span className="font-bold text-text-primary">{score}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {[...Array(3)].map((_, i) => (
                                <Heart
                                    key={i}
                                    size={20}
                                    className={i < lives ? 'fill-red-500 text-red-500' : 'text-gray-300'}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="text-sm text-text-muted font-medium">
                        {currentItemIndex + 1} / 20
                    </div>
                    <button onClick={onBack} className="text-text-muted hover:text-primary">
                        <ArrowLeft size={20} />
                    </button>
                </div>
                {/* Progress Bar */}
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentItemIndex) / 20) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                {streak >= 3 && (
                    <div className="mt-2 text-center text-sm font-bold text-orange-500">
                        🔥 {streak} Seri! +5 Bonus
                    </div>
                )}
            </div>

            {/* Current Item */}
            <div className="text-center mb-8">
                <AnimatePresence mode="wait">
                    {currentItem && (
                        <motion.div
                            key={currentItem.id + currentItemIndex}
                            initial={{ opacity: 0, y: -20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            ref={itemRef}
                            draggable
                            onDragStart={handleDragStart}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            className="inline-block bg-white rounded-card border-2 border-dashed border-primary p-6 cursor-grab active:cursor-grabbing shadow-card hover:shadow-hover transition-all select-none"
                        >
                            <span className="text-6xl block mb-2">{currentItem.emoji}</span>
                            <span className="text-lg font-bold text-text-primary">{currentItem.name}</span>
                            <p className="text-xs text-text-muted mt-1">Sürükle ve bırak!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Feedback */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`text-center mb-4 p-3 rounded-lg font-bold flex items-center justify-center gap-2 ${feedback.type === 'correct'
                                ? 'bg-primary-soft text-primary-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                    >
                        {feedback.type === 'correct' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        {feedback.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bins */}
            <div className="grid grid-cols-4 gap-3">
                {BINS.map(bin => (
                    <div
                        key={bin.id}
                        data-bin={bin.id}
                        onDragOver={(e) => handleDragOver(e, bin.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={() => handleDrop(bin.id)}
                        className={`
                            p-4 rounded-card border-2 transition-all text-center
                            ${bin.bgColor} ${bin.borderColor}
                            ${draggedOver === bin.id ? 'scale-105 shadow-lg border-4' : 'border-dashed'}
                        `}
                    >
                        <span className="text-4xl block mb-2">{bin.emoji}</span>
                        <span className={`text-sm font-bold ${bin.color}`}>{bin.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WasteSortGame;
