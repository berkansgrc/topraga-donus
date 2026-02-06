import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-green-50 p-6 rounded-full mb-6"
            >
                <Leaf size={64} className="text-primary-600" />
            </motion.div>

            <h1 className="text-6xl font-extrabold text-primary-800 mb-2">404</h1>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Aradığınız Sayfa Bulunamadı</h2>
            <p className="text-text-secondary max-w-md mb-8">
                Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
                Doğaya dönmeye ne dersiniz?
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center space-x-2 px-6 py-3 rounded-button border border-border hover:bg-background-subtle transition-colors text-text-primary font-medium"
                >
                    <ArrowLeft size={18} />
                    <span>Geri Dön</span>
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center space-x-2 px-6 py-3 rounded-button bg-primary hover:bg-primary-600 transition-colors text-white font-medium shadow-soft"
                >
                    <Home size={18} />
                    <span>Ana Sayfaya Git</span>
                </button>
            </div>
        </div>
    );
};

export default NotFound;
