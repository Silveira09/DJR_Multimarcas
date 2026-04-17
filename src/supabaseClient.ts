import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase
// Substitua estas URLs pelas do seu projeto Supabase
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções de banco de dados para carros
export const dbCars = {
  // Buscar todos os carros
  async getAll() {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  // Buscar carro por ID
  async getById(id: number) {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar novo carro
  async create(car: any) {
    const { data, error } = await supabase
      .from('cars')
      .insert([car])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Atualizar carro
  async update(id: number, car: any) {
    const { data, error } = await supabase
      .from('cars')
      .update(car)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Deletar carro
  async delete(id: number) {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// Funções de banco de dados para configurações
export const dbSettings = {
  async get() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data || null
  },

  async update(settings: any) {
    const existing = await this.get()
    
    if (existing) {
      const { data, error } = await supabase
        .from('settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
      
      if (error) throw error
      return data[0]
    } else {
      const { data, error } = await supabase
        .from('settings')
        .insert([{ ...settings, id: 1 }])
        .select()
      
      if (error) throw error
      return data[0]
    }
  }
}

// Funções de upload de imagens
export const storage = {
  async uploadImage(file: File, carId?: number) {
    const fileName = `${Date.now()}-${file.name}`
    const path = carId ? `cars/${carId}/${fileName}` : `cars/${fileName}`
    
    const { error } = await supabase.storage
      .from('car-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) throw error
    
    // URL pública da imagem
    const { data: urlData } = supabase.storage
      .from('car-images')
      .getPublicUrl(path)
    
    return urlData.publicUrl
  },

  async deleteImage(url: string) {
    try {
      // Extrair o path da URL
      const urlParts = url.split('/car-images/')
      if (urlParts.length > 1) {
        const path = urlParts[1]
        const { error } = await supabase.storage
          .from('car-images')
          .remove([path])
        if (error) console.error('Erro ao deletar:', error)
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
    }
  }
}
