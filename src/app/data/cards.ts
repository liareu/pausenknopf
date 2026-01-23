export type Category = {
  id: string;
  name: string;
  color: string;
  colorClass: string;
  description: string;
  label: string;
  keyword: string;
  shortDescription: string;
  badgeLabels: string[];
};

export type Card = {
  id: string;
  categoryId: string;
  title: string;
  text: string;
  hashtags: string[];
  audioFile?: string;
};

export type RecoveryType = {
  id: string;
  name: string;
  title: string;
  color: string;
  colorClass: string;
  shortDescription: string;
  signs: string[];
  helps: string[];
};

export type Situation = {
  id: string;
  name: string;
  description: string;
  color: string;
  colorClass: string;
  icon: string;
  relevantCardIds: string[];
};

export const categories: Category[] = [
  {
    id: 'blau',
    name: 'Mein Herz rast',
    color: '#6B9BD1',
    colorClass: 'bg-[#6B9BD1]',
    description: 'Diese Karten helfen dir, wieder runterzufahren.',
    label: 'Blau – Runterfahren & Atmung',
    keyword: 'Runterfahren',
    shortDescription: 'wenn alles zu viel ist',
    badgeLabels: ['Atmung', 'Beruhigung', 'Achtsamkeit']
  },
  {
    id: 'orange',
    name: 'Ich bin sehr unruhig',
    color: '#E89B6C',
    colorClass: 'bg-[#E89B6C]',
    description: 'Diese Karten helfen dir, Energie zu regulieren.',
    label: 'Orange – Aktive Regulation',
    keyword: 'Regulieren',
    shortDescription: 'wenn du zu viel Energie hast',
    badgeLabels: ['Regulation', 'Energie', 'Bewegung']
  },
  {
    id: 'koralle',
    name: 'Ich brauche Bewegung',
    color: '#D97850',
    colorClass: 'bg-[#D97850]',
    description: 'Diese Karten helfen dir, Spannung durch Bewegung loszulassen.',
    label: 'Koralle – Körper aktivieren',
    keyword: 'Aktivieren',
    shortDescription: 'wenn du Spannung loslassen willst',
    badgeLabels: ['Bewegung', 'Spannung', 'Aktivität']
  },
  {
    id: 'gruen',
    name: 'Ich fühle mich nicht ganz da',
    color: '#8FB89C',
    colorClass: 'bg-[#8FB89C]',
    description: 'Diese Karten helfen dir, wieder im Körper anzukommen.',
    label: 'Grün – Körper & Erdung',
    keyword: 'Zurückkommen',
    shortDescription: 'wenn du zurückkommen möchtest',
    badgeLabels: ['Körper', 'Präsenz', 'Erdung']
  },
  {
    id: 'rosa',
    name: 'Ich brauche Ruhe',
    color: '#D4A5A5',
    colorClass: 'bg-[#D4A5A5]',
    description: 'Diese Karten helfen dir, innere Sicherheit zu finden.',
    label: 'Rosa – Ruhe & innere Sicherheit',
    keyword: 'Sicherheit',
    shortDescription: 'wenn du Schutz brauchst',
    badgeLabels: ['Ruhe', 'Schutz', 'Geborgenheit']
  },
  {
    id: 'beige',
    name: 'Ich zweifle / bin erschöpft',
    color: '#C9B5A8',
    colorClass: 'bg-[#C9B5A8]',
    description: 'Diese Karten sind da, um dich zu halten.',
    label: 'Beige – Zweifel & Erschöpfung',
    keyword: 'Trösten',
    shortDescription: 'wenn du nicht mehr kannst',
    badgeLabels: ['Mitgefühl', 'Halt', 'Selbstmitgefühl']
  }
];

