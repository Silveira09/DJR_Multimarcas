import { useState, useEffect } from 'react'
import { dbCars, dbSettings, storage } from './supabaseClient'
import { Car, Settings } from './types'

// Componente Header
function Header({ 
  settings, 
  onNavigate, 
  currentPage, 
  onOpenLogin, 
  isAdmin, 
  onLogout 
}: { 
  settings: Settings | null
  onNavigate: (page: string) => void
  currentPage: string
  onOpenLogin: () => void
  isAdmin: boolean
  onLogout: () => void
}) {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <span className="text-5xl font-black text-orange-500 tracking-wider">
              {settings?.logoText || 'DJR'}
            </span>
            <span className="text-sm text-gray-600 tracking-widest uppercase">
              {settings?.logoSubtext || 'Multimarcas'}
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => onNavigate('cars')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'cars' || currentPage === 'details' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
              }`}
            >
              Estoque
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'contact' ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
              }`}
            >
              Contato
            </button>
          </nav>

          {/* Admin Button */}
          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <>
                <button
                  onClick={() => onNavigate('admin')}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  Painel Admin
                </button>
                <button
                  onClick={onLogout}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                  title="Sair"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenLogin}
                className="text-gray-400 hover:text-orange-500 transition-colors"
                title="Área Admin"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// Componente CarCard
