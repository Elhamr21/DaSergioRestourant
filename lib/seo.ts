import { contactInfo, logoUrl, menuItems, restaurantImages, restaurantInfo, reviews, reviewSummary } from './data'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.dasergio-restaurant.de').replace(/\/$/, '')
export const metadataBase = new URL(siteUrl)

export const siteName = `${restaurantInfo.name} ${restaurantInfo.tagline}`
export const defaultDescription =
  'Authentische italienische Küche in Fulda: Pizza, Pasta, Fleisch- und Fischgerichte, Desserts und Tischreservierung bei Da Sergio.'
export const defaultSeoImage = restaurantImages[0]?.url ?? logoUrl

export const businessAddress = {
  streetAddress: 'Heinrich-von-Bibra-Platz 1b',
  postalCode: '36037',
  addressLocality: 'Fulda',
  addressRegion: 'Hessen',
  addressCountry: 'DE',
}

export const businessPhoneInternational = '+4915202091211'

const dayOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const categoryLabels: Record<string, string> = {
  antipasti: 'Antipasti',
  salate: 'Salate',
  pizza: 'Pizza',
  pasta: 'Pasta',
  schnitzel: 'Schnitzel',
  fleisch: 'Fleisch',
  fisch: 'Fisch',
  dolci: 'Desserts',
  bevande: 'Getränke',
}

function toIsoDate(date: string) {
  const [day, month, year] = date.split('.')
  return `${year}-${month}-${day}`
}

export function getRestaurantJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${siteUrl}/#restaurant`,
    name: restaurantInfo.name,
    legalName: `${restaurantInfo.name} - ${restaurantInfo.tagline}`,
    description: defaultDescription,
    image: [logoUrl, ...restaurantImages.map((image) => image.url)],
    logo: logoUrl,
    url: siteUrl,
    telephone: businessPhoneInternational,
    email: contactInfo.email,
    address: {
      '@type': 'PostalAddress',
      ...businessAddress,
    },
    hasMap: contactInfo.googleMapsUrl,
    servesCuisine: ['Italienisch', 'Pizza', 'Pasta'],
    priceRange: '€€',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek,
        opens: '12:00',
        closes: '22:30',
      },
    ],
    menu: `${siteUrl}/menu`,
    hasMenu: {
      '@id': `${siteUrl}/menu#menu`,
    },
    acceptsReservations: true,
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/#kontakt`,
        inLanguage: 'de-DE',
      },
      result: {
        '@type': 'Reservation',
        name: 'Tischreservierung',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviewSummary.ratingValue,
      reviewCount: reviewSummary.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.name,
      },
      datePublished: toIsoDate(review.date),
      reviewBody: review.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  }
}

export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    inLanguage: 'de-DE',
    publisher: {
      '@id': `${siteUrl}/#restaurant`,
    },
  }
}

export function getMenuJsonLd() {
  const sections = Object.entries(categoryLabels)
    .map(([category, name]) => {
      const items = menuItems.filter((item) => item.category === category)

      if (items.length === 0) return null

      return {
        '@type': 'MenuSection',
        name,
        hasMenuItem: items.map((item) => ({
          '@type': 'MenuItem',
          name: item.name,
          description: item.description,
          image: item.imageUrl,
          suitableForDiet: [
            item.isVegetarian ? 'https://schema.org/VegetarianDiet' : null,
            item.isVegan ? 'https://schema.org/VeganDiet' : null,
            item.isGlutenFree ? 'https://schema.org/GlutenFreeDiet' : null,
          ].filter(Boolean),
          offers: {
            '@type': 'Offer',
            price: item.price.toFixed(2),
            priceCurrency: 'EUR',
          },
        })),
      }
    })
    .filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${siteUrl}/menu#menu`,
    name: `Speisekarte von ${restaurantInfo.name}`,
    url: `${siteUrl}/menu`,
    mainEntityOfPage: `${siteUrl}/menu`,
    inLanguage: 'de-DE',
    hasMenuSection: sections,
  }
}
