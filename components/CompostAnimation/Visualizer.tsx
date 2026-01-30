import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompostStage } from './StageModel';
import { Thermometer, Wind, Droplets } from 'lucide-react';

interface VisualizerProps {
    stage: CompostStage;
    progress: number;
    reducedMotion?: boolean;
}

// Gauge Component with premium glass design
const PremiumGauge = ({
    icon: Icon,
    value,
    gradientFrom,
    gradientTo,
    label,
    unit
}: {
    icon: any;
    value: number;
    gradientFrom: string;
    gradientTo: string;
    label: string;
    unit: string;
}) => (
    <div className="relative group">
        <div className="relative w-11 h-16 rounded-xl overflow-hidden shadow-lg border border-white/20 backdrop-blur-md bg-gradient-to-b from-white/10 to-black/20">
            {/* Glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

            {/* Fill */}
            <motion.div
                className="absolute bottom-0 left-0 right-0"
                style={{ background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})` }}
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ type: "spring", stiffness: 30, damping: 10 }}
            />

            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur flex items-center justify-center shadow-inner">
                    <Icon size={12} className="text-white drop-shadow-lg" />
                </div>
            </div>

            {/* Value */}
            <div className="absolute bottom-0.5 left-0 right-0 text-center">
                <span className="text-[9px] font-black text-white drop-shadow-lg">{Math.round(value)}{unit}</span>
            </div>
        </div>

        {/* Label */}
        <div className="mt-1 text-center">
            <span className="text-[7px] font-bold text-white/90 bg-black/30 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                {label}
            </span>
        </div>
    </div>
);

// Stage Scene Component
const StageScene = ({ stage, progress, reducedMotion }: { stage: CompostStage; progress: number; reducedMotion: boolean }) => {
    switch (stage.key) {
        case 'collect':
            return <CollectScene progress={progress} reducedMotion={reducedMotion} />;
        case 'layering':
            return <LayeringScene progress={progress} reducedMotion={reducedMotion} />;
        case 'active':
            return <ActiveScene progress={progress} reducedMotion={reducedMotion} />;
        case 'turning':
            return <TurningScene progress={progress} reducedMotion={reducedMotion} />;
        case 'curing':
            return <CuringScene progress={progress} reducedMotion={reducedMotion} />;
        case 'ready':
            return <ReadyScene progress={progress} reducedMotion={reducedMotion} />;
        default:
            return null;
    }
};

// === STAGE SCENES ===

const CollectScene = ({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
            {/* Bin */}
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-40 h-48">
                <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-2xl">
                    <defs>
                        <linearGradient id="binGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#5D4037" />
                            <stop offset="50%" stopColor="#8D6E63" />
                            <stop offset="100%" stopColor="#5D4037" />
                        </linearGradient>
                        <linearGradient id="compostGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8D6E63" />
                            <stop offset="100%" stopColor="#4E342E" />
                        </linearGradient>
                    </defs>

                    <rect x="10" y="20" width="140" height="170" rx="8" fill="url(#binGradient)" />

                    <motion.rect
                        x="15"
                        y={180 - (progress * 1.2)}
                        width="130"
                        height={progress * 1.2}
                        rx="4"
                        fill="url(#compostGradient)"
                        initial={{ height: 0 }}
                        animate={{ height: progress * 1.2 }}
                    />

                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <rect key={i} x="10" y={30 + i * 28} width="140" height="2" fill="#3E2723" opacity={0.3} />
                    ))}

                    <rect x="5" y="15" width="150" height="12" rx="4" fill="#4E342E" />
                </svg>
            </div>

            {/* Falling items */}
            <AnimatePresence>
                {[
                    { emoji: '🍎', x: 35, delay: 0 },
                    { emoji: '🥕', x: 45, delay: 0.3 },
                    { emoji: '🍌', x: 55, delay: 0.6 },
                    { emoji: '🥬', x: 65, delay: 0.9 },
                ].map((item, i) => progress > i * 20 && (
                    <motion.div
                        key={i}
                        className="absolute text-3xl"
                        style={{ left: `${item.x}%` }}
                        initial={{ top: '-10%', rotate: -30, opacity: 0 }}
                        animate={{ top: '55%', rotate: 0, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2, delay: item.delay, repeat: reducedMotion ? 0 : Infinity, repeatDelay: 3 }}
                    >
                        {item.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    </div>
);

const LayeringScene = ({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-56">
            <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl">
                <defs>
                    <linearGradient id="greenLayer" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4CAF50" />
                        <stop offset="100%" stopColor="#2E7D32" />
                    </linearGradient>
                    <linearGradient id="brownLayer" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8D6E63" />
                        <stop offset="100%" stopColor="#5D4037" />
                    </linearGradient>
                </defs>

                <rect x="20" y="30" width="160" height="200" rx="12" fill="#3E2723" stroke="#5D4037" strokeWidth="4" />

                {[0, 1, 2, 3, 4, 5].map((i) => {
                    const layerProgress = Math.max(0, Math.min(100, (progress - i * 15) * 2));
                    return (
                        <motion.rect
                            key={i}
                            x="28"
                            y={195 - i * 28}
                            width="144"
                            height="24"
                            rx="4"
                            fill={i % 2 === 0 ? "url(#greenLayer)" : "url(#brownLayer)"}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: layerProgress / 100, opacity: layerProgress / 100 }}
                            style={{ originX: 0.5 }}
                        />
                    );
                })}

                <text x="100" y="20" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Karbon : Azot = 3:1</text>
            </svg>

            <div className="absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col gap-2 text-xs font-bold">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-600" />
                    <span className="text-white/80">Yeşil (N)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-700" />
                    <span className="text-white/80">Kahve (C)</span>
                </div>
            </div>
        </div>
    </div>
);

const ActiveScene = ({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) => (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.div
            className="absolute inset-0 bg-gradient-to-t from-orange-900/30 via-red-900/20 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
        />

        <div className="relative w-48 h-56">
            <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl">
                <defs>
                    <linearGradient id="heatGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#4E342E" />
                        <stop offset="50%" stopColor="#6D4C41" />
                        <stop offset="100%" stopColor="#8D6E63" />
                    </linearGradient>
                </defs>

                <rect x="20" y="30" width="160" height="200" rx="12" fill="url(#heatGradient)" stroke="#FF5722" strokeWidth="3" />

                {!reducedMotion && [1, 2, 3, 4, 5].map(i => (
                    <motion.circle
                        key={i}
                        cx={50 + i * 25}
                        cy={100 + Math.sin(i) * 30}
                        r="8"
                        fill="#FFE082"
                        opacity={0.6}
                        animate={{ cy: [100 + Math.sin(i) * 30, 120 + Math.sin(i) * 30, 100 + Math.sin(i) * 30] }}
                        transition={{ repeat: Infinity, duration: 1.5 + i * 0.2 }}
                    />
                ))}
            </svg>

            {!reducedMotion && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-4">
                    {[1, 2, 3].map(i => (
                        <motion.div
                            key={i}
                            className="w-8 h-8 bg-white rounded-full blur-xl"
                            initial={{ y: 0, opacity: 0 }}
                            animate={{ y: -40, opacity: [0, 0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                        />
                    ))}
                </div>
            )}

            <div className="absolute -left-16 top-1/2 -translate-y-1/2">
                <div className="bg-red-500/20 backdrop-blur rounded-xl p-2 border border-red-400/30">
                    <div className="text-2xl font-black text-red-400">{Math.round(40 + progress * 0.3)}°C</div>
                    <div className="text-[10px] text-red-300">Isı Yüksek!</div>
                </div>
            </div>
        </div>
    </div>
);

const TurningScene = ({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-56">
            <motion.div
                animate={!reducedMotion ? { rotate: [0, -5, 5, 0] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ originX: 0.5, originY: 1 }}
            >
                <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl">
                    <rect x="20" y="30" width="160" height="200" rx="12" fill="#5D4037" stroke="#8D6E63" strokeWidth="3" />

                    {[...Array(15)].map((_, i) => (
                        <motion.circle
                            key={i}
                            cx={40 + (i % 5) * 30}
                            cy={60 + Math.floor(i / 5) * 50}
                            r={10}
                            fill={i % 3 === 0 ? '#4CAF50' : i % 3 === 1 ? '#8D6E63' : '#6D4C41'}
                            animate={!reducedMotion ? {
                                cx: [40 + (i % 5) * 30, 45 + ((i + 1) % 5) * 30, 40 + (i % 5) * 30],
                                cy: [60 + Math.floor(i / 5) * 50, 70 + Math.floor((i + 1) / 5) * 50, 60 + Math.floor(i / 5) * 50]
                            } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                    ))}
                </svg>
            </motion.div>

            <motion.div
                className="absolute -right-12 top-0 text-5xl"
                animate={!reducedMotion ? { rotate: [-20, 20, -20], x: [0, 10, 0] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ originX: 0, originY: 1 }}
            >
                🍴
            </motion.div>

            <motion.div
                className="absolute -left-12 top-1/3 text-2xl"
                animate={!reducedMotion ? { x: [0, 10, 0], opacity: [0.5, 1, 0.5] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
            >
                💨 O₂
            </motion.div>
        </div>
    </div>
);

const CuringScene = ({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-56">
            <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl">
                <defs>
                    <linearGradient id="matureCompost" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3E2723" />
                        <stop offset="100%" stopColor="#1B0F0E" />
                    </linearGradient>
                </defs>

                <rect x="20" y="30" width="160" height="200" rx="12" fill="url(#matureCompost)" stroke="#5D4037" strokeWidth="3" />

                {[...Array(20)].map((_, i) => (
                    <circle
                        key={i}
                        cx={35 + (i % 6) * 25}
                        cy={50 + Math.floor(i / 6) * 45}
                        r={5}
                        fill="#2D1B18"
                        opacity={0.5}
                    />
                ))}

                {[1, 2, 3].map(i => (
                    <motion.text
                        key={i}
                        x={50 + i * 30}
                        y={120 + i * 20}
                        fontSize="20"
                        animate={!reducedMotion ? {
                            x: [50 + i * 30, 55 + i * 30, 50 + i * 30],
                            y: [120 + i * 20, 125 + i * 20, 120 + i * 20]
                        } : {}}
                        transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3 }}
                    >
                        🪱
                    </motion.text>
                ))}
            </svg>

            <motion.div
                className="absolute -right-16 top-1/2 -translate-y-1/2 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="text-3xl">❄️</div>
                <div className="text-[10px] text-white/80 font-bold mt-1">Soğuyor</div>
            </motion.div>
        </div>
    </div>
);

const ReadyScene = ({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) => (
    <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
            className="absolute inset-0 bg-gradient-to-t from-green-900/30 via-transparent to-transparent"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 }}
        />

        <div className="relative flex items-end gap-6">
            {/* Bag of compost */}
            <motion.div
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", delay: 0.2 }}
            >
                <svg viewBox="0 0 100 140" className="w-32 h-44 drop-shadow-2xl">
                    <path d="M15 30 L85 30 L90 130 Q50 140 10 130 Z" fill="#5D4037" stroke="#4E342E" strokeWidth="2" />
                    <path d="M15 30 Q50 20 85 30" fill="none" stroke="#4E342E" strokeWidth="3" />
                    <ellipse cx="50" cy="35" rx="30" ry="10" fill="#2D1B18" />
                    <rect x="25" y="60" width="50" height="40" rx="5" fill="#FFF8E1" />
                    <text x="50" y="78" textAnchor="middle" fill="#4E342E" fontSize="9" fontWeight="bold">KOMPOST</text>
                    <text x="50" y="92" textAnchor="middle" fill="#4CAF50" fontSize="8">✓ HAZIR</text>
                </svg>
            </motion.div>

            {/* Growing plant */}
            <motion.div
                initial={{ scale: 0, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", delay: 0.5 }}
                className="relative"
            >
                <svg viewBox="0 0 80 120" className="w-24 h-36 drop-shadow-xl">
                    <path d="M15 80 L65 80 L60 115 Q40 120 20 115 Z" fill="#D84315" stroke="#BF360C" strokeWidth="2" />
                    <rect x="10" y="75" width="60" height="10" rx="3" fill="#E64A19" />
                    <ellipse cx="40" cy="80" rx="25" ry="8" fill="#3E2723" />
                    <motion.path
                        d="M40 80 Q40 50 40 30"
                        fill="none"
                        stroke="#4CAF50"
                        strokeWidth="4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    />
                    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }}>
                        <ellipse cx="30" cy="35" rx="15" ry="8" fill="#66BB6A" transform="rotate(-30 30 35)" />
                        <ellipse cx="50" cy="35" rx="15" ry="8" fill="#66BB6A" transform="rotate(30 50 35)" />
                        <ellipse cx="40" cy="20" rx="12" ry="6" fill="#81C784" />
                    </motion.g>
                </svg>

                {!reducedMotion && [1, 2, 3].map(i => (
                    <motion.div
                        key={i}
                        className="absolute text-xl"
                        style={{ top: `${20 + i * 15}%`, left: `${30 + i * 20}%` }}
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                    >
                        ✨
                    </motion.div>
                ))}
            </motion.div>
        </div>

        <motion.div
            className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
        >
            🎉 Tamamlandı!
        </motion.div>
    </div>
);

const Visualizer: React.FC<VisualizerProps> = ({ stage, progress, reducedMotion = false }) => {

    const sim = useMemo(() => {
        switch (stage.key) {
            case 'collect': return { temp: 25, moisture: 40, oxygen: 95 };
            case 'layering': return { temp: 28, moisture: 50, oxygen: 90 };
            case 'active': return { temp: 65, moisture: 55, oxygen: 40 };
            case 'turning': return { temp: 50, moisture: 50, oxygen: 85 };
            case 'curing': return { temp: 35, moisture: 45, oxygen: 75 };
            case 'ready': return { temp: 22, moisture: 40, oxygen: 90 };
            default: return { temp: 25, moisture: 50, oxygen: 80 };
        }
    }, [stage]);

    const getBgGradient = () => {
        switch (stage.key) {
            case 'collect': return 'from-sky-400 via-sky-300 to-green-200';
            case 'layering': return 'from-sky-500 via-sky-400 to-amber-100';
            case 'active': return 'from-orange-400 via-amber-300 to-yellow-100';
            case 'turning': return 'from-sky-400 via-cyan-300 to-green-100';
            case 'curing': return 'from-slate-500 via-slate-400 to-stone-300';
            case 'ready': return 'from-green-400 via-emerald-300 to-lime-100';
            default: return 'from-sky-400 via-sky-300 to-green-200';
        }
    };

    return (
        <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b ${getBgGradient()}`}>

            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-1/5 bg-gradient-to-t from-amber-900 via-amber-800 to-amber-700">
                <div className="absolute -top-2 left-0 right-0 flex justify-around overflow-hidden">
                    {[...Array(16)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="text-green-600 text-lg"
                            animate={!reducedMotion ? { rotate: [-5, 5, -5] } : {}}
                            transition={{ repeat: Infinity, duration: 2 + i * 0.1, delay: i * 0.05 }}
                        >
                            🌿
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Stage-specific scene */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={stage.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <StageScene stage={stage} progress={progress} reducedMotion={reducedMotion} />
                </motion.div>
            </AnimatePresence>

            {/* Gauges - inside container with safe margins */}
            <div className="absolute right-4 bottom-[25%] flex flex-col gap-2 z-20">
                <PremiumGauge
                    icon={Thermometer}
                    value={sim.temp}
                    gradientFrom="#DC2626"
                    gradientTo="#F97316"
                    label="Sıcaklık"
                    unit="°C"
                />
                <PremiumGauge
                    icon={Droplets}
                    value={sim.moisture}
                    gradientFrom="#2563EB"
                    gradientTo="#06B6D4"
                    label="Nem"
                    unit="%"
                />
                <PremiumGauge
                    icon={Wind}
                    value={sim.oxygen}
                    gradientFrom="#0EA5E9"
                    gradientTo="#38BDF8"
                    label="Oksijen"
                    unit="%"
                />
            </div>

            {/* Stage Badge */}
            <motion.div
                key={stage.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-3 left-3 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/50 shadow-2xl z-20"
            >
                <div className="text-[9px] text-stone-500 font-black uppercase tracking-widest">Aşama</div>
                <div className="text-base font-black text-stone-800">{stage.label}</div>
            </motion.div>

        </div>
    );
};

export default Visualizer;
