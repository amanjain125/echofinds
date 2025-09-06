// js/admin.js - CORRECTED AND SAFER VERSION

document.addEventListener('DOMContentLoaded', () => {
    // Find the container where products will be displayed
    const productContainer = document.getElementById('productListContainer');

    // --- SAFETY CHECK ---
    // If the container element doesn't exist in the HTML, stop the script.
    if (!productContainer) {
        console.error("Error: Could not find the element with ID 'productListContainer'. Please check your admin.html file.");
        return; // Exit the function to prevent errors
    }

    // Load products from localStorage or create an empty array if none exist
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // --- Function to display all products on the page ---
    function renderProducts() {
        // Clear the container first
        productContainer.innerHTML = '';

        // If there are no products, show a message
        if (products.length === 0) {
            productContainer.innerHTML = '<p>No products have been listed yet. Go to the "Sell" page to add one!</p>';
            return;
        }

        // Loop through each product and create its HTML card
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-admin-card';

            // Use a data attribute to store the unique product ID on the delete button
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="product-admin-image">
                <div class="product-admin-details">
                    <h3 class="product-admin-title">${product.title}</h3>
                    <p class="product-admin-category">Category: ${product.category}</p>
                    <p class="product-admin-price">Price: $${product.price}</p>
                </div>
                <div class="product-admin-actions">
                    <button class="delete-btn" data-id="${product.id}">Delete</button>
                </div>
            `;
            productContainer.appendChild(productCard);
        });
    }

    // --- Event listener for handling delete clicks ---
    // This listens for clicks on the entire container
    productContainer.addEventListener('click', (e) => {
        // Check if the specific element that was clicked has the 'delete-btn' class
        if (e.target.classList.contains('delete-btn')) {
            // Get the unique ID from the button's 'data-id' attribute.
            // Using 'dataset.id' is the modern way to access data attributes.
            const productIdToDelete = parseInt(e.target.dataset.id);

            // Ask for confirmation before deleting
            if (confirm('Are you sure you want to delete this product?')) {
                // Create a new array that includes all products EXCEPT the one with the matching ID
                products = products.filter(product => product.id !== productIdToDelete);

                // Save the updated array back to localStorage
                localStorage.setItem('products', JSON.stringify(products));

                // Re-run the function to display the updated list of products on the page
                renderProducts();
            }
        }
    });

    // --- Initial call ---
    // Display all products when the page first loads
    renderProducts();
});