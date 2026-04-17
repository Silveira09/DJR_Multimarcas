-- ============================================
-- DJR Multimarcas - Schema do Banco de Dados
-- Copie e cole este código no SQL Editor do Supabase
-- ============================================

-- Tabela de carros
-- Campos opcionais podem ser NULL (não aparecem para o cliente se vazios)
CREATE TABLE IF NOT EXISTS cars (
  id BIGSERIAL PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR(50), -- Opcional
  mileage INTEGER, -- Opcional
  price DECIMAL(12,2) NOT NULL,
  plate VARCHAR(20), -- Opcional (só admin vê)
  transmission VARCHAR(20), -- Opcional
  description TEXT, -- Opcional
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  store_name VARCHAR(200) DEFAULT 'DJR Multimarcas',
  contact_phone VARCHAR(20),
  whatsapp_message TEXT DEFAULT 'Olá! Vi o veículo {carro} no valor de {preco} e gostaria de mais informações.',
  warranty_months INTEGER DEFAULT 3,
  logo_text VARCHAR(50) DEFAULT 'DJR',
  logo_subtext VARCHAR(50) DEFAULT 'Multimarcas',
  primary_color VARCHAR(20) DEFAULT '#000000',
  secondary_color VARCHAR(20) DEFAULT '#FFFFFF',
  accent_color VARCHAR(20) DEFAULT '#F97316',
  social_instagram VARCHAR(100),
  social_facebook VARCHAR(200),
  social_whatsapp VARCHAR(20),
  address TEXT,
  email VARCHAR(100),
  -- Localização
  google_maps_embed TEXT,
  gps_link TEXT,
  -- Segurança
  admin_password VARCHAR(255) DEFAULT 'djr2024admin',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT settings_single_row CHECK (id = 1)
);

-- Inserir configurações padrão
INSERT INTO settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Habilitar Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para carros
DROP POLICY IF EXISTS "Allow public read access to cars" ON cars;
DROP POLICY IF EXISTS "Allow public insert to cars" ON cars;
DROP POLICY IF EXISTS "Allow public update to cars" ON cars;
DROP POLICY IF EXISTS "Allow public delete to cars" ON cars;

CREATE POLICY "Allow public read access to cars" ON cars
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert to cars" ON cars
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to cars" ON cars
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete to cars" ON cars
  FOR DELETE USING (true);

-- Políticas de acesso para configurações
DROP POLICY IF EXISTS "Allow public read access to settings" ON settings;
DROP POLICY IF EXISTS "Allow public update to settings" ON settings;
DROP POLICY IF EXISTS "Allow public insert to settings" ON settings;

CREATE POLICY "Allow public read access to settings" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Allow public update to settings" ON settings
  FOR UPDATE USING (true);

CREATE POLICY "Allow public insert to settings" ON settings
  FOR INSERT WITH CHECK (true);

-- ============================================
-- Bucket de Storage para Imagens
-- Crie manualmente no Supabase Storage:
-- 1. Vá em Storage
-- 2. Clique em "New bucket"
-- 3. Nome: car-images
-- 4. Marque como "Public bucket"
-- 5. Clique em "Create bucket"
-- ============================================

-- Dados de exemplo (opcional)
-- Campos opcionais podem ser NULL ou vazios
INSERT INTO cars (brand, model, year, color, mileage, price, plate, transmission, description, images, featured, available) VALUES
('Honda', 'Civic', 2022, 'Prata', 25000, 125000.00, 'ABC1234', 'Automático', 'Veículo em perfeito estado, único dono, todas as revisões na concessionária. Ar condicionado, direção hidráulica, vidros elétricos, travas elétricas, alarme, sensor de estacionamento, câmera de ré, bancos em couro, teto solar.', '{}', true, true),
('Toyota', 'Corolla', 2021, 'Branco', 35000, 118000.00, 'DEF5678', 'CVT', 'Carro impecável, revisões em dia, IPVA 2024 pago. Completo com ar condicionado digital, central multimídia, sensores de estacionamento dianteiro e traseiro.', '{}', true, true),
('Volkswagen', 'T-Cross', 2023, 'Cinza', 12000, 135000.00, 'GHI9012', 'Automático', 'SUV compacto mais vendido do Brasil. Veículo zero km, ainda na garantia de fábrica. Pacote tecnológico completo.', '{}', true, true),
('Chevrolet', 'Onix', 2020, NULL, 48000, 75000.00, 'JKL3456', 'Manual', 'Carro econômico e bem conservado. Ideal para primeiro carro ou trabalho com aplicativos.', '{}', false, true),
('Hyundai', 'HB20', 2021, 'Vermelho', NULL, 82000.00, NULL, NULL, 'Veículo bonito e econômico. Revisões em dia.', '{}', false, true),
('Ford', 'Ka', 2019, NULL, NULL, 58000.00, NULL, 'Manual', NULL, '{}', false, false);
('Chevrolet', 'Onix', 2020, 'Azul', 48000, 75000.00, 'JKL3456', 'Manual', 'Carro econômico e confiável. Ideal para primeiro carro ou uso urbano. Ar condicionado, direção elétrica, vidros e travas elétricas.', '{}', false, true),
('Hyundai', 'HB20', 2021, 'Vermelho', 32000, 82000.00, 'MNO7890', 'Automático', 'Veículo bem conservado, revisões documentadas. Completo com ar condicionado, direção elétrica, central multimídia com Android Auto e Apple CarPlay.', '{}', false, true),
('Ford', 'Ka', 2019, 'Branco', 55000, 62000.00, 'PQR1234', 'Manual', 'Carro compacto e econômico. Perfeito para cidade. Ar condicionado, direção elétrica, vidros elétricos.', '{}', false, false);

-- ============================================
-- FIM DO SCRIPT
-- ============================================