export const cards: Card[] = [
  // BLAU - Runterfahren & Atmung
  {
    id: 'blau-1',
    categoryId: 'blau',
    title: 'Lange Ausatmung',
    text: `Atme langsam durch die Nase ein.

Atme länger aus,
als du eingeatmet hast.

Noch einmal.

Dein Körper darf langsamer werden.
Du bist nicht in Gefahr.`,
    hashtags: ['panik', 'herzrasen', 'alarm_im_körper']
  },
  {
    id: 'blau-2',
    categoryId: 'blau',
    title: 'Hand auf Brust & Bauch',
    text: `Leg eine Hand auf deine Brust.
Die andere auf deinen Bauch.

Spür die Wärme deiner Hände.

Du atmest.
Dein Körper arbeitet für dich.`,
    hashtags: ['enge', 'zu_viel', 'runterfahren']
  },
  {
    id: 'blau-3',
    categoryId: 'blau',
    title: 'Zählen',
    text: `Atme ein – zähle 1.
Atme aus – zähle 2.

Zähle bis 10.

Wenn du dich verzählst,
fang einfach wieder an.`,
    hashtags: ['überflutung', 'keine_luft', 'struktur']
  },
  {
    id: 'blau-4',
    categoryId: 'blau',
    title: 'Der Seufzer',
    text: `Atme ein.

Atme noch ein kleines bisschen mehr ein.

Lass die Luft hörbar raus.

Dein Körper weiß,
wie Loslassen geht.`,
    hashtags: ['spannung', 'durchatmen', 'loslassen']
  },

  // ORANGE - Aktive Regulation
  {
    id: 'orange-1',
    categoryId: 'orange',
    title: 'Schütteln',
    text: `Stell dich hin.

Schüttel deine Hände.
Dann Arme, Schultern, Beine.

Es darf albern aussehen.

Dein Körper lässt Spannung los.`,
    hashtags: ['unruhe', 'energie_zu_viel', 'dampf_raus']
  },
  {
    id: 'orange-2',
    categoryId: 'orange',
    title: 'Kraft spüren',
    text: `Drück deine Hände fest gegeneinander.

Halt die Spannung.

Lass los.

Du hast Kraft.
Auch jetzt.`,
    hashtags: ['spannung', 'kraft', 'ich_kann']
  },
  {
    id: 'orange-3',
    categoryId: 'orange',
    title: 'Wand',
    text: `Stell dich vor eine Wand.

Drück deine Hände dagegen.

Spür deinen Körper.

Du bist stabiler,
als es sich gerade anfühlt.`,
    hashtags: ['halt_im_körper', 'stabilität', 'runterkommen']
  },
  {
    id: 'orange-4',
    categoryId: 'orange',
    title: 'Gehen',
    text: `Geh langsam ein paar Schritte.

Spür jeden Fuß.

Links.
Rechts.

Du bist hier.`,
    hashtags: ['getrieben', 'bewegung', 'jetzt']
  },
  {
    id: 'orange-5',
    categoryId: 'orange',
    title: 'Druck & Loslassen',
    text: `Ball deine Hände zu Fäusten.

Halt kurz.

Öffne sie wieder.

Dein Körper darf loslassen.`,
    hashtags: ['spannung', 'entladen', 'körperarbeit']
  },

  // KORALLE - Körper aktivieren
  {
    id: 'koralle-1',
    categoryId: 'koralle',
    title: 'Schütteln',
    text: `Stell dich hin.

Schüttle deinen ganzen Körper.
Wie ein nasser Hund.

Es darf albern aussehen.

Dein Körper lässt Spannung los.`,
    hashtags: ['unruhe', 'energie_loswerden', 'dampf_raus']
  },
  {
    id: 'koralle-2',
    categoryId: 'koralle',
    title: 'Fallen lassen',
    text: `Hebe deine Arme hoch über den Kopf.

Halte kurz die Spannung.

Dann: einfach fallen lassen.

Wiederhole das ein paar Mal.`,
    hashtags: ['spannung', 'loslassen', 'leichter_werden']
  },
  {
    id: 'koralle-3',
    categoryId: 'koralle',
    title: 'Stampfen',
    text: `Stampfe abwechselnd mit beiden Füßen fest auf den Boden.

Spüre den Kontakt.

Sag innerlich oder laut:
"Ich bin hier."`,
    hashtags: ['wut', 'erdung', 'ich_bin_da']
  },
  {
    id: 'koralle-4',
    categoryId: 'koralle',
    title: 'Nein sagen',
    text: `Schüttle deinen Kopf 'Nein'.

Erst klein, dann größer.

Sag innerlich oder laut 'Nein' dazu.

Du darfst Grenzen haben.`,
    hashtags: ['grenze', 'nein', 'widerstand']
  },
  {
    id: 'koralle-5',
    categoryId: 'koralle',
    title: 'Hüpfen',
    text: `Hüpfe auf der Stelle.

Klein oder groß.
So wie es sich gut anfühlt.

Dein Körper darf Energie bewegen.`,
    hashtags: ['eingefroren', 'auftauen', 'bewegung']
  },
  {
    id: 'koralle-6',
    categoryId: 'koralle',
    title: 'Fäuste',
    text: `Balle deine Fäuste fest.

Spüre die Spannung.

Öffne sie plötzlich und lasse alles los.

Wiederhole das.`,
    hashtags: ['spannung', 'kontrolle_abgeben', 'loslassen']
  },
  
  // GRÜN - Körper & Erdung
  {
    id: 'gruen-1',
    categoryId: 'gruen',
    title: 'Komm zurück in deinen Körper',
    text: `Spür deine Füße.

Spür deine Hände.

Beweg sie ein wenig.

Du bist hier.
Dein Körper ist da.`,
    hashtags: ['nicht_ganz_da', 'zurück_kommen', 'hier_und_jetzt']
  },
  {
    id: 'gruen-2',
    categoryId: 'gruen',
    title: '5-4-3-2-1-Übung',
    text: `Nenne für dich:

5 Dinge, die du siehst.
4 Dinge, die du hörst.
3 Dinge, die du berührst.
2 Dinge, die du riechst.
1 Sache, die du schmeckst.

Du bist im Jetzt.`,
    hashtags: ['benommen', 'boden_verloren', 'orientierung']
  },
  {
    id: 'gruen-3',
    categoryId: 'gruen',
    title: 'Boden spüren',
    text: `Stell beide Füße fest auf den Boden.

Drück sie leicht hinein.

Der Boden trägt dich.
Du fällst nicht.`,
    hashtags: ['neben_mir', 'halt', 'körper']
  },
  {
    id: 'gruen-4',
    categoryId: 'gruen',
    title: 'Temperatur',
    text: `Spür etwas Kaltes
oder etwas Warmes.

Bleib kurz dabei.

Sag dir innerlich:
Ich bin hier.`,
    hashtags: ['dissoziation', 'zurück_kommen', 'spüren']
  },
  {
    id: 'gruen-5',
    categoryId: 'gruen',
    title: 'Ein Gegenstand',
    text: `Such dir einen Gegenstand in deiner Nähe.

Beschreibe ihn still:
Farbe. Form. Gewicht.

Bleib bei diesem einen Ding.`,
    hashtags: ['nicht_da', 'fokus', 'erdung']
  },
  {
    id: 'gruen-6',
    categoryId: 'gruen',
    title: 'Druck',
    text: `Drück deine Daumen fest
in deine Handflächen.

Halte kurz.

Lass los.

Wiederhole das ein paar Mal.`,
    hashtags: ['spannung', 'körperkontakt', 'hier']
  },
  
  // ROSA - Ruhe & innere Sicherheit
  {
    id: 'rosa-1',
    categoryId: 'rosa',
    title: 'Dein sicherer Ort',
    text: `Schließe die Augen.

Stell dir einen Ort vor,
an dem nichts von dir will.

Du musst nichts leisten.

Atme aus.
Du darfst hier sein.`,
    hashtags: ['rückzug', 'sicherheit', 'ruhe']
  },
  {
    id: 'rosa-2',
    categoryId: 'rosa',
    title: 'Schutzhülle',
    text: `Stell dir vor,
du bist von etwas Warmem umgeben.

Es schützt dich.

Du darfst dich anlehnen.
Du bist gehalten.`,
    hashtags: ['weich_werden', 'geschützt', 'ankommen']
  },
  {
    id: 'rosa-3',
    categoryId: 'rosa',
    title: 'Beobachten',
    text: `Die Gedanken dürfen da sein.

Du musst ihnen nicht folgen.

Du bist die,
die beobachtet.

Nicht das,
was gerade laut ist.`,
    hashtags: ['abstand', 'innere_ruhe', 'beobachten']
  },
  
  // BEIGE - Zweifel & Erschöpfung
  {
    id: 'beige-1',
    categoryId: 'beige',
    title: 'Mit dir ist nichts falsch',
    text: `Mit dir ist nichts falsch.

Dein Nervensystem ist überlastet.

Das ist kein Makel.
Das ist menschlich.`,
    hashtags: ['scham', 'bin_ich_falsch', 'überlastung']
  },
  {
    id: 'beige-2',
    categoryId: 'beige',
    title: 'Erlaubnis',
    text: `Du darfst langsam sein.

Du musst nichts beweisen.

Nicht jetzt.
Vielleicht auch später nicht.`,
    hashtags: ['erschöpfung', 'druck_raus', 'erlaubnis']
  },
  {
    id: 'beige-3',
    categoryId: 'beige',
    title: 'Nicht allein',
    text: `Du musst da nicht alleine durch.

Es gibt Verbindung.

Auch wenn du sie gerade
nicht spürst.`,
    hashtags: ['allein_gefühl', 'verbindung', 'getragen']
  },
  {
    id: 'beige-4',
    categoryId: 'beige',
    title: 'Erinnerung',
    text: `Das geht vorbei.

Nicht, weil du kämpfst,
sondern weil nichts bleibt,
wie es ist.`,
    hashtags: ['zweifel', 'hoffnung', 'es_verändert_sich']
  },
  // Innerer sicherer Ort - für alle 3 Kategorien
  {
    id: 'blau-innerer-ort',
    categoryId: 'blau',
    title: 'Innerer sicherer Ort',
    text: `1. Ankommen
Setz dich bequem hin. Spür den Kontakt zum Stuhl und den Boden unter deinen Füßen.
Atme ruhig ein und aus. Komm mit jedem Atemzug ein bisschen mehr zur Ruhe.

2. Atem & Gedanken
Nimm deinen Atem wahr, ohne ihn zu verändern.
Wenn Gedanken kommen: Lass sie einfach da sein und wieder weiterziehen.

3. Reise zu deinem Wohlfühlort
Stell dir einen Ort vor, an dem du dich sicher, geborgen und wohl fühlst.
Er kann real sein oder aus deiner Fantasie.

4. Schutz & Grenze
Gib dem Ort eine klare Begrenzung (z.B. Tür, Tor, Zaun oder eine unsichtbare Grenze).
Du entscheidest, wer oder was dort sein darf (am besten keine Menschen – vielleicht Tiere).

5. Sinne aktivieren (und anpassen)
Schau dich um: Was siehst du? Mach es so schön, wie du es brauchst.
Hör hin: Welche Geräusche sind da? Stell Lautstärke und Art so ein, dass es angenehm ist.
Riech: Gibt es einen Duft? Wenn nicht, erschaffe einen.
Schmeck: Gibt es etwas zu trinken oder zu essen?
Spür: Wie fühlt sich die Luft an? Temperatur? Kleidung? Untergrund? Alles darf bequem sein.

6. Genießen
Bleib einen Moment dort. Atme ruhig. Nimm das Gefühl von Sicherheit und Ruhe in dir wahr.

7. Anker setzen (optional)
Gib dem Ort einen Namen oder ein Symbol.
Oder verbinde ihn mit einer kleinen Geste (z.B. Hand aufs Herz), damit du ihn schnell wieder findest.

8. Zurückkommen
Verabschiede dich langsam von deinem Ort.
Spür wieder deinen Atem, dann den Stuhl, den Boden, die Umgebung.
Nimm Geräusche im Raum wahr.
Beweg dich sanft, streck dich, öffne die Augen in deinem Tempo.`,
    hashtags: ['panik', 'nicht_einschlafen_können', 'beruhigung', 'sicherheit']
  },
  {
    id: 'rosa-innerer-ort',
    categoryId: 'rosa',
    title: 'Innerer sicherer Ort',
    text: `1. Ankommen
Setz dich bequem hin. Spür den Kontakt zum Stuhl und den Boden unter deinen Füßen.
Atme ruhig ein und aus. Komm mit jedem Atemzug ein bisschen mehr zur Ruhe.

2. Atem & Gedanken
Nimm deinen Atem wahr, ohne ihn zu verändern.
Wenn Gedanken kommen: Lass sie einfach da sein und wieder weiterziehen.

3. Reise zu deinem Wohlfühlort
Stell dir einen Ort vor, an dem du dich sicher, geborgen und wohl fühlst.
Er kann real sein oder aus deiner Fantasie.

4. Schutz & Grenze
Gib dem Ort eine klare Begrenzung (z.B. Tür, Tor, Zaun oder eine unsichtbare Grenze).
Du entscheidest, wer oder was dort sein darf (am besten keine Menschen – vielleicht Tiere).

5. Sinne aktivieren (und anpassen)
Schau dich um: Was siehst du? Mach es so schön, wie du es brauchst.
Hör hin: Welche Geräusche sind da? Stell Lautstärke und Art so ein, dass es angenehm ist.
Riech: Gibt es einen Duft? Wenn nicht, erschaffe einen.
Schmeck: Gibt es etwas zu trinken oder zu essen?
Spür: Wie fühlt sich die Luft an? Temperatur? Kleidung? Untergrund? Alles darf bequem sein.

6. Genießen
Bleib einen Moment dort. Atme ruhig. Nimm das Gefühl von Sicherheit und Ruhe in dir wahr.

7. Anker setzen (optional)
Gib dem Ort einen Namen oder ein Symbol.
Oder verbinde ihn mit einer kleinen Geste (z.B. Hand aufs Herz), damit du ihn schnell wieder findest.

8. Zurückkommen
Verabschiede dich langsam von deinem Ort.
Spür wieder deinen Atem, dann den Stuhl, den Boden, die Umgebung.
Nimm Geräusche im Raum wahr.
Beweg dich sanft, streck dich, öffne die Augen in deinem Tempo.`,
    hashtags: ['panik', 'nicht_einschlafen_können', 'schutz', 'geborgenheit']
  },
  {
    id: 'beige-innerer-ort',
    categoryId: 'beige',
    title: 'Innerer sicherer Ort',
    text: `1. Ankommen
Setz dich bequem hin. Spür den Kontakt zum Stuhl und den Boden unter deinen Füßen.
Atme ruhig ein und aus. Komm mit jedem Atemzug ein bisschen mehr zur Ruhe.

2. Atem & Gedanken
Nimm deinen Atem wahr, ohne ihn zu verändern.
Wenn Gedanken kommen: Lass sie einfach da sein und wieder weiterziehen.

3. Reise zu deinem Wohlfühlort
Stell dir einen Ort vor, an dem du dich sicher, geborgen und wohl fühlst.
Er kann real sein oder aus deiner Fantasie.

4. Schutz & Grenze
Gib dem Ort eine klare Begrenzung (z.B. Tür, Tor, Zaun oder eine unsichtbare Grenze).
Du entscheidest, wer oder was dort sein darf (am besten keine Menschen – vielleicht Tiere).

5. Sinne aktivieren (und anpassen)
Schau dich um: Was siehst du? Mach es so schön, wie du es brauchst.
Hör hin: Welche Geräusche sind da? Stell Lautstärke und Art so ein, dass es angenehm ist.
Riech: Gibt es einen Duft? Wenn nicht, erschaffe einen.
Schmeck: Gibt es etwas zu trinken oder zu essen?
Spür: Wie fühlt sich die Luft an? Temperatur? Kleidung? Untergrund? Alles darf bequem sein.

6. Genießen
Bleib einen Moment dort. Atme ruhig. Nimm das Gefühl von Sicherheit und Ruhe in dir wahr.

7. Anker setzen (optional)
Gib dem Ort einen Namen oder ein Symbol.
Oder verbinde ihn mit einer kleinen Geste (z.B. Hand aufs Herz), damit du ihn schnell wieder findest.

8. Zurückkommen
Verabschiede dich langsam von deinem Ort.
Spür wieder deinen Atem, dann den Stuhl, den Boden, die Umgebung.
Nimm Geräusche im Raum wahr.
Beweg dich sanft, streck dich, öffne die Augen in deinem Tempo.`,
    hashtags: ['nicht_einschlafen_können', 'erschöpfung', 'halt', 'selbstmitgefühl']
  }
];

