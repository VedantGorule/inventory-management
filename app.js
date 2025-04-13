// Fetch products from the server and display them
function fetchProducts() {
  fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector("#productTable tbody");
      tableBody.innerHTML = ''; // Clear existing rows

      // Populate table with fetched products
      data.forEach(product => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.sku}</td>
          <td>${product.category}</td>
          <td>${product.price}</td>
          <td>${product.quantity}</td>
        `;

        tableBody.appendChild(row);
      });

      // Populate sales and purchase product select options
      const salesProductSelect = document.getElementById("salesProductSelect");
      const purchaseProductSelect = document.getElementById("purchaseProductSelect");

      salesProductSelect.innerHTML = '';
      purchaseProductSelect.innerHTML = '';

      data.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = `${product.name} (${product.sku})`;

        salesProductSelect.appendChild(option);
        purchaseProductSelect.appendChild(option.cloneNode(true));
      });
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
}

// Add a new product to the database
function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById("productName").value;
  const sku = document.getElementById("productSku").value;
  const category = document.getElementById("productCategory").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const quantity = parseInt(document.getElementById("productQuantity").value);

  const newProduct = { name, sku, category, price, quantity };

  fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newProduct)
  })
  .then(response => response.json())
  .then(data => {
    alert('Product added successfully');
    fetchProducts(); // Refresh the product list
    document.getElementById("productForm").reset(); // Clear the form fields
  })
  .catch(error => {
    console.error('Error adding product:', error);
  });
}

// Add a sales order
function addSalesOrder(event) {
  event.preventDefault();

  const productId = document.getElementById("salesProductSelect").value;
  const quantitySold = parseInt(document.getElementById("quantitySold").value);

  const salesOrder = { productId, quantitySold };

  fetch('http://localhost:3000/api/sales', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(salesOrder)
  })
  .then(response => response.json())
  .then(data => {
    alert('Sales order added successfully');
    fetchProducts(); // Refresh the product list
    document.getElementById("salesForm").reset(); // Clear the form fields
  })
  .catch(error => {
    console.error('Error adding sales order:', error);
  });
}

// Add a purchase order
function addPurchaseOrder(event) {
  event.preventDefault();

  const productId = document.getElementById("purchaseProductSelect").value;
  const quantityPurchased = parseInt(document.getElementById("quantityPurchased").value);

  const purchaseOrder = { productId, quantityPurchased };

  fetch('http://localhost:3000/api/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(purchaseOrder)
  })
  .then(response => response.json())
  .then(data => {
    alert('Purchase order added successfully');
    fetchProducts(); // Refresh the product list
    document.getElementById("purchaseForm").reset(); // Clear the form fields
  })
  .catch(error => {
    console.error('Error adding purchase order:', error);
  });
}

// Listen for form submissions
document.getElementById("productForm").addEventListener("submit", addProduct);
document.getElementById("salesForm").addEventListener("submit", addSalesOrder);
document.getElementById("purchaseForm").addEventListener("submit", addPurchaseOrder);

// Initial fetch of products when the page loads
fetchProducts();
