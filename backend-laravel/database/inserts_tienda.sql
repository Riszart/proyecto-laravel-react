-- Datos de prueba para la base de datos tienda_api (MySQL / XAMPP)
-- 5 categorias nuevas + 20 productos nuevos

USE tienda_api;

-- ------------------------------------------------------------
-- 5 categorias nuevas (ids 3 al 7)
-- ------------------------------------------------------------
INSERT INTO categorias (id, nombre, created_at, updated_at) VALUES
    (3, 'Monitores',        NOW(), NOW()),
    (4, 'Almacenamiento',   NOW(), NOW()),
    (5, 'Audio',            NOW(), NOW()),
    (6, 'Redes',            NOW(), NOW()),
    (7, 'Impresoras',       NOW(), NOW());

-- ------------------------------------------------------------
-- 20 productos nuevos
-- ------------------------------------------------------------
INSERT INTO productos (nombre, precio, stock, categoria_id, created_at, updated_at) VALUES
    -- Monitores (id 3)
    ('Monitor LED 24" Full HD',        520.00, 12, 3, NOW(), NOW()),
    ('Monitor Gamer 27" 165Hz',        980.00,  7, 3, NOW(), NOW()),
    ('Monitor Curvo 32" QHD',         1450.00,  4, 3, NOW(), NOW()),
    ('Monitor Portatil 15.6" USB-C',    690.00,  9, 3, NOW(), NOW()),

    -- Almacenamiento (id 4)
    ('SSD NVMe 1TB',                   340.00, 25, 4, NOW(), NOW()),
    ('SSD SATA 480GB',                 160.00, 30, 4, NOW(), NOW()),
    ('Disco Duro Externo 2TB',         290.00, 18, 4, NOW(), NOW()),
    ('Memoria USB 128GB',               45.00, 60, 4, NOW(), NOW()),
    ('MicroSD 256GB Clase 10',          75.00, 40, 4, NOW(), NOW()),

    -- Audio (id 5)
    ('Audifonos Bluetooth ANC',        240.00, 20, 5, NOW(), NOW()),
    ('Parlante Portatil 20W',          185.00, 15, 5, NOW(), NOW()),
    ('Microfono Condensador USB',      310.00, 10, 5, NOW(), NOW()),

    -- Redes (id 6)
    ('Router WiFi 6 AX1800',           420.00, 14, 6, NOW(), NOW()),
    ('Switch 8 Puertos Gigabit',       210.00, 16, 6, NOW(), NOW()),
    ('Repetidor WiFi Malla',           150.00, 22, 6, NOW(), NOW()),
    ('Adaptador USB WiFi AC1200',       60.00, 35, 6, NOW(), NOW()),

    -- Impresoras (id 7)
    ('Impresora Multifuncional WiFi',  560.00,  8, 7, NOW(), NOW()),
    ('Impresora Laser Monocromo',      780.00,  6, 7, NOW(), NOW()),
    ('Cartucho de Tinta Negro',         85.00, 50, 7, NOW(), NOW()),
    ('Papel Fotografico A4 x50',        38.00, 45, 7, NOW(), NOW());
