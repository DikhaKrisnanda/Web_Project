import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TypeScript Types & Interfaces
// ============================================================================

export type MediaCategory =
  | 'Semua Kategori'
  | 'Anime'
  | 'Manga'
  | 'Drama'
  | 'Light Novel';

export type MediaAura =
  | 'Semua Suasana'
  | 'High Energy'
  | 'Melancholy'
  | 'Binge Mode'
  | 'Chill Vibes';

export interface MediaItem {
  id: number;
  title: string;
  category: Exclude<MediaCategory, 'Semua Kategori'>;
  aura: Exclude<MediaAura, 'Semua Suasana'>;
  rating: number;
  year: number;
  episodesOrChapters: string;
  genres: string[];
  synopsis: string;
  image: string;
  creatorOrStudio: string;
}

// ============================================================================
// Sample Media Data (FlipPlay Entertainment Catalog)
// ============================================================================

const SAMPLE_MEDIA_DATA: MediaItem[] = [
  {
    id: 1,
    title: 'Naruto Shippuden',
    category: 'Anime',
    aura: 'High Energy',
    rating: 9.9,
    year: 2007,
    episodesOrChapters: '500 Episode',
    genres: ['Shonen', 'Aksi', 'Ninja', 'Adventure'],
    synopsis:
      'Perjalanan Uzumaki Naruto menguasai jurus Rasengan dan cakra Kurama demi melindungi desa Konoha serta membawa pulang Sasuke.',
    image:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=700&q=80',
    creatorOrStudio: 'Studio Pierrot',
  },
  {
    id: 2,
    title: 'Attack on Titan: The Final Season',
    category: 'Anime',
    aura: 'Binge Mode',
    rating: 9.8,
    year: 2023,
    episodesOrChapters: '87 Episode',
    genres: ['Aksi', 'Militer', 'Misteri', 'Dark Fantasy'],
    synopsis:
      'Pertempuran penentuan antara pulau Paradis dan kekaisaran Marley ketika rahasia asal-usul Titan akhirnya terungkap ke seluruh dunia.',
    image:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80',
    creatorOrStudio: 'MAPPA',
  },
  {
    id: 3,
    title: 'Solo Leveling: Arise',
    category: 'Manga',
    aura: 'High Energy',
    rating: 9.7,
    year: 2022,
    episodesOrChapters: '179 Chapter',
    genres: ['Aksi', 'Leveling', 'Dungeon', 'Super Power'],
    synopsis:
      'Sung Jin-Woo, hunter terlemah berperingkat E, secara misterius terpilih menjadi Player tunggal dengan kemampuan menaikkan level tanpa batas.',
    image:
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=700&q=80',
    creatorOrStudio: 'Chugong & DUBU (REDICE Studio)',
  },
  {
    id: 4,
    title: 'Crash Landing on You',
    category: 'Drama',
    aura: 'Melancholy',
    rating: 9.5,
    year: 2019,
    episodesOrChapters: '16 Episode',
    genres: ['Romance', 'Comedy', 'Drama'],
    synopsis:
      'Pewaris konglomerat Korea Selatan mendarat darurat di Korea Utara akibat badai paralayang dan bertemu seorang perwira tentara terhormat.',
    image:
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=700&q=80',
    creatorOrStudio: 'tvN / Studio Dragon',
  },
  {
    id: 5,
    title: 'Classroom of the Elite',
    category: 'Light Novel',
    aura: 'Binge Mode',
    rating: 9.4,
    year: 2015,
    episodesOrChapters: '28 Volume',
    genres: ['Psikologis', 'Drama', 'Sekolah', 'Mystery'],
    synopsis:
      'Kiyotaka Ayanokoji sengaja menempatkan dirinya di kelas D terbawah SMA Koudo Ikusei yang sangat kompetitif dan penuh intrik rahasia.',
    image:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80',
    creatorOrStudio: 'Shogo Kinugasa',
  },
  {
    id: 6,
    title: 'One Piece',
    category: 'Manga',
    aura: 'Binge Mode',
    rating: 9.9,
    year: 1997,
    episodesOrChapters: '1100+ Chapter',
    genres: ['Shonen', 'Petualangan', 'Fantasi', 'Komedi'],
    synopsis:
      'Monkey D. Luffy bersama Bajak Laut Topi Jerami mengarungi Grand Line untuk menemukan harta karun legendaris peninggalan Raja Bajak Laut.',
    image:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=700&q=80',
    creatorOrStudio: 'Eiichiro Oda',
  },
  {
    id: 7,
    title: 'Yuru Camp (Laid-Back Camp)',
    category: 'Anime',
    aura: 'Chill Vibes',
    rating: 9.3,
    year: 2018,
    episodesOrChapters: '36 Episode',
    genres: ['Slice of Life', 'Alam', 'Relaksasi'],
    synopsis:
      'Kisah hangat sekelompok siswi SMA yang menikmati kedamaian berkemah solo dan kelompok di sekitar keindahan Gunung Fuji.',
    image:
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=700&q=80',
    creatorOrStudio: 'C-Station',
  },
  {
    id: 8,
    title: 'Sword Art Online: Progressive',
    category: 'Light Novel',
    aura: 'High Energy',
    rating: 9.2,
    year: 2012,
    episodesOrChapters: '8 Volume',
    genres: ['Isekai', 'Aksi', 'Game Virtual', 'Romance'],
    synopsis:
      'Pengisahan kembali secara mendetail lantai demi lantai petualangan Kirito dan Asuna menaklukkan kastil melayang Aincrad dari awal.',
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=700&q=80',
    creatorOrStudio: 'Reki Kawahara',
  },
];

