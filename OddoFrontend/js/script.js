document.addEventListener('DOMContentLoaded', () => {

    const addProductForm = document.getElementById('add-product-form');
    const productGrid = document.querySelector('.product-grid');
    const productCountElement = document.querySelector('.product-count');

    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // 1. Get form values
        const title = document.getElementById('product-title').value;
        const category = document.getElementById('product-category').value;
        const price = parseFloat(document.getElementById('product-price').value).toFixed(2);
        const description = document.getElementById('product-description').value;
        const photoInput = document.getElementById('product-photo');
        const photoFile = photoInput.files[0];

        if (photoFile) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imageUrl = e.target.result;

                // 2. Create the new product card HTML
                const newProductCard = document.createElement('div');
                newProductCard.classList.add('product-card');
                newProductCard.innerHTML = `
                    <span class="product-badge">${category}</span>
                    <img src="${imageUrl}" alt="${title}" class="product-card-image">
                    <div class="product-card-content">
                        <h3 class="product-card-title">${title}</h3>
                        <div class="rating">
                           <i class="fas fa-star"></i> New
                        </div>
                        <div class="product-card-footer">
                            <span class="product-card-price">$${price}</span>
                            <button class="btn add-to-cart-btn"><i class="fas fa-shopping-cart"></i></button>
                        </div>
                    </div>
                `;

                // 3. Add the new card to the grid
                productGrid.prepend(newProductCard); // prepend adds it to the beginning

                // 4. Update product count
                updateProductCount();

                // 5. Reset the form
                addProductForm.reset();
            };

            reader.readAsDataURL(photoFile);
        }
    });

    function updateProductCount() {
        const currentCount = productGrid.children.length;
        productCountElement.textContent = `${currentCount} products found`;
    }

    // Modal Logic (keeping your existing modal functionality)
    const modal = document.getElementById('deliveryModal');
    const closeButton = document.querySelector('.close-button');

    // This is a generic selector. You might need to make it more specific
    // if you have other buttons that could open a modal.
    document.body.addEventListener('click', function(event) {
        if (event.target.matches('.add-to-cart-btn')) {
             modal.style.display = 'flex';
        }
    });
    
    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});