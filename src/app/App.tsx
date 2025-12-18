import { useState } from 'react';
import { categories, cards, Category, Card } from './data/cards';
import Vector from '../imports/Vector-3-98';
import { motion, AnimatePresence } from 'motion/react';
import backgroundImage from '../assets/background-optimized.jpg';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MotionProvider, useMotion } from './context/MotionContext';

type Screen =
  | { type: 'start' }
  | { type: 'orientation' }
  | { type: 'category'; categoryId: string }
  | { type: 'card'; cardId: string }
  | { type: 'impressum' }
  | { type: 'datenschutz' };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'start' });

  const renderScreen = () => {
    switch (screen.type) {
      case 'start':
        return (
          <StartScreen 
            key="start" 
            onContinue={() => setScreen({ type: 'orientation' })}
            onImpressum={() => setScreen({ type: 'impressum' })}
            onDatenschutz={() => setScreen({ type: 'datenschutz' })}
          />
        );
      case 'orientation':
        return (
          <OrientationScreen
            key="orientation"
            onSelectCategory={(categoryId) => setScreen({ type: 'category', categoryId })}
            onSelectCard={(cardId) => setScreen({ type: 'card', cardId })}
            onImpressum={() => setScreen({ type: 'impressum' })}
            onDatenschutz={() => setScreen({ type: 'datenschutz' })}
          />
        );
      case 'category':
        return (
          <CategoryScreen 
            key={`category-${screen.categoryId}`}
            categoryId={screen.categoryId}
            onSelectCard={(cardId) => setScreen({ type: 'card', cardId })}
            onBack={() => setScreen({ type: 'orientation' })}
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
          />
        );
      case 'impressum':
        return <ImpressumScreen key="impressum" onBack={() => setScreen({ type: 'start' })} />;
      case 'datenschutz':
        return <DatenschutzScreen key="datenschutz" onBack={() => setScreen({ type: 'start' })} />;
      default:
        return (
          <StartScreen 
            key="start" 
            onContinue={() => setScreen({ type: 'orientation' })}
            onImpressum={() => setScreen({ type: 'impressum' })}
            onDatenschutz={() => setScreen({ type: 'datenschutz' })}
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
        </div>
      </MotionProvider>
    </ErrorBoundary>
  );
}

function StartScreen({ 
  onContinue, 
  onImpressum, 
  onDatenschutz 
}: { 
  onContinue: () => void;
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
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          filter: 'grayscale(100%)'
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
          <div className="w-48 h-48">
            <Vector />
          </div>
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
        
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="w-full py-4 px-6 bg-black text-white hover:bg-neutral-800 active:bg-neutral-900 transition-colors rounded-lg"
          aria-label="Zur Orientierung"
        >
          Was brauche ich gerade?
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-6 left-0 right-0 px-8"
      >
        <div className="max-w-md mx-auto flex justify-center gap-4 text-xs text-neutral-600">
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
      </motion.div>
    </motion.div>
  );
}

function OrientationScreen({ onSelectCategory, onSelectCard, onImpressum, onDatenschutz }: { onSelectCategory: (categoryId: string) => void; onSelectCard: (cardId: string) => void; onImpressum: () => void; onDatenschutz: () => void }) {
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
      className="min-h-screen flex flex-col px-6 py-12"
    >
      <div className="max-w-md w-full mx-auto space-y-8 flex-1">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="w-20 h-20">
            <Vector />
          </div>
        </motion.div>

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
          className="w-full py-5 px-6 bg-black text-white rounded-2xl hover:opacity-90 active:opacity-80 transition-opacity font-medium shadow-sm"
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
              className={`${category.colorClass} rounded-2xl hover:shadow-md active:shadow-sm transition-all shadow-sm aspect-square flex flex-col justify-center items-center p-6 text-center`}
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
                    <span key={badge} className="text-xs text-neutral-900 opacity-70 px-2 py-1 bg-white/20 rounded-full backdrop-blur-sm break-words">
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
          <p className="text-xs text-black font-bold uppercase font-serif" style={{ fontFamily: 'Rufina, serif', letterSpacing: '0.01em' }}>
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
  onBack
}: {
  categoryId: string;
  onSelectCard: (cardId: string) => void;
  onBack: () => void;
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
      className="min-h-screen"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className={`${category.colorClass} text-white px-6 py-8`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="text-white hover:opacity-70 active:opacity-50 transition-opacity mb-4"
            aria-label="Zurück zur Orientierung"
          >
            ← Zurück
          </motion.button>
          <p className="text-sm opacity-90 block px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-sm w-fit">{category.label.split(' – ')[1] || category.label}</p>
          <h2 className="text-4xl text-black" style={{ letterSpacing: '0.02em' }}>{category.name}</h2>
          <p className="opacity-90 leading-relaxed">{category.description}</p>
        </div>
      </motion.div>

      <div className="max-w-md mx-auto px-6 py-8 space-y-4">
        {categoryCards.map((card, index) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.06, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCard(card.id)}
            className="w-full py-8 px-8 bg-white hover:shadow-md active:shadow-sm transition-shadow rounded-2xl text-center border border-neutral-200"
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
      </div>
    </motion.div>
  );
}

function CardDetailScreen({ cardId, onBack }: { cardId: string; onBack: () => void }) {
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
      className="min-h-screen flex flex-col"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className={`${category.colorClass} px-6 py-6`}
      >
        <div className="max-w-md mx-auto">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="text-white hover:opacity-70 active:opacity-50 transition-opacity mb-2"
            aria-label="Zurück zur Kategorie"
          >
            ← Zurück
          </motion.button>
          <p className="text-white text-sm opacity-90">{category.label.split(' – ')[1] || category.label}</p>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
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
            <p className="whitespace-pre-line leading-loose text-neutral-700" style={{ letterSpacing: '0.01em' }}>
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
        className="px-6 py-6"
      >
        <div className="max-w-md mx-auto">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-full py-3 px-6 text-neutral-600 hover:text-neutral-800 active:text-neutral-900 transition-colors"
            aria-label="Zurück zur Kategorie"
          >
            ← Zurück zu den Karten
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ImpressumScreen({ onBack }: { onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col px-6 py-12"
    >
      <div className="max-w-md w-full mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="w-16 h-16">
            <Vector />
          </div>
        </motion.div>

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

function DatenschutzScreen({ onBack }: { onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen flex flex-col px-6 py-12"
    >
      <div className="max-w-md w-full mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="w-16 h-16">
            <Vector />
          </div>
        </motion.div>

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