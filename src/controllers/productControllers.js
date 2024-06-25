import { promises as fs } from "fs";

class ProductControllers {
    constructor(path) {
        this.path = path;
    }

    async addProduct({ title, description, price, img, code }) {
        try {
            const arrayProducts = await this.readFile();

            if (!title || !description || !price || !code) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            if (arrayProducts.some(item => item.code === code)) {
                console.log("El código debe ser único");
                return;
            }

            const newId = await this.generateUniqueId(arrayProducts);

            const newProduct = {
                title,
                description,
                price,
                img: img || [],
                code,
                id: newId
            };

            arrayProducts.push(newProduct);
            await this.saveFile(arrayProducts);
            console.log("Producto añadido correctamente:", newProduct);
            return newProduct;
        } catch (error) {
            console.log("Error al agregar el producto", error);
            throw error;
        }
    }

    async generateUniqueId(arrayProducts) {
        let maxId = 0;
        arrayProducts.forEach(product => {
            if (product.id > maxId) {
                maxId = product.id;
            }
        });

        return maxId + 1;
    }

    async getProducts() {
        try {
            const arrayProducts = await this.readFile();
            return arrayProducts;
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async getProductsById(id) {
        try {
            const arrayProducts = await this.readFile();
            const product = arrayProducts.find(item => item.id === id);

            if (!product) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return product;
            }
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProducts[index] = { ...arrayProducts[index], ...productoActualizado };
                await this.saveFile(arrayProducts);
                console.log("Producto actualizado correctamente");
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProducts.splice(index, 1);
                await this.saveFile(arrayProducts);
                console.log("Producto eliminado correctamente");
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }

    async readFile() {
        try {
            const answer = await fs.readFile(this.path, "utf-8");
            const arrayProducts = JSON.parse(answer);
            return arrayProducts;
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async saveFile(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
            throw error;
        }
    }
}

export default ProductControllers;
