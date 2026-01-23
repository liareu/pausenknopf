import { useState, useEffect, useRef } from 'react';
import { categories, cards, Category, Card, recoveryTypes, RecoveryType, situations, Situation } from './data/cards';
import { motion, AnimatePresence } from 'motion/react';
import backgroundImage from '../assets/background-optimized.jpg';
import backgroundStart from '../assets/background-start.jpg';
import logoSvg from '../assets/logo.svg';
import knopfSvg from '../assets/knopf.svg';
import innererSichererOrtAudio from '../assets/innerer-sicherer-ort.m4a';
import { ErrorBoundary } from './components/ErrorBoundary';

// Audio files mapping
const audioFiles: Record<string, string> = {
  'innerer-sicherer-ort.m4a': innererSichererOrtAudio
};
import { MotionProvider, useMotion } from './context/MotionContext';
import { FavoritesProvider, useFavoritesContext } from './context/FavoritesContext';
import { Wind, BatteryMedium, Shuffle, AlertCircle, Phone, Star, Plus, Minus, Heart, Compass, House, Search, X, Moon, CloudRain, Cloud, Zap } from 'lucide-react';

// Icon mapping for situations
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'AlertCircle': AlertCircle,
  'Moon': Moon,
  'CloudRain': CloudRain,
  'Wind': Wind,
  'Cloud': Cloud,
  'Zap': Zap
};

// Search utility function
function searchCards(query: string, allCards: Card[]): Card[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();

  return allCards.filter(card => {
    // Search in title
    if (card.title.toLowerCase().includes(normalizedQuery)) return true;

    // Search in text
    if (card.text.toLowerCase().includes(normalizedQuery)) return true;

    // Search in hashtags
    if (card.hashtags.some(tag => tag.toLowerCase().includes(normalizedQuery))) return true;

    return false;
  });
}

function BottomNav({
  currentTab,
  onTabChange,
  onHome,
  onFavorites
}: {
  currentTab: 'exercises' | 'recovery' | 'favorites' | 'none';
  onTabChange: (tab: 'exercises' | 'recovery') => void;
  onHome: () => void;
  onFavorites: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 px-6 flex justify-center">
      <div className="bg-black rounded-full shadow-2xl px-6 py-3 flex items-center gap-4">
        <button
          onClick={onHome}
          className={`transition-colors text-sm px-3 py-2 rounded-full ${currentTab === 'none' ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white'}`}
          aria-label="Zur Startseite"
        >
          Start
        </button>

        <button
          onClick={() => onTabChange('exercises')}
          className={`transition-colors text-sm px-3 py-2 rounded-full ${currentTab === 'exercises' ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white'}`}
          aria-label="Was hilft jetzt?"
        >
          Übungen
        </button>

        <button
          onClick={() => onTabChange('recovery')}
          className={`transition-colors text-sm px-3 py-2 rounded-full ${currentTab === 'recovery' ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white'}`}
          aria-label="Was fehlt mir?"
        >
          Erholung
        </button>

        <button
          onClick={onFavorites}
          className={`transition-colors text-sm px-3 py-2 rounded-full ${currentTab === 'favorites' ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white'}`}
          aria-label="Meine Favoriten"
        >
          Favoriten
        </button>
      </div>
    </div>
  );
}