export const recoveryTypes: RecoveryType[] = [
  {
    id: 'koerperlich',
    name: 'Körperliche Erholung',
    title: 'Wenn dein Körper nicht mehr kann ...',
    color: '#6B9BD1',
    colorClass: 'bg-[#6B9BD1]',
    shortDescription: 'wenn du erschöpft bist',
    signs: [
      'schwere Müdigkeit',
      'Verspannungen/Kopfschmerzen',
      'schwaches Immunsystem',
      'Appetit-/Libidoverlust',
      'Magen-Darm-Beschwerden'
    ],
    helps: [
      'ausschlafen',
      'Wärme/Wellness',
      'leichte Bewegung (Yoga, Dehnen, Spazieren)',
      'ausruhen'
    ]
  },
  {
    id: 'mental',
    name: 'Mentale Erholung',
    title: 'Wenn dein Kopf überläuft ...',
    color: '#E8C66C',
    colorClass: 'bg-[#E8C66C]',
    shortDescription: 'wenn du nicht mehr denken kannst',
    signs: [
      'Konzentrationsprobleme',
      'Reizbarkeit',
      'Vergesslichkeit',
      'Gedankenchaos'
    ],
    helps: [
      'bildschirmfreie Zeit',
      'Mini-Pausen',
      'Spaziergänge',
      'Gedanken sortieren (z. B. Listen schreiben)',
      'Aufgaben abgeben'
    ]
  },
  {
    id: 'emotional',
    name: 'Emotionale Erholung',
    title: 'Wenn dein Herz müde ist ...',
    color: '#A5C4D4',
    colorClass: 'bg-[#A5C4D4]',
    shortDescription: 'wenn du nichts mehr fühlst',
    signs: [
      'emotionale Leere',
      'wenig Freude',
      'schnelle Erschöpfung',
      'Rückzug'
    ],
    helps: [
      'Gefühle zulassen',
      'darüber sprechen',
      'weinen',
      'Selfcare & Journaling',
      'dich fragen: "Was brauche ich?"'
    ]
  }
];

