document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');
    const productCountElement = document.querySelector('.product-count');
    const pageCategory = document.body.dataset.category;

    let allProducts = getProducts();
    let productsToDisplay = allProducts;

    // If we are on a category page, filter the products
    if (pageCategory) {
        productsToDisplay = allProducts.filter(p => p.category === pageCategory);
    }
    
    displayProducts(productsToDisplay);

    function displayProducts(products) {
        productGrid.innerHTML = ''; // Clear existing products
        if (products.length === 0) {
            productGrid.innerHTML = '<p>No products found in this category.</p>';
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <span class="product-badge">${product.category}</span>
                <img src="${product.image}" alt="${product.title}" class="product-card-image">
                <div class="product-card-content">
                    <h3 class="product-card-title">${product.title}</h3>
                    <div class="rating">
                        <i class="fas fa-star"></i> ${product.rating}
                    </div>
                    <div class="product-card-footer">
                        <span class="product-card-price">$${product.price}</span>
                        <button class="btn add-to-cart-btn" data-product-id="${product.id}"><i class="fas fa-shopping-cart"></i></button>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });

        // Update product count
        productCountElement.textContent = `${products.length} products found`;
    }
});