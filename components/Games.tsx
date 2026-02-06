import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Star, Zap, ArrowLeft, Lock, Sparkles, Target, Brain, Recycle } from 'lucide-react';
import { Link } from 'react-router-dom';
import WasteSortGame from './games/WasteSortGame';
import CompostQuiz from './games/CompostQuiz';
import MemoryGame from './games/MemoryGame';

// Oyun kartı tipi
interface Game {
    id: string;
    title: string;
    description: string;
    emoji: string;
    color: string;
    bgGradient: string;
    difficulty: 'easy' | 'medium' | 'hard';
    isLocked: boolean;
    comingSoon?: boolean;
}

// Mevcut oyunlar - Site renk temasına uygun
const GAMES: Game[] = [
    {
        id: 'waste-sort',
        title: 'Atığı Doğru Kutuya At',
        description: 'Atıkları doğru geri dönüşüm kutularına sürükle ve bırak!',
        emoji: '🗑️',
        color: 'text-primary',
        bgGradient: 'from-primary to-primary-600',
        difficulty: 'easy',
        isLocked: false
    },
    {
        id: 'compost-quiz',
        title: 'Kompost Bilgi Yarışması',
        description: 'Kompost hakkında ne kadar bilgilisin? Test et!',
        emoji: '🧠',
        color: 'text-secondary',
        bgGradient: 'from-secondary to-secondary-600',
        difficulty: 'medium',
        isLocked: false
    },
    {
        id: 'eco-memory',
        title: 'Çevre Hafıza Oyunu',
        description: 'Kartları eşleştirerek çevre bilgini pekiştir!',
        emoji: '🃏',
        color: 'text-primary-600',
        bgGradient: 'from-primary to-primary-600',
        difficulty: 'easy',
        isLocked: false
    },
    {
        id: 'speed-recycle',
        title: 'Hızlı Geri Dönüşüm',
        description: 'Zamana karşı yarış! Atıkları hızlıca sınıflandır.',
        emoji: '⚡',
        color: 'text-secondary-600',
        bgGradient: 'from-secondary to-secondary-600',
        difficulty: 'hard',
        isLocked: true,
        comingSoon: true
    },
    {
        id: 'eco-builder',
        title: 'Eko Şehir Kurucu',
        description: 'Sürdürülebilir bir şehir inşa et!',
        emoji: '🏙️',
        color: 'text-primary',
        bgGradient: 'from-primary to-green-600',
        difficulty: 'hard',
        isLocked: true,
        comingSoon: true
    },
    {
        id: 'carbon-calculator-game',
        title: 'Karbon Avcısı',
        description: 'CO₂ emisyonlarını azaltarak puan topla!',
        emoji: '🌍',
        color: 'text-primary',
        bgGradient: 'from-primary to-primary-600',
        difficulty: 'medium',
        isLocked: true,
        comingSoon: true
    }
];

const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
        case 'easy': return { label: 'Kolay', color: 'bg-primary-soft text-primary-700', stars: 1 };
        case 'medium': return { label: 'Orta', color: 'bg-secondary-soft text-secondary-700', stars: 2 };
        case 'hard': return { label: 'Zor', color: 'bg-red-50 text-status-error', stars: 3 };
        default: return { label: 'Kolay', color: 'bg-primary-soft text-primary-700', stars: 1 };
    }
};