export const situations: Situation[] = [
  {
    id: 'panik',
    name: 'Panikattacke',
    description: 'Dein Herz rast, du fühlst Alarm im Körper',
    color: '#E85D75',
    colorClass: 'bg-[#E85D75]',
    icon: 'AlertCircle',
    relevantCardIds: ['blau-1', 'blau-innerer-ort', 'rosa-innerer-ort']
  },
  {
    id: 'schlaf',
    name: 'Kann nicht einschlafen',
    description: 'Die Gedanken kreisen, du findest keine Ruhe',
    color: '#7B68A6',
    colorClass: 'bg-[#7B68A6]',
    icon: 'Moon',
    relevantCardIds: ['blau-innerer-ort', 'rosa-innerer-ort', 'beige-innerer-ort', 'blau-4']
  },
  {
    id: 'ueberwaeltigt',
    name: 'Überwältigt',
    description: 'Alles ist zu viel, du fühlst dich überfordert',
    color: '#E8A87C',
    colorClass: 'bg-[#E8A87C]',
    icon: 'CloudRain',
    relevantCardIds: ['blau-2', 'blau-3', 'orange-1', 'gruen-2', 'rosa-1']
  },
  {
    id: 'unruhig',
    name: 'Unruhig & rastlos',
    description: 'Du kannst nicht stillsitzen, fühlst dich getrieben',
    color: '#F4A261',
    colorClass: 'bg-[#F4A261]',
    icon: 'Wind',
    relevantCardIds: ['orange-1', 'orange-4', 'koralle-1', 'koralle-2']
  },
  {
    id: 'dissoziation',
    name: 'Neben mir stehen',
    description: 'Du fühlst dich nicht ganz da, benommen oder abwesend',
    color: '#84B59F',
    colorClass: 'bg-[#84B59F]',
    icon: 'Cloud',
    relevantCardIds: ['gruen-1', 'gruen-2', 'gruen-4', 'gruen-5']
  },
  {
    id: 'verspannt',
    name: 'Angespannt',
    description: 'Dein Körper ist verspannt, du fühlst Druck',
    color: '#C9B5A8',
    colorClass: 'bg-[#C9B5A8]',
    icon: 'Zap',
    relevantCardIds: ['blau-4', 'orange-2', 'orange-5', 'koralle-2', 'koralle-6', 'gruen-6']
  }
];