type Screen =
  | { type: 'start' }
  | { type: 'sos' }
  | { type: 'favorites' }
  | { type: 'orientation' }
  | { type: 'situations' }
  | { type: 'situation-result'; situationId: string }
  | { type: 'recovery-types' }
  | { type: 'recovery-detail'; recoveryId: string }
  | { type: 'questionnaire' }
  | { type: 'questionnaire-result'; selectedSigns: string[] }
  | { type: 'category'; categoryId: string }
  | { type: 'card'; cardId: string }
  | { type: 'impressum' }
  | { type: 'datenschutz' };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'start' });
  const [screenHistory, setScreenHistory] = useState<Screen[]>([]);
  const [currentTab, setCurrentTab] = useState<'exercises' | 'recovery'>('exercises');

  const navigateTo = (newScreen: Screen) => {
    setScreenHistory(prev => [...prev, screen]);
    setScreen(newScreen);
  };

  const navigateBack = () => {
    if (screenHistory.length > 0) {
      const previousScreen = screenHistory[screenHistory.length - 1];
      setScreen(previousScreen);
      setScreenHistory(prev => prev.slice(0, -1));
    } else {
      setScreen({ type: 'start' });
    }
  };

  const navigateHome = () => {
    setScreenHistory([]);
    setScreen({ type: 'start' });
  };

  const handleTabChange = (tab: 'exercises' | 'recovery') => {
    setCurrentTab(tab);
    setScreenHistory([]);
    if (tab === 'exercises') {
      setScreen({ type: 'orientation' });
    } else {
      setScreen({ type: 'recovery-types' });
    }
  };

  // Determine current tab based on screen type
  const isExercisesFlow = screen.type === 'orientation' || screen.type === 'category' || screen.type === 'card';
  const isRecoveryFlow = screen.type === 'recovery-types' || screen.type === 'recovery-detail' || screen.type === 'questionnaire' || screen.type === 'questionnaire-result';
  const isFavoritesFlow = screen.type === 'favorites';
  const hideBottomNav = screen.type === 'impressum' || screen.type === 'datenschutz';
  const showBottomNav = !hideBottomNav;

  const renderScreen = () => {
    switch (screen.type) {
      case 'start':
        return (
          <StartScreen
            key="start"
            onSOS={() => setScreen({ type: 'sos' })}
            onExercises={() => setScreen({ type: 'orientation' })}
            onRecovery={() => setScreen({ type: 'recovery-types' })}
            onSituations={() => setScreen({ type: 'situations' })}
            onSelectCategory={(categoryId) => setScreen({ type: 'category', categoryId })}
            onImpressum={() => navigateTo({ type: 'impressum' })}
            onDatenschutz={() => navigateTo({ type: 'datenschutz' })}
          />
        );
      case 'sos':
        return <SOSScreen key="sos" onBack={() => setScreen({ type: 'start' })} onHome={navigateHome} />;
      case 'favorites':
        return (
          <FavoritesScreen
            key="favorites"
            onSelectCard={(cardId) => setScreen({ type: 'card', cardId })}
            onBack={() => setScreen({ type: 'start' })}
            onHome={navigateHome}
          />
        );
      case 'situations':
        return (
          <SituationsScreen
            key="situations"
            onSelectSituation={(situationId) => setScreen({ type: 'situation-result', situationId })}
            onBack={() => setScreen({ type: 'start' })}
            onHome={navigateHome}
          />
        );
      case 'situation-result':
        return (
          <SituationResultScreen
            key={`situation-${screen.situationId}`}
            situationId={screen.situationId}
            onSelectCard={(cardId) => setScreen({ type: 'card', cardId })}
            onBack={() => setScreen({ type: 'situations' })}
            onHome={navigateHome}
          />
        );
      case 'recovery-types':
        return (
          <RecoveryTypesScreen
            key="recovery-types"
            onSelectRecovery={(recoveryId) => setScreen({ type: 'recovery-detail', recoveryId })}
            onStartQuestionnaire={() => setScreen({ type: 'questionnaire' })}
            onHome={navigateHome}
            onBack={() => setScreen({ type: 'start' })}
          />
        );
      case 'recovery-detail':
        return (
          <RecoveryDetailScreen
            key={`recovery-${screen.recoveryId}`}
            recoveryId={screen.recoveryId}
            onBack={() => setScreen({ type: 'recovery-types' })}
            onStartQuestionnaire={() => setScreen({ type: 'questionnaire' })}
            onHome={navigateHome}
          />
        );
      case 'questionnaire':
        return (
          <QuestionnaireScreen
            key="questionnaire"
            onSubmit={(selectedSigns) => setScreen({ type: 'questionnaire-result', selectedSigns })}
            onBack={() => setScreen({ type: 'recovery-types' })}
            onHome={navigateHome}
          />
        );
      case 'questionnaire-result':
        return (
          <QuestionnaireResultScreen
            key="questionnaire-result"
            selectedSigns={screen.selectedSigns}
            onViewDetail={(recoveryId) => setScreen({ type: 'recovery-detail', recoveryId })}
            onRetry={() => setScreen({ type: 'questionnaire' })}
            onBack={() => setScreen({ type: 'recovery-types' })}
            onHome={navigateHome}
          />
        );
      case 'orientation':
        return (
          <OrientationScreen
            key="orientation"
            onSelectCategory={(categoryId) => setScreen({ type: 'category', categoryId })}
            onSelectCard={(cardId) => setScreen({ type: 'card', cardId })}
            onHome={navigateHome}
          />
        );
      case 'category':
        return (
          <CategoryScreen
            key={`category-${screen.categoryId}`}
            categoryId={screen.categoryId}
            onSelectCard={(cardId) => setScreen({ type: 'card', cardId })}
            onBack={() => setScreen({ type: 'orientation' })}
            onHome={navigateHome}
          />
        );
      case 'card':
        return (
          <CardDetailScreen
            key={`card-${screen.cardId}`}
            cardId={screen.cardId}
            onBack={() => {
              const card = cards.find(c => c.id === screen.cardId);
              if (card) {
                setScreen({ type: 'category', categoryId: card.categoryId });
              }
            }}
            onRandomCard={() => {
              const randomCard = cards[Math.floor(Math.random() * cards.length)];
              setScreen({ type: 'card', cardId: randomCard.id });
            }}
            onHome={navigateHome}
          />
        );
      case 'impressum':
        return <ImpressumScreen key="impressum" onBack={navigateBack} onHome={navigateHome} />;
      case 'datenschutz':
        return <DatenschutzScreen key="datenschutz" onBack={navigateBack} onHome={navigateHome} />;
      default:
        return (
          <StartScreen
            key="start"
            onSOS={() => setScreen({ type: 'sos' })}
            onExercises={() => setScreen({ type: 'orientation' })}
            onRecovery={() => setScreen({ type: 'recovery-types' })}
            onSelectCategory={(categoryId) => setScreen({ type: 'category', categoryId })}
            onImpressum={() => navigateTo({ type: 'impressum' })}
            onDatenschutz={() => navigateTo({ type: 'datenschutz' })}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <FavoritesProvider>
        <MotionProvider>
          <div className="min-h-screen bg-[#FDF7F3]" role="application" aria-label="Pausenknopf App">
            <AnimatePresence mode="wait">
              {renderScreen()}
            </AnimatePresence>
            {showBottomNav && (
              <BottomNav
                currentTab={isExercisesFlow ? 'exercises' : isRecoveryFlow ? 'recovery' : isFavoritesFlow ? 'favorites' : 'none'}
                onTabChange={handleTabChange}
                onHome={navigateHome}
                onFavorites={() => setScreen({ type: 'favorites' })}
              />
            )}
          </div>
        </MotionProvider>
      </FavoritesProvider>
    </ErrorBoundary>
  );
}

function StartScreen({
  onSOS,
  onExercises,
  onRecovery,
  onSituations,
  onSelectCategory,
  onImpressum,
  onDatenschutz
}: {
  onSOS: () => void;
  onExercises: () => void;
  onRecovery: () => void;
  onSituations: () => void;
  onSelectCategory: (categoryId: string) => void;
  onImpressum: () => void;
  onDatenschutz: () => void;
}) {

  // Floating blobs animation
  const floatingBlobs = [
    { color: '#6B9BD1', size: 60, delay: 0, x: '10%', y: '15%' },
    { color: '#D4A5A5', size: 80, delay: 2, x: '85%', y: '20%' },
    { color: '#E8C4A0', size: 50, delay: 4, x: '75%', y: '70%' },
    { color: '#F4A261', size: 70, delay: 1, x: '15%', y: '75%' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
      role="main"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />

      {/* Floating decorative blobs */}
      {floatingBlobs.map((blob, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full opacity-20 blur-2xl"
          style={{
            backgroundColor: blob.color,
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            delay: blob.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Content */}
      <div className="max-w-md w-full text-center space-y-6 relative z-10 pb-40">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex justify-center mb-4"
        >
          <img src={logoSvg} alt="Pausenknopf Logo" className="w-44 h-44" />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-black text-lg leading-relaxed px-4"
          style={{ letterSpacing: '0.01em' }}
        >
          Für Momente, die gerade viel sind
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6 pt-4"
        >
          {/* Panik Button - mit Gradient und pulsierendem Ring */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSOS}
            className="w-full py-10 px-8 bg-gradient-to-br from-[#D97850] to-[#c76942] text-white rounded-3xl shadow-2xl relative overflow-hidden group"
            aria-label="Panik Button - Schnelle Atemübung"
          >
            {/* Pulsierender Ring */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-3xl border-4 border-white"
            />

            {/* Subtiler Glanz-Effekt */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent group-hover:via-white/20 transition-all duration-500" />

            <div className="space-y-3 relative text-center">
              <p className="text-4xl" style={{ letterSpacing: '0.02em' }}>Panik-Button</p>
              <p className="text-base opacity-90" style={{ letterSpacing: '0.01em' }}>Schnelle Atemübung</p>
            </div>
          </motion.button>

          {/* Schnellzugriff Kategorien - Tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap gap-2 justify-center px-4"
          >
            {categories.slice(0, 6).map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + index * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCategory(category.id)}
                className={`${category.colorClass} px-4 py-2 rounded-full text-xs shadow-md hover:shadow-lg transition-all`}
                style={{ letterSpacing: '0.01em' }}
              >
                {category.keyword}
              </motion.button>
            ))}
          </motion.div>

          {/* Hauptnavigation - mit Cards */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExercises}
              className="py-8 px-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-black/10 relative overflow-hidden group"
              aria-label="Was hilft jetzt?"
            >
              {/* Solid Color Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#D97850] group-hover:opacity-100 transition-opacity" />

              <div className="space-y-2 text-left">
                <p className="text-xl text-black" style={{ letterSpacing: '0.01em' }}>Was hilft jetzt?</p>
                <p className="text-xs text-neutral-600" style={{ letterSpacing: '0.01em' }}>Übungen für den Moment</p>
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRecovery}
              className="py-8 px-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-black/10 relative overflow-hidden group"
              aria-label="Was fehlt mir?"
            >
              {/* Solid Color Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E5C5B5] group-hover:opacity-100 transition-opacity" />

              <div className="space-y-2 text-left">
                <p className="text-xl text-black" style={{ letterSpacing: '0.01em' }}>Was fehlt mir?</p>
                <p className="text-xs text-neutral-600" style={{ letterSpacing: '0.01em' }}>Finde deine Erholung</p>
              </div>
            </motion.button>
          </div>

          {/* Situations Button - full width */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSituations}
            className="w-full py-8 px-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-black/10 relative overflow-hidden group"
            aria-label="Wie fühlst du dich?"
          >
            {/* Solid Color Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F4A261] group-hover:opacity-100 transition-opacity" />

            <div className="space-y-2 text-center">
              <p className="text-xl text-black" style={{ letterSpacing: '0.01em' }}>Wie fühlst du dich?</p>
              <p className="text-xs text-neutral-600" style={{ letterSpacing: '0.01em' }}>Finde Übungen nach Situation</p>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute bottom-28 left-0 right-0 px-6"
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="text-center">
            <p className="text-[10px] text-black font-bold uppercase" style={{ letterSpacing: '0.01em' }}>
              mit liebe entwickelt von Julia Reuter für dich {'<3'}
            </p>
          </div>
          <div className="flex justify-center gap-4 text-[8px] text-neutral-500">
            <button
              onClick={onImpressum}
              className="hover:text-neutral-700 transition-colors"
            >
              Impressum
            </button>
            <span>·</span>
            <button
              onClick={onDatenschutz}
              className="hover:text-neutral-700 transition-colors"
            >
              Datenschutz
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SearchInput({
  value,
  onChange,
  onClear
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="relative"
    >
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Übungen durchsuchen..."
        className="w-full py-4 pl-12 pr-12 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black/20 placeholder:text-neutral-400 transition-all"
        aria-label="Übungen durchsuchen"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Suche löschen"
        >
          <X size={20} />
        </button>
      )}
    </motion.div>
  );
}

function SearchResults({
  results,
  onSelectCard,
  searchQuery
}: {
  results: Card[];
  onSelectCard: (cardId: string) => void;
  searchQuery: string;
}) {
  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex-1 flex items-center justify-center py-12"
      >
        <div className="text-center space-y-4">
          <Search size={64} className="mx-auto text-neutral-300" />
          <p className="text-neutral-600" style={{ letterSpacing: '0.01em' }}>
            Keine Ergebnisse für "{searchQuery}"
          </p>
          <p className="text-sm text-neutral-500" style={{ letterSpacing: '0.01em' }}>
            Versuche einen anderen Suchbegriff
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3 pt-4">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-neutral-600 text-center"
        style={{ letterSpacing: '0.01em' }}
      >
        {results.length} {results.length === 1 ? 'Übung' : 'Übungen'} gefunden
      </motion.p>
      {results.map((card, index) => {
        const category = categories.find(c => c.id === card.categoryId);
        return (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.06, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCard(card.id)}
            className="w-full p-6 bg-white/75 backdrop-blur-sm hover:shadow-md active:shadow-sm transition-shadow rounded-2xl text-left border border-neutral-200"
            style={{ borderLeftWidth: '4px', borderLeftColor: category?.color || '#000' }}
            aria-label={`Karte ${card.title} öffnen`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${category?.color}40`, color: category?.color }}
                  >
                    {category?.keyword}
                  </span>
                </div>
                <h3 className="text-lg font-semibold" style={{ letterSpacing: '0.01em' }}>
                  {card.title}
                </h3>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function OrientationScreen({ onSelectCategory, onSelectCard, onHome }: { onSelectCategory: (categoryId: string) => void; onSelectCard: (cardId: string) => void; onHome: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debouncing für Performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchResults = searchCards(debouncedQuery, cards);
  const isSearching = debouncedQuery.trim().length > 0;

  const getRandomCard = () => {
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    onSelectCard(randomCard.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col px-6 py-12 pb-32 relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <div className="max-w-md w-full mx-auto space-y-4 flex-1 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3 text-center"
        >
          <h1 className="text-2xl" style={{ letterSpacing: '0.02em' }}>Was brauchst du gerade?</h1>
        </motion.div>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={getRandomCard}
          className="w-full py-5 px-6 bg-black/85 text-white rounded-2xl hover:bg-black/90 active:bg-black/80 transition-all font-medium shadow-sm backdrop-blur-sm"
          style={{ letterSpacing: '0.01em' }}
          aria-label="Zufällige Karte auswählen"
        >
          Zeig mir eine zufällige Karte
        </motion.button>

        {isSearching ? (
          <SearchResults
            results={searchResults}
            onSelectCard={onSelectCard}
            searchQuery={debouncedQuery}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.06, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectCategory(category.id)}
                className="rounded-2xl hover:shadow-md active:shadow-sm transition-all shadow-sm aspect-square flex flex-col justify-center items-center p-6 text-center backdrop-blur-sm"
                style={{ backgroundColor: `${category.color}99` }}
                aria-label={`Kategorie ${category.name} auswählen`}
              >
                <div className="space-y-2 w-full text-center flex flex-col items-center justify-center px-2">
                  <h3
                    className="text-xl font-serif text-neutral-900 break-words"
                    style={{
                      fontFamily: 'Rufina, serif',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {category.keyword}
                  </h3>
                  <p className="text-sm text-neutral-900 leading-snug break-words" style={{ letterSpacing: '0.01em' }}>
                    {category.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center mt-3 w-full">
                    {category.badgeLabels.map((badge) => (
                      <span key={badge} className="text-xs text-neutral-900 px-2 py-1 bg-white/70 rounded-full backdrop-blur-sm break-words font-medium">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

      </div>
    </motion.div>
  );
}

function CategoryScreen({
  categoryId,
  onSelectCard,
  onBack,
  onHome
}: {
  categoryId: string;
  onSelectCard: (cardId: string) => void;
  onBack: () => void;
  onHome: () => void;
}) {
  const category = categories.find(c => c.id === categoryId);
  const categoryCards = cards.filter(c => c.categoryId === categoryId);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="text-center space-y-4">
          <p className="text-neutral-600">Kategorie nicht gefunden</p>
          <button
            onClick={onBack}
            className="w-full max-w-xs mx-auto py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center block"
            aria-label="Zurück"
          >
            ← Zurück
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className={`${category.colorClass} text-white px-6 py-8 relative z-10`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <p className="text-sm opacity-90 block px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm w-fit">{category.label.split(' – ')[1] || category.label}</p>
          <h2 className="text-4xl text-black" style={{ letterSpacing: '0.02em' }}>{category.name}</h2>
          <p className="opacity-90 leading-relaxed">{category.description}</p>
        </div>
      </motion.div>

      <div className="max-w-md mx-auto px-6 py-8 pb-32 space-y-4 relative z-10">
        {categoryCards.map((card, index) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.06, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCard(card.id)}
            className="w-full py-8 px-8 bg-white/75 backdrop-blur-sm hover:shadow-md active:shadow-sm transition-shadow rounded-2xl text-center border border-neutral-200"
            aria-label={`Karte ${card.title} öffnen`}
          >
            <h3 className="text-lg" style={{ letterSpacing: '0.01em' }}>{card.title}</h3>
          </motion.button>
        ))}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center mt-8"
          aria-label="Zurück"
        >
          ← Zurück
        </motion.button>
      </div>
    </motion.div>
  );
}

// Audio Player Component
function AudioPlayer({ audioFile }: { audioFile: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-neutral-200"
    >
      <audio
        ref={audioRef}
        src={audioFiles[audioFile] || audioFile}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlayPause}
            className="w-16 h-16 flex items-center justify-center bg-black text-white rounded-full hover:bg-neutral-800 transition-colors"
            aria-label={isPlaying ? "Pause" : "Abspielen"}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
          />
          <div className="flex justify-between text-xs text-neutral-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Wiederverwendbare Atemkreis-Komponente
function BreathingCircle() {
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;

        setBreathPhase((phase) => {
          if (phase === 'in') {
            setCountdown(4);
            return 'hold';
          } else if (phase === 'hold') {
            setCountdown(4);
            return 'out';
          } else {
            setCountdown(4);
            return 'in';
          }
        });
        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const phaseText = {
    in: 'Einatmen',
    hold: 'Halten',
    out: 'Ausatmen'
  };

  const phaseColor = {
    in: 'bg-[#6B9BD1]',
    hold: 'bg-[#D4A5A5]',
    out: 'bg-[#E8C4A0]'
  };

  return (
    <motion.div className="flex flex-col items-center justify-center space-y-16 py-8">
      <motion.div
        animate={{
          scale: breathPhase === 'in' ? 1.5 : breathPhase === 'hold' ? 1.5 : 1,
        }}
        transition={{ duration: breathPhase === 'hold' ? 0 : 4, ease: "easeInOut" }}
        className={`w-32 h-32 rounded-full ${phaseColor[breathPhase]} flex items-center justify-center text-white text-4xl font-bold shadow-2xl`}
      >
        {countdown}
      </motion.div>

      <motion.div
        key={breathPhase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-2xl font-bold text-neutral-800" style={{ letterSpacing: '0.02em' }}>
          {phaseText[breathPhase]}
        </p>
      </motion.div>
    </motion.div>
  );
}

function CardDetailScreen({ cardId, onBack, onRandomCard, onHome }: { cardId: string; onBack: () => void; onRandomCard: () => void; onHome: () => void }) {
  const card = cards.find(c => c.id === cardId);
  const category = card ? categories.find(c => c.id === card.categoryId) : null;
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  // Prüfe ob es eine Atemübung ist (Kategorie "blau")
  const isBreathingExercise = category?.id === 'blau';

  if (!card || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="text-center space-y-4">
          <p className="text-neutral-600">Karte nicht gefunden</p>
          <button
            onClick={onBack}
            className="w-full max-w-xs mx-auto py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center block"
            aria-label="Zurück"
          >
            ← Zurück
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className={`${category.colorClass} px-6 py-6 relative z-10`}
      >
        <div className="max-w-md mx-auto space-y-2">
          <p className="text-white text-sm opacity-90">{category.label.split(' – ')[1] || category.label}</p>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 relative z-10">
        <div className="max-w-md w-full space-y-8">
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-2xl text-center"
              style={{ letterSpacing: '0.02em' }}
            >
              {card.title}
            </motion.h2>
          </div>

          {/* Atemkreis nur für Atemübungen (Kategorie "blau") */}
          {isBreathingExercise && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <BreathingCircle />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-4"
          >
            <p className="text-lg whitespace-pre-line leading-loose text-neutral-700" style={{ letterSpacing: '0.01em' }}>
              {card.text}
            </p>
          </motion.div>

          {/* Audio Player wenn vorhanden */}
          {card.audioFile && (
            <AudioPlayer audioFile={card.audioFile} />
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap gap-2 justify-center pt-4"
          >
            {card.hashtags.map((tag) => (
              <span key={tag} className="text-xs text-neutral-500">
                #{tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="px-6 py-6 pb-32 relative z-10"
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFavorite(cardId)}
              className={`w-12 h-12 flex items-center justify-center ${
                isFavorite(cardId)
                  ? 'bg-[#F4A261] text-white'
                  : 'bg-white text-neutral-600 border-2 border-neutral-300'
              } hover:opacity-80 transition-all rounded-full outline-none focus:outline-none`}
              aria-label={isFavorite(cardId) ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
            >
              <Heart size={20} className={isFavorite(cardId) ? 'fill-current' : ''} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRandomCard}
              className="w-12 h-12 flex items-center justify-center bg-black text-white hover:bg-neutral-800 transition-colors rounded-full outline-none focus:outline-none"
              aria-label="Noch eine zufällige Karte anzeigen"
            >
              <Shuffle size={20} />
            </motion.button>
          </div>
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center"
            aria-label="Zurück"
          >
            ← Zurück
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ImpressumScreen({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col px-6 py-12 relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <div className="max-w-md w-full mx-auto space-y-6 relative z-10">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onHome}
          className="flex justify-center mx-auto"
          aria-label="Zurück zur Startseite"
        >
          <img src={logoSvg} alt="Pausenknopf Logo" className="w-16 h-16" />
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3 text-center"
        >
          <h2 className="text-2xl" style={{ letterSpacing: '0.02em' }}>Impressum</h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6 text-sm text-neutral-600 leading-relaxed"
          style={{ letterSpacing: '0.01em' }}
        >
          <div>
            <p className="font-medium text-neutral-800 mb-2">Angaben gemäß § 5 TMG</p>
            <p>Julia Reuter</p>
            <p className="mt-2">
              <strong>Kontakt:</strong><br />
              <a href="https://juliareuter-design.com" target="_blank" rel="noopener noreferrer" className="text-neutral-700 hover:text-neutral-900 underline">
                juliareuter-design.com
              </a>
            </p>
          </div>

          <div>
            <p className="font-medium text-neutral-800 mb-2">Haftungsausschluss</p>
            <p className="text-xs leading-relaxed">
              Die Inhalte dieser App wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Die Nutzung der Inhalte erfolgt auf eigene Verantwortung. Diese App ersetzt keine professionelle therapeutische oder medizinische Beratung.
            </p>
          </div>

          <div>
            <p className="font-medium text-neutral-800 mb-2">Urheberrecht</p>
            <p className="text-xs leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf dieser App unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors mt-8"
          aria-label="Zurück zur Startseite"
        >
          ← Zurück
        </motion.button>
      </div>
    </motion.div>
  );
}

function DatenschutzScreen({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col px-6 py-12 relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <div className="max-w-md w-full mx-auto space-y-6 relative z-10">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onHome}
          className="flex justify-center mx-auto"
          aria-label="Zurück zur Startseite"
        >
          <img src={logoSvg} alt="Pausenknopf Logo" className="w-16 h-16" />
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3 text-center"
        >
          <h2 className="text-2xl" style={{ letterSpacing: '0.02em' }}>Datenschutz</h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6 text-sm text-neutral-600 leading-relaxed"
          style={{ letterSpacing: '0.01em' }}
        >
          <div>
            <p className="font-medium text-neutral-800 mb-2">Verantwortliche</p>
            <p>Julia Reuter</p>
            <p className="mt-2">
              <a href="https://juliareuter-design.com" target="_blank" rel="noopener noreferrer" className="text-neutral-700 hover:text-neutral-900 underline">
                juliareuter-design.com
              </a>
            </p>
          </div>

          <div>
            <p className="font-medium text-neutral-800 mb-2">Datenerfassung</p>
            <p className="text-xs leading-relaxed">
              Diese App erfasst und speichert keine personenbezogenen Daten. Alle Inhalte und Übungen werden lokal auf Ihrem Gerät ausgeführt. Es werden keine Daten an externe Server übermittelt.
            </p>
          </div>

          <div>
            <p className="font-medium text-neutral-800 mb-2">Keine Cookies oder Tracking</p>
            <p className="text-xs leading-relaxed">
              Diese App verwendet keine Cookies, Analytics-Tools oder andere Tracking-Mechanismen. Ihre Nutzung bleibt vollständig anonym.
            </p>
          </div>

          <div>
            <p className="font-medium text-neutral-800 mb-2">Ihre Rechte</p>
            <p className="text-xs leading-relaxed">
              Da wir keine personenbezogenen Daten erheben oder speichern, fallen die üblichen Auskunfts-, Berichtigungs- und Löschungsrechte nicht an. Bei Fragen zum Datenschutz können Sie uns über die auf der Impressum-Seite angegebenen Kontaktmöglichkeiten erreichen.
            </p>
          </div>

          <div>
            <p className="font-medium text-neutral-800 mb-2">Änderungen</p>
            <p className="text-xs leading-relaxed">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte rechtliche Rahmenbedingungen oder bei Änderungen der App anzupassen. Die jeweils aktuelle Fassung finden Sie in der App.
            </p>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors mt-8"
          aria-label="Zurück zur Startseite"
        >
          ← Zurück
        </motion.button>
      </div>
    </motion.div>
  );
}
function RecoveryTypesScreen({
  onSelectRecovery,
  onStartQuestionnaire,
  onHome,
  onBack
}: {
  onSelectRecovery: (recoveryId: string) => void;
  onStartQuestionnaire: () => void;
  onHome: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col px-6 py-12 pb-32 relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <div className="max-w-md w-full mx-auto space-y-4 flex-1 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3 text-center"
        >
          <h1 className="text-2xl" style={{ letterSpacing: '0.02em' }}>Welche Art von Erholung brauchst du?</h1>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartQuestionnaire}
          className="w-full py-4 px-6 bg-black/85 text-white hover:bg-black/90 active:bg-black/80 transition-all rounded-lg backdrop-blur-sm"
          aria-label="Fragebogen starten"
        >
          Fragebogen starten
        </motion.button>

        <div className="space-y-4 pt-4">
          {recoveryTypes.map((recovery, index) => (
            <motion.button
              key={recovery.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRecovery(recovery.id)}
              className="w-full rounded-2xl hover:shadow-md active:shadow-sm transition-all shadow-sm p-8 backdrop-blur-sm"
              style={{ backgroundColor: `${recovery.color}99` }}
              aria-label={`${recovery.name} auswählen`}
            >
              <div className="space-y-3 text-center">
                <h2
                  className="text-2xl font-serif text-neutral-900"
                  style={{
                    fontFamily: 'Rufina, serif',
                    letterSpacing: '0.02em'
                  }}
                >
                  {recovery.name}
                </h2>
                <p className="text-sm text-neutral-900 leading-snug" style={{ letterSpacing: '0.01em' }}>
                  {recovery.shortDescription}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RecoveryDetailScreen({
  recoveryId,
  onBack,
  onStartQuestionnaire,
  onHome
}: {
  recoveryId: string;
  onBack: () => void;
  onStartQuestionnaire: () => void;
  onHome: () => void;
}) {
  const recovery = recoveryTypes.find(r => r.id === recoveryId);

  if (!recovery) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="text-center space-y-4">
          <p className="text-neutral-600">Erholungstyp nicht gefunden</p>
          <button
            onClick={onBack}
            className="w-full max-w-xs mx-auto py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center block"
            aria-label="Zurück"
          >
            ← Zurück
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className={`${recovery.colorClass} px-6 py-8 relative z-10`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <h2 className="text-3xl text-black" style={{ letterSpacing: '0.02em' }}>{recovery.title}</h2>
        </div>
      </motion.div>

      <div className="flex-1 max-w-md mx-auto px-6 py-8 space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-medium" style={{ letterSpacing: '0.01em' }}>Mögliche Anzeichen:</h3>
          <ul className="space-y-2 list-disc list-inside text-neutral-700">
            {recovery.signs.map((sign, index) => (
              <li key={index} style={{ letterSpacing: '0.01em' }}>{sign}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-medium" style={{ letterSpacing: '0.01em' }}>Was dir helfen könnte:</h3>
          <ul className="space-y-2 list-disc list-inside text-neutral-700">
            {recovery.helps.map((help, index) => (
              <li key={index} style={{ letterSpacing: '0.01em' }}>{help}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="px-6 py-6 pb-32 relative z-10"
      >
        <div className="max-w-md mx-auto space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartQuestionnaire}
            className="w-full py-4 px-6 bg-black text-white hover:bg-neutral-800 active:bg-neutral-900 transition-colors rounded-lg font-medium"
            aria-label="Fragebogen starten"
          >
            Unsicher? Mach den Fragebogen
          </motion.button>
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center"
            aria-label="Zurück"
          >
            ← Zurück
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SituationsScreen({
  onSelectSituation,
  onBack,
  onHome
}: {
  onSelectSituation: (situationId: string) => void;
  onBack: () => void;
  onHome: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col px-6 py-12 pb-32 relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <div className="max-w-md w-full mx-auto space-y-4 flex-1 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3 text-center"
        >
          <h1 className="text-2xl" style={{ letterSpacing: '0.02em' }}>Wie fühlst du dich gerade?</h1>
          <p className="text-sm text-neutral-600" style={{ letterSpacing: '0.01em' }}>
            Wähle die Situation, die am besten passt
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          {situations.map((situation, index) => {
            const Icon = iconMap[situation.icon];
            return (
              <motion.button
                key={situation.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.06, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectSituation(situation.id)}
                className="rounded-2xl hover:shadow-md active:shadow-sm transition-all shadow-sm aspect-square flex flex-col justify-center items-center p-6 text-center backdrop-blur-sm"
                style={{ backgroundColor: `${situation.color}99` }}
                aria-label={`${situation.name} auswählen`}
              >
                <div className="space-y-2 w-full text-center flex flex-col items-center justify-center">
                  {Icon && <Icon size={48} className="text-neutral-900" />}
                  <h3
                    className="text-lg font-medium text-neutral-900 break-words"
                    style={{ letterSpacing: '0.01em' }}
                  >
                    {situation.name}
                  </h3>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center mt-8"
          aria-label="Zurück"
        >
          ← Zurück
        </motion.button>
      </div>
    </motion.div>
  );
}

function SituationResultScreen({
  situationId,
  onSelectCard,
  onBack,
  onHome
}: {
  situationId: string;
  onSelectCard: (cardId: string) => void;
  onBack: () => void;
  onHome: () => void;
}) {
  const situation = situations.find(s => s.id === situationId);
  const relevantCards = situation ? cards.filter(c => situation.relevantCardIds.includes(c.id)) : [];

  if (!situation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="text-center space-y-4">
          <p className="text-neutral-600">Situation nicht gefunden</p>
          <button
            onClick={onBack}
            className="w-full max-w-xs mx-auto py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center block"
            aria-label="Zurück"
          >
            ← Zurück
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className={`${situation.colorClass} text-white px-6 py-8 relative z-10`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex justify-center">
            {(() => {
              const Icon = iconMap[situation.icon];
              return Icon ? <Icon size={64} className="text-black" /> : null;
            })()}
          </div>
          <h2 className="text-3xl text-center text-black" style={{ letterSpacing: '0.02em' }}>{situation.name}</h2>
          <p className="text-center text-black/80 leading-relaxed" style={{ letterSpacing: '0.01em' }}>
            {situation.description}
          </p>
        </div>
      </motion.div>

      <div className="max-w-md mx-auto px-6 py-8 pb-32 space-y-4 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-sm text-neutral-600 text-center"
          style={{ letterSpacing: '0.01em' }}
        >
          {relevantCards.length} {relevantCards.length === 1 ? 'Übung' : 'Übungen'} für dich
        </motion.p>

        {relevantCards.map((card, index) => {
          const category = categories.find(c => c.id === card.categoryId);
          return (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.06, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCard(card.id)}
              className="w-full p-6 bg-white/75 backdrop-blur-sm hover:shadow-md active:shadow-sm transition-shadow rounded-2xl text-left border border-neutral-200"
              style={{ borderLeftWidth: '4px', borderLeftColor: category?.color || '#000' }}
              aria-label={`Karte ${card.title} öffnen`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${category?.color}40`, color: category?.color }}
                    >
                      {category?.keyword}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold" style={{ letterSpacing: '0.01em' }}>
                    {card.title}
                  </h3>
                </div>
              </div>
            </motion.button>
          );
        })}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center mt-8"
          aria-label="Zurück"
        >
          ← Zurück
        </motion.button>
      </div>
    </motion.div>
  );
}

function QuestionnaireScreen({
  onSubmit,
  onBack,
  onHome
}: {
  onSubmit: (selectedSigns: string[]) => void;
  onBack: () => void;
  onHome: () => void;
}) {
  const [selectedSigns, setSelectedSigns] = useState<string[]>([]);

  const allSigns = recoveryTypes.flatMap(recovery =>
    recovery.signs.map(sign => ({ sign, recoveryId: recovery.id }))
  );

  const toggleSign = (sign: string) => {
    if (selectedSigns.includes(sign)) {
      setSelectedSigns(selectedSigns.filter(s => s !== sign));
    } else {
      setSelectedSigns([...selectedSigns, sign]);
    }
  };

  const handleSubmit = () => {
    if (selectedSigns.length > 0) {
      onSubmit(selectedSigns);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col px-6 py-12 pb-32 relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <div className="max-w-md w-full mx-auto space-y-8 flex-1 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-2xl" style={{ letterSpacing: '0.02em' }}>Welche Anzeichen treffen auf dich zu?</h1>
          <p className="text-sm text-neutral-600" style={{ letterSpacing: '0.01em' }}>
            Wähle alle aus, die du gerade bei dir bemerkst
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3"
        >
          {allSigns.map((item, index) => {
            const isSelected = selectedSigns.includes(item.sign);
            return (
              <motion.button
                key={`${item.recoveryId}-${item.sign}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.03, duration: 0.3 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSign(item.sign)}
                className={`w-full py-4 px-6 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
                aria-label={`${item.sign} ${isSelected ? 'abwählen' : 'auswählen'}`}
              >
                <div className="flex items-center justify-between">
                  <span style={{ letterSpacing: '0.01em' }}>{item.sign}</span>
                  {isSelected && <span>✓</span>}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="space-y-3"
        >
          <motion.button
            animate={{ opacity: selectedSigns.length > 0 ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
            whileHover={selectedSigns.length > 0 ? { scale: 1.02 } : {}}
            whileTap={selectedSigns.length > 0 ? { scale: 0.98 } : {}}
            onClick={handleSubmit}
            disabled={selectedSigns.length === 0}
            className={`w-full py-4 px-6 rounded-lg transition-colors ${
              selectedSigns.length > 0
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
            }`}
            aria-label="Auswertung anzeigen"
          >
            Auswertung ({selectedSigns.length} ausgewählt)
          </motion.button>
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center"
            aria-label="Zurück"
          >
            ← Zurück
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function QuestionnaireResultScreen({
  selectedSigns,
  onViewDetail,
  onRetry,
  onBack,
  onHome
}: {
  selectedSigns: string[];
  onViewDetail: (recoveryId: string) => void;
  onRetry: () => void;
  onBack: () => void;
  onHome: () => void;
}) {
  const scores = recoveryTypes.map(recovery => {
    const matchCount = recovery.signs.filter(sign => selectedSigns.includes(sign)).length;
    return { recovery, matchCount };
  });

  const sortedScores = scores.sort((a, b) => b.matchCount - a.matchCount);
  const bestMatch = sortedScores[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col px-6 py-12 pb-32 relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <div className="max-w-md w-full mx-auto space-y-8 flex-1 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="space-y-4 text-center"
        >
          <h1 className="text-2xl" style={{ letterSpacing: '0.02em' }}>Dein Ergebnis</h1>
        </motion.div>

        {bestMatch.matchCount > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-6"
          >
            <div className={`${bestMatch.recovery.colorClass} rounded-2xl p-8 space-y-4`}>
              <h2 className="text-2xl font-serif text-neutral-900" style={{ fontFamily: 'Rufina, serif', letterSpacing: '0.02em' }}>
                {bestMatch.recovery.name}
              </h2>
              <p className="text-neutral-900 leading-relaxed" style={{ letterSpacing: '0.01em' }}>
                {bestMatch.matchCount} von {bestMatch.recovery.signs.length} Anzeichen treffen auf dich zu.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewDetail(bestMatch.recovery.id)}
                className="w-full py-3 px-6 bg-black text-white hover:bg-neutral-800 transition-colors rounded-lg"
                aria-label="Details ansehen"
              >
                Was dir helfen könnte
              </motion.button>
            </div>

            {sortedScores.filter(s => s.matchCount > 0 && s.recovery.id !== bestMatch.recovery.id).map((score) => (
              <div key={score.recovery.id} className={`${score.recovery.colorClass} rounded-2xl p-6 space-y-3 opacity-80`}>
                <h3 className="text-lg font-medium" style={{ letterSpacing: '0.01em' }}>{score.recovery.name}</h3>
                <p className="text-sm text-neutral-800" style={{ letterSpacing: '0.01em' }}>
                  {score.matchCount} von {score.recovery.signs.length} Anzeichen
                </p>
                <button
                  onClick={() => onViewDetail(score.recovery.id)}
                  className="text-sm underline hover:no-underline"
                >
                  Auch ansehen
                </button>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center space-y-4 py-8"
          >
            <p className="text-neutral-600" style={{ letterSpacing: '0.01em' }}>
              Keine Übereinstimmungen gefunden. Versuche es nochmal oder schau dir alle Erholungstypen an.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="w-full py-3 px-6 bg-white border-2 border-black text-black hover:bg-neutral-50 transition-colors rounded-lg"
            aria-label="Fragebogen nochmal machen"
          >
            Nochmal versuchen
          </motion.button>
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center"
            aria-label="Zurück"
          >
            ← Zurück
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SOSScreen({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  const [mode, setMode] = useState<'breathing' | 'grounding'>('breathing');
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [countdown, setCountdown] = useState(4);
  const [contactsOpen, setContactsOpen] = useState(false);

  useEffect(() => {
    if (mode !== 'breathing') return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;

        // Phasenwechsel
        setBreathPhase((phase) => {
          if (phase === 'in') {
            return 'hold';
          } else if (phase === 'hold') {
            return 'out';
          } else {
            return 'in';
          }
        });

        // Nächsten Countdown zurückgeben
        return prev; // Wird im nächsten Render durch useEffect aktualisiert
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  // Separater Effect für Countdown-Reset bei Phasenwechsel
  useEffect(() => {
    if (breathPhase === 'in') {
      setCountdown(4);
    } else if (breathPhase === 'hold') {
      setCountdown(7);
    } else if (breathPhase === 'out') {
      setCountdown(8);
    }
  }, [breathPhase]);

  const phaseText = {
    in: 'Einatmen',
    hold: 'Halten',
    out: 'Ausatmen'
  };

  const phaseColor = {
    in: 'bg-[#6B9BD1]',
    hold: 'bg-[#D4A5A5]',
    out: 'bg-[#E8C4A0]'
  };

  const phaseDuration = {
    in: 4,
    hold: 7,
    out: 8
  };

  // 5-4-3-2-1 Grounding Technik
  if (mode === 'grounding') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-screen flex flex-col px-6 py-12 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${backgroundStart})`
          }}
        />

        <div className="max-w-md w-full mx-auto space-y-8 flex-1 relative z-10 flex flex-col justify-center pb-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center space-y-3"
          >
            <h1 className="text-2xl font-bold text-neutral-800" style={{ letterSpacing: '0.02em' }}>
              5-4-3-2-1 Technik
            </h1>
            <p className="text-sm text-neutral-600">Nimm dir Zeit für jeden Schritt</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-[#8FB89C]/20 backdrop-blur-sm rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-[#8FB89C]">5</p>
                <p className="text-neutral-800 font-medium">Nenne 5 Dinge, die du sehen kannst</p>
                <p className="text-sm text-neutral-600">Schau dich um. Was siehst du?</p>
              </div>
            </div>

            <div className="bg-[#8FB89C]/20 backdrop-blur-sm rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-[#8FB89C]">4</p>
                <p className="text-neutral-800 font-medium">Nenne 4 Dinge, die du berühren kannst</p>
                <p className="text-sm text-neutral-600">Spüre die Textur, die Temperatur</p>
              </div>
            </div>

            <div className="bg-[#8FB89C]/20 backdrop-blur-sm rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-[#8FB89C]">3</p>
                <p className="text-neutral-800 font-medium">Nenne 3 Dinge, die du hören kannst</p>
                <p className="text-sm text-neutral-600">Lausche auf Geräusche um dich herum</p>
              </div>
            </div>

            <div className="bg-[#8FB89C]/20 backdrop-blur-sm rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-[#8FB89C]">2</p>
                <p className="text-neutral-800 font-medium">Nenne 2 Dinge, die du riechen kannst</p>
                <p className="text-sm text-neutral-600">Was kannst du wahrnehmen?</p>
              </div>
            </div>

            <div className="bg-[#8FB89C]/20 backdrop-blur-sm rounded-2xl p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-[#8FB89C]">1</p>
                <p className="text-neutral-800 font-medium">Nenne 1 Ding, das du schmecken kannst</p>
                <p className="text-sm text-neutral-600">Vielleicht ein Getränk oder Essen?</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-3"
          >
            <button
              onClick={() => setMode('breathing')}
              className="w-full py-4 px-6 bg-[#6B9BD1] text-white hover:bg-[#5a8bc0] transition-colors rounded-lg font-medium"
            >
              Zur Atemübung wechseln
            </button>
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center"
              aria-label="Zurück"
            >
              ← Zurück
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Atemübung (bestehender Code)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen flex flex-col px-6 py-12 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />

      <div className="max-w-md w-full mx-auto space-y-20 flex-1 relative z-10 flex flex-col justify-center pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center space-y-3"
        >
          <h1 className="text-2xl font-bold text-neutral-800" style={{ letterSpacing: '0.02em' }}>
            Atme mit mir
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed px-4" style={{ letterSpacing: '0.01em' }}>
            4 Sekunden durch die Nase einatmen · 7 Sekunden Luft anhalten · 8 Sekunden zischend durch den Mund ausatmen
          </p>
        </motion.div>

        <motion.div className="flex flex-col items-center justify-center space-y-24">
          <motion.div
            animate={{
              scale: breathPhase === 'in' ? 1.8 : breathPhase === 'hold' ? 1.8 : 1,
            }}
            transition={{
              duration: breathPhase === 'in' ? 4 : breathPhase === 'hold' ? 0.5 : 8,
              ease: "easeInOut"
            }}
            className={`w-40 h-40 rounded-full ${phaseColor[breathPhase]} flex items-center justify-center text-white text-5xl font-bold shadow-2xl`}
          >
            {countdown}
          </motion.div>

          <motion.div
            key={breathPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-4xl font-bold text-neutral-800" style={{ letterSpacing: '0.02em' }}>
              {phaseText[breathPhase]}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center space-y-3"
        >
          <p className="text-neutral-700 leading-relaxed px-4" style={{ letterSpacing: '0.01em' }}>
            Du bist nicht allein
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="space-y-3"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden">
            <button
              onClick={() => setContactsOpen(!contactsOpen)}
              className="w-full py-3 px-6 cursor-pointer text-center text-sm font-semibold text-neutral-700 hover:bg-white/40 transition-colors flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              <span>Notfallkontakte</span>
              {contactsOpen ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            {contactsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 space-y-2 bg-white/40"
              >
                <a
                  href="tel:08001110111"
                  className="flex items-center justify-between w-full py-3 px-4 bg-[#E63946]/90 hover:bg-[#E63946] text-white rounded-xl transition-colors text-sm font-semibold"
                >
                  <span>Telefonseelsorge</span>
                  <span className="text-xs">0800 111 0 111</span>
                </a>
                <a
                  href="tel:08001110222"
                  className="flex items-center justify-between w-full py-3 px-4 bg-[#E63946]/90 hover:bg-[#E63946] text-white rounded-xl transition-colors text-sm font-semibold"
                >
                  <span>Telefonseelsorge</span>
                  <span className="text-xs">0800 111 0 222</span>
                </a>
                <a
                  href="tel:116111"
                  className="flex items-center justify-between w-full py-3 px-4 bg-[#6B9BD1]/90 hover:bg-[#6B9BD1] text-white rounded-xl transition-colors text-sm font-semibold"
                >
                  <span>Kinder-/Jugendtelefon</span>
                  <span className="text-xs">116 111</span>
                </a>
                <p className="text-xs text-neutral-600 text-center mt-3" style={{ letterSpacing: '0.01em' }}>
                  Diese App ersetzt keine professionelle Hilfe
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={() => setMode('grounding')}
            className="w-full py-4 px-6 bg-[#8FB89C] text-white hover:bg-[#7da88a] transition-colors rounded-lg font-medium"
          >
            5-4-3-2-1 Technik ausprobieren
          </button>
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center"
            aria-label="Zurück"
          >
            ← Zurück
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function FavoritesScreen({
  onSelectCard,
  onBack,
  onHome
}: {
  onSelectCard: (cardId: string) => void;
  onBack: () => void;
  onHome: () => void;
}) {
  const { favorites } = useFavoritesContext();
  const favoriteCards = cards.filter(card => favorites.includes(card.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col px-6 py-12 pb-32 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />

      <div className="max-w-md w-full mx-auto space-y-6 flex-1 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <Heart size={32} className="text-neutral-600" />
            <h1 className="text-2xl" style={{ letterSpacing: '0.02em' }}>Meine Favoriten</h1>
          </div>
          <p className="text-sm text-neutral-600" style={{ letterSpacing: '0.01em' }}>
            {favoriteCards.length} {favoriteCards.length === 1 ? 'Karte' : 'Karten'} gespeichert
          </p>
        </motion.div>

        {favoriteCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="text-center space-y-4 py-12">
              <Heart size={64} className="mx-auto text-neutral-300" />
              <p className="text-neutral-600" style={{ letterSpacing: '0.01em' }}>
                Noch keine Favoriten
              </p>
              <p className="text-sm text-neutral-500" style={{ letterSpacing: '0.01em' }}>
                Tippe auf das Herz bei einer Karte, um sie hier zu speichern
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {favoriteCards.map((card, index) => {
              const category = categories.find(c => c.id === card.categoryId);
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.06, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectCard(card.id)}
                  className="w-full p-6 bg-white/75 backdrop-blur-sm hover:shadow-md active:shadow-sm transition-shadow rounded-2xl text-left border border-neutral-200"
                  style={{ borderLeftWidth: '4px', borderLeftColor: category?.color || '#000' }}
                  aria-label={`Karte ${card.title} öffnen`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${category?.color}40`, color: category?.color }}>
                          {category?.keyword}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold" style={{ letterSpacing: '0.01em' }}>{card.title}</h3>
                    </div>
                    <Heart size={20} className="text-neutral-600 flex-shrink-0" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors text-center mt-6"
          aria-label="Zurück"
        >
          ← Zurück
        </motion.button>
      </div>
    </motion.div>
  );
}
