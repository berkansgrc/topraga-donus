import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    MessageCircle, X, Send, Trash2, Sprout, 
    Key, HelpCircle, AlertCircle, Info, Settings 
} from 'lucide-react';
import { sendMessageToGemini, isGeminiConfigured, getGeminiApiKey } from '../services/geminiService';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const Chatbot: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [input, setInput] = useState('');
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            text: "Merhaba! Ben **Toprak**, Yapay Zeka Dönüşüm ve Kompost Asistanıyım. 🌱\n\nEvsel atıklarınızı nasıl geri dönüştüreceğinizi öğrenmek, kompost sürecinizi geliştirmek veya sitemizin özelliklerini keşfetmek için bana dilediğinizi sorabilirsiniz.\n\nNasıl yardımcı olabilirim?"
        }
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            setTimeout(() => chatInputRef.current?.focus(), 300);
        }
    }, [messages, isOpen, isLoading]);

    // Handle initial custom API key loading
    useEffect(() => {
        const stored = localStorage.getItem('user_gemini_api_key') || sessionStorage.getItem('user_gemini_api_key') || '';
        setApiKeyInput(stored);
        
        // If not configured, open settings automatically when chat opens
        if (!isGeminiConfigured() && isOpen) {
            setShowSettings(true);
        }
    }, [isOpen]);

    const handleSaveApiKey = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKeyInput.trim()) {
            localStorage.setItem('user_gemini_api_key', apiKeyInput.trim());
            setShowSettings(false);
            // Add system confirmation message
            setMessages(prev => [
                ...prev,
                { role: 'model', text: "🔑 API Anahtarınız başarıyla kaydedildi! Şimdi sorularınızı sormaya başlayabilirsiniz." }
            ]);
        }
    };

    const handleClearApiKey = () => {
        localStorage.removeItem('user_gemini_api_key');
        sessionStorage.removeItem('user_gemini_api_key');
        setApiKeyInput('');
        setMessages([
            {
                role: 'model',
                text: "API anahtarı temizlendi. Sohbeti kullanmak için lütfen geçerli bir anahtar girin."
            }
        ]);
        setShowSettings(true);
    };

    const handleSend = async (textToSend: string) => {
        if (!textToSend.trim() || isLoading) return;

        // Check if API key is configured
        if (!isGeminiConfigured()) {
            setShowSettings(true);
            return;
        }

        const userMessage: Message = { role: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Keep only recent history for token economy and model speed (max 10 messages)
            const chatHistory = [...messages, userMessage].slice(-10);
            
            const responseText = await sendMessageToGemini(chatHistory);
            
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (error: any) {
            setMessages(prev => [
                ...prev, 
                { 
                    role: 'model', 
                    text: "⚠️ Üzgünüm, API bağlantısı kurulurken bir sorun oluştu. Lütfen API anahtarınızın doğruluğunu ve internet bağlantınızı kontrol edin." 
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend(input);
        }
    };

    const handleClearChat = () => {
        if (window.confirm("Sohbet geçmişini temizlemek istediğinize emin misiniz?")) {
            setMessages([
                {
                    role: 'model',
                    text: "Sohbet geçmişi temizlendi. 🌱\n\nKompost yapımı, geri dönüşüm veya web sitemiz hakkındaki sorularınızı bekliyorum!"
                }
            ]);
            setShowSettings(false);
        }
    };

    // Suggestion chips
    const suggestions = [
        "Kompost nasıl yapılır? 🌱",
        "Yumurta kabuğu komposta atılır mı? 🥚",
        "Atık yağları nereye atmalıyım? 🛢️",
        "Karbon-Azot dengesi nedir? 🍂",
        "Sitedeki oyunlar nelerdir? 🎮",
        "Atık pilleri nereye atarım? 🔋"
    ];

    // Markdown & Link parser helper
    const parseMessageContent = (text: string) => {
        const lines = text.split('\n');
        
        return lines.map((line, lineIndex) => {
            // Check if bullet point
            const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            let content = line;
            if (isListItem) {
                content = line.trim().substring(2);
            }

            const parts: React.ReactNode[] = [];
            let currentIndex = 0;

            // Combined regex for **bold** and [label](url)
            const regex = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\))/g;
            let match;

            while ((match = regex.exec(content)) !== null) {
                const matchIndex = match.index;
                
                // Add text before match
                if (matchIndex > currentIndex) {
                    parts.push(content.substring(currentIndex, matchIndex));
                }

                if (match[2]) {
                    // Bold match
                    parts.push(
                        <strong key={matchIndex} className="font-bold text-primary-700">
                            {match[2]}
                        </strong>
                    );
                } else if (match[3] && match[4]) {
                    // Link match
                    const label = match[3];
                    const url = match[4];
                    const isInternal = url.startsWith('/');

                    if (isInternal) {
                        parts.push(
                            <button
                                key={matchIndex}
                                onClick={() => {
                                    navigate(url);
                                    setIsOpen(false); // Close chatbot on page change for better UX
                                }}
                                className="text-primary hover:text-primary-700 underline font-semibold transition-colors cursor-pointer inline bg-transparent p-0 border-none align-baseline text-left font-sans"
                            >
                                {label}
                            </button>
                        );
                    } else {
                        parts.push(
                            <a
                                key={matchIndex}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary-700 underline font-semibold transition-colors inline"
                            >
                                {label}
                            </a>
                        );
                    }
                }

                currentIndex = regex.lastIndex;
            }

            if (currentIndex < content.length) {
                parts.push(content.substring(currentIndex));
            }

            if (isListItem) {
                return (
                    <li key={lineIndex} className="ml-4 list-disc list-outside mb-1 text-text-secondary leading-relaxed text-sm">
                        {parts}
                    </li>
                );
            } else {
                return (
                    <p key={lineIndex} className="mb-2 text-text-secondary leading-relaxed text-sm last:mb-0">
                        {parts}
                    </p>
                );
            }
        });
    };

    const isEnvKeyConfigured = !!import.meta.env.VITE_GEMINI_API_KEY && 
                              import.meta.env.VITE_GEMINI_API_KEY !== 'PLACEHOLDER_API_KEY' && 
                              import.meta.env.VITE_GEMINI_API_KEY.trim() !== '';

    return (
        <>
            {/* Floating Action Button (FAB) */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed z-[90] p-4 rounded-full shadow-hover cursor-pointer transition-all flex items-center justify-center
                    ${isOpen ? 'bg-text-primary text-white' : 'bg-primary text-white'}
                    /* MobileNav is bottom-0 (height 16/64px), so on mobile we lift FAB up to bottom-20 (80px) */
                    bottom-20 md:bottom-6 right-4 md:right-6`}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                title="Toprak Asistan"
            >
                <div className="relative">
                    {/* Pulsing ring around button when closed */}
                    {!isOpen && (
                        <span className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping pointer-events-none" />
                    )}
                    {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                </div>
            </motion.button>

            {/* Chat Drawer Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 250 }}
                        className={`fixed z-[90] flex flex-col bg-white/95 backdrop-blur-md border border-border/40 shadow-hover rounded-card overflow-hidden
                            /* Layout positions: */
                            bottom-36 md:bottom-24 right-4 md:right-6 
                            w-[calc(100vw-2rem)] md:w-[400px] 
                            h-[500px] max-h-[calc(100vh-12rem)] md:max-h-[600px]`}
                    >
                        {/* Header */}
                        <div className="bg-primary text-white px-4 py-3.5 flex items-center justify-between shadow-soft select-none">
                            <div className="flex items-center space-x-2.5">
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <Sprout size={18} className="text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
                                        Toprak Asistan
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                                    </div>
                                    <span className="text-[10px] text-primary-soft">Yapay Zeka Rehberi</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                                {/* Clear Chat Button */}
                                <button 
                                    onClick={handleClearChat}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
                                    title="Sohbeti Temizle"
                                >
                                    <Trash2 size={16} />
                                </button>
                                
                                {/* Settings Toggle Button */}
                                <button 
                                    onClick={() => setShowSettings(!showSettings)}
                                    className={`p-1.5 rounded-lg transition-colors 
                                        ${showSettings ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}
                                    title="Anahtar Ayarları"
                                >
                                    <Key size={16} />
                                </button>

                                {/* Close Button */}
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
                                    title="Kapat"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Space / Settings Screen */}
                        <div className="flex-grow flex flex-col overflow-hidden relative">
                            <AnimatePresence mode="wait">
                                {showSettings ? (
                                    /* API Key Configuration Panel */
                                    <motion.div
                                        key="settings"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="absolute inset-0 bg-background-base p-5 flex flex-col justify-between overflow-y-auto z-10"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                                                <Key size={18} />
                                                <span>Gemini API Bağlantı Ayarları</span>
                                            </div>

                                            {isEnvKeyConfigured ? (
                                                <div className="bg-primary-soft border border-primary/20 rounded-card p-3.5 text-xs text-primary-700 flex items-start space-x-2.5">
                                                    <Info size={16} className="shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-semibold block mb-0.5">Sistem Anahtarı Aktif</span>
                                                        Projenin .env.local dosyasındaki VITE_GEMINI_API_KEY başarıyla yüklendi. Ekstra işlem yapmanıza gerek yoktur.
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-card p-3.5 text-xs text-yellow-800 flex items-start space-x-2.5">
                                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-semibold block mb-0.5">API Anahtarı Eksik</span>
                                                        Sistem dosyalarında Gemini API Anahtarı bulunamadı. Sohbet özelliğini hemen denemek için geçici bir anahtar ekleyebilirsiniz.
                                                    </div>
                                                </div>
                                            )}

                                            <form onSubmit={handleSaveApiKey} className="space-y-3 pt-2">
                                                <label className="block text-xs font-semibold text-text-secondary">
                                                    Kişisel Gemini API Anahtarınız:
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="password"
                                                        placeholder="AIzaSy..."
                                                        value={apiKeyInput}
                                                        onChange={(e) => setApiKeyInput(e.target.value)}
                                                        className="flex-grow px-3 py-2 bg-white border border-border/40 rounded-input text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="bg-primary hover:bg-primary-600 text-white px-3 py-2 rounded-button text-xs font-semibold shadow-soft cursor-pointer transition-colors"
                                                    >
                                                        Kaydet
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-text-muted">
                                                    Anahtarınız sadece tarayıcınızda (yerel depolamada) saklanır, sunucularımıza gönderilmez.
                                                </p>
                                            </form>

                                            <div className="pt-2 border-t border-border/20">
                                                <a 
                                                    href="https://aistudio.google.com/" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-xs text-primary hover:text-primary-700 underline font-semibold flex items-center"
                                                >
                                                    <HelpCircle size={14} className="mr-1" />
                                                    Ücretsiz Gemini API Anahtarı Nasıl Alınır?
                                                </a>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-border/20 flex justify-between items-center gap-2">
                                            {(localStorage.getItem('user_gemini_api_key') || sessionStorage.getItem('user_gemini_api_key')) && (
                                                <button
                                                    onClick={handleClearApiKey}
                                                    className="text-xs text-status-error hover:underline flex items-center"
                                                >
                                                    Kayıtlı Anahtarı Sil
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    if (isGeminiConfigured()) {
                                                        setShowSettings(false);
                                                    } else {
                                                        alert("Lütfen önce geçerli bir API anahtarı kaydedin.");
                                                    }
                                                }}
                                                className="text-xs font-semibold text-text-secondary hover:text-text-primary px-3 py-1.5 border border-border/40 rounded-button bg-white shadow-soft"
                                            >
                                                Kapat
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* Chat Messages Container */
                                    <motion.div
                                        key="chat"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex-grow flex flex-col overflow-hidden"
                                    >
                                        {/* Message List */}
                                        <div className="flex-grow overflow-y-auto p-4 space-y-4 flex flex-col bg-background-base/20">
                                            {messages.map((msg, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex items-start space-x-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    {msg.role === 'model' && (
                                                        <div className="shrink-0 bg-primary/10 text-primary p-1 rounded-lg">
                                                            <Sprout size={14} />
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`px-3.5 py-2.5 text-sm shadow-soft
                                                            ${msg.role === 'user'
                                                                ? 'bg-primary text-white rounded-[16px_16px_4px_16px] max-w-[80%]'
                                                                : 'bg-white border border-border/30 text-text-primary rounded-[16px_16px_16px_4px] max-w-[80%]'
                                                            }`}
                                                    >
                                                        {msg.role === 'user' ? (
                                                            <p className="leading-relaxed text-sm whitespace-pre-wrap">{msg.text}</p>
                                                        ) : (
                                                            parseMessageContent(msg.text)
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {/* Typing Indicator */}
                                            {isLoading && (
                                                <div className="flex items-start space-x-2 justify-start">
                                                    <div className="shrink-0 bg-primary/10 text-primary p-1 rounded-lg">
                                                        <Sprout size={14} />
                                                    </div>
                                                    <div className="bg-white border border-border/30 px-4 py-3 rounded-[16px_16px_16px_4px] shadow-soft flex items-center space-x-1.5 h-9">
                                                        <span className="w-1.5 h-1.5 bg-text-muted/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                        <span className="w-1.5 h-1.5 bg-text-muted/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <span className="w-1.5 h-1.5 bg-text-muted/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Suggestion Chips - shown only on default welcome or when history is empty */}
                                            {messages.length === 1 && !isLoading && (
                                                <div className="pt-2 select-none">
                                                    <span className="text-[10px] text-text-muted font-semibold block mb-2">Hızlı Sorular:</span>
                                                    <div className="flex flex-wrap">
                                                        {suggestions.map((sug, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => handleSend(sug)}
                                                                className="bg-white hover:bg-primary-soft hover:text-primary text-text-secondary border border-border/40 rounded-pill px-3 py-1.5 text-xs transition-all shadow-soft cursor-pointer mr-2 mb-2 text-left hover:border-primary/30 font-medium font-sans"
                                                            >
                                                                {sug}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Input Box */}
                                        <div className="p-3 bg-white border-t border-border/30 flex items-center gap-2">
                                            <input
                                                ref={chatInputRef}
                                                type="text"
                                                placeholder={isGeminiConfigured() ? "Sorunuzu yazın..." : "API Anahtarı gerekli..."}
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                disabled={!isGeminiConfigured() || isLoading}
                                                className="flex-grow px-3.5 py-2.5 bg-background-subtle border border-border/30 rounded-input focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all text-text-primary disabled:opacity-60"
                                            />
                                            <button
                                                onClick={() => handleSend(input)}
                                                disabled={!isGeminiConfigured() || !input.trim() || isLoading}
                                                className="bg-primary hover:bg-primary-600 text-white p-2.5 rounded-button transition-colors disabled:opacity-50 disabled:hover:bg-primary shadow-soft flex items-center justify-center cursor-pointer"
                                                title="Gönder"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
