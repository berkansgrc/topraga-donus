import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw, Lightbulb, Star, Brain } from 'lucide-react';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

// 15 Kompost Sorusu
const QUESTIONS: Question[] = [
    {
        id: 1,
        question: "Hangisi kompost yapılabilir?",
        options: ["Plastik şişe", "Muz kabuğu", "Cam bardak", "Metal kutu"],
        correctIndex: 1,
        explanation: "Muz kabuğu organik atıktır ve kompost için mükemmeldir! Potasyum açısından zengindir."
    },
    {
        id: 2,
        question: "Kompost ne kadar sürede olgunlaşır?",
        options: ["1-2 hafta", "2-6 ay", "1-2 yıl", "5-10 yıl"],
        correctIndex: 1,
        explanation: "Doğru koşullarda kompost 2-6 ayda olgunlaşır. Sıcaklık ve nem önemlidir."
    },
    {
        id: 3,
        question: "Hangisi kompost için uygun DEĞİLDİR?",
        options: ["Yumurta kabuğu", "Kahve telvesi", "Et parçaları", "Kuru yaprak"],
        correctIndex: 2,
        explanation: "Et parçaları kötü koku yapar, zararlı bakteriler üretir ve haşere çeker. Asla kompost yapmayın!"
    },
    {
        id: 4,
        question: "Yeşil malzemeler kompost için ne sağlar?",
        options: ["Karbon", "Azot", "Kalsiyum", "Demir"],
        correctIndex: 1,
        explanation: "Yeşil malzemeler (taze çim, sebze artıkları) azot sağlar ve çürümeyi hızlandırır."
    },
    {
        id: 5,
        question: "Kahverengi malzemeler kompost için ne sağlar?",
        options: ["Azot", "Karbon", "Fosfor", "Potasyum"],
        correctIndex: 1,
        explanation: "Kahverengi malzemeler (kuru yaprak, karton) karbon sağlar ve yapıya katkıda bulunur."
    },
    {
        id: 6,
        question: "Kompost için ideal Karbon:Azot (C:N) oranı nedir?",
        options: ["10:1", "30:1", "50:1", "100:1"],
        correctIndex: 1,
        explanation: "30:1 oranı ideal çürüme sağlar. Çok fazla karbon yavaşlatır, çok fazla azot koku yapar."
    },
    {
        id: 7,
        question: "Kompost yığını ne sıklıkla karıştırılmalı?",
        options: ["Her gün", "Haftada 1-2 kez", "Ayda 1 kez", "Hiç karıştırılmaz"],
        correctIndex: 1,
        explanation: "Haftada 1-2 kez karıştırmak havalandırma sağlar ve çürümeyi hızlandırır."
    },
    {
        id: 8,
        question: "Hangi hayvan gübresi kompost için uygundur?",
        options: ["Kedi dışkısı", "Köpek dışkısı", "Tavuk gübresi", "Hiçbiri"],
        correctIndex: 2,
        explanation: "Tavuk gübresi mükemmel bir azot kaynağıdır. Kedi/köpek dışkısı zararlı parazitler içerir."
    },
    {
        id: 9,
        question: "Kompost yığını çok kötü koku yapıyorsa ne yapmalı?",
        options: ["Daha fazla su ekle", "Kahverengi malzeme ekle", "Daha fazla et at", "Güneşe koy"],
        correctIndex: 1,
        explanation: "Kötü koku genellikle çok fazla azottan kaynaklanır. Kahverengi malzeme ekleyerek dengeyi sağlayın."
    },
    {
        id: 10,
        question: "Hangisi 'yeşil' malzeme sayılır?",
        options: ["Kuru yaprak", "Gazete", "Meyve kabukları", "Karton"],
        correctIndex: 2,
        explanation: "Meyve kabukları taze ve nemli oldukları için 'yeşil' malzeme sayılır ve azot sağlar."
    },
    {
        id: 11,
        question: "Kompost yığını için ideal nem oranı nedir?",
        options: ["Kuru kum gibi", "Sıkılmış sünger gibi", "Su birikintisi gibi", "Islak çamur gibi"],
        correctIndex: 1,
        explanation: "İdeal nem, sıkıldığında birkaç damla su çıkaran sünger gibi olmalıdır."
    },
    {
        id: 12,
        question: "Hangisi kompost olgunlaştığının işaretidir?",
        options: ["Kötü koku", "Toprak kokusu", "Sinek kaynağı", "Isı yayması"],
        correctIndex: 1,
        explanation: "Olgun kompost hoş bir toprak kokusu yapar, koyu kahverengi ve ufalanan bir dokuya sahiptir."
    },
    {
        id: 13,
        question: "Yumurta kabukları neden kompost için faydalıdır?",
        options: ["Azot sağlar", "Kalsiyum sağlar", "Nem tutar", "Isı üretir"],
        correctIndex: 1,
        explanation: "Ezilmiş yumurta kabukları kalsiyum sağlar ve toprak pH'ını dengeler."
    },
    {
        id: 14,
        question: "Kompost kutusuna hangisi eklenmemeli?",
        options: ["Çay poşeti", "Kahve filtresi", "Renkli gazete", "Yemek artığı"],
        correctIndex: 2,
        explanation: "Renkli mürekkepler zararlı kimyasallar içerebilir. Siyah-beyaz gazete güvenlidir."
    },
    {
        id: 15,
        question: "Kompost yapmanın çevreye en büyük faydası nedir?",
        options: ["Güzel koku verir", "Çöp miktarını azaltır", "Enerji üretir", "Su tasarrufu sağlar"],
        correctIndex: 1,
        explanation: "Kompost, çöp miktarını %30 azaltır ve doğal gübre üretir. Bu da sera gazı emisyonlarını düşürür!"
    }
];

