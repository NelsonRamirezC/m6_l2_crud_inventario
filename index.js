const express = require('express');
const fs = require('fs');
const {v4: uuid} = require('uuid');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get("/", (req, res) =>{
    res.status(200).sendFile(__dirname + "/inventario.html")
})

//CONSULTAR PRODUCTOS.
app.get("/productos", (req, res) => {
    fs.readFile("productos.json", "utf8", (err, data) => {
        if(err) return res.status(500).send({code: 500, message: "No se pudo leer la información de productos."})
        let productos = JSON.parse(data);
        res.json(productos);
    })
})

//buscar productos
app.get("/productos/:id", (req, res) => {
    let id = req.params.id;
    fs.readFile("productos.json", "utf8", (err, data) => {
        if(err) return res.status(500).send({code: 500, message: "No se pudo leer la información de productos."})
        let productos = JSON.parse(data);
        let productoBuscado = productos.productos.find(producto => producto.id == id);
        res.json(productoBuscado);
    })
})

//AGREGAR PRODUCTOS.
app.post("/productos", (req, res) => {
    let {nombre, descripcion, precio, stock, imagen} = req.body;
    let nuevoProducto = {
        id: uuid().slice(0,6),
        nombre, 
        descripcion,
        precio,
        stock,
        imagen
    };
    fs.readFile("productos.json", "utf8", (err, data) => {
        if(err) return res.status(500).send({code: 500, message: "No se pudo leer la información de productos."})
        let productos = JSON.parse(data);
        productos.productos.push(nuevoProducto);
        fs.writeFile("productos.json", JSON.stringify(productos, null, 4), "utf8", (err) => {
            if(err) return res.status(500).send({code: 500, message: "error al guardar el producto"});
             
            res.json(productos);
        })
    })
})

app.put("/productos", (req, res) => {
    let {id, nombre, descripcion, precio, stock, imagen} = req.body;
    res.send("actualizar productos.")

    fs.readFile("productos.json", "utf8", (err, data) => {
        if(err) return res.status(500).send({code: 500, message: "No se pudo leer la información de productos."})
        let productos = JSON.parse(data);
        let findProducto = productos.productos.find(producto => producto.id == id);
        findProducto.nombre = nombre;

        fs.writeFile("productos.json", JSON.stringify(productos, null, 4), "utf8", (err) => {
            if(err) return res.status(500).send({code: 500, message: "error al guardar el producto"});
             
            res.json(productos);
        })
    })
})

//ELIMINAR PRODUCTOS.
app.delete("/productos/:id", (req, res) => {
    let id = req.params.id;

    fs.readFile("productos.json", "utf8", (err, data) => {
        if(err) return res.status(500).send({code: 500, message: "No se pudo leer la información de productos."})
        let productos = JSON.parse(data);
        productos.productos = productos.productos.filter(producto => producto.id != id);
        fs.writeFile("productos.json", JSON.stringify(productos, null, 4), "utf8", (err) => {
            if(err) return res.status(500).send({code: 500, message: "error al guardar el producto"});
            res.json(productos);
        })
    })
})

app.all("*", (req, res) => {
    res.status(404).sendFile(__dirname + "/404.html")
})

app.listen(3000, () => console.log("http://localhost:3000"))