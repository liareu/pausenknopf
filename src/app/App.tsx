import { useState } from 'react';
import { categories, cards, Category, Card, recoveryTypes, RecoveryType } from './data/cards';
import { motion, AnimatePresence } from 'motion/react';
import backgroundImage from '../assets/background-optimized.jpg';
import backgroundStart from '../assets/background-start.jpg';
import logoSvg from '../assets/logo.svg';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MotionProvider, useMotion } from './context/MotionContext';
import { Sparkles, BatteryMedium, Home } from 'lucide-react';

function BottomNav({
  currentTab,
  onTabChange,
  onHome
}: {
  currentTab: 'exercises' | 'recovery';
  onTabChange: (tab: 'exercises' | 'recovery') => void;
  onHome: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="max-w-md mx-auto bg-[#FDF7F3] rounded-2xl shadow-lg border border-neutral-200/50">
        <div className="flex p-2 gap-2 justify-center items-center">
          <button
            onClick={() => onTabChange('exercises')}
            className={`w-14 h-14 flex items-center justify-center transition-all rounded-full outline-none focus:outline-none ${
              currentTab === 'exercises'
                ? 'bg-[#6B9BD1] text-white font-medium shadow-sm'
                : 'text-neutral-700 hover:bg-neutral-100/50'
            }`}
            aria-label="Was hilft jetzt?"
          >
            <Sparkles size={24} />
          </button>
          <button
            onClick={onHome}
            className="w-14 h-14 flex items-center justify-center transition-all rounded-full outline-none focus:outline-none bg-black text-white hover:bg-neutral-800 shadow-md"
            aria-label="Zur Startseite"
          >
            <Home size={24} />
          </button>
          <button
            onClick={() => onTabChange('recovery')}
            className={`w-14 h-14 flex items-center justify-center transition-all rounded-full outline-none focus:outline-none ${
              currentTab === 'recovery'
                ? 'bg-[#D4A5A5] text-white font-medium shadow-sm'
                : 'text-neutral-700 hover:bg-neutral-100/50'
            }`}
            aria-label="Was fehlt mir?"
          >
            <BatteryMedium size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

type Screen =
  | { type: 'start' }
  | { type: 'orientation' }
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
  const showBottomNav = isExercisesFlow || isRecoveryFlow;

  const renderScreen = () => {
    switch (screen.type) {
      case 'start':
        return (
          <StartScreen
            key="start"
            onExercises={() => setScreen({ type: 'orientation' })}
            onRecovery={() => setScreen({ type: 'recovery-types' })}
            onImpressum={() => navigateTo({ type: 'impressum' })}
            onDatenschutz={() => navigateTo({ type: 'datenschutz' })}
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
            onImpressum={() => navigateTo({ type: 'impressum' })}
            onDatenschutz={() => navigateTo({ type: 'datenschutz' })}
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
            onImpressum={() => navigateTo({ type: 'impressum' })}
            onDatenschutz={() => navigateTo({ type: 'datenschutz' })}
          />
        );
      case 'questionnaire':
        return (
          <QuestionnaireScreen
            key="questionnaire"
            onSubmit={(selectedSigns) => setScreen({ type: 'questionnaire-result', selectedSigns })}
            onBack={() => setScreen({ type: 'recovery-types' })}
            onHome={navigateHome}
            onImpressum={() => navigateTo({ type: 'impressum' })}
            onDatenschutz={() => navigateTo({ type: 'datenschutz' })}
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
            onImpressum={() => navigateTo({ type: 'impressum' })}
            onDatenschutz={() => navigateTo({ type: 'datenschutz' })}
          />
        );
      case 'orientation':
        return (
          <OrientationScreen
            key="orientation"
            onSelectCategory={(categoryId) => setScreen({ type: 'category', categoryId })}
            onSelectCard={(cardId) => setScreen({ type: 'card', cardId })}
            onHome={navigateHome}
            onImpressum={() => navigateTo({ type: 'impressum' })}
            onDatenschutz={() => navigateTo({ type: 'datenschutz' })}
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
            onImpressum={() => navigateTo({ type: 'impressum' })}
            onDatenschutz={() => navigateTo({ type: 'datenschutz' })}
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
            onImpressum={() => navigateTo({ type: 'impressum' })}
            onDatenschutz={() => navigateTo({ type: 'datenschutz' })}
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
            onExercises={() => setScreen({ type: 'orientation' })}
            onRecovery={() => setScreen({ type: 'recovery-types' })}
            onImpressum={() => navigateTo({ type: 'impressum' })}
            onDatenschutz={() => navigateTo({ type: 'datenschutz' })}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <MotionProvider>
        <div className="min-h-screen bg-[#FDF7F3]" role="application" aria-label="Pausenknopf App">
          <AnimatePresence mode="wait">
            {renderScreen()}
          </AnimatePresence>
          {showBottomNav && (
            <BottomNav
              currentTab={isExercisesFlow ? 'exercises' : 'recovery'}
              onTabChange={handleTabChange}
              onHome={navigateHome}
            />
          )}
        </div>
      </MotionProvider>
    </ErrorBoundary>
  );
}

function StartScreen({
  onExercises,
  onRecovery,
  onImpressum,
  onDatenschutz
}: {
  onExercises: () => void;
  onRecovery: () => void;
  onImpressum: () => void;
  onDatenschutz: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col items-center justify-center px-8 py-12 relative overflow-hidden"
      role="main"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />

      {/* Content */}
      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <img src={logoSvg} alt="Pausenknopf Logo" className="w-48 h-48" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4 text-[rgb(0,0,0)] text-[20px]"
        >
          <p className="text-black leading-relaxed" style={{ letterSpacing: '0.01em' }}>
            Für Momente, die gerade viel sind
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-5"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExercises}
            className="w-full py-8 px-8 bg-[#6B9BD1]/50 backdrop-blur-md text-black hover:bg-[#6B9BD1]/60 active:bg-[#6B9BD1]/45 transition-all rounded-2xl text-center border border-white/20"
            aria-label="Was hilft jetzt? - Schnelle Übungen für den Moment"
          >
            <div className="space-y-2">
              <div className="text-2xl font-extrabold leading-tight" style={{ letterSpacing: '0.01em', fontWeight: 900 }}>Was hilft jetzt?</div>
              <div className="text-sm opacity-80 leading-snug" style={{ letterSpacing: '0.01em' }}>Übungen für den Moment</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRecovery}
            className="w-full py-8 px-8 bg-[#D4A5A5]/50 backdrop-blur-md text-black hover:bg-[#D4A5A5]/60 active:bg-[#D4A5A5]/45 transition-all rounded-2xl text-center border border-white/20"
            aria-label="Was fehlt mir? - Finde heraus, welche Erholung du brauchst"
          >
            <div className="space-y-2">
              <div className="text-2xl font-extrabold leading-tight" style={{ letterSpacing: '0.01em', fontWeight: 900 }}>Was fehlt mir?</div>
              <div className="text-sm opacity-80 leading-snug" style={{ letterSpacing: '0.01em' }}>Finde deine Erholung</div>
            </div>
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-6 left-0 right-0 px-8"
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="text-center">
            <p className="text-[10px] text-black font-bold uppercase" style={{ letterSpacing: '0.01em' }}>
              mit liebe entwickelt von Julia Reuter für dich {'<3'}
            </p>
          </div>
          <div className="flex justify-center gap-4 text-xs text-neutral-600">
            <button
              onClick={onImpressum}
              className="hover:text-neutral-800 transition-colors"
            >
              Impressum
            </button>
            <span>·</span>
            <button
              onClick={onDatenschutz}
              className="hover:text-neutral-800 transition-colors"
            >
              Datenschutz
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrientationScreen({ onSelectCategory, onSelectCard, onHome, onImpressum, onDatenschutz }: { onSelectCategory: (categoryId: string) => void; onSelectCard: (cardId: string) => void; onHome: () => void; onImpressum: () => void; onDatenschutz: () => void }) {
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
      className="min-h-screen flex flex-col px-6 py-12 pb-24 relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <div className="max-w-md w-full mx-auto space-y-4 flex-1 relative z-10">
        <div className="space-y-3">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors"
            aria-label="Zurück zur Startseite"
          >
            ← Zurück
          </motion.button>

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
            <img src={logoSvg} alt="Pausenknopf Logo" className="w-28 h-28" />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3 text-center"
        >
          <h1 className="text-2xl" style={{ letterSpacing: '0.02em' }}>Was brauchst du gerade?</h1>
        </motion.div>

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

      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="w-full pb-4 space-y-3 pt-8"
      >
        <div className="max-w-md mx-auto text-center">
          <p className="text-[10px] text-black font-bold uppercase" style={{ letterSpacing: '0.01em' }}>
            mit liebe entwickelt von Julia Reuter für dich {'<3'}
          </p>
        </div>
        <div className="max-w-md mx-auto flex justify-center gap-3 text-xs text-neutral-500">
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
      </motion.div>
    </motion.div>
  );
}

function CategoryScreen({
  categoryId,
  onSelectCard,
  onBack,
  onHome,
  onImpressum,
  onDatenschutz
}: {
  categoryId: string;
  onSelectCard: (cardId: string) => void;
  onBack: () => void;
  onHome: () => void;
  onImpressum: () => void;
  onDatenschutz: () => void;
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
            className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Zurück
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
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="text-white hover:opacity-70 active:opacity-50 transition-opacity"
              aria-label="Zurück zur Orientierung"
            >
              ← Zurück
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHome}
              className="flex items-center justify-center"
              aria-label="Zurück zur Startseite"
            >
              <img src={logoSvg} alt="Pausenknopf Logo" className="w-16 h-16" />
            </motion.button>
          </div>
          <p className="text-sm opacity-90 block px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm w-fit">{category.label.split(' – ')[1] || category.label}</p>
          <h2 className="text-4xl text-black" style={{ letterSpacing: '0.02em' }}>{category.name}</h2>
          <p className="opacity-90 leading-relaxed">{category.description}</p>
        </div>
      </motion.div>

      <div className="max-w-md mx-auto px-6 py-8 pb-24 space-y-4 relative z-10">
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
          className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors mt-8"
          aria-label="Zurück zur Orientierung"
        >
          ← Zurück
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full pb-4 space-y-3 pt-8"
        >
          <div className="max-w-md mx-auto space-y-3">
            <div className="text-center">
              <p className="text-[10px] text-black font-bold uppercase" style={{ letterSpacing: '0.01em' }}>
                mit liebe entwickelt von Julia Reuter für dich {'<3'}
              </p>
            </div>
            <div className="flex justify-center gap-3 text-xs text-neutral-500">
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
      </div>
    </motion.div>
  );
}

function CardDetailScreen({ cardId, onBack, onRandomCard, onHome, onImpressum, onDatenschutz }: { cardId: string; onBack: () => void; onRandomCard: () => void; onHome: () => void; onImpressum: () => void; onDatenschutz: () => void }) {
  const card = cards.find(c => c.id === cardId);
  const category = card ? categories.find(c => c.id === card.categoryId) : null;

  if (!card || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="text-center space-y-4">
          <p className="text-neutral-600">Karte nicht gefunden</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Zurück
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
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="text-white hover:opacity-70 active:opacity-50 transition-opacity"
              aria-label="Zurück zur Kategorie"
            >
              ← Zurück
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHome}
              className="flex items-center justify-center"
              aria-label="Zurück zur Startseite"
            >
              <img src={logoSvg} alt="Pausenknopf Logo" className="w-16 h-16" />
            </motion.button>
          </div>
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
        className="px-6 py-6 pb-24 relative z-10"
      >
        <div className="max-w-md mx-auto space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRandomCard}
            className="w-full py-4 px-6 bg-black text-white hover:bg-neutral-800 active:bg-neutral-900 transition-colors rounded-lg font-medium"
            aria-label="Noch eine zufällige Karte anzeigen"
          >
            Noch eine zufällige Karte
          </motion.button>

          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors"
            aria-label="Zurück zur Kategorie"
          >
            ← Zurück zu den Karten
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full pb-4 space-y-3"
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="text-center">
                <p className="text-[10px] text-black font-bold uppercase" style={{ letterSpacing: '0.01em' }}>
                  mit liebe entwickelt von Julia Reuter für dich {'<3'}
                </p>
              </div>
              <div className="flex justify-center gap-3 text-xs text-neutral-500">
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
  onBack,
  onImpressum,
  onDatenschutz
}: {
  onSelectRecovery: (recoveryId: string) => void;
  onStartQuestionnaire: () => void;
  onHome: () => void;
  onBack: () => void;
  onImpressum: () => void;
  onDatenschutz: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col px-6 py-12 pb-24 relative overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url(${backgroundStart})`
        }}
      />
      <div className="max-w-md w-full mx-auto space-y-4 flex-1 relative z-10">
        <div className="space-y-3">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors"
            aria-label="Zurück zur Startseite"
          >
            ← Zurück
          </motion.button>

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
            <img src={logoSvg} alt="Pausenknopf Logo" className="w-28 h-28" />
          </motion.button>
        </div>

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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="w-full pb-4 space-y-3 pt-8"
        >
          <div className="max-w-md mx-auto space-y-3">
            <div className="text-center">
              <p className="text-[10px] text-black font-bold uppercase" style={{ letterSpacing: '0.01em' }}>
                mit liebe entwickelt von Julia Reuter für dich {'<3'}
              </p>
            </div>
            <div className="flex justify-center gap-3 text-xs text-neutral-500">
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
      </div>
    </motion.div>
  );
}

function RecoveryDetailScreen({
  recoveryId,
  onBack,
  onStartQuestionnaire,
  onHome,
  onImpressum,
  onDatenschutz
}: {
  recoveryId: string;
  onBack: () => void;
  onStartQuestionnaire: () => void;
  onHome: () => void;
  onImpressum: () => void;
  onDatenschutz: () => void;
}) {
  const recovery = recoveryTypes.find(r => r.id === recoveryId);

  if (!recovery) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8">
        <div className="text-center space-y-4">
          <p className="text-neutral-600">Erholungstyp nicht gefunden</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Zurück
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
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="text-white hover:opacity-70 active:opacity-50 transition-opacity"
              aria-label="Zurück zur Übersicht"
            >
              ← Zurück
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHome}
              className="flex items-center justify-center"
              aria-label="Zurück zur Startseite"
            >
              <img src={logoSvg} alt="Pausenknopf Logo" className="w-16 h-16" />
            </motion.button>
          </div>
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
        className="px-6 py-6 pb-24 relative z-10"
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
            className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors"
            aria-label="Zurück zur Übersicht"
          >
            ← Zurück zur Übersicht
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="w-full pb-4 space-y-3"
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="text-center">
                <p className="text-[10px] text-black font-bold uppercase" style={{ letterSpacing: '0.01em' }}>
                  mit liebe entwickelt von Julia Reuter für dich {'<3'}
                </p>
              </div>
              <div className="flex justify-center gap-3 text-xs text-neutral-500">
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
        </div>
      </motion.div>
    </motion.div>
  );
}

function QuestionnaireScreen({
  onSubmit,
  onBack,
  onHome,
  onImpressum,
  onDatenschutz
}: {
  onSubmit: (selectedSigns: string[]) => void;
  onBack: () => void;
  onHome: () => void;
  onImpressum: () => void;
  onDatenschutz: () => void;
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
      className="min-h-screen flex flex-col px-6 py-12 pb-24 relative overflow-hidden"
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
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="text-neutral-600 hover:text-neutral-800 transition-colors"
            aria-label="Zurück"
          >
            ← Zurück
          </motion.button>
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

        <motion.button
          initial={{ opacity: 0 }}
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full pb-4 space-y-3 pt-8"
        >
          <div className="max-w-md mx-auto space-y-3">
            <div className="text-center">
              <p className="text-[10px] text-black font-bold uppercase" style={{ letterSpacing: '0.01em' }}>
                mit liebe entwickelt von Julia Reuter für dich {'<3'}
              </p>
            </div>
            <div className="flex justify-center gap-3 text-xs text-neutral-500">
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
      </div>
    </motion.div>
  );
}

function QuestionnaireResultScreen({
  selectedSigns,
  onViewDetail,
  onRetry,
  onBack,
  onHome,
  onImpressum,
  onDatenschutz
}: {
  selectedSigns: string[];
  onViewDetail: (recoveryId: string) => void;
  onRetry: () => void;
  onBack: () => void;
  onHome: () => void;
  onImpressum: () => void;
  onDatenschutz: () => void;
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
      className="min-h-screen flex flex-col px-6 py-12 pb-24 relative overflow-hidden"
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
            className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 transition-colors"
            aria-label="Zurück zur Übersicht"
          >
            ← Zurück zur Übersicht
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full pb-4 space-y-3 pt-8"
        >
          <div className="max-w-md mx-auto space-y-3">
            <div className="text-center">
              <p className="text-[10px] text-black font-bold uppercase" style={{ letterSpacing: '0.01em' }}>
                mit liebe entwickelt von Julia Reuter für dich {'<3'}
              </p>
            </div>
            <div className="flex justify-center gap-3 text-xs text-neutral-500">
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
      </div>
    </motion.div>
  );
}
