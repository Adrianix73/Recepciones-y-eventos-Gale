## Trello
Más info en https://trello.com/b/SSyNjcTW/recepciones-y-eventos-gale-eirl

<img width="1853" height="870" alt="trello" src="https://github.com/user-attachments/assets/53d827e3-a39f-47bb-a8e8-f8a03346e257" />

# Sistema de Gestión de Ventas y Reportes

Sistema web para la gestión de Ventas de los productos que ofrece la empresa y para la gestión de Reportes de productos más vendidos,
cuál es el método de pago más usado, cuantos fueron las ganancias (al día, semana y mes), entre otros.

Desarrollo como proyecto final del curso de Java Web en SENATI

## Descripción del negocio

__Empresa:__ Recepciones y Eventos Gale E.I.R.L.

__Nombre comercial:__ El Rincón de Rango

__RUC:__ 20614373203

__Giro del negocio:__ Restobar - Establecimiento dedicado a la venta decomidas y bebidas, con atención en mesa mediante mozos
y eventos con música en vivo los fines de semana.

__Tamaño:__ Microempresa con más de 10 trabajadores (mozos, cajero, cocineros, administrador y contador externo).

__Contexto actual:__ El negocio opera de forma mayormente manual: los pedidos se anotan en papel o se comunican de voz a la cocina, 
el inventario se controla en un cuaderno, y calcular las ganancias diarias resulta complicado y toma bastante tiempo. 
Acepta múltiples métodos de pago (efectivo, tarjeta, Yape, Plin, transferencia), pero no cuenta con un sistema digital que
centralice las ventas ni genere reportes automáticos.

__Justificación del proyecto:__ El dueño reportó todos los problemas listados en la entrevista emitida para la obtención de datos: 
pedidos olvidados, platos equivocados, falta de control de insumos, dificultad para conocer las ventas del día, pérdida de dinero e insumos, 
demoras por mala comunicación y errores en cobros.
Esto evidencia una necesidad urgente de digitalizar al menos el proceso de ventas y generación de reportes para 
reducir pérdidas, errores y tiempos muertos.

## Indetificar el problema y solución

### Problema delimitado:

El Rincón de Rango no cuenta con ningún sistema digital para registrar sus ventas. Todo el proceso, desde la 
toma del pedido hasta el cobro, se realiza de forma manual (papel, voz, memoria), lo que genera:

- Errores frecuentes en pedidos (platos equivocados, pedidos olvidados).
- Imposibilidad de conocer las ventas reales al final del día, semana o mes (el dueño indica que "es complicado y toma bastante tiempo").
- Pérdida de dinero e insumos sin poder rastrear el origen.
- Errores en cobros y dificultad para cuadrar caja.

En resumen: __No existe trazabilidad ni control sobre el flujo de ventas,__ lo que impide tomar 
decisiones informadas y genera pérdidas económicas constantes.

### Solución tecnológica propuesta:

Desarrollar un __Sistema Web de Gestión de Ventas y Reportes__ que permita:

1. Registrar digitalmente cada venta (productos, cantidades, precios, método de pago, mozo responsable).
2. Generar reportes automáticos de ventas por día, semana y mes.
3. Gestionar el catálogo de productos (platos y bebidas) con precios y disponibilidad.
4. Controlar la caja diaria con resumen de ingresos por método de pago.

__Justificación tecnológica:__ Al ser un sistema web, es accesible desde cualquier dispositivo que ya posee 
el negocio (laptop, tablets, celulares) sin necesidad de instalar software adicional. El internet del local 
es estable ("muy bueno, casi nunca se cae"), lo que garantiza la viabilidad de una solución basada en la nube/web o también solo local.

## Requerimientos Funcionales (RF)

| Código | Descripción |
|---|---|
| __RF-01__ | El sistema debe registrar una nueva venta asociando los productos consumidos, las cantidades, el precio unitario, el mozo responsable y el método de pago utilizado. |
| __RF-02__ | El sistema debe generar reportes de ventas filtrados por día, semana y mes, mostrando totales de ingresos, cantidad de ventas y desglose por método de pago. |
| __RF-03__ | El sistema debe gestionar el catálogo de productos (crear, editar, desactivar, reactivar y listar platos y bebidas) con su nombre, precio, categoría y estado de disponibilidad. |
| __RF-04__ | El sistema debe controlar la apertura y cierre de caja diaria, calculando automáticamente el total de ingresos y el desglose por cada método de pago (efectivo, tarjeta, Yape, Plin, transferencia). |
| __RF-05__ | El sistema debe autenticar a los usuarios mediante credenciales (usuario y contraseña hasheada) y restringir el acceso según su rol (administrador, cajero, mozo), permitiendo que solo el administrador acceda a los reportes de ventas y configuración del sistema. |

## Requerimientos No Funcionales (RNF)

| Código | Tipo | Descripción |
|---|---|---|
| __RNF-01__ | __Usabilidad__ | La interfaz del sistema debe ser intuitiva y sencilla, permitiendo que un mozo sin experiencia técnica pueda registrar una venta en menos de 1 minuto y sin capacitación extensa. |
| __RNF-02__ | __Rendimiento__ | El sistema debe cargar cualquier página y procesar el registro de una venta en un tiempo máximo de 3 segundos, incluso en horas punta con múltiples usuarios concurrentes (más de 10 trabajadores). |
| __RNF-03__ | __Seguridad__ | El sistema debe almacenar las contraseñas hasheadas con BCrypt; cada usuario accede a las funciones de su rol. |
| __RNF-04__ | __Compatibilidad__ | El sistema debe ser responsive y funcionar correctamente en los navegadores web de los dispositivos disponibles en el local (laptop, tablet y celulares), sin requerir instalación de software adicional. |

## Stack completo
1. Trello = Gestión del proyecto (Kanban)
2. Draw.io = Diagrama DER y MR
3. Figma = Wireframe + Diseño UI/UX
4. MySQL Workbench = Diseñar y administrar BD
5. Intellij IDEA = Backend (Sping Boot)
6. VS Code = Frontend (HTML/CSS/JS)
7. XAMPP = Servidor Tomcat para correr la app
8. Postman = Para pruebas de API REST

## Tecnologias Utilizadas
- Java 21
- Spring Boot 3
- MySQL 8
- HTML5, CSS3, JavaScript
- Intellij IDEA
- XAMPP (Tomcat)
- MySQL Workbench
- Figma (diseño UI/UX)
- Draw.io (Diagramas)

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

## Base de datos
El sistema cuenta con 5 tablas principales:

| Tabla | Descripción |
|---|---|
|Categoria | Grupo de productos que comparten características similares |
| Producto | Plato, bebida, o servicio que se ofrece |
| Usuario | Empleado con rol de funciones específicas (Mozo, Cajero y Administrador) |
| Venta | Proceso de transferir el producto a cambio de un precio establecido |
| Detalle_Venta | Descripciones y detalles relevantes de una venta |

## Diagrama Entidad-Relación (DER)

<img width="1220" height="664" alt="DER rango" src="https://github.com/user-attachments/assets/3a95bfdd-b448-44ef-821f-317fbefbd790" />

## Modelo Relacional (MR)

<img width="1087" height="722" alt="MR rango" src="https://github.com/user-attachments/assets/9588206f-cf8c-4688-b1f6-e46c312dfa37" />

### Cardinalidades
Categoría - Producto (1:N)

Una categoría puede tener muchos productos, pero un producto solo puede estar en una sola categoría.

Usuario - Venta (1:N)

Un usuario puede registrar muchas ventas, pero una venta solo puede haber sido registrada por un solo usuario.

Venta - Detalle_Venta (1:N)

Una venta puede tener muchos detalles (Detalle_Venta), pero un detalle (Detalle_Venta) solo puede estar en una sola venta.

Producto - Detalle_Venta (1:N)

Un producto puede estar muchos detalles (Detalle_Venta), pero un detalle (Detalle_Venta) solo puede tener en un solo producto.

| Entidad A | Relacion | Entidad B | Cardinalidad |
|---|---|---|---|
| Categoria | tiene | Producto | 1:N |
| Usuario | registra | Venta | 1:N |
| Venta | tiene | Detalle_Venta | 1:N |
| Producto | tiene | Detalle_Venta | 1:N |

### Base de datos
El sistema cuenta con 5 tablas principales:

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
('Juan', 'Perez', 'Mozo', '$2a$12$XdJzPwj4SyUu0OLHiRfVueba/PLe914j.1.0nOAyOz5mJSojpNtI'),
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
```

### Decisiones de Diseño
- **Borrado lógico:** Los productos y usuarios no se eliminan. Se utilizan ```fecha_desactivacion``` (productos) y ```fecha_baja``` (usuarios) para desactivarlos, preservando la integridad histórica de ventas y reportes.
- **Precio histórico:** El campo ```precio_unitario``` en detalle_venta almacena el precio al momento de la venta, independientemente de cambios futuros en ```precio_actual``` del producto.
- **Seguridad:** Las contraseñas se almacenan hasheadas con BCrypt (hash irreversible con salt automático), nunca entexto plano

## Como correr el proyecto
### Requisitos previos
- Tener instalado Intellij IDEA
- Tener instalado XAMPP (para MySQL)
- Tener instalado MySQL Workbench
- Tener instalado JDK 21 o superior

### Backend
1. Abrir la carpeta ```backend/``` en Intellij IDEA
2. Configurar ```application.properties``` con los datos de MySQL
3. Iniciar XAMPP y activar MySQL
4. Ejecutar ```restobar-rdrApplication.java```
5. El backend corre en: ```http://localhost:8080```

### Frontend
1. Abrir la carpeta ```frontend/``` en VS Code
2. Abrir ```index.html``` con Live Server
3. El frontend se comunica con el backend via fetch()

>El frontend y el backend corren por separado. El backend debe estar iniciado antes de abrir el frontend

### Configuracion de la base de datos

```
spring.application.name=retobar-rdr
# CONEXION A MYSQL
spring.datasource.url=jdbc:mysql://localhost:3306/restobar_db
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

#JPA / HIBERNATE
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Puerto del servidor
server.port=8080
```

## DIAGRAMA DE FIGMA
https://www.figma.com/design/VaGY5zk4hwqLfsuftBrOuK/Untitled?node-id=0-1&t=f5fw57nCb4pSx9Py-1







