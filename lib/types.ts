export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'pizza' | 'pasta' | 'antipasti' | 'dolci' | 'bevande' | 'fleisch' | 'fisch' | 'schnitzel' | 'salate'
  imageUrl: string
  allergens: string[]
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  spicyLevel?: 0 | 1 | 2 | 3
  order: number
}

export interface EventMedia {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  title: string
  eventDate: string
  description?: string
}

export interface FoodDrinkMedia {
  id: string
  type: 'image'
  url: string
  title: string
  category: 'food' | 'drink'
  price?: number
  description?: string
}

export interface Review {
  id: string
  name: string
  rating: number
  date: string
  text: string
  avatar?: string
}

export interface OpeningHours {
  day: string
  hours: string
}
