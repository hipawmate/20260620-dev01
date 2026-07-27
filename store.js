const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("product-search");
const searchForm = document.getElementById("product-search-form");

const visibleProducts = products.filter(function (product) {
  return product.status === "show" || product.status === "top_pick";
});

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim();
}

function getProductSearchText(product) {
  return [
    product.name,
    product.nameOriginal,
    product.categoryDisplay,
    product.categorySlug,
    product.searchKeywords,
    product.seoPrimaryKeyword,
    product.seoSupportingKeywords,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function renderProducts(productList) {
  if (!productGrid) return;

  productGrid.innerHTML = "";

  if (productList.length === 0) {
    productGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-gray-600">Produk belum ketemu.</p>
        <p class="text-sm text-gray-400 mt-2">Coba keyword lain seperti carrier, catnip, grooming, atau scratcher.</p>
      </div>
    `;
    return;
  }

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
      <div class="relative">
        <img
          src="${product.imageUrl}"
          alt="${product.name}"
          class="w-full aspect-[4/5] object-cover rounded-lg bg-neutral-100"
        />

        ${
          product.status === "top_pick"
            ? `<span class="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm">Top Pick</span>`
            : ""
        }
      </div>

      <div class="mt-3">
        <p class="text-xs text-neutral-500">${product.categoryDisplay}</p>
        <h3 class="font-medium text-neutral-900 group-hover:underline group-hover:underline-offset-4">
          ${product.name}
        </h3>
        <p class="text-sm text-neutral-700">${product.priceDisplay}</p>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

function filterProductsBySearch(query) {
  const cleanQuery = normalizeText(query);

  if (!cleanQuery) {
    return visibleProducts;
  }

  const queryWords = cleanQuery.split(/\s+/).filter(Boolean);

  return visibleProducts.filter(function (product) {
    const searchText = getProductSearchText(product);

    return queryWords.every(function (word) {
      return searchText.includes(word);
    });
  });
}

function handleSearch() {
  const query = searchInput ? searchInput.value : "";
  const filteredProducts = filterProductsBySearch(query);

  renderProducts(filteredProducts);
}

if (searchInput) {
  searchInput.addEventListener("input", handleSearch);
}

if (searchForm) {
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    handleSearch();
  });
}

renderProducts(visibleProducts);
