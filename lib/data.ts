import type { MenuItem, EventMedia, FoodDrinkMedia, Review, OpeningHours } from './types'

export const menuItems: MenuItem[] = [
  // Pizza
  {
    id: 'pizza-1',
    name: 'Pizza Margherita',
    description: 'Klassische Pizza mit Tomatensauce, Mozzarella und frischem Basilikum',
    price: 9.80,
    category: 'pizza',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    allergens: ['gluten', 'lactose'],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    order: 1
  },
  {
    id: 'pizza-2',
    name: 'Pizza Salami',
    description: 'Tomatensauce, Mozzarella und würzige Salami',
    price: 10.80,
    category: 'pizza',
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
    allergens: ['gluten', 'lactose'],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    order: 2
  },
  // Pasta
  {
    id: 'pasta-1',
    name: 'Spaghetti Carbonara',
    description: 'Spaghetti mit Ei, Schinken und Sahne - ein italienischer Klassiker',
    price: 12.80,
    category: 'pasta',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80',
    allergens: ['gluten', 'lactose', 'egg'],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    order: 3
  },
  {
    id: 'pasta-2',
    name: 'Penne Arrabiata',
    description: 'Penne in scharfer Tomatensauce mit Knoblauch und Chili',
    price: 11.80,
    category: 'pasta',
    imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80',
    allergens: ['gluten'],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    spicyLevel: 2,
    order: 4
  },
  // Antipasti
  {
    id: 'antipasti-1',
    name: 'Bruschetta',
    description: 'Geröstetes Brot mit frischen Tomaten und Knoblauch',
    price: 9.80,
    category: 'antipasti',
    imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800&q=80',
    allergens: ['gluten'],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    order: 5
  },
  // Salate
  {
    id: 'salate-1',
    name: 'Salat Caprese',
    description: 'Tomaten - Mozzarella und Rucola',
    price: 11.80,
    category: 'salate',
    imageUrl: 'https://images.unsplash.com/photo-1608032077018-c9aad9565d29?w=800&q=80',
    allergens: ['lactose'],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true,
    order: 6
  },
  // Fleisch
  {
    id: 'fleisch-1',
    name: 'Rumpsteak',
    description: 'Rumpsteak gegrillt (250 gr.), Bratensosse, Kartoffeln, Drillingkartoffeln und Gemüse',
    price: 32.80,
    category: 'fleisch',
    imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
    allergens: [],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    order: 7
  },
  // Schnitzel
  {
    id: 'schnitzel-1',
    name: 'Schnitzel Wiener Art',
    description: 'Schnitzel Wiener Art mit pommes frites',
    price: 13.80,
    category: 'schnitzel',
    imageUrl: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=800&q=80',
    allergens: ['gluten', 'egg'],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    order: 8
  },
  // Fisch
  {
    id: 'fisch-1',
    name: 'Gegrillter Lachs',
    description: 'Gegrillter Lachs mit Gemüse',
    price: 22.80,
    category: 'fisch',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    allergens: ['fish'],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    order: 9
  },
  // Dolci
  {
    id: 'dolci-1',
    name: 'Tiramisu',
    description: 'Hausgemachtes Tiramisu nach original italienischem Rezept',
    price: 8.50,
    category: 'dolci',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
    allergens: ['gluten', 'lactose', 'egg'],
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    order: 10
  },
]

export const eventMedia: EventMedia[] = [
  {
    id: 'event-1',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-31%20at%2016.07.25%20%285%29-uhdRYIWdfr3VVpdXf4lFRYqSal3diC.jpeg',
    title: 'Valentinstag bei Da Sergio',
    eventDate: '14.02.2026',
    description: 'Ein romantischer Abend mit herzförmigen Ballons und besonderer Atmosphäre'
  },
  {
    id: 'event-2',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-31%20at%2016.14.52%20%281%29-nnyThjbsgQ9INJaESbTCxIIDJt6rJy.jpeg',
    title: 'Weihnachtsfeier',
    eventDate: '24.12.2025',
    description: 'Festliche Stimmung mit roter Beleuchtung und Weihnachtsbaum'
  },
  {
    id: 'event-3',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-31%20at%2016.22.38%20%282%29-SJllAiiyLwIsYgYNGGuxh8apnehkuN.jpeg',
    title: 'Silvester Empfang',
    eventDate: '31.12.2025',
    description: 'Sektempfang mit festlicher Dekoration'
  },
  {
    id: 'event-4',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-31%20at%2016.14.59-RSBoqox4x7Ss43kQkppEn3qz2DKKR3.jpeg',
    title: 'Private Feier',
    eventDate: '15.01.2026',
    description: 'Elegante Tischdekoration für besondere Anlässe'
  },
]

export const restaurantImages: FoodDrinkMedia[] = [
  {
    id: 'restaurant-1',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-31%20at%2016.15.08%20%281%29-HrFQInVBLptKz9NshSdefnIj5vMDuB.jpeg',
    title: 'Hauptraum',
    category: 'food',
    description: 'Unser gemütlicher Hauptraum mit Holzakzenten'
  },
  {
    id: 'restaurant-2',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-31%20at%2016.15.08-AMIbtjwtxWW5ltNlcvs9slx8V49Gk8.jpeg',
    title: 'Bar Bereich',
    category: 'drink',
    description: 'Unsere Bar mit exklusiver Weinauswahl'
  },
  {
    id: 'restaurant-3',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-31%20at%2016.15.28-R4u0OpUvCX0nVatlca5Jp18F5BOHNz.jpeg',
    title: 'Festliche Tafel',
    category: 'food',
    description: 'Perfekt für Familienfeiern und Gruppen'
  },
]

export const foodDrinkMedia: FoodDrinkMedia[] = [
  // Menu images
  {
    id: 'menu-vorspeisen',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vorspeisen_salate_supen1-QrQHcWxymNX2IRSYKI5rQojEvZKdL2.png',
    title: 'Vorspeisen, Salate & Suppen',
    category: 'food',
    description: 'Frische Vorspeisen und Salate'
  },
  {
    id: 'menu-pasta',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pasta5-xZyEHeyAetXimfIToxp6PSKuURFHUA.png',
    title: 'Pasta',
    category: 'food',
    description: 'Hausgemachte Pasta'
  },
  {
    id: 'menu-pizza',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pizza3-K2D1ypi49VsYzsrc9mRXNtx7V6XvSk.png',
    title: 'Pizza',
    category: 'food',
    description: 'Traditionelle italienische Pizza'
  },
  {
    id: 'menu-schnitzel',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schnitzel_fleisch4-dyJTYdFEeSGpAGLu3XXimNmHDd2A20.png',
    title: 'Schnitzel & Fleisch',
    category: 'food',
    description: 'Schnitzel und Fleischgerichte'
  },
  {
    id: 'menu-fisch',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fisch10-uFSl89s2S4SbYMe7JtM637eHJUOqKW.png',
    title: 'Fisch',
    category: 'food',
    description: 'Frische Fischgerichte'
  },
  {
    id: 'menu-desserts',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Deserts9-4gaTDMhgMrZAByQ5UTL5bAg0OA9BjU.png',
    title: 'Desserts',
    category: 'food',
    description: 'Süße Versuchungen'
  },
  // Drinks
  {
    id: 'menu-weine',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ApfelweinWeisweineRotweineProsecco2-44FL7XRUuoz5GGytCailFaiM3HC7vv.png',
    title: 'Weine & Prosecco',
    category: 'drink',
    description: 'Ausgewählte Weine aus Italien'
  },
  {
    id: 'menu-biere',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Biere8-SoEJ48uRgWu4HhvNmihO6Jfj32gTPJ.png',
    title: 'Biere',
    category: 'drink',
    description: 'Biere vom Fass und Flasche'
  },
  {
    id: 'menu-alkoholfrei',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AlkoholfreieGetranke_selbstgemachteLimonade7-rVDOrqVTXqHT1uGIBPfT6WBROqR2Bv.png',
    title: 'Alkoholfreie Getränke',
    category: 'drink',
    description: 'Erfrischende Limonaden und mehr'
  },
  {
    id: 'menu-heisse',
    type: 'image',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/seiseGetranke_spriritousen6-azQv5xsWD2ylpJdrXVU89hyNne7trY.png',
    title: 'Heiße Getränke & Spirituosen',
    category: 'drink',
    description: 'Kaffee, Espresso und Digestifs'
  },
]

export const reviews: Review[] = [
  {
    id: 'review-1',
    name: 'Maria S.',
    rating: 5,
    date: '15.03.2026',
    text: 'Absolut fantastisch! Die beste Pizza in Fulda. Das Personal ist sehr freundlich und die Atmosphäre einladend.',
  },
  {
    id: 'review-2',
    name: 'Thomas K.',
    rating: 5,
    date: '10.03.2026',
    text: 'Wir feiern hier regelmäßig unsere Familienfeste. Die Qualität ist immer hervorragend und das Team kümmert sich um jedes Detail.',
  },
  {
    id: 'review-3',
    name: 'Sandra M.',
    rating: 5,
    date: '05.03.2026',
    text: 'Die Pasta Carbonara ist ein Traum! Authentisch italienisch und mit viel Liebe zubereitet. Komme immer wieder gerne.',
  },
  {
    id: 'review-4',
    name: 'Michael B.',
    rating: 4,
    date: '01.03.2026',
    text: 'Tolle Lage, gutes Essen und faire Preise. Das Tiramisu ist hausgemacht und schmeckt fantastisch!',
  },
]

export const openingHours: OpeningHours[] = [
  { day: 'Montag - Sonntag', hours: '12:00 - 22:30 Uhr' },
]

export const contactInfo = {
  address: 'Heinrich-von-Bibra-Platz 1b, 36037 Fulda',
  phone: '0661 49989201',
  email: 'info@dasergio-restaurant.de',
  googleMapsUrl: 'https://maps.google.com/?q=Heinrich-von-Bibra-Platz+1b,+36037+Fulda',
}

export const restaurantInfo = {
  name: 'Da Sergio',
  tagline: 'Restaurant & Pizzeria',
  description: 'Unvergessliches Geschmackserlebnis – Ein Hauch von Perfektion in jedem Gericht',
  philosophy: `Italienische Klassiker, liebevoll zubereitet – ein kulinarisches Erlebnis wie in Italien.

Bei Da Sergio legen wir größten Wert auf Qualität und Frische. Unsere Gerichte werden täglich mit ausgewählten Zutaten zubereitet. Wir verwenden hochwertige italienische Produkte und kochen nach traditionellen Rezepten.

Wir bieten auch vegetarische und vegane Optionen an. Bei Allergien oder Unverträglichkeiten sprechen Sie uns bitte an – wir beraten Sie gerne und passen unsere Gerichte nach Möglichkeit an Ihre Bedürfnisse an.`,
  owner: 'Aurela Deda',
}

export const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-dasergio-0dV2YEDNkPWttAY1KOh2QQ9QEUNdcE.png'
