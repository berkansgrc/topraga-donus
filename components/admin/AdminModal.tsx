import React from 'react';
import { X, ImageIcon, Loader2 } from 'lucide-react';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    title: string;
    loading: boolean;
    children: React.ReactNode;
    showImageUpload?: boolean;
    file?: File | null;
    onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdminModal: React.FC<AdminModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    loading,
    children,
    showImageUpload = true,
    file,
    onFileChange
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-card shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-white rounded-t-card">
                    <h3 className="text-lg font-bold text-text-primary">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-background-subtle rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    {children}

                    {showImageUpload && onFileChange && (
                        <div>
                            <label className="block text-sm font-semibold mb-1">Görsel</label>
                            <div className="flex items-center space-x-3">
                                <label className="cursor-pointer flex items-center space-x-2 bg-background-subtle hover:bg-background-base text-text-secondary border border-border border-dashed px-4 py-2 rounded-lg transition-colors">
                                    <ImageIcon size={18} />
                                    <span className="text-sm">Dosya Seç</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                                </label>
                                {file && <span className="text-sm text-text-muted truncate max-w-[200px]">{file.name}</span>}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-600 text-white py-3 rounded-button font-bold transition-colors flex justify-center items-center disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Kaydet'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminModal;
