-- =============================================================================
-- DATABASE SCHEMA DDL: KCN LAND - SÀN GIAO DỊCH NHÀ XƯỞNG & BĐS CÔNG NGHIỆP
-- Compatible with PostgreSQL 14+ and MySQL 8.0+
-- =============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(191) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(30) DEFAULT 'user', -- 'admin', 'editor', 'user', 'investor'
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    code VARCHAR(50) PRIMARY KEY, -- 'SALE', 'RENT', 'KCN_PROJECT', 'STANDARD_FACTORY', 'COLD_LOGISTICS'
    name VARCHAR(150) NOT NULL,
    icon VARCHAR(100) DEFAULT 'Warehouse',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PROVINCES & INDUSTRIAL PARKS (LOCATIONS)
CREATE TABLE IF NOT EXISTS provinces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS industrial_parks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL, -- e.g. 'KCN VSIP 1', 'KCN Long Đức'
    province_id INT REFERENCES provinces(id) ON DELETE SET NULL,
    total_area_ha DECIMAL(10, 2),
    occupancy_rate DECIMAL(5, 2)
);

-- 4. PROPERTIES TABLE (NHÀ XƯỞNG & ĐẤT CÔNG NGHIỆP)
CREATE TABLE IF NOT EXISTS properties (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_code VARCHAR(50) REFERENCES categories(code) ON UPDATE CASCADE,
    province VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    kcn VARCHAR(150) NOT NULL,
    
    -- Pricing (VND)
    price BIGINT NOT NULL, -- Supports 50,000,000 -> 150,000,000,000+
    price_display VARCHAR(100),
    
    -- Technical Specs
    area VARCHAR(50) NOT NULL, -- e.g. '12.000 m2'
    power VARCHAR(50) DEFAULT '1.000 kVA',
    pccc VARCHAR(100) DEFAULT 'Tự Động (Sprinkler)',
    ceiling_height_m DECIMAL(4, 2), -- e.g. 11.5m
    floor_loading_ton_m2 DECIMAL(4, 2), -- e.g. 5.0 ton/m2
    
    -- Media (Images, Video Drone, Audio Voiceover .mp3)
    thumbnail_url TEXT NOT NULL,
    video_url TEXT, -- Flycam Drone video (.mp4)
    audio_url TEXT, -- Voiceover description audio (.mp3)
    audio_duration VARCHAR(20) DEFAULT '01:30',
    model_3d_enabled BOOLEAN DEFAULT TRUE,
    
    -- Content
    description TEXT,
    status VARCHAR(30) DEFAULT 'published', -- 'draft', 'published', 'archived'
    
    -- Automation Triggers Status
    email_notified BOOLEAN DEFAULT FALSE,
    
    created_by VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PROPERTY GALLERY IMAGES
CREATE TABLE IF NOT EXISTS property_gallery (
    id SERIAL PRIMARY KEY,
    property_id VARCHAR(36) REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INT DEFAULT 0
);

-- 6. SAVED PROPERTIES (WISHLIST)
CREATE TABLE IF NOT EXISTS saved_properties (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    property_id VARCHAR(36) REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- 7. SUBSCRIBERS TABLE (NEWSLETTER SUBSCRIBERS)
CREATE TABLE IF NOT EXISTS subscribers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(191),
    phone VARCHAR(30),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. HOMEPAGE NOTICES & TICKER BAR
CREATE TABLE IF NOT EXISTS homepage_notices (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    badge VARCHAR(50) DEFAULT 'Quy Hoạch KCN',
    link_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_settings (
    key_name VARCHAR(100) PRIMARY KEY,
    value_text TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. BROADCAST & WEBHOOK LOGS
CREATE TABLE IF NOT EXISTS broadcast_logs (
    id SERIAL PRIMARY KEY,
    property_id VARCHAR(36) REFERENCES properties(id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL, -- 'email', 'hotline'
    total_recipients INT DEFAULT 0,
    success_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    response_payload TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INDEXES FOR HIGH-SPEED FILTERING & SEARCHING
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_province ON properties(province);
CREATE INDEX IF NOT EXISTS idx_properties_kcn ON properties(kcn);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category_code);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);
