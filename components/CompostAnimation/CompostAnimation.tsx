import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timeline from './Timeline';
import { COMPOST_STAGES } from './StageModel';
import Visualizer from './Visualizer';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

const CompostAnimation: React.FC = () => {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1); // 0.5x to 2x
    const [progress, setProgress] = useState(0); // 0 to 100 within current stage

    const requestRef = useRef<number>(0);
    const previousTimeRef = useRef<number>(0);
    // Ref to hold the latest index to avoid closure staleness in the animation loop
    const currentStageIndexRef = useRef(currentStageIndex);

    // Sync ref with state
    useEffect(() => {
        currentStageIndexRef.current = currentStageIndex;
    }, [currentStageIndex]);

    const currentStage = COMPOST_STAGES[currentStageIndex];

    // Main Animation Loop using requestAnimationFrame for smoothness and accuracy
    const animate = useCallback((time: number) => {
        if (previousTimeRef.current !== undefined) {
            const deltaTime = time - previousTimeRef.current;

            const currentIndex = currentStageIndexRef.current;
            const currentStageDef = COMPOST_STAGES[currentIndex];

            // Calculate progress increment based on delta time
            const durationMs = currentStageDef.durationSec * 1000;
            const increment = (deltaTime / durationMs) * 100 * speed;

            setProgress(prevProgress => {
                const nextProgress = prevProgress + increment;

                if (nextProgress >= 100) {
                    // We crossed the boundary
                    console.log(`Stage ${currentIndex} complete. Next stage?`, currentIndex + 1 < COMPOST_STAGES.length);

                    if (currentIndex < COMPOST_STAGES.length - 1) {
                        // Move to next stage
                        setCurrentStageIndex(currentIndex + 1);
                        // We return 0 here so the progress bar resets immediately for the next frame
                        // The state update above will trigger the Effect to update ref
                        return 0;
                    } else {
                        // End of animation
                        setIsPlaying(false);
                        return 100;
                    }
                }
                return nextProgress;
            });
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    }, [speed]);

    useEffect(() => {
        if (isPlaying) {
            console.log('Animation Started/Resumed');
            previousTimeRef.current = performance.now();
            requestRef.current = requestAnimationFrame(animate);
        } else {
            console.log('Animation Paused');
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying, animate]);

    // Handle manual stage change
    const handleStageSelect = (index: number) => {
        setCurrentStageIndex(index);
        setProgress(0);
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (!isPlaying && progress >= 100 && currentStageIndex === COMPOST_STAGES.length - 1) {
            // Restart if at the very end
            setCurrentStageIndex(0);
            setProgress(0);
        }
        setIsPlaying(!isPlaying);
    };

    const handleReset = () => {
        setCurrentStageIndex(0);
        setProgress(0);
        setIsPlaying(false);
    }

    return (
        <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-border/50">
            {/* Header */}
            <div className="bg-primary/5 p-6 border-b border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Wind size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary">Kompost Serüveni</h3>
                    </div>
                    <p className="text-sm text-text-muted">Atığın toprağa dönüşüm öyküsünü izle</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-border">
                    <button
                        onClick={handleReset}
                        className="p-2 hover:bg-background-subtle rounded-lg text-text-muted hover:text-primary transition-colors"
                        title="Başa Dön"
                    >
                        <RotateCcw size={18} />
                    </button>

                    <button
                        onClick={togglePlay}
                        className={`
              w-10 h-10 flex items-center justify-center rounded-full text-white transition-all transform hover:scale-105 active:scale-95
              ${isPlaying ? 'bg-amber-500 shadow-amber-200' : 'bg-primary shadow-primary-200'}
              shadow-lg
            `}
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>

                    <div className="flex items-center gap-2 px-2 border-l border-border ml-1">
                        <span className="text-xs font-semibold text-text-muted">Hız:</span>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.5"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            className="w-20 accent-primary cursor-pointer"
                        />
                        <span className="text-xs w-8 text-right font-mono text-primary">{speed}x</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-background-surface to-white min-h-[400px] flex flex-col">

                {/* Timeline */}
                <div className="mb-10">
                    <Timeline
                        currentStageIndex={currentStageIndex}
                        onStageSelect={handleStageSelect}
                    />
                </div>

                <div className="flex-1 grid md:grid-cols-2 gap-8 items-center">
                    {/* Visual Animation Area */}
                    <div className="w-full aspect-square md:aspect-video rounded-2xl border-2 border-border shadow-inner overflow-hidden relative group bg-[#F5F2EB]">
                        <Visualizer stage={currentStage} progress={progress} />
                    </div>

                    {/* Stage Info */}
                    <div className="space-y-6">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentStage.key}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <h2 className="text-3xl font-extrabold text-primary">{currentStage.label}</h2>
                                <p className="text-lg text-text-secondary leading-relaxed">
                                    {currentStage.description}
                                </p>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {currentStage.concepts.map((concept, i) => (
                                        <span key={i} className="px-3 py-1 bg-secondary-soft/50 text-secondary-dark rounded-full text-sm font-medium border border-secondary/20">
                                            #{concept}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Progress Bar for current stage */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
                                <span>Süreç İlerlemesi</span>
                                <span>{Math.min(100, Math.round(progress))}%</span>
                            </div>
                            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary to-green-400"
                                    style={{ width: `${Math.min(100, progress)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompostAnimation;