export type Affirmation = {
  id: string;
  text: string;
};

export const affirmations: Affirmation[] = [
  { id: 'aff-1', text: 'Du bist genug, genau so wie du bist.' },
  { id: 'aff-2', text: 'Du darfst Fehler machen. Das macht dich menschlich.' },
  { id: 'aff-3', text: 'Es ist okay, nicht okay zu sein.' },
  { id: 'aff-4', text: 'Du machst das richtig. Jeder Schritt zählt.' },
  { id: 'aff-5', text: 'Du bist nicht allein mit dem, was du fühlst.' },
  { id: 'aff-6', text: 'Du darfst dir Zeit nehmen. Es gibt kein "zu langsam".' },
  { id: 'aff-7', text: 'Deine Gefühle sind gültig und wichtig.' },
  { id: 'aff-8', text: 'Du verdienst Ruhe und Fürsorge.' },
  { id: 'aff-9', text: 'Jeder Tag ist eine neue Chance.' },
  { id: 'aff-10', text: 'Du bist stärker, als du denkst.' },
  { id: 'aff-11', text: 'Es ist mutig, um Hilfe zu bitten.' },
  { id: 'aff-12', text: 'Du darfst stolz auf dich sein.' },
  { id: 'aff-13', text: 'Kleine Schritte sind auch Schritte.' },
  { id: 'aff-14', text: 'Du musst nicht perfekt sein.' },
  { id: 'aff-15', text: 'Du hast das Recht, Grenzen zu setzen.' },
  { id: 'aff-16', text: 'Du darfst dich ausruhen, ohne es verdienen zu müssen.' },
  { id: 'aff-17', text: 'Deine Bedürfnisse sind wichtig.' },
  { id: 'aff-18', text: 'Es ist okay, nicht alles zu schaffen.' },
  { id: 'aff-19', text: 'Du bist wertvoll, unabhängig von deiner Leistung.' },
  { id: 'aff-20', text: 'Du darfst dir selbst verzeihen.' },
  { id: 'aff-21', text: 'Dein Tempo ist genau richtig.' },
  { id: 'aff-22', text: 'Du darfst Nein sagen.' },
  { id: 'aff-23', text: 'Heute ist genug. Du bist genug.' },
  { id: 'aff-24', text: 'Du hast schon so viel geschafft.' },
  { id: 'aff-25', text: 'Es ist okay, sich zu schonen.' },
  { id: 'aff-26', text: 'Du darfst sanft mit dir selbst sein.' },
  { id: 'aff-27', text: 'Deine Geschichte ist wichtig.' },
  { id: 'aff-28', text: 'Du verdienst Liebe und Respekt – auch von dir selbst.' },
  { id: 'aff-29', text: 'Manchmal ist "Durchhalten" schon ein Erfolg.' },
  { id: 'aff-30', text: 'Du bist mehr als deine Ängste.' },
  { id: 'aff-31', text: 'Jeder Atemzug ist ein Neuanfang.' }
];