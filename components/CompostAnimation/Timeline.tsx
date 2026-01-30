import React from 'react';
import { motion } from 'framer-motion';
import { COMPOST_STAGES, CompostStage } from './StageModel';
import { ChevronRight } from 'lucide-react';

interface TimelineProps {
    currentStageIndex: number;
    onStageSelect: (index: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ currentStageIndex, onStageSelect }) => {
    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 hide-scrollbar">
            <div className="flex md:justify-center min-w-max px-4">
                {COMPOST_STAGES.map((stage, index) => {
                    const isActive = index === currentStageIndex;
                    const isPast = index < currentStageIndex;

                    return (
                        <div key={stage.key} className="flex items-center group">
                            {/* Node */}
                            <div
                                onClick={() => onStageSelect(index)}
                                className={`
                  relative flex flex-col items-center cursor-pointer transition-all duration-300
                  ${isActive ? 'scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}
                `}
                            >
                                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 z-10
                  transition-colors duration-300
                  ${isActive
                                        ? 'bg-primary border-primary text-white shadow-lg'
                                        : isPast
                                            ? 'bg-primary-soft border-primary text-primary'
                                            : 'bg-background-surface border-border text-text-muted'}
                `}>
                                    {index + 1}
                                </div>

                                <span className={`
                  mt-2 text-xs font-semibold whitespace-nowrap transition-colors
                  ${isActive ? 'text-primary' : 'text-text-muted'}
                `}>
                                    {stage.label}
                                </span>

                                {/* Active Indicator Pulse */}
                                {isActive && (
                                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                                    </span>
                                )}
                            </div>

                            {/* Connector Line */}
                            {index < COMPOST_STAGES.length - 1 && (
                                <div className="w-8 md:w-16 h-1 mx-2 bg-border relative overflow-hidden rounded-full">
                                    <motion.div
                                        initial={{ width: '0%' }}
                                        animate={{ width: isPast ? '100%' : '0%' }}
                                        className="absolute top-0 left-0 h-full bg-primary"
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Timeline;
