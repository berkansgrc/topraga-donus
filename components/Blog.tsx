import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, User, ArrowRight, ArrowLeft, Tag, Search, Sparkles, Loader2, Clock } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

// Blog yazısı tipi
interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    image_url: string | null;
    author: string;
    read_time: string;
    is_featured: boolean;
    is_published: boolean;
    created_at: string;
}

const CATEGORIES = [
    { id: 'all', label: 'Tümü', color: 'bg-text-primary' },
    { id: 'kompost', label: '🌱 Kompost', color: 'bg-primary' },
    { id: 'geridonusum', label: '♻️ Geri Dönüşüm', color: 'bg-blue-600' },
    { id: 'haberler', label: '📰 Haberler', color: 'bg-purple-600' }
];

const getCategoryStyle = (category: string) => {
    switch (category) {
        case 'kompost':
            return 'bg-primary-soft text-primary-700';
        case 'geridonusum':
            return 'bg-blue-50 text-blue-700';
        case 'haberler':
            return 'bg-purple-50 text-purple-700';
        default:
            return 'bg-background-subtle text-text-secondary';
    }
};

const getCategoryLabel = (category: string) => {
    switch (category) {
        case 'kompost':
            return '🌱 Kompost';
        case 'geridonusum':
            return '♻️ Geri Dönüşüm';
        case 'haberler':
            return '📰 Haberler';
        default:
            return category;
    }
};

const Blog: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('is_published', true)
                    .order('is_featured', { ascending: false })
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Blog yazıları yüklenirken hata:', error);
                } else if (data) {
                    setBlogPosts(data);
                }
            } catch (err) {
                console.error('Beklenmeyen hata:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    // Haber detayı açıldığında sayfayı en üste kaydır
    useEffect(() => {
        if (selectedPost) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [selectedPost]);

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    // DETAY GÖRÜNÜMÜ
    if (selectedPost) {
        return (
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Geri Butonu */}
                    <button
                        onClick={() => setSelectedPost(null)}
                        className="flex items-center text-text-muted hover:text-primary mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Tüm Yazılara Dön
                    </button>

                    {/* Görsel */}
                    {selectedPost.image_url && (
                        <div className="w-full h-64 md:h-96 rounded-card overflow-hidden mb-8">
                            <img
                                src={selectedPost.image_url}
                                alt={selectedPost.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Kategori ve Meta */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className={`px-3 py-1 rounded-pill text-sm font-bold ${getCategoryStyle(selectedPost.category)}`}>
                            {getCategoryLabel(selectedPost.category)}
                        </span>
                        {selectedPost.is_featured && (
                            <span className="flex items-center text-sm text-amber-600 font-medium">
                                <Sparkles size={14} className="mr-1" /> Öne Çıkan
                            </span>
                        )}
                    </div>

                    {/* Başlık */}
                    <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
                        {selectedPost.title}
                    </h1>

                    {/* Meta Bilgiler */}
                    <div className="flex flex-wrap items-center gap-4 text-text-muted mb-8 pb-6 border-b border-border">
                        <span className="flex items-center">
                            <User size={16} className="mr-2" />
                            {selectedPost.author}
                        </span>
                        <span className="flex items-center">
                            <Calendar size={16} className="mr-2" />
                            {new Date(selectedPost.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span className="flex items-center">
                            <Clock size={16} className="mr-2" />
                            {selectedPost.read_time}
                        </span>
                    </div>

                    {/* İçerik */}
                    <div className="prose prose-lg max-w-none text-text-secondary leading-relaxed">
                        {selectedPost.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Alt Bilgi */}
                    <div className="mt-12 pt-6 border-t border-border">
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="flex items-center text-primary font-semibold hover:gap-2 transition-all"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Diğer Yazılara Göz At
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center space-x-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-pill text-sm font-semibold mb-4">
                    <Newspaper size={16} />
                    <span>Blog & Haberler</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
                    Sürdürülebilirlik <span className="text-primary">Haberleri</span>
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                    Çevre, kompost ve geri dönüşüm hakkında en güncel bilgiler, ipuçları ve başarı hikayeleri.
                </p>
            </motion.div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">

                {/* Search */}
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Yazılarda ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-button border border-border bg-white focus:ring-2 focus:ring-primary-soft focus:border-primary outline-none transition-all"
                    />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-button text-sm font-medium transition-all ${activeCategory === cat.id
                                ? `${cat.color} text-white shadow-soft`
                                : 'bg-background-subtle text-text-secondary hover:bg-background-surface'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Post (First) */}
            {filteredPosts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="relative group bg-white rounded-card border border-border shadow-card hover:shadow-hover transition-all overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-rose-100 to-purple-100">
                                {filteredPosts[0].image_url ? (
                                    <img
                                        src={filteredPosts[0].image_url}
                                        alt={filteredPosts[0].title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Newspaper size={64} className="text-rose-300" />
                                    </div>
                                )}
                            </div>
                            <div className="md:w-1/2 p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 rounded-pill text-xs font-bold ${getCategoryStyle(filteredPosts[0].category)}`}>
                                        {getCategoryLabel(filteredPosts[0].category)}
                                    </span>
                                    <span className="flex items-center text-xs text-text-muted">
                                        <Sparkles size={12} className="mr-1 text-amber-500" />
                                        Öne Çıkan
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 group-hover:text-primary transition-colors">
                                    {filteredPosts[0].title}
                                </h2>
                                <p className="text-text-secondary mb-6 leading-relaxed">
                                    {filteredPosts[0].excerpt}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-text-muted">
                                        <span className="flex items-center">
                                            <User size={14} className="mr-1" />
                                            {filteredPosts[0].author}
                                        </span>
                                        <span className="flex items-center">
                                            <Calendar size={14} className="mr-1" />
                                            {new Date(filteredPosts[0].created_at).toLocaleDateString('tr-TR')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPost(filteredPosts[0])}
                                        className="flex items-center text-primary font-semibold text-sm hover:gap-2 transition-all"
                                    >
                                        Devamını Oku <ArrowRight size={14} className="ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.slice(1).map((post, index) => (
                    <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white rounded-card border border-border shadow-card hover:shadow-hover transition-all overflow-hidden flex flex-col"
                    >
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-rose-100 to-purple-100">
                            {post.image_url ? (
                                <img
                                    src={post.image_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Newspaper size={48} className="text-rose-300" />
                                </div>
                            )}
                            <div className="absolute top-3 left-3">
                                <span className={`px-3 py-1 rounded-pill text-xs font-bold ${getCategoryStyle(post.category)}`}>
                                    {getCategoryLabel(post.category)}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                            <p className="text-sm text-text-muted mb-4 leading-relaxed line-clamp-3 flex-grow">
                                {post.excerpt}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex items-center gap-3 text-xs text-text-muted">
                                    <span className="flex items-center">
                                        <Calendar size={12} className="mr-1" />
                                        {new Date(post.created_at).toLocaleDateString('tr-TR')}
                                    </span>
                                    <span>•</span>
                                    <span>{post.read_time}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedPost(post)}
                                    className="text-primary font-medium text-sm flex items-center hover:gap-1 transition-all"
                                >
                                    Oku <ArrowRight size={12} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-background-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                        <Newspaper size={32} className="text-text-muted" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Sonuç Bulunamadı</h3>
                    <p className="text-text-muted">Arama kriterlerinize uygun yazı bulunamadı.</p>
                </div>
            )}

        </div>
    );
};

export default Blog;