// Aura styling metadata
const AURA_CONFIG: Record<
  Exclude<MediaAura, 'Semua Suasana'>,
  { label: string; icon: string; badgeClass: string }
> = {
  'High Energy': {
    label: 'High Energy',
    icon: '⚡',
    badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  },
  'Melancholy': {
    label: 'Melancholy',
    icon: '🌧️',
    badgeClass: 'bg-sky-500/15 border-sky-500/30 text-sky-300',
  },
  'Binge Mode': {
    label: 'Binge Mode',
    icon: '🍿',
    badgeClass: 'bg-pink-500/15 border-pink-500/30 text-pink-300',
  },
  'Chill Vibes': {
    label: 'Chill Vibes',
    icon: '☕',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  },
};

// ============================================================================
// Main Functional Component
// ============================================================================

export const FlipPlayApp: React.FC = () => {
  // State Management
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] =
    useState<MediaCategory>('Semua Kategori');
  const [selectedAura, setSelectedAura] =
    useState<MediaAura>('Semua Suasana');
  const [isDevToolsOpen, setIsDevToolsOpen] = useState<boolean>(false);
  const [isSimulatingError, setIsSimulatingError] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedModalMedia, setSelectedModalMedia] =
    useState<MediaItem | null>(null);

  // Aksesibilitas: Keyboard shortcut Escape untuk menutup modal, drawer, dan menu
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedModalMedia) setSelectedModalMedia(null);
        if (isDevToolsOpen) setIsDevToolsOpen(false);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    },
    [selectedModalMedia, isDevToolsOpen, isMobileMenuOpen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock scroll saat mobile menu atau modal terbuka
  useEffect(() => {
    if (isMobileMenuOpen || selectedModalMedia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, selectedModalMedia]);

  // Dynamic Filtering dengan useMemo
  const filteredMedia = useMemo(() => {
    if (isSimulatingError) return [];

    const query = searchQuery.trim().toLowerCase();

    return SAMPLE_MEDIA_DATA.filter((item) => {
      const matchQuery =
        query === '' ||
        item.title.toLowerCase().includes(query) ||
        item.genres.some((g) => g.toLowerCase().includes(query)) ||
        item.creatorOrStudio.toLowerCase().includes(query);

      const matchCategory =
        selectedCategory === 'Semua Kategori' ||
        item.category === selectedCategory;

      const matchAura =
        selectedAura === 'Semua Suasana' || item.aura === selectedAura;

      return matchQuery && matchCategory && matchAura;
    });
  }, [searchQuery, selectedCategory, selectedAura, isSimulatingError]);

  // Reset all filters handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua Kategori');
    setSelectedAura('Semua Suasana');
    setIsSimulatingError(false);
    setIsMobileMenuOpen(false);
  };

  const auraOptions: MediaAura[] = [
    'Semua Suasana',
    'High Energy',
    'Melancholy',
    'Binge Mode',
    'Chill Vibes',
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans antialiased selection:bg-indigo-600 selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────────
          1. HEADER & NAVBAR (Desktop + Mobile Trigger)
      ───────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#1F293D] transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0">
              <span className="text-white text-sm sm:text-base">▶</span>
            </div>
            <div className="min-w-0">
              <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-white flex items-center">
                Flip
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
                  Play
                </span>
              </span>
              <span className="block text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5 truncate">
                The Vibe Grid
              </span>
            </div>
          </div>

          {/* Desktop Navigation Items (>= 768px) */}
          <nav
            className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium text-slate-300"
            aria-label="Navigasi Desktop"
          >
            {(
              [
                'Semua Kategori',
                'Anime',
                'Manga',
                'Drama',
                'Light Novel',
              ] as MediaCategory[]
            ).map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl transition-all relative ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryNavPill"
                      className="absolute inset-0 bg-indigo-600/20 border border-indigo-500/30 rounded-xl"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Desktop Reset Filter & Mobile Menu Hamburger (< 768px) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleResetFilters}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            >
              <span>↺</span>
              <span>Reset</span>
            </button>

            {/* Mobile Hamburger Button (< 768px) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              aria-label="Buka menu navigasi"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────
          2. MOBILE SLIDE-OVER DRAWER MENU (< 768px)
      ───────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-72 max-w-full bg-[#0F172A] border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl z-10"
              role="dialog"
              aria-modal="true"
              aria-label="Menu Navigasi Mobile"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-white">
                      Flip
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
                        Play
                      </span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="Tutup menu"
                  >
                    ✕
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Kategori Media
                  </p>
                  {(
                    [
                      'Semua Kategori',
                      'Anime',
                      'Manga',
                      'Drama',
                      'Light Novel',
                    ] as MediaCategory[]
                  ).map((cat) => {
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                          isActive
                            ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>{cat}</span>
                        {isActive && <span className="text-xs">✔</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>↺</span>
                  <span>Reset Semua Filter</span>
                </button>
                <p className="text-[10px] text-center text-slate-500">
                  FlipPlay The Vibe Grid v2.0
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────────
          3. MAIN CONTENT AREA
      ───────────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-14 w-full flex-1">
        {/* RESPONSIVE HERO SECTION (1-Column Mobile -> 2-Column Desktop) */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headline & Value Prop */}
            <div className="space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span>Koleksi Terkurasi</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2]">
                The Vibe{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-300">
                  Grid
                </span>{' '}
                Hub
              </h1>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Temukan rekomendasi anime, manga, dan drama favoritmu sesuai
                suasana hati.
              </p>

              {/* Value Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-slate-300">
                <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5">
                  <span className="text-indigo-400">⚡</span> Real-time Filter
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5">
                  <span className="text-pink-400">🎬</span> 4K Ultra HD
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5">
                  <span className="text-cyan-400">📖</span> Digital Reader
                </span>
              </div>
            </div>

            {/* Right Column: Featured Interactive Showcase Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-45 transition duration-500" />
              <div className="relative bg-[#111827] border border-slate-800/90 rounded-3xl overflow-hidden p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center gap-5">
                <img
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80"
                  alt="Featured Highlight"
                  className="w-full sm:w-40 aspect-[4/3] sm:aspect-square object-cover rounded-2xl shadow-md"
                />
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 uppercase">
                      Pilihan Minggu Ini
                    </span>
                    <span className="text-amber-400 text-xs font-semibold">
                      ★ 9.9 / 10
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    Naruto Shippuden & Arc Terpenting
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    Ikuti perjalanan epik dunia shinobi dengan visual tajam dan
                    pilihan audio dual-track.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedModalMedia(SAMPLE_MEDIA_DATA[0])}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors pt-1"
                  >
                    <span>Eksplorasi Sekarang</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTROL PANEL: Search Bar & Filter Suasana Hati */}
        <section className="bg-[#111827]/90 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl mb-10 space-y-5">
          {/* Top Row: Search Input & Category Dropdown */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <label htmlFor="searchQuery" className="sr-only">
                Cari judul media
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                  🔍
                </span>
                <input
                  type="text"
                  id="searchQuery"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul anime, manga, drama, atau novel..."
                  className="w-full pl-11 pr-10 py-3 bg-[#0B0F19] border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    title="Hapus pencarian"
                    aria-label="Hapus kata kunci pencarian"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Dropdown (Desktop & Quick Switch) */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="selectedCategory"
                className="text-xs text-slate-400 font-medium flex-shrink-0"
              >
                Kategori:
              </label>
              <select
                id="selectedCategory"
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value as MediaCategory)
                }
                className="px-3.5 py-3 bg-[#0B0F19] border border-slate-800 focus:border-indigo-500 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="Semua Kategori">Semua Kategori</option>
                <option value="Anime">Anime</option>
                <option value="Manga">Manga</option>
                <option value="Drama">Drama</option>
                <option value="Light Novel">Light Novel</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Filter Suasana Hati with Animated Tabs */}
          <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <span>✨</span>
                <span>Filter Suasana Hati:</span>
              </span>

              {/* Real-time Count Badge */}
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full border transition-colors ${
                  isSimulatingError
                    ? 'text-rose-400 bg-rose-950/60 border-rose-800/50'
                    : 'text-indigo-300 bg-indigo-950/60 border-indigo-800/40'
                }`}
              >
                {isSimulatingError
                  ? 'Gagal memuat'
                  : `${filteredMedia.length} media ditemukan`}
              </span>
            </div>

            {/* Aura Pills with Smooth Animated Indicator */}
            <div
              className="flex flex-wrap items-center gap-2"
              role="tablist"
              aria-label="Pilihan Suasana Hati"
            >
              {auraOptions.map((aura) => {
                const isActive = selectedAura === aura;
                const icon =
                  aura === 'Semua Suasana' ? '🌐' : AURA_CONFIG[aura]?.icon;

                return (
                  <button
                    key={aura}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedAura(aura)}
                    className={`relative px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-300 hover:text-white bg-slate-800/70 border border-slate-700/60'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeAuraTabPill"
                        className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-600/30"
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10 text-xs">{icon}</span>
                    <span className="relative z-10">{aura}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────
            CONTENT VIEWS: ERROR STATE / EMPTY STATE / ANIMATED MEDIA GRID
        ───────────────────────────────────────────────────────────────── */}
        {isSimulatingError ? (
          /* Error State with sleek Retry Button */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-10 p-8 rounded-3xl bg-rose-950/25 border border-rose-500/30 text-center space-y-4 max-w-lg mx-auto shadow-2xl"
          >
            <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mx-auto">
              ⚠️
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                Gagal Mengambil Data Media
              </h3>
              <p className="text-sm text-rose-300/90 leading-relaxed">
                Terjadi simulasi gangguan koneksi jaringan (Simulated Network
                Error / HTTP Timeout).
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSimulatingError(false)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors inline-flex items-center gap-2 shadow-lg shadow-rose-600/20"
              >
                <span>↺</span>
                <span>Coba Lagi / Pulihkan Koneksi</span>
              </button>
            </div>
          </motion.div>
        ) : filteredMedia.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 text-center space-y-3"
          >
            <div className="w-16 h-16 rounded-full bg-slate-800/80 text-slate-500 flex items-center justify-center text-2xl mx-auto">
              🎬
            </div>
            <h3 className="text-lg font-bold text-white">
              Tidak Ada Media yang Cocok
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ditemukan judul yang cocok dengan kata kunci atau filter yang
              Anda pilih.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/40 transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          </motion.div>
        ) : (
          /* Dynamic Card Grid with Micro-Animations (Fade-in & Scale) */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredMedia.map((item) => {
                const auraMeta = AURA_CONFIG[item.aura];

                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    whileHover={{ scale: 1.03 }}
                    className="group relative bg-[#111827] border border-slate-800/80 hover:border-indigo-500/70 hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.35)] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Media Thumbnail with Elegant Image Gradient Overlay */}
                      <figure className="relative aspect-video overflow-hidden bg-slate-900">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {/* Elegant Gradient Overlay at the bottom for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/40 to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-950/75 backdrop-blur-md border border-white/10 text-slate-200">
                            {item.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-medium rounded-md backdrop-blur-md border ${auraMeta.badgeClass} flex items-center gap-1`}
                          >
                            <span>{auraMeta.icon}</span>
                            <span>{item.aura}</span>
                          </span>
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-950/75 text-amber-400 flex items-center gap-1 backdrop-blur-md border border-white/10">
                            <span>★</span>
                            <span>{item.rating.toFixed(1)}</span>
                          </span>
                        </div>
                      </figure>

                      {/* Card Body */}
                      <div className="p-4 space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {item.genres.slice(0, 3).map((genre) => (
                            <span
                              key={genre}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/50 text-slate-400 font-medium"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>

                        <h2
                          className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1"
                          title={item.title}
                        >
                          {item.title}
                        </h2>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.synopsis}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-4 pt-0 border-t border-slate-800/80 flex items-center justify-between mt-3">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {item.episodesOrChapters}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedModalMedia(item)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-transparent font-medium text-xs transition-colors flex items-center gap-1.5"
                      >
                        <span>Lihat Detail</span>
                        <span className="text-[10px]">→</span>
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────────
          4. MODAL DETAIL POPUP (Animated with Framer Motion)
      ───────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedModalMedia && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedModalMedia(null)}
              aria-hidden="true"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#111827] border border-[#1F293D] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedModalMedia(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
                title="Tutup dialog detail"
                aria-label="Tutup dialog"
              >
                ✕
              </button>

              {/* Modal Image */}
              <figure className="relative aspect-video overflow-hidden">
                <img
                  src={selectedModalMedia.image}
                  alt={selectedModalMedia.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 flex gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-indigo-600 text-white">
                    {selectedModalMedia.category}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-pink-600 text-white">
                    {selectedModalMedia.aura}
                  </span>
                </div>
              </figure>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                    <span>
                      {selectedModalMedia.episodesOrChapters} • Tahun{' '}
                      {selectedModalMedia.year}
                    </span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      ★ {selectedModalMedia.rating.toFixed(1)} / 10
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedModalMedia.title}
                  </h3>
                  <p className="text-xs text-indigo-400 font-medium mt-0.5">
                    Kreator / Studio: {selectedModalMedia.creatorOrStudio}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedModalMedia.genres.map((g) => (
                      <span
                        key={g}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-h-36 overflow-y-auto pr-1">
                  {selectedModalMedia.synopsis}
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      alert(`Memutar konten: ${selectedModalMedia.title}`)
                    }
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Mulai Nonton / Baca Sekarang</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────────
          5. FLOATING DEVELOPER DRAWER (Animated Toggle)
      ───────────────────────────────────────────────────────────────── */}
      <aside
        className="fixed bottom-5 right-5 z-40 flex flex-col items-end"
        aria-label="Developer & Testing Drawer"
      >
        <AnimatePresence>
          {isDevToolsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-3 w-72 bg-[#111827]/95 border border-[#1F293D] rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSimulatingError ? 'bg-rose-500' : 'bg-emerald-400'
                    }`}
                  />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Dev Controls
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDevToolsOpen(false)}
                  className="text-slate-400 hover:text-white text-xs p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Tutup Panel Dev"
                >
                  ✕
                </button>
              </div>

              {/* Controls */}
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 leading-tight">
                  Simulasi kondisi error dan reset data katalog secara real-time.
                </p>

                {/* Toggle Error State Button */}
                <button
                  type="button"
                  onClick={() => setIsSimulatingError((prev) => !prev)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-between group ${
                    isSimulatingError
                      ? 'border-rose-500/50 bg-rose-950/40 text-rose-300'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Simulasi Error State</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      isSimulatingError
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-700/60 text-slate-400'
                    }`}
                  >
                    {isSimulatingError ? 'ON' : 'OFF'}
                  </span>
                </button>

                {/* Reset All Filters Button */}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span>↺</span>
                    <span>Reset Semua Filter</span>
                  </span>
                  <span className="text-[10px] text-slate-500">→</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger Button (Floating Pill) */}
        <button
          type="button"
          onClick={() => setIsDevToolsOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#111827]/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/70 shadow-xl backdrop-blur-md text-xs font-medium transition-all group"
          title="Buka panel developer & pengujian"
          aria-expanded={isDevToolsOpen}
        >
          <span className="text-indigo-400 group-hover:rotate-45 transition-transform duration-300 text-xs">
            ⚙️
          </span>
          <span>Dev Tools</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSimulatingError ? 'bg-rose-500' : 'bg-emerald-400'
            }`}
          />
        </button>
      </aside>

      {/* ─────────────────────────────────────────────────────────────────
          6. FOOTER
      ───────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0B0F19] border-t border-slate-800/80 py-8 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p>&copy; 2026 FlipPlay Technologies Inc. The Vibe Grid.</p>
          <p className="text-slate-600">
            Platform kurasi hiburan digital terpadu untuk anime, manga, drama,
            dan light novel.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FlipPlayApp;
