import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Droplets, Eye, Wind, AlertCircle, CheckCircle, RefreshCw, ChevronRight, Leaf, Bug } from 'lucide-react';

interface Question {
    id: string;
    question: string;
    icon: React.ReactNode;
    options: {
        value: string;
        label: string;
        emoji: string;
        score: number;
        feedback: string;
    }[];
}

const QUESTIONS: Question[] = [
    {
        id: 'smell',
        question: 'Kompostun kokusu nasıl?',
        icon: <Wind size={20} />,
        options: [
            { value: 'earthy', label: 'Toprak gibi, hoş', emoji: '🌿', score: 3, feedback: 'Mükemmel! Sağlıklı kompost kokusu.' },
            { value: 'none', label: 'Koku yok', emoji: '😐', score: 2, feedback: 'İyi, daha fazla yeşil malzeme ekleyebilirsin.' },
            { value: 'ammonia', label: 'Keskin/Amonyak', emoji: '😷', score: 1, feedback: 'Çok fazla azot! Kahverengi malzeme ekle.' },
            { value: 'rotten', label: 'Çürük/Kötü koku', emoji: '🤢', score: 0, feedback: 'Anaerobik ortam! Karıştır ve havalandır.' }
        ]
    },
    {
        id: 'moisture',
        question: 'Nem durumu nasıl?',
        icon: <Droplets size={20} />,
        options: [
            { value: 'sponge', label: 'Sıkılmış sünger gibi', emoji: '💧', score: 3, feedback: 'Mükemmel nem dengesi!' },
            { value: 'dry', label: 'Kuru ve tozlu', emoji: '🏜️', score: 1, feedback: 'Çok kuru! Su ekle ve karıştır.' },
            { value: 'wet', label: 'Su damlıyor', emoji: '💦', score: 0, feedback: 'Çok ıslak! Kuru malzeme ekle.' },
            { value: 'clumpy', label: 'Topak topak', emoji: '🟤', score: 2, feedback: 'Biraz kuru, hafif nemlendir.' }
        ]
    },
    {
        id: 'color',
        question: 'Rengi ne durumda?',
        icon: <Eye size={20} />,
        options: [
            { value: 'dark_brown', label: 'Koyu kahverengi/Siyah', emoji: '🟫', score: 3, feedback: 'Olgunlaşmış kompost rengi!' },
            { value: 'brown', label: 'Orta kahverengi', emoji: '🟤', score: 2, feedback: 'İyi ilerliyor, beklemeye devam.' },
            { value: 'green_yellow', label: 'Yeşilimsi/Sarı', emoji: '🟡', score: 1, feedback: 'Henüz taze, daha çok karıştır.' },
            { value: 'moldy', label: 'Küflü/Gri', emoji: '🔘', score: 0, feedback: 'Hava sirkülasyonu gerekli!' }
        ]
    },
    {
        id: 'temperature',
        question: 'Sıcaklık nasıl?',
        icon: <Thermometer size={20} />,
        options: [
            { value: 'warm', label: 'İç kısım ılık/sıcak', emoji: '🔥', score: 3, feedback: 'Aktif ayrışma süreci! Harika!' },
            { value: 'cool', label: 'Ortam sıcaklığında', emoji: '🌡️', score: 2, feedback: 'Normal, olgunlaşma aşamasında olabilir.' },
            { value: 'cold', label: 'Soğuk, tepkisiz', emoji: '❄️', score: 1, feedback: 'Yeşil malzeme ekle ve karıştır.' },
            { value: 'hot', label: 'Çok sıcak, buhar var', emoji: '♨️', score: 2, feedback: 'Aşırı ısı! Havalandır ve karıştır.' }
        ]
    },
    {
        id: 'creatures',
        question: 'İçinde canlı var mı?',
        icon: <Bug size={20} />,
        options: [
            { value: 'worms', label: 'Solucanlar, böcekler', emoji: '🪱', score: 3, feedback: 'Harika! Doğal ayrıştırıcılar çalışıyor.' },
            { value: 'flies', label: 'Sinekler, haşereler', emoji: '🪰', score: 0, feedback: 'Et/süt ürünü mü ekledin? Kahverengi ile kapat.' },
            { value: 'ants', label: 'Karıncalar', emoji: '🐜', score: 1, feedback: 'Çok kuru! Su ekle.' },
            { value: 'none', label: 'Hiç yok', emoji: '🔍', score: 1, feedback: 'Biraz yaşam beklenebilir, normal olabilir.' }
        ]
    }
];

interface HealthResult {
    score: number;
    maxScore: number;
    percentage: number;
    level: 'excellent' | 'good' | 'fair' | 'needs_attention';
    title: string;
    message: string;
    tips: string[];
}

interface Answer {
    value: string;
    score: number;
    feedback: string;
}