interface CompostQuizProps {
    onBack: () => void;
}

const CompostQuiz: React.FC<CompostQuizProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('compostQuizHighScore');
        return saved ? parseInt(saved) : 0;
    });

    // Oyunu başlat
    const startGame = useCallback(() => {
        const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
        setShuffledQuestions(shuffled);
        setCurrentQuestionIndex(0);
        setScore(0);
        setCorrectAnswers(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setGameState('playing');
    }, []);

    // Cevap seç
    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return; // Zaten cevaplandı

        setSelectedAnswer(index);
        setShowExplanation(true);

        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        if (index === currentQuestion.correctIndex) {
            setScore(prev => prev + 10);
            setCorrectAnswers(prev => prev + 1);
        }
    };

    // Sonraki soru
    const nextQuestion = () => {
        if (currentQuestionIndex + 1 >= shuffledQuestions.length) {
            // Oyun bitti
            const finalScore = score;
            if (finalScore > highScore) {
                setHighScore(finalScore);
                localStorage.setItem('compostQuizHighScore', finalScore.toString());
            }
            setGameState('result');
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        }
    };

    const currentQuestion = shuffledQuestions[currentQuestionIndex];

    // Performans değerlendirmesi
    const getPerformanceMessage = () => {
        const percentage = (correctAnswers / QUESTIONS.length) * 100;
        if (percentage === 100) return { emoji: '🏆', title: 'Mükemmel!', message: 'Kompost uzmanısın!' };
        if (percentage >= 80) return { emoji: '🌟', title: 'Harika!', message: 'Çok iyi biliyorsun!' };
        if (percentage >= 60) return { emoji: '👍', title: 'İyi!', message: 'Biraz daha pratik yap!' };
        if (percentage >= 40) return { emoji: '💪', title: 'Fena Değil!', message: 'Öğrenmeye devam!' };
        return { emoji: '📚', title: 'Öğrenmeye Devam!', message: 'Kompost Lab\'a göz at!' };
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
                    <div className="text-7xl mb-4">🧠</div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Kompost Bilgi Yarışması</h1>
                    <p className="text-text-muted mb-6">
                        15 soru ile kompost bilgini test et!<br />
                        <span className="text-sm">Her doğru cevap 10 puan</span>
                    </p>

                    {highScore > 0 && (
                        <div className="bg-secondary-soft rounded-lg p-3 mb-6 flex items-center justify-center gap-2">
                            <Trophy className="text-secondary" size={20} />
                            <span className="font-bold text-secondary-700">En Yüksek Skor: {highScore}</span>
                        </div>
                    )}

                    <div className="bg-primary-soft rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-primary-700 font-medium mb-2">📋 Nasıl Oynanır:</p>
                        <ul className="text-sm text-primary-600 space-y-1">
                            <li>• 15 çoktan seçmeli soru</li>
                            <li>• Süre sınırı yok, rahatça düşün</li>
                            <li>• Her cevap sonrası açıklama</li>
                            <li>• Doğru: +10 puan</li>
                        </ul>
                    </div>

                    <button
                        onClick={startGame}
                        className="w-full py-4 bg-gradient-to-r from-secondary to-secondary-600 text-white font-bold text-lg rounded-button shadow-soft hover:shadow-card transition-all flex items-center justify-center gap-2"
                    >
                        <Brain size={20} />
                        Yarışmaya Başla
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
                    <h1 className="text-3xl font-bold text-secondary mb-2">{performance.title}</h1>
                    <p className="text-text-muted mb-6">{performance.message}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-secondary-soft rounded-xl p-4">
                            <div className="text-3xl font-bold text-secondary">{score}</div>
                            <div className="text-sm text-secondary-700">Toplam Puan</div>
                        </div>
                        <div className="bg-primary-soft rounded-xl p-4">
                            <div className="text-3xl font-bold text-primary">{correctAnswers}/{QUESTIONS.length}</div>
                            <div className="text-sm text-primary-700">Doğru Cevap</div>
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
                            className="flex-1 py-3 bg-gradient-to-r from-secondary to-secondary-600 text-white font-bold rounded-button flex items-center justify-center gap-2"
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
        <div className="min-h-[70vh] p-4 max-w-2xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-card border border-border shadow-card p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Brain className="text-secondary" size={20} />
                        <span className="text-sm font-medium text-text-muted">
                            Soru {currentQuestionIndex + 1}/{shuffledQuestions.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Trophy className="text-secondary" size={20} />
                        <span className="font-bold text-text-primary">{score}</span>
                    </div>
                    <button onClick={onBack} className="text-text-muted hover:text-primary">
                        <ArrowLeft size={20} />
                    </button>
                </div>
                {/* Progress Bar */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-secondary to-secondary-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestionIndex) / shuffledQuestions.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                {currentQuestion && (
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-card border border-border shadow-card p-6 mb-6"
                    >
                        <h2 className="text-xl font-bold text-text-primary mb-6">
                            {currentQuestion.question}
                        </h2>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswer === index;
                                const isCorrect = index === currentQuestion.correctIndex;
                                const showResult = selectedAnswer !== null;

                                let bgClass = 'bg-background-subtle hover:bg-primary-soft';
                                let borderClass = 'border-transparent';
                                let textClass = 'text-text-primary';

                                if (showResult) {
                                    if (isCorrect) {
                                        bgClass = 'bg-primary-soft';
                                        borderClass = 'border-primary';
                                        textClass = 'text-primary-700';
                                    } else if (isSelected && !isCorrect) {
                                        bgClass = 'bg-red-50';
                                        borderClass = 'border-red-400';
                                        textClass = 'text-red-700';
                                    } else {
                                        bgClass = 'bg-gray-50';
                                        textClass = 'text-gray-400';
                                    }
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswer(index)}
                                        disabled={selectedAnswer !== null}
                                        className={`w-full p-4 rounded-lg border-2 ${borderClass} ${bgClass} ${textClass} text-left transition-all flex items-center justify-between ${selectedAnswer === null ? 'cursor-pointer' : 'cursor-default'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-sm font-bold">
                                                {String.fromCharCode(65 + index)}
                                            </span>
                                            <span className="font-medium">{option}</span>
                                        </div>
                                        {showResult && isCorrect && (
                                            <CheckCircle className="text-primary" size={24} />
                                        )}
                                        {showResult && isSelected && !isCorrect && (
                                            <XCircle className="text-red-500" size={24} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Explanation */}
            <AnimatePresence>
                {showExplanation && currentQuestion && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`rounded-lg p-4 mb-6 flex items-start gap-3 ${selectedAnswer === currentQuestion.correctIndex
                                ? 'bg-primary-soft border border-primary'
                                : 'bg-blue-50 border border-blue-200'
                            }`}
                    >
                        <Lightbulb className={selectedAnswer === currentQuestion.correctIndex ? 'text-primary' : 'text-blue-500'} size={24} />
                        <div>
                            <p className={`font-bold mb-1 ${selectedAnswer === currentQuestion.correctIndex ? 'text-primary-700' : 'text-blue-700'}`}>
                                {selectedAnswer === currentQuestion.correctIndex ? '✅ Doğru!' : '💡 Bilgi:'}
                            </p>
                            <p className={selectedAnswer === currentQuestion.correctIndex ? 'text-primary-600' : 'text-blue-600'}>
                                {currentQuestion.explanation}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Next Button */}
            {showExplanation && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <button
                        onClick={nextQuestion}
                        className="px-8 py-3 bg-gradient-to-r from-secondary to-secondary-600 text-white font-bold rounded-button shadow-soft hover:shadow-card transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                        {currentQuestionIndex + 1 >= shuffledQuestions.length ? 'Sonuçları Gör' : 'Sonraki Soru'}
                        <ArrowRight size={18} />
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default CompostQuiz;