const Games: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    const handlePlayGame = (gameId: string) => {
        const game = GAMES.find(g => g.id === gameId);
        if (game && !game.isLocked) {
            setSelectedGame(gameId);
        }
    };

    // Atığı Doğru Kutuya At oyunu
    if (selectedGame === 'waste-sort') {
        return (
            <div className="min-h-screen bg-background-base py-12 px-4">
                <WasteSortGame onBack={() => setSelectedGame(null)} />
            </div>
        );
    }

    // Kompost Bilgi Yarışması
    if (selectedGame === 'compost-quiz') {
        return (
            <div className="min-h-screen bg-background-base py-12 px-4">
                <CompostQuiz onBack={() => setSelectedGame(null)} />
            </div>
        );
    }

    // Çevre Hafıza Oyunu
    if (selectedGame === 'eco-memory') {
        return (
            <div className="min-h-screen bg-background-base py-12 px-4">
                <MemoryGame onBack={() => setSelectedGame(null)} />
            </div>
        );
    }

    // Diğer oyunlar için placeholder
    if (selectedGame) {
        const game = GAMES.find(g => g.id === selectedGame);
        return (
            <div className="min-h-screen bg-background-base py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => setSelectedGame(null)}
                        className="flex items-center text-text-muted hover:text-primary mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Oyunlara Dön
                    </button>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-card border border-border shadow-card p-8 text-center"
                    >
                        <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${game?.bgGradient} flex items-center justify-center text-5xl shadow-lg`}>
                            {game?.emoji}
                        </div>
                        <h1 className="text-3xl font-bold text-text-primary mb-4">{game?.title}</h1>
                        <p className="text-text-secondary mb-8">{game?.description}</p>

                        <div className="bg-primary-soft rounded-xl p-6 mb-6">
                            <Sparkles className="mx-auto text-primary mb-3" size={32} />
                            <p className="text-primary-700 font-medium">
                                Bu oyun yakında aktif olacak! 🎮
                            </p>
                            <p className="text-sm text-primary-600 mt-2">
                                Oyun geliştirme aşamasında. Çok yakında burada olacak!
                            </p>
                        </div>

                        <button
                            onClick={() => setSelectedGame(null)}
                            className="px-6 py-3 bg-primary text-white font-bold rounded-button hover:bg-primary-600 transition-colors"
                        >
                            Diğer Oyunlara Göz At
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-base py-12 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center space-x-2 bg-primary-soft text-primary-700 px-4 py-2 rounded-pill text-sm font-semibold mb-4">
                        <Gamepad2 size={16} />
                        <span>Eğlenerek Öğren</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
                        Oyun <span className="text-primary">Zamanı!</span> 🎮
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Çevre ve geri dönüşüm hakkında eğlenceli oyunlarla bilgini test et ve yeni şeyler öğren!
                    </p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-3 gap-4 mb-12"
                >
                    <div className="bg-white rounded-card border border-border p-4 text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-secondary-soft flex items-center justify-center text-secondary">
                            <Trophy size={24} />
                        </div>
                        <div className="text-2xl font-bold text-text-primary">{GAMES.filter(g => !g.isLocked).length}</div>
                        <div className="text-sm text-text-muted">Aktif Oyun</div>
                    </div>
                    <div className="bg-white rounded-card border border-border p-4 text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary-soft flex items-center justify-center text-primary">
                            <Target size={24} />
                        </div>
                        <div className="text-2xl font-bold text-text-primary">{GAMES.length}</div>
                        <div className="text-sm text-text-muted">Toplam Oyun</div>
                    </div>
                    <div className="bg-white rounded-card border border-border p-4 text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-secondary-soft flex items-center justify-center text-secondary-600">
                            <Star size={24} />
                        </div>
                        <div className="text-2xl font-bold text-text-primary">0</div>
                        <div className="text-sm text-text-muted">Kazanılan Yıldız</div>
                    </div>
                </motion.div>

                {/* Games Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GAMES.map((game, index) => {
                        const difficultyInfo = getDifficultyLabel(game.difficulty);
                        return (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`group relative bg-white rounded-card border border-border shadow-card hover:shadow-hover transition-all overflow-hidden ${game.isLocked ? 'opacity-75' : ''}`}
                            >
                                {/* Header with gradient */}
                                <div className={`h-32 bg-gradient-to-br ${game.bgGradient} flex items-center justify-center relative`}>
                                    <span className="text-6xl group-hover:scale-110 transition-transform">
                                        {game.emoji}
                                    </span>
                                    {game.isLocked && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <Lock size={32} className="text-white" />
                                        </div>
                                    )}
                                    {game.comingSoon && (
                                        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-pill">
                                            Yakında
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className={`text-lg font-bold ${game.color}`}>
                                            {game.title}
                                        </h3>
                                        <span className={`px-2 py-1 rounded-pill text-xs font-bold ${difficultyInfo.color}`}>
                                            {difficultyInfo.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-muted mb-4">
                                        {game.description}
                                    </p>

                                    {/* Difficulty Stars */}
                                    <div className="flex items-center gap-1 mb-4">
                                        {[1, 2, 3].map((star) => (
                                            <Star
                                                key={star}
                                                size={14}
                                                className={star <= difficultyInfo.stars ? 'text-secondary fill-secondary' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>

                                    {/* Play Button */}
                                    <button
                                        onClick={() => handlePlayGame(game.id)}
                                        disabled={game.isLocked}
                                        className={`w-full py-3 rounded-button font-bold flex items-center justify-center gap-2 transition-all ${game.isLocked
                                            ? 'bg-background-subtle text-text-muted cursor-not-allowed'
                                            : `bg-gradient-to-r ${game.bgGradient} text-white hover:shadow-lg hover:scale-[1.02]`
                                            }`}
                                    >
                                        {game.isLocked ? (
                                            <>
                                                <Lock size={16} />
                                                Kilitli
                                            </>
                                        ) : (
                                            <>
                                                <Zap size={16} />
                                                Oyna
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Back to Guide */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <Link
                        to="/guide"
                        className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Atık Rehberine Dön
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Games;
