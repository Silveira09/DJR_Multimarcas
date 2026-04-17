export interface Car {
  id?: number
  brand: string
  model: string
  year: number
  color: string
  mileage: number
  price: number
  plate: string // Apenas para admin
  transmission: 'Manual' | 'Automático' | 'CVT' | 'Outro'
  description: string
  images: string[]
  featured: boolean
  available: boolean
  created_at?: string
  updated_at?: string
}

export interface Settings {
  id?: number
  storeName: string
  contactPhone: string
  whatsappMessage: string
  warrantyMonths: number
  logoText: string
  logoSubtext: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  socialInstagram?: string
  socialFacebook?: string
  socialWhatsapp?: string
  address?: string
  email?: string
  // Localização
  googleMapsEmbed?: string
  gpsLink?: string
  // Segurança
  adminPassword?: string
  updated_at?: string
}

export interface User {
  id: string
  email: string
  isAdmin: boolean
}
