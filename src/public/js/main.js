const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
});

const renderProducts = (data) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div");
        card.innerHTML = `<p> ${item.title} </p>
                            <p> ${item.id} </p>
                            <p> ${item.price} </p>
                            <button data-id="${item.id}"> Eliminar </button>`;

        contenedorProductos.appendChild(card);

        card.querySelector("button").addEventListener("click", (event) => {
            const id = event.target.getAttribute("data-id");
            eliminarProducto(id);
        });
    });
};

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
};

document.getElementById("btnSend").addEventListener("click", () => {
    agregarProducto();
});

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        id: document.getElementById("id").value,
        status: document.getElementById("status").value === "true",
    };
    socket.emit("agregarProducto", producto);
};
socket.on("productoAgregado", (producto) => {
    console.log("Producto agregado:", producto);
});