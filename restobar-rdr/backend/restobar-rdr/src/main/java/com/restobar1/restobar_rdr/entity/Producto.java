package com.restobar1.restobar_rdr.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Long id;

    // @ManyToOne = Muchos productos pertenecen a UNA categoría
    // @JoinColumn indica qué columna en la tabla "producto" es la FK
    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @Column(name = "nombre_producto", nullable = false)
    private String nombreProducto;

    @Column(name = "precio_actual", nullable = false)
    private Double precioActual;

    private String descripcion;

    @Column(name = "fecha_desactivada")
    private LocalDateTime fechaDesactivada;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public Double getPrecioActual() {
        return precioActual;
    }

    public void setPrecioActual(Double precioActual) {
        this.precioActual = precioActual;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaDesactivada() {
        return fechaDesactivada;
    }

    public void setFechaDesactivada(LocalDateTime fechaDesactivada) {
        this.fechaDesactivada = fechaDesactivada;
    }

    // Getters y Setters
}
