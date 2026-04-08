# Sistema de Gestión de Ventas y Reportes — Rincón de Rango
Sistema web para la gestión de ventas y generación de reportes del restobar "El Rincón de Rango". Desarrollado como proyecto del curso de Java Web en SENATI — 3er ciclo de Ingeniería de Software.

## Descripción del negocio
**Razón Social:** Recepciones y Eventos Gale EIRL

**RUC:** 20614373203

**Nombre Comercial:** El Rincón de Rango

**Giro:** Restobar con servicio de comidas, bebidas y eventos con música en vivo los fines de semana

**Tamaño:** MYPE (micro y pequeña empresa) con más de 10 trabajadores

**Contexto:** El restobar opera de forma manual: los mozos anotan pedidos en papel, la comunicación con cocina es verbal o mediante papelitos, y el control de ventas e ingresos se lleva en cuadernos. Esto genera errores frecuentes, pérdida de información y dificultad para conocer las ganancias reales del negocio.

**Justificación:** Se requiere un sistema digital que reemplace los registros manuales de ventas, permitiendo al administrador conocer con exactitud cuánto se vendió, qué productos son los más demandados y cuál es el ingreso real del negocio por día, semana o mes.

## Problema identificado y solución
**Problema:** El restobar no cuenta con un registro digital de ventas. Todo se anota en papel o libreta, lo que provoca: pedidos olvidados, platos equivocados, dificultad para saber cuánto se vendió al final del día, pérdida de dinero sin trazabilidad y errores al cobrar. El dueño manifiesta que calcular sus ganancias "es complicado y le toma bastante tiempo".

**Solución tecnológica:** Desarrollar un sistema web con Java Spring Boot y MariaDB que permita registrar ventas digitalmente, asociando productos consumidos, cantidades, precios, usuario responsable y método de pago. El sistema generará reportes de ventas por período, productos más vendidos y control de caja diario. Se justifica una solución web porque el local ya cuenta con computadora, tablet, celulares e impresora, además de internet estable.

## Requerimientos Funcionales
| Código | Descripción |
|---|---|
| RF-01 | El sistema debe **registrar** una nueva venta asociando los productos consumidos, las cantidades, el precio unitario, el usuario responsable del registro y el método de pago utilizado |
| RF-02 | El sistema debe **generar** reportes de ventas filtrados por rango de fechas, mostrando totales, cantidad de transacciones y desglose por método de pago |
| RF-03 | El sistema debe **gestionar** el catálogo de productos permitiendo crear, editar, desactivar y reactivar platos con su categoría y precio |
| RF-04 | El sistema debe **controlar** el arqueo de caja diario, calculando automáticamente el total de ingresos por cada método de pago |
| RF-05 | El sistema debe **autenticar** a los usuarios mediante nombre y contraseña hasheada con BCrypt, asignando permisos según su rol (Admin, Mozo, Cajero) |

## Requerimientos No Funcionales
| Código | Tipo | Descripción |
|---|---|---|
| RNF-01 | Usabilidad | La interfaz debe ser intuitiva y permitir al mozo registrar una venta en menos de 1 minuto sin capacitación previa |
| RNF-02 | Rendimiento | El sistema debe cargar y procesar cualquier operación en menos de 3 segundos |
| RNF-03 | Seguridad | Las contraseñas se almacenan hasheadas con BCrypt; cada usuario accede únicamente a las funciones de su rol |
| RNF-04 | Compatibilidad | El sistema debe ser responsive y funcionar correctamente en computadora, tablet y celular (dispositivos disponibles en el local) |

## Stack completo
1. **Trello** — Gestión del proyecto (Kanban)
2. **Draw.io** — Diagrama Entidad-Relación + Modelo Relacional
3. **Figma** — Wireframe + Diseño UI/UX
4. **MySQL Workbench** — Diseñar y administrar la base de datos
5. **IntelliJ IDEA** — Frontend (HTML, CSS, JS) + Backend (Spring Boot)
6. **XAMPP** — Servidor MariaDB + Tomcat
7. **Postman** — Pruebas de API REST
8. **Git + GitHub** — Control de versiones

## Tecnologías utilizadas
- Java 21
- Spring Boot 3
- MySQL 8
- HTML5, CSS3, JavaScript
- IntelliJ IDEA
- XAMPP (Tomcat)
- MySQL Workbench
- Figma (diseño UI/UX)
- Draw.io (diagramas)

---

## Estructura del proyecto

```
JavaWeb-GotaGota/
├── backend/          → Spring Boot (Java)
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/         → HTML, CSS, JS
│   ├── css/
│   ├── js/
│   └── index.html
```

---

## Base de datos

El sistema cuenta con 5 tablas principales:

| Tabla | Descripción |
|---|---|
| CATEGORIA | Clasificación de los productos del menú (Entradas, Platos de Fondo, Bebidas, etc.) |
| PRODUCTO | Platos y bebidas disponibles en el restobar con su precio y estado |
| USUARIO | Personal del restobar con roles diferenciados (Admin, Mozo, Cajero) |
| VENTA | Registro de cada transacción de venta realizada |
| DETALLE_VENTA | Desglose de productos vendidos por cada venta con precio histórico |

### Diagrama Entidad-Relación (DER)
<img width="1220" height="664" alt="DER rango" src="https://github.com/user-attachments/assets/3f20dc0c-cfd9-4e10-9df0-a27a217b97cc" />

### Modelo Relacional (MR)
<img width="1087" height="722" alt="MR rango" src="https://github.com/user-attachments/assets/9b7cbb63-3996-4afd-8409-2fe43480d4f0" />


### Cardinalidades
**CATEGORIA — PRODUCTO (1:N)** <br>
Una categoría agrupa muchos productos, pero un producto pertenece a una sola categoría. <br>
**USUARIO — VENTA (1:N)** <br>
Un usuario puede registrar muchas ventas, pero una venta es registrada por un solo usuario. <br>
**VENTA — DETALLE_VENTA (1:N)** <br>
Una venta contiene muchos detalles (productos), pero cada detalle pertenece a una sola venta. <br>
**PRODUCTO — DETALLE_VENTA (1:N)** <br>
Un producto puede aparecer en muchos detalles de venta, pero cada detalle referencia a un solo producto.

| Entidad A | Relación | Entidad B | Cardinalidad |
|---|---|---|---|
| CATEGORIA | agrupa | PRODUCTO | 1:N |
| USUARIO | registra | VENTA | 1:N |
| VENTA | contiene | DETALLE_VENTA | 1:N |
| PRODUCTO | aparece en | DETALLE_VENTA | 1:N |

### DDL (Creación de tablas)
El sistema cuanta con 5 tablas principales:

```sql
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
    fecha_desactivacion DATETIME NULL,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    CONSTRAINT uq_nombre_producto UNIQUE (nombre_producto)
) ENGINE = InnoDB;

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(60),
    apellido VARCHAR(40),
    rol VARCHAR(20) NOT NULL,
    clave VARCHAR(255) NOT NULL,
    ultimo_login DATETIME NULL,
    fecha_baja DATETIME NULL
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
('Harry', 'Gale', 'Admin', '$2b$10$hash_ejemplo_seguro'),
('Andrea', 'Vega', 'Cajero', '$2b$10$hash_cajero_ejemplo'),
('Juan', 'Perez', 'Mozo', '$2b$10$hash_mozo_ejemplo'),
('Carlos', 'Villa', 'Mozo', '$2b$10$hash_mozo2_ejemplo');

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

```
## Cómo correr el proyecto
### Requisitos previos
- Tener instalado IntelliJ IDEA
- Tener instalado XAMPP (para MariaDB)
- Tener instalado MySQL Workbench
- Tener instalado JDK 21 o superior

### Backend
1. Abrir la carpeta ```backend/``` en IntelliJ IDEA
2. Configurar ```application.properties``` con los datos de MariaDB
3. Iniciar XAMPP y activar MySQL
4. Ejecutar ```RestobarApplication.java```
5. El backend corre en: ```http://localhost:8080```

### Frontend
1. Abrir la carpeta ```frontend/``` en VS Code o IntelliJ
2. Abrir ```index.html``` con Live Server
3. El frontend se comunica con el backend vía fetch()

> El frontend y el backend corren por separado. El backend debe estar iniciado antes de abrir el frontend.

### Configuración de base de datos

```
spring.application.name=restobar-rdr
# CONEXION A MARIADB
spring.datasource.url=jdbc:mysql://localhost:3306/restobar_db
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / HIBERNATE
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect

# Puerto del servidor
server.port=8080

# Desactivar autoconfiguración de Spring Security
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
```

## Diagrama en Figma
https://www.figma.com/design/VaGY5zk4hwqLfsuftBrOuK/WIREFRAME-empresa?node-id=0-1&t=ZyXuPgaqGjbarz02-1
