CREATE DATABASE restobar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci; 
USE restobar_db;

CREATE TABLE categoria (
id_categoria INT PRIMARY KEY AUTO_INCREMENT,
nombre_categoria VARCHAR(50) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE producto (
id_producto INT PRIMARY KEY AUTO_INCREMENT,
id_categoria INT NOT NULL,
nombre_producto VARCHAR(100) NOT NULL,
precio_actual DECIMAL(10,2) NOT NULL,
descripcion TEXT,
imagen_url VARCHAR(255) DEFAULT NULL,
fecha_desactivacion DATETIME DEFAULT NULL,
CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
CONSTRAINT uq_nombre_producto UNIQUE (nombre_producto)
) ENGINE = InnoDB;

CREATE TABLE usuario (
id_usuario INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(60),
apellido VARCHAR(40),
rol VARCHAR(20) NOT NULL,
clave VARCHAR(255) NOT NULL, -- Se aplicará Hash BCrypt
ultimo_login DATETIME NULL,
fecha_baja DATETIME DEFAULT NULL
) ENGINE = InnoDB;

CREATE TABLE venta (
id_venta INT PRIMARY KEY AUTO_INCREMENT,
id_usuario INT NOT NULL,
fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
total_venta DECIMAL(10,2) DEFAULT 0.00,
metodo_pago VARCHAR(30),
estado VARCHAR(20) DEFAULT 'pendiente',
CONSTRAINT fk_venta_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE = InnoDB;

CREATE TABLE detalle_venta (
id_detalle_venta INT PRIMARY KEY AUTO_INCREMENT,
id_venta INT NOT NULL,
id_producto INT NOT NULL,
cantidad INT NOT NULL,
precio_unitario DECIMAL(10,2) NOT NULL,
subtotal DECIMAL(10,2) NOT NULL,
notas_especificas VARCHAR(255) NULL,
CONSTRAINT fk_detalle_venta FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
CONSTRAINT chk_cantidad_positiva CHECK (cantidad > 0)
) ENGINE = InnoDB;

-- INSERCIÓN DATOS REPRENSETATIVOS

-- CATEGORÍA
INSERT INTO categoria (nombre_categoria) VALUES 
('Sopas'),
('Entradas'), 
('Platos de Fondo'), 
('Bebidas');

-- PRODUCTO
INSERT INTO producto (id_categoria, nombre_producto, precio_actual, descripcion) VALUES 
(1, 'Caldo de gallina', 9.00, 'Gallina, huevo, apio, papa'),
(2, 'Rocoto relleno', 20.00, 'Rocoto, carne, cebolla'),
(3, 'Ceviche Mixto', 45.00, 'Pescado, mariscos, limón y ají'),
(3, 'Juane especial', 50.00, 'Pollo, maduro, huevo, aceituna, arroz'),
(3, 'Parrillada Rango', 80.00, 'Carne de res, pollo, chuleta y guarniciones'),
(4, 'Jarra de Chicha', 15.00, 'Chicha morada natural 1L'),
(4, "Coca Cola", 65.00, 'Sabor original');

-- USUARIO
INSERT INTO usuario (nombre, apellido, rol, clave) VALUES 
('Harry', 'Gale', 'Admin', '$2a$12$eLwOU4MpOG6xYUFQnB0xquxn57T4ndezbL9eeJnlKcm1nt6d7ZiX6'),
('Andrea', 'Vega', 'Cajero', '$2a$12$6/eZfqIvYnYhiiNPUhXOfu9z0pdgKDHlkK9RGmPLl4S1K5zHhC/im'),
('Juan', 'Perez', 'Mozo', '$2a$12$XdJzPwj4SyUu0OLHiRfVueba/PLe914j.1.0nOAyOz5mJSojpNtI.'),
('Carlos', 'Villa', 'Mozo', '$2a$12$Btpl36.l5t5AFrkB7hYWG.PU7i5pMR.iYQzSvSVaSgkU.q5Y4jjLC');

-- VENTA
INSERT INTO venta (id_usuario, total_venta, metodo_pago, estado) VALUES 
(3, 345.00, 'Yape', 'pagado'),
(3, 60.00, '-', 'pendiente'),
(4, 135.00, 'Efectivo', 'pagado'),
(4, 65.00, 'Tarjeta', 'pagado');

-- DETALLE VENTA
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES 
# Venta 1
(1, 1, 5, 9.00, 45.00),
(1, 4, 2, 50.00, 100.00),
(1, 3, 2, 45.00, 90.00),
(1, 5, 1, 80.00, 80.00),
(1, 6, 2, 15.00, 30.00),

# Venta 2
(2, 3, 1, 45.00, 45.00),
(2, 6, 1, 15.00, 15.00),

# Venta 3
(3, 5, 2, 80.00, 160.00),
(3, 6, 1, 15.00, 15.00),

# Venta 4
(4, 7, 1, 65.00, 65.00 );

-- CONSULTAS DE LOS DATOS REPRESENTATIVOS

SELECT * FROM categoria;
SELECT * FROM producto;
SELECT * FROM usuario;
SELECT * FROM venta;
SELECT * FROM detalle_venta;

# 1. Reporte detallado de una venta específica
SELECT v.id_venta, v.fecha_hora, p.nombre_producto, dv.precio_unitario, dv.cantidad, dv.subtotal
FROM venta v
INNER JOIN detalle_venta dv ON v.id_venta = dv.id_venta
INNER JOIN producto p ON dv.id_producto = p.id_producto
WHERE v.id_venta = 1
ORDER BY p.nombre_producto ASC;

# 2. Reporte de ventas totales por método de pago
SELECT metodo_pago, COUNT(*) AS num_ventas, SUM(total_venta) AS total_recaudado
FROM venta
WHERE estado = 'pagado'
GROUP BY metodo_pago
ORDER BY total_recaudado DESC;

# 3. Ranking de productos más vendidos
SELECT p.nombre_producto, SUM(dv.cantidad) AS total_unidades
FROM detalle_venta dv
INNER JOIN producto p ON dv.id_producto = p.id_producto
GROUP BY p.nombre_producto
ORDER BY total_unidades DESC;

# 4. Ranking de bebidas más vendidas
SELECT p.nombre_producto, SUM(dv.cantidad) AS total_unidades
FROM detalle_venta dv
INNER JOIN producto p ON dv.id_producto = p.id_producto
WHERE p.id_categoria = 4
GROUP BY p.nombre_producto
ORDER BY total_unidades DESC;