const CompostHealthCheck: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, Answer>>({});
    const [showResult, setShowResult] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    const handleAnswer = (questionId: string, option: typeof QUESTIONS[0]['options'][0]) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: { value: option.value, score: option.score, feedback: option.feedback }
        }));

        if (currentStep < QUESTIONS.length - 1) {
            setTimeout(() => setCurrentStep(prev => prev + 1), 300);
        } else {
            setTimeout(() => setShowResult(true), 300);
        }
    };

    const calculateResult = (): HealthResult => {
        const totalScore = Object.values(answers).reduce((sum, a) => sum + a.score, 0);
        const maxScore = QUESTIONS.length * 3;
        const percentage = Math.round((totalScore / maxScore) * 100);

        let level: HealthResult['level'];
        let title: string;
        let message: string;

        if (percentage >= 80) {
            level = 'excellent';
            title = '🏆 Mükemmel Kompost!';
            message = 'Kompostun çok sağlıklı! Aynı şekilde devam et.';
        } else if (percentage >= 60) {
            level = 'good';
            title = '✨ İyi Gidiyor!';
            message = 'Kompostun iyi durumda, küçük iyileştirmeler yapabilirsin.';
        } else if (percentage >= 40) {
            level = 'fair';
            title = '💪 Geliştirebilirsin!';
            message = 'Birkaç düzeltme ile kompostun daha sağlıklı olacak.';
        } else {
            level = 'needs_attention';
            title = '⚠️ Dikkat Gerekiyor!';
            message = 'Kompostun bakıma ihtiyaç duyuyor, önerileri uygula.';
        }

        // Collect tips from low-scoring answers
        const tips = Object.values(answers)
            .filter(a => a.score < 2)
            .map(a => a.feedback);

        return { score: totalScore, maxScore, percentage, level, title, message, tips };
    };

    const resetCheck = () => {
        setCurrentStep(0);
        setAnswers({});
        setShowResult(false);
        setIsStarted(false);
    };

    const currentQuestion = QUESTIONS[currentStep];
    const result = showResult ? calculateResult() : null;

    // Initial state - not started
    if (!isStarted) {
        return (
            <div className="bg-background-surface rounded-card border border-border shadow-card p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-soft rounded-xl flex items-center justify-center">
                        <Thermometer className="text-primary" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-text-primary">Kompost Sağlık Kontrolü</h3>
                        <p className="text-sm text-text-muted">5 soru ile durumu değerlendir</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
                    <div className="text-5xl mb-4">🌡️</div>
                    <p className="text-text-secondary text-sm mb-6 max-w-xs">
                        Basit sorularla kompostunun sağlığını öğren ve iyileştirme önerileri al.
                    </p>
                    <button
                        onClick={() => setIsStarted(true)}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-button shadow-soft hover:shadow-card transition-all flex items-center gap-2"
                    >
                        Kontrole Başla
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    // Result state
    if (showResult && result) {
        const levelColors = {
            excellent: 'bg-primary-soft text-primary-700 border-primary',
            good: 'bg-accent-soft text-accent border-accent',
            fair: 'bg-secondary-soft text-secondary-700 border-secondary',
            needs_attention: 'bg-red-50 text-status-error border-status-error'
        };

        return (
            <div className="bg-background-surface rounded-card border border-border shadow-card p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-text-primary flex items-center gap-2">
                        <Thermometer size={18} className="text-primary" />
                        Sonuç
                    </h3>
                    <button
                        onClick={resetCheck}
                        className="text-text-muted hover:text-primary transition-colors"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1"
                >
                    {/* Score Circle */}
                    <div className="text-center mb-4">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${levelColors[result.level]} font-bold text-2xl`}>
                            {result.percentage}%
                        </div>
                        <h4 className="font-bold text-lg text-text-primary mt-3">{result.title}</h4>
                        <p className="text-sm text-text-muted">{result.message}</p>
                    </div>

                    {/* Tips */}
                    {result.tips.length > 0 && (
                        <div className="bg-secondary-soft/50 rounded-lg p-3 space-y-2">
                            <p className="font-semibold text-secondary-700 text-sm flex items-center gap-1">
                                <Leaf size={14} /> İyileştirme Önerileri:
                            </p>
                            {result.tips.slice(0, 3).map((tip, i) => (
                                <p key={i} className="text-xs text-secondary-600 flex items-start gap-2">
                                    <span>•</span> {tip}
                                </p>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        );
    }

    // Question state
    return (
        <div className="bg-background-surface rounded-card border border-border shadow-card p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                    <Thermometer size={18} className="text-primary" />
                    Soru {currentStep + 1}/{QUESTIONS.length}
                </h3>
                <button
                    onClick={resetCheck}
                    className="text-text-muted hover:text-primary transition-colors text-sm"
                >
                    İptal
                </button>
            </div>

            {/* Progress */}
            <div className="h-1.5 bg-background-subtle rounded-full overflow-hidden mb-4">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1"
                >
                    <div className="flex items-center gap-2 text-primary mb-3">
                        {currentQuestion.icon}
                        <span className="font-medium text-text-primary">{currentQuestion.question}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {currentQuestion.options.map(option => (
                            <button
                                key={option.value}
                                onClick={() => handleAnswer(currentQuestion.id, option)}
                                className={`p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary-soft/50 transition-all text-left ${answers[currentQuestion.id]?.value === option.value
                                    ? 'border-primary bg-primary-soft'
                                    : ''
                                    }`}
                            >
                                <span className="text-lg block mb-1">{option.emoji}</span>
                                <span className="text-sm font-medium text-text-primary">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CompostHealthCheck;
