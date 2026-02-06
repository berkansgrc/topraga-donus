import React from 'react';

interface BlogFormProps {
    formData: any;
    setFormData: (data: any) => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ formData, setFormData }) => {
    return (
        <>
            <div>
                <label className="block text-sm font-semibold mb-1">Yazı Başlığı</label>
                <input
                    className="w-full p-2 border rounded-lg"
                    value={formData.title || ''}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Başlık girin..."
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-semibold mb-1">Kısa Özet</label>
                <textarea
                    className="w-full p-2 border rounded-lg"
                    value={formData.excerpt || ''}
                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Yazının kısa açıklaması..."
                    rows={2}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-semibold mb-1">İçerik</label>
                <textarea
                    className="w-full p-2 border rounded-lg"
                    value={formData.content || ''}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Yazının tam içeriği..."
                    rows={6}
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">Kategori</label>
                    <select
                        className="w-full p-2 border rounded-lg"
                        value={formData.category || 'haberler'}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="kompost">🌱 Kompost</option>
                        <option value="geridonusum">♻️ Geri Dönüşüm</option>
                        <option value="haberler">📰 Haberler</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Yazar</label>
                    <input
                        className="w-full p-2 border rounded-lg"
                        value={formData.author || 'Harezmi Ekibi'}
                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Yazar adı"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">Okuma Süresi</label>
                    <input
                        className="w-full p-2 border rounded-lg"
                        value={formData.read_time || '5 dk'}
                        onChange={e => setFormData({ ...formData, read_time: e.target.value })}
                        placeholder="Örn: 5 dk"
                    />
                </div>
                <div className="flex flex-col justify-end">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_featured || false}
                            onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="w-4 h-4 text-primary rounded"
                        />
                        <span className="text-sm font-medium">⭐ Öne Çıkan Yazı</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            checked={formData.is_published !== false}
                            onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                            className="w-4 h-4 text-primary rounded"
                        />
                        <span className="text-sm font-medium">👁️ Yayında</span>
                    </label>
                </div>
            </div>
        </>
    );
};

export default BlogForm;