function CarCard({ car, onClick }: { car: Car; onClick: () => void }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('pt-BR').format(mileage)
  }

  // Build info string only with filled fields
  const infoParts = [car.year.toString()]
  if (car.color && car.color.trim() !== '') infoParts.push(car.color)
  if (car.transmission && car.transmission.trim() !== '') infoParts.push(car.transmission)
  const infoString = infoParts.join(' • ')

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.images[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500'}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {car.featured && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            DESTAQUE
          </span>
        )}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
          car.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {car.available ? 'DISPONÍVEL' : 'VENDIDO'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {car.brand} {car.model}
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          {infoString}
        </p>
        
        {car.mileage && car.mileage > 0 && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500">
              {formatMileage(car.mileage)} km
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-500">
            {formatPrice(car.price)}
          </span>
          <button className="text-orange-500 text-sm font-medium hover:underline">
            Ver detalhes →
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente CarDetails
function CarDetails({ 
  car, 
  settings,
  onBack 
}: { 
  car: Car
  settings: Settings | null
  onBack: () => void 
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('pt-BR').format(mileage)
  }

  const handleWhatsApp = () => {
    const phone = settings?.contactPhone?.replace(/\D/g, '') || '5511999999999'
    const message = encodeURIComponent(
      (settings?.whatsappMessage || 'Olá! Vi o veículo {carro} no valor de {preco} e gostaria de mais informações.')
        .replace('{carro}', `${car.brand} ${car.model} ${car.year}`)
        .replace('{preco}', formatPrice(car.price))
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  const allImages = car.images.length > 0 ? car.images : ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500']

  // Build info string only with filled fields
  const infoParts = [car.year.toString()]
  if (car.color && car.color.trim() !== '') infoParts.push(car.color)
  if (car.transmission && car.transmission.trim() !== '') infoParts.push(car.transmission)
  const infoString = infoParts.join(' • ')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao estoque
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="relative h-96 bg-white rounded-xl overflow-hidden shadow-lg mb-4">
              <img
                src={allImages[currentImageIndex]}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {car.brand} {car.model}
                </h1>
                <p className="text-gray-500">
                  {infoString}
                </p>
              </div>
              {car.featured && (
                <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  DESTAQUE
                </span>
              )}
            </div>

            <div className="text-4xl font-bold text-orange-500 mb-6">
              {formatPrice(car.price)}
            </div>

            {/* Specs Grid - Only show filled fields */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Ano</p>
                <p className="text-lg font-semibold text-gray-800">{car.year}</p>
              </div>
              
              {car.mileage && car.mileage > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Quilometragem</p>
                  <p className="text-lg font-semibold text-gray-800">{formatMileage(car.mileage)} km</p>
                </div>
              )}
              
              {car.color && car.color.trim() !== '' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Cor</p>
                  <p className="text-lg font-semibold text-gray-800">{car.color}</p>
                </div>
              )}
              
              {car.transmission && car.transmission.trim() !== '' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Câmbio</p>
                  <p className="text-lg font-semibold text-gray-800">{car.transmission}</p>
                </div>
              )}
            </div>

            {/* Warranty */}
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-800">Garantia de {settings?.warrantyMonths || 3} meses</p>
                  <p className="text-sm text-gray-500">Segurança e tranquilidade na sua compra</p>
                </div>
              </div>
            </div>

            {/* Description - Only show if filled */}
            {car.description && car.description.trim() !== '' && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Descrição</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{car.description}</p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleWhatsApp}
                disabled={!car.available}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  car.available
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {car.available ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Interessar no WhatsApp
                  </span>
                ) : (
                  'Veículo Vendido'
                )}
              </button>
              {settings?.contactPhone && (
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-gray-800 text-white hover:bg-gray-900 transition-all text-center block"
                >
                  📞 Ligar Agora
                </a>
              )}
            </div>

            {/* Status */}
            {!car.available && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600 font-semibold">Veículo Indisponível</p>
                <p className="text-sm text-red-500">Este veículo já foi vendido</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente AdminPanel
function AdminPanel({ 
  settings,
  onSaveSettings,
  onLogout 
}: { 
  settings: Settings | null
  onSaveSettings: (settings: Settings) => void
  onLogout: () => void
}) {
  const [activeTab, setActiveTab] = useState<'cars' | 'settings'>('cars')
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<Settings>({
    storeName: settings?.storeName || 'DJR Multimarcas',
    contactPhone: settings?.contactPhone || '',
    whatsappMessage: settings?.whatsappMessage || 'Olá! Vi o veículo {carro} no valor de {preco} e gostaria de mais informações.',
    warrantyMonths: settings?.warrantyMonths || 3,
    logoText: settings?.logoText || 'DJR',
    logoSubtext: settings?.logoSubtext || 'Multimarcas',
    primaryColor: settings?.primaryColor || '#000000',
    secondaryColor: settings?.secondaryColor || '#FFFFFF',
    accentColor: settings?.accentColor || '#F97316',
    socialInstagram: settings?.socialInstagram || '',
    socialFacebook: settings?.socialFacebook || '',
    socialWhatsapp: settings?.socialWhatsapp || '',
    address: settings?.address || '',
    email: settings?.email || '',
    googleMapsEmbed: settings?.googleMapsEmbed || '',
    gpsLink: settings?.gpsLink || '',
    adminPassword: settings?.adminPassword || 'djr2024admin'
  })

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Car form state
  const [carForm, setCarForm] = useState<Omit<Car, 'id' | 'created_at' | 'updated_at'>>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    mileage: 0,
    price: 0,
    plate: '',
    transmission: 'Manual',
    description: '',
    images: [],
    featured: false,
    available: true
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async () => {
    try {
      const data = await dbCars.getAll()
      setCars(data)
    } catch (error) {
      console.error('Erro ao carregar carros:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      await dbSettings.update(settingsForm)
      onSaveSettings(settingsForm)
      alert('Configurações salvas com sucesso!')
    } catch (error) {
      alert('Erro ao salvar configurações')
    }
  }

  const handleChangePassword = () => {
    // Validate current password
    if (currentPassword !== settings?.adminPassword && currentPassword !== 'djr2024admin') {
      setPasswordMessage({ type: 'error', text: 'Senha atual incorreta' })
      return
    }

    // Validate new password
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres' })
      return
    }

    // Validate confirmation
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'As senhas não coincidem' })
      return
    }

    // Update password
    setSettingsForm({ ...settingsForm, adminPassword: newPassword })
    setPasswordMessage({ type: 'success', text: 'Senha alterada com sucesso! Não esqueça de salvar as configurações.' })
    
    // Clear fields
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    setImageFiles(prev => [...prev, ...newFiles])
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmitCar = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let imageUrls: string[] = []
      
      // Upload images
      for (const file of imageFiles) {
        const url = await storage.uploadImage(file)
        imageUrls.push(url)
      }

      const carData = {
        ...carForm,
        images: editingCar ? [...editingCar.images, ...imageUrls] : imageUrls
      }

      if (editingCar) {
        await dbCars.update(editingCar.id!, carData)
      } else {
        await dbCars.create(carData)
      }

      await loadCars()
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar carro:', error)
      alert('Erro ao salvar veículo')
    }
  }

  const resetForm = () => {
    setCarForm({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      mileage: 0,
      price: 0,
      plate: '',
      transmission: 'Manual',
      description: '',
      images: [],
      featured: false,
      available: true
    })
    setImageFiles([])
    setShowForm(false)
    setEditingCar(null)
  }

  const handleEditCar = (car: Car) => {
    setCarForm({
      brand: car.brand,
      model: car.model,
      year: car.year,
      color: car.color,
      mileage: car.mileage,
      price: car.price,
      plate: car.plate,
      transmission: car.transmission,
      description: car.description,
      images: car.images,
      featured: car.featured,
      available: car.available
    })
    setEditingCar(car)
    setShowForm(true)
  }

  const handleDeleteCar = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return
    
    try {
      await dbCars.delete(id)
      await loadCars()
    } catch (error) {
      alert('Erro ao excluir veículo')
    }
  }

  const filteredCars = cars.filter(car => {
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'available' 
        ? car.available 
        : !car.available
    
    const matchesSearch = searchTerm === '' || 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.plate.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
          <button
            onClick={onLogout}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Sair
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('cars')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'cars' 
                ? 'text-orange-500 border-b-2 border-orange-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Gestão de Estoque
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-4 font-medium transition-colors ${
              activeTab === 'settings' 
                ? 'text-orange-500 border-b-2 border-orange-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Configurações
          </button>
        </div>

        {/* Cars Tab */}
        {activeTab === 'cars' && (
          <div>
            {/* Actions */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                + Adicionar Veículo
              </button>
              
              <input
                type="text"
                placeholder="Buscar por marca, modelo ou placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Todos</option>
                <option value="available">Disponíveis</option>
                <option value="sold">Vendidos</option>
              </select>
            </div>

            {/* Cars Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Veículo</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Ano</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">KM</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCars.map(car => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={car.images[0] || 'https://via.placeholder.com/50'}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover mr-3"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{car.brand} {car.model}</p>
                            <p className="text-sm text-gray-500">{car.color} • {car.transmission}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{car.year}</td>
                      <td className="px-6 py-4 text-gray-600">{new Intl.NumberFormat('pt-BR').format(car.mileage)} km</td>
                      <td className="px-6 py-4 text-gray-600 font-mono">{car.plate}</td>
                      <td className="px-6 py-4 font-semibold text-orange-500">{formatPrice(car.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          car.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {car.available ? 'Disponível' : 'Vendido'}
                        </span>
                        {car.featured && (
                          <span className="ml-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600">
                            Destaque
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCar(car)}
                            className="text-blue-500 hover:text-blue-600"
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car.id!)}
                            className="text-red-500 hover:text-red-600"
                            title="Excluir"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCars.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Nenhum veículo encontrado
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Configurações da Loja</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Loja</label>
                <input
                  type="text"
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({...settingsForm, storeName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone/WhatsApp</label>
                <input
                  type="text"
                  value={settingsForm.contactPhone}
                  onChange={(e) => setSettingsForm({...settingsForm, contactPhone: e.target.value})}
                  placeholder="5511999999999"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem do WhatsApp
                  <span className="text-gray-500 text-xs ml-2">
                    Use {'{carro}'} e {'{preco}'} para substituição automática
                  </span>
                </label>
                <textarea
                  value={settingsForm.whatsappMessage}
                  onChange={(e) => setSettingsForm({...settingsForm, whatsappMessage: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Garantia (meses)</label>
                <input
                  type="number"
                  value={settingsForm.warrantyMonths}
                  onChange={(e) => setSettingsForm({...settingsForm, warrantyMonths: parseInt(e.target.value) || 3})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({...settingsForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({...settingsForm, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="text"
                  value={settingsForm.socialInstagram}
                  onChange={(e) => setSettingsForm({...settingsForm, socialInstagram: e.target.value})}
                  placeholder="@seuinstagram"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="text"
                  value={settingsForm.socialFacebook}
                  onChange={(e) => setSettingsForm({...settingsForm, socialFacebook: e.target.value})}
                  placeholder="facebook.com/suapagina"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Localização */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📍 Localização da Loja</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Maps Embed (iframe)
                    <span className="text-gray-500 text-xs ml-2">
                      Obtenha em: Google Maps → Compartilhar → Incorporar um mapa
                    </span>
                  </label>
                  <textarea
                    value={settingsForm.googleMapsEmbed || ''}
                    onChange={(e) => setSettingsForm({...settingsForm, googleMapsEmbed: e.target.value})}
                    rows={3}
                    placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link do GPS (Waze/Google Maps)
                    <span className="text-gray-500 text-xs ml-2">
                      Para o botão "Como Chegar"
                    </span>
                  </label>
                  <input
                    type="text"
                    value={settingsForm.gpsLink || ''}
                    onChange={(e) => setSettingsForm({...settingsForm, gpsLink: e.target.value})}
                    placeholder="https://waze.com/ul/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Segurança - Mudança de Senha */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🔐 Segurança</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Digite a senha atual"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Digite a nova senha"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Confirme a nova senha"
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleChangePassword}
                  className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                >
                  Alterar Senha
                </button>
                {passwordMessage && (
                  <span className={`ml-4 text-sm ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordMessage.text}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleSaveSettings}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        )}

        {/* Car Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingCar ? 'Editar Veículo' : 'Adicionar Veículo'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmitCar} className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                      <input
                        type="text"
                        required
                        value={carForm.brand}
                        onChange={(e) => setCarForm({...carForm, brand: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Ex: Honda"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
                      <input
                        type="text"
                        required
                        value={carForm.model}
                        onChange={(e) => setCarForm({...carForm, model: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Ex: Civic"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
                      <input
                        type="number"
                        required
                        value={carForm.year}
                        onChange={(e) => setCarForm({...carForm, year: parseInt(e.target.value) || new Date().getFullYear()})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cor <span className="text-gray-400 font-normal">(opcional)</span></label>
                      <input
                        type="text"
                        value={carForm.color}
                        onChange={(e) => setCarForm({...carForm, color: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Ex: Prata"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Câmbio <span className="text-gray-400 font-normal">(opcional)</span></label>
                      <select
                        value={carForm.transmission}
                        onChange={(e) => setCarForm({...carForm, transmission: e.target.value as any})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Selecione...</option>
                        <option value="Manual">Manual</option>
                        <option value="Automático">Automático</option>
                        <option value="CVT">CVT</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Placa <span className="text-gray-400 font-normal">(opcional - só admin vê)</span></label>
                      <input
                        type="text"
                        value={carForm.plate}
                        onChange={(e) => setCarForm({...carForm, plate: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="ABC1234"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quilometragem <span className="text-gray-400 font-normal">(opcional)</span></label>
                      <input
                        type="number"
                        value={carForm.mileage || ''}
                        onChange={(e) => setCarForm({...carForm, mileage: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Ex: 50000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$) <span className="text-orange-500 font-normal">*</span></label>
                      <input
                        type="number"
                        required
                        value={carForm.price}
                        onChange={(e) => setCarForm({...carForm, price: parseFloat(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Ex: 85000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição <span className="text-gray-400 font-normal">(opcional)</span></label>
                    <textarea
                      value={carForm.description}
                      onChange={(e) => setCarForm({...carForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Descreva o veículo, opcionais, estado de conservação, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagens do Veículo <span className="text-gray-400 font-normal">(opcional)</span></label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600">Clique para selecionar imagens</p>
                        <p className="text-xs text-gray-500 mt-1">ou arraste e solte aqui (JPG, PNG)</p>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Você pode selecionar múltiplas imagens de uma vez</p>
                    
                    {/* Show new images to upload */}
                    {imageFiles.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Novas imagens:</p>
                        <div className="flex flex-wrap gap-2">
                          {imageFiles.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt=""
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show existing images when editing */}
                    {editingCar && editingCar.images && editingCar.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Imagens atuais:</p>
                        <div className="flex flex-wrap gap-2">
                          {editingCar.images.map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt=""
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={carForm.featured}
                        onChange={(e) => setCarForm({...carForm, featured: e.target.checked})}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Destaque</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={carForm.available}
                        onChange={(e) => setCarForm({...carForm, available: e.target.checked})}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Disponível</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                      {editingCar ? 'Atualizar' : 'Salvar'} Veículo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente LoginModal
function LoginModal({ 
  isOpen, 
  onClose, 
  onLogin 
}: { 
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Login secreto
    if (username === 'admin' && password === 'djr2024admin') {
      onLogin()
      onClose()
      setError('')
    } else {
      setError('Usuário ou senha incorretos')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Área Administrativa</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Digite seu usuário"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Digite sua senha"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

// Componente Home
function Home({ 
  settings,
  cars,
  onNavigate,
  onViewCar 
}: { 
  settings: Settings | null
  cars: Car[]
  onNavigate: (page: string) => void
  onViewCar: (car: Car) => void
}) {
  const featuredCars = cars.filter(c => c.featured && c.available).slice(0, 6)
  const availableCars = cars.filter(c => c.available)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Encontre o Carro dos Seus Sonhos
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Na DJR Multimarcas você encontra os melhores veículos com garantia e procedência.
          </p>
          <button
            onClick={() => onNavigate('cars')}
            className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors"
          >
            Ver Estoque
          </button>
        </div>
      </section>

      {/* Featured Cars */}
      {featuredCars.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Veículos em Destaque
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map(car => (
                <CarCard key={car.id} car={car} onClick={() => onViewCar(car)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Available Cars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Nosso Estoque
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCars.slice(0, 6).map(car => (
              <CarCard key={car.id} car={car} onClick={() => onViewCar(car)} />
            ))}
          </div>
          {availableCars.length > 6 && (
            <div className="text-center mt-8">
              <button
                onClick={() => onNavigate('cars')}
                className="text-orange-500 font-medium hover:underline"
              >
                Ver todos os veículos →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Por Que Escolher a DJR?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Garantia de {settings?.warrantyMonths || 3} Meses
              </h3>
              <p className="text-gray-600">
                Todos os veículos com garantia completa para sua tranquilidade.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Procedência Verificada
              </h3>
              <p className="text-gray-600">
                Todos os veículos passam por rigorosa verificação de documentação.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Melhor Preço
              </h3>
              <p className="text-gray-600">
                Preços justos e condições especiais de pagamento.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Componente CarGrid (Página de Estoque)
function CarGridPage({ 
  cars, 
  onViewCar 
}: { 
  cars: Car[]
  onViewCar: (car: Car) => void 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'year-desc' | 'newest'>('newest')
  const [filterAvailable, setFilterAvailable] = useState(true)

  const filteredCars = cars
    .filter(car => !filterAvailable || car.available)
    .filter(car => 
      searchTerm === '' ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'year-desc':
          return b.year - a.year
        case 'newest':
        default:
          return (b.created_at || '').localeCompare(a.created_at || '')
      }
    })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Nosso Estoque
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar por marca ou modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="newest">Mais Recentes</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="year-desc">Mais Recente (Ano)</option>
          </select>

          <label className="flex items-center px-4 py-3 border border-gray-300 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
            />
            <span className="ml-2 text-gray-700">Disponíveis</span>
          </label>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map(car => (
            <CarCard key={car.id} car={car} onClick={() => onViewCar(car)} />
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum veículo encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente Contact
function ContactPage({ settings }: { settings: Settings | null }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Entre em Contato
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações</h2>
              
              <div className="space-y-4">
                {settings?.contactPhone && (
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${settings.contactPhone}`} className="text-gray-700 hover:text-orange-500">
                      {settings.contactPhone}
                    </a>
                  </div>
                )}

                {settings?.email && (
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${settings.email}`} className="text-gray-700 hover:text-orange-500">
                      {settings.email}
                    </a>
                  </div>
                )}

                {settings?.address && (
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{settings.address}</span>
                  </div>
                )}
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Redes Sociais</h3>
                <div className="flex space-x-4">
                  {settings?.socialWhatsapp && (
                    <a
                      href={`https://wa.me/${settings.socialWhatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                  )}
                  {settings?.socialInstagram && (
                    <a
                      href={`https://instagram.com/${settings.socialInstagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:opacity-90 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {settings?.socialFacebook && (
                    <a
                      href={settings.socialFacebook.startsWith('http') ? settings.socialFacebook : `https://${settings.socialFacebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              {settings?.googleMapsEmbed ? (
                <div 
                  className="rounded-xl overflow-hidden shadow-lg"
                  dangerouslySetInnerHTML={{ __html: settings.googleMapsEmbed }}
                  style={{ width: '100%', height: '350px' }}
                />
              ) : (
                <div className="bg-gray-100 rounded-xl flex items-center justify-center min-h-[350px]">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-orange-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-500">Visite nossa loja</p>
                    {settings?.address && (
                      <p className="text-gray-700 font-medium mt-2">{settings.address}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Botão Como Chegar */}
              {settings?.gpsLink && (
                <a
                  href={settings.gpsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center w-full bg-green-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-600 transition-colors"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Como Chegar
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente Footer
function Footer({ settings }: { settings: Settings | null }) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex flex-col items-center md:items-start mb-4">
              <span className="text-4xl font-black text-orange-500 tracking-wider">
                {settings?.logoText || 'DJR'}
              </span>
              <span className="text-sm text-gray-400 tracking-widest uppercase">
                {settings?.logoSubtext || 'Multimarcas'}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Os melhores veículos com a qualidade e confiança que você merece.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              {settings?.contactPhone && (
                <p>📞 {settings.contactPhone}</p>
              )}
              {settings?.email && (
                <p>✉️ {settings.email}</p>
              )}
              {settings?.address && (
                <p>📍 {settings.address}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Garantia</h3>
            <p className="text-gray-400 text-sm">
              Todos os veículos com garantia de {settings?.warrantyMonths || 3} meses.
              Compre com tranquilidade e segurança.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {settings?.storeName || 'DJR Multimarcas'}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

// App Principal
function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [settingsData, carsData] = await Promise.all([
        dbSettings.get(),
        dbCars.getAll()
      ])
      setSettings(settingsData)
      setCars(carsData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    setIsAdmin(true)
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setCurrentPage('home')
  }

  const handleViewCar = (car: Car) => {
    setSelectedCar(car)
    setCurrentPage('details')
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    if (page !== 'details') {
      setSelectedCar(null)
    }
  }

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show header only on non-admin pages */}
      {!isAdmin && (
        <>
          <Header
            settings={settings}
            onNavigate={handleNavigate}
            currentPage={currentPage}
            onOpenLogin={() => setShowLoginModal(true)}
            isAdmin={isAdmin}
            onLogout={handleLogout}
          />

          <main>
            {currentPage === 'home' && (
              <Home
                settings={settings}
                cars={cars}
                onNavigate={handleNavigate}
                onViewCar={handleViewCar}
              />
            )}

            {currentPage === 'cars' && (
              <CarGridPage
                cars={cars}
                onViewCar={handleViewCar}
              />
            )}

            {currentPage === 'details' && selectedCar && (
              <CarDetails
                car={selectedCar}
                settings={settings}
                onBack={() => handleNavigate('cars')}
              />
            )}

            {currentPage === 'contact' && (
              <ContactPage settings={settings} />
            )}
          </main>

          <Footer settings={settings} />
        </>
      )}

      {/* Admin Panel */}
      {isAdmin && (
        <AdminPanel
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onLogout={handleLogout}
        />
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}

export default App
