import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, RotateCcw, Star, Zap, CheckCircle } from 'lucide-react';

interface Card {
    id: number;
    emoji: string;
    name: string;
    isFlipped: boolean;
    isMatched: boolean;
}

// Kart çiftleri
const CARD_PAIRS = [
    { emoji: '♻️', name: 'Geri Dönüşüm' },
    { emoji: '🌱', name: 'Kompost' },
    { emoji: '🌍', name: 'Dünya' },
    { emoji: '💧', name: 'Su Damlası' },
    { emoji: '🌳', name: 'Ağaç' },
    { emoji: '☀️', name: 'Güneş Enerjisi' },
    { emoji: '🍃', name: 'Yaprak' },
    { emoji: '🐝', name: 'Arı' }
];

interface MemoryGameProps {
    onBack: () => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [score, setScore] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('memoryGameHighScore');
        return saved ? parseInt(saved) : 0;
    });
    const [bestMoves, setBestMoves] = useState(() => {
        const saved = localStorage.getItem('memoryGameBestMoves');
        return saved ? parseInt(saved) : 999;
    });

    // Kartları karıştır ve başlat
    const initializeGame = useCallback(() => {
        const gameCards: Card[] = [];

        // Her çiftten 2 kart oluştur
        CARD_PAIRS.forEach((pair, index) => {
            gameCards.push({
                id: index * 2,
                emoji: pair.emoji,
                name: pair.name,
                isFlipped: false,
                isMatched: false
            });
            gameCards.push({
                id: index * 2 + 1,
                emoji: pair.emoji,
                name: pair.name,
                isFlipped: false,
                isMatched: false
            });
        });

        // Kartları karıştır
        const shuffled = gameCards.sort(() => Math.random() - 0.5);

        setCards(shuffled);
        setFlippedCards([]);
        setMoves(0);
        setMatches(0);
        setScore(0);
        setIsChecking(false);
        setGameState('playing');
    }, []);

    // Kart tıklama
    const handleCardClick = (cardId: number) => {
        if (isChecking) return; // Kontrol yapılırken tıklama engelle
        if (flippedCards.length >= 2) return; // Zaten 2 kart açık
        if (flippedCards.includes(cardId)) return; // Aynı kart

        const card = cards.find(c => c.id === cardId);
        if (!card || card.isMatched || card.isFlipped) return;

        // Kartı çevir
        setCards(prev => prev.map(c =>
            c.id === cardId ? { ...c, isFlipped: true } : c
        ));

        const newFlipped = [...flippedCards, cardId];
        setFlippedCards(newFlipped);

        // 2 kart açıldıysa kontrol et
        if (newFlipped.length === 2) {
            setMoves(prev => prev + 1);
            setIsChecking(true);

            const [firstId, secondId] = newFlipped;
            const firstCard = cards.find(c => c.id === firstId);
            const secondCard = cards.find(c => c.id === secondId);

            if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
                // Eşleşme!
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === firstId || c.id === secondId
                            ? { ...c, isMatched: true }
                            : c
                    ));
                    setMatches(prev => prev + 1);
                    setScore(prev => prev + 20);
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 500);
            } else {
                // Eşleşme yok
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === firstId || c.id === secondId
                            ? { ...c, isFlipped: false }
                            : c
                    ));
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    };

    // Oyun bitişi kontrolü
    useEffect(() => {
        if (matches === CARD_PAIRS.length && gameState === 'playing') {
            // Bonus puan hesapla (az hamle = daha fazla bonus)
            const minMoves = CARD_PAIRS.length; // En az 8 hamle
            const bonusMoves = Math.max(0, 24 - moves); // 24'ten az hamle için bonus
            const bonusScore = bonusMoves * 5;
            const finalScore = score + bonusScore;

            setScore(finalScore);

            // High score güncelle
            if (finalScore > highScore) {
                setHighScore(finalScore);
                localStorage.setItem('memoryGameHighScore', finalScore.toString());
            }

            // Best moves güncelle
            if (moves < bestMoves) {
                setBestMoves(moves);
                localStorage.setItem('memoryGameBestMoves', moves.toString());
            }

            setTimeout(() => {
                setGameState('result');
            }, 500);
        }
    }, [matches, gameState, moves, score, highScore, bestMoves]);

    // Performans değerlendirmesi
    const getPerformanceMessage = () => {
        if (moves <= 10) return { emoji: '🏆', title: 'Mükemmel Hafıza!', message: 'İnanılmaz! Çok az hamle kullandın!' };
        if (moves <= 14) return { emoji: '🌟', title: 'Harika!', message: 'Hafızan çok güçlü!' };
        if (moves <= 18) return { emoji: '👍', title: 'İyi!', message: 'Güzel oynadın!' };
        if (moves <= 24) return { emoji: '💪', title: 'Fena Değil!', message: 'Biraz daha pratik yap!' };
        return { emoji: '🎮', title: 'Tamamlandı!', message: 'Tekrar deneyerek gelişebilirsin!' };
    };

    // MENU
    if (gameState === 'menu') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-card border border-border shadow-card p-8 max-w-md w-full text-center"
                >
                    <div className="text-7xl mb-4">🃏</div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Çevre Hafıza Oyunu</h1>
                    <p className="text-text-muted mb-6">
                        Eşleşen çevre kartlarını bul!<br />
                        <span className="text-sm">8 çift, 16 kart</span>
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {highScore > 0 && (
                            <div className="bg-secondary-soft rounded-lg p-3 flex items-center justify-center gap-2">
                                <Trophy className="text-secondary" size={18} />
                                <span className="font-bold text-secondary-700 text-sm">Rekor: {highScore}</span>
                            </div>
                        )}
                        {bestMoves < 999 && (
                            <div className="bg-primary-soft rounded-lg p-3 flex items-center justify-center gap-2">
                                <Zap className="text-primary" size={18} />
                                <span className="font-bold text-primary-700 text-sm">En Az: {bestMoves} hamle</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {CARD_PAIRS.map((pair, i) => (
                            <div key={i} className="w-10 h-10 bg-primary-soft rounded-lg flex items-center justify-center text-xl">
                                {pair.emoji}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={initializeGame}
                        className="w-full py-4 bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-bold text-lg rounded-button shadow-soft hover:shadow-card transition-all flex items-center justify-center gap-2"
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

    // RESULT
    if (gameState === 'result') {
        const performance = getPerformanceMessage();
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-card border border-border shadow-card p-8 max-w-md w-full text-center"
                >
                    <div className="text-7xl mb-4">{performance.emoji}</div>
                    <h1 className="text-3xl font-bold text-primary mb-2">{performance.title}</h1>
                    <p className="text-text-muted mb-6">{performance.message}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-primary-soft rounded-xl p-4">
                            <div className="text-3xl font-bold text-primary">{score}</div>
                            <div className="text-sm text-primary-700">Toplam Puan</div>
                        </div>
                        <div className="bg-secondary-soft rounded-xl p-4">
                            <div className="text-3xl font-bold text-secondary">{moves}</div>
                            <div className="text-sm text-secondary-700">Hamle</div>
                        </div>
                    </div>

                    {(score >= highScore || moves <= bestMoves) && (
                        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg p-3 mb-6 flex items-center justify-center gap-2 border border-yellow-200">
                            <Star className="text-yellow-500 fill-yellow-500" size={20} />
                            <span className="font-bold text-yellow-700">
                                {score >= highScore ? '🏆 Yeni Puan Rekoru!' : '⚡ En Az Hamle!'}
                            </span>
                            <Star className="text-yellow-500 fill-yellow-500" size={20} />
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={initializeGame}
                            className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-bold rounded-button flex items-center justify-center gap-2"
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

    // PLAYING
    return (
        <div className="min-h-[70vh] p-4 max-w-lg mx-auto">
            {/* Header */}
            <div className="bg-white rounded-card border border-border shadow-card p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Trophy className="text-secondary" size={20} />
                            <span className="font-bold text-text-primary">{score}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-text-muted text-sm">Hamle:</span>
                            <span className="font-bold text-text-primary">{moves}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="text-primary" size={18} />
                        <span className="font-medium text-primary">{matches}/{CARD_PAIRS.length}</span>
                    </div>
                    <button onClick={onBack} className="text-text-muted hover:text-primary">
                        <ArrowLeft size={20} />
                    </button>
                </div>
                {/* Progress Bar */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary-600 to-emerald-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(matches / CARD_PAIRS.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-4 gap-3">
                {cards.map(card => (
                    <motion.div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={`
                            aspect-square rounded-xl cursor-pointer relative
                            ${card.isMatched ? 'opacity-50' : ''}
                        `}
                        whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
                        whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
                    >
                        <AnimatePresence mode="wait">
                            {card.isFlipped || card.isMatched ? (
                                <motion.div
                                    key="front"
                                    initial={{ rotateY: 90 }}
                                    animate={{ rotateY: 0 }}
                                    exit={{ rotateY: 90 }}
                                    transition={{ duration: 0.2 }}
                                    className={`
                                        absolute inset-0 rounded-xl flex items-center justify-center text-4xl
                                        ${card.isMatched
                                            ? 'bg-primary-soft border-2 border-primary'
                                            : 'bg-white border-2 border-primary shadow-card'
                                        }
                                    `}
                                >
                                    {card.emoji}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="back"
                                    initial={{ rotateY: -90 }}
                                    animate={{ rotateY: 0 }}
                                    exit={{ rotateY: -90 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600 to-emerald-600 flex items-center justify-center text-white text-2xl shadow-card"
                                >
                                    ❓
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Restart Button */}
            <div className="mt-6 text-center">
                <button
                    onClick={initializeGame}
                    className="text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto text-sm"
                >
                    <RotateCcw size={14} />
                    Yeniden Başlat
                </button>
            </div>
        </div>
    );
};

export default MemoryGame;
