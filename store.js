const productGrid = document.getElementById("product-grid");

function renderProducts(productList) {
  productGrid.innerHTML = "";

  productList.forEach(function (product) {
    const card = document.createElement("a");
    card.href = product.productUrl;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.className = "group block product-card";
    card.dataset.sku = product.hpmSku;
    card.dataset.category = product.categorySlug;
    card.dataset.status = product.status;

    card.innerHTML = `
      <img
        src="${product.imageUrl}"
        alt="${product.name}"
        class="w-full aspect-[4/5] object-cover rounded-lg bg-neutral-100"
      />
      <div class="mt-3">
        <p class="text-xs text-neutral-500">${product.categoryDisplay}</p>
        <h3 class="font-medium text-neutral-900">${product.name}</h3>
        <p class="text-sm text-neutral-700">${product.priceDisplay}</p>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

const visibleProducts = products.filter(function (product) {
  return product.status === "show" || product.status === "top_pick";
});

renderProducts(visibleProducts);
