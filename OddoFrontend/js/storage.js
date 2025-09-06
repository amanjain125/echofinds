const initialProducts = [
    { id: 1, title: 'Wireless Bluetooth Headphones', category: 'Electronics', price: '89.99', image: '../images/earphone.jpg', rating: 4.5 },
    { id: 2, title: 'Vintage Leather Jacket', category: 'Fashion', price: '159.99', image: '../images/jacket.jpeg', rating: 4.8 },
    { id: 3, title: 'Smart Home Security Camera', category: 'Home', price: '49.99', image: '../images/homesec.jpg', rating: 4.2 },
    { id: 4, title: 'Mountain Bike', category: 'Sports', price: '299.00', image: '../images/bike.jpeg', rating: 4.6 },
    { id: 5, title: 'Best Seller Novel', category: 'Books', price: '12.50', image: '../images/novel.jpeg', rating: 4.9 },
    { id: 6, title: 'Vintage Desk Lamp', category: 'Home', price: '35.00', image: '../images/lamp.jpeg', rating: 4.0 }
];

function getProducts() {
    const products = localStorage.getItem('products');
    if (!products) {
        localStorage.setItem('products', JSON.stringify(initialProducts));
        return initialProducts;
    }
    return JSON.parse(products);
}

function addProduct(product) {
    const products = getProducts();
    products.unshift(product); // Add new product to the beginning
    localStorage.setItem('products', JSON.stringify(products));
}