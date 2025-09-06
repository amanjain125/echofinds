document.getElementById('add-product-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('product-title').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value).toFixed(2);
    const photoInput = document.getElementById('product-photo');
    const photoFile = photoInput.files[0];

    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newProduct = {
                id: Date.now(), // Unique ID based on timestamp
                title: title,
                category: category,
                price: price,
                image: e.target.result, // Base64 image string
                rating: 'New' // Or a default rating
            };

            // Save product to localStorage
            let products = JSON.parse(localStorage.getItem('products')) || [];
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));

            alert('Product listed successfully!');
            window.location.href = 'index.html'; // Redirect to homepage
        };
        reader.readAsDataURL(photoFile);
    }
});