(function () {
  const productGrid = document.getElementById("product-grid");
  const pagination = document.getElementById("pagination");
  const searchInput = document.getElementById("product-search");
  const searchForm = document.getElementById("product-search-form");

  const PRODUCTS_PER_PAGE = 12;
  let currentPage = 1;

  const productData =
    window.HIPAWMATE_PRODUCTS ||
    (typeof products !== "undefined" ? products : []);

  let currentProducts = productData;

  function showDebugMessage(message) {
    if (!productGrid) return;

    productGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-red-600 font-semibold">${message}</p>
      </div>
    `;
  }

  if (!productGrid) {
    console.error("product-grid tidak ketemu. Cek id='product-grid' di HTML.");
    return;
  }

  if (!Array.isArray(productData) || productData.length === 0) {
    showDebugMessage(
      "Product data belum kebaca. Cek hipawmate_products.js sudah ke-load sebelum store.js."
    );
    console.error("Product data kosong atau belum kebaca:", productData);
    return;
  }

  function normalizeText(value) {
    return String(value || "").toLowerCase().trim();
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

  function getPaginatedProducts(productList, page) {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return productList.slice(startIndex, endIndex);
  }

  function renderProducts(productList) {
    productGrid.innerHTML = "";

    if (productList.length === 0) {
      productGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-gray-600">Produk belum ketemu.</p>
          <p class="text-sm text-gray-400 mt-2">
            Coba keyword lain seperti carrier, catnip, grooming, atau scratcher.
          </p>
        </div>
      `;
      return;
    }

    productList.forEach(function (product) {
      const card = document.createElement("a");

      card.href = product.productUrl || "#";
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.className = "group block product-card";

      card.innerHTML = `
        <div class="relative">
          <img
            src="${product.imageUrl || ""}"
            alt="${product.name || "Produk HiPawMate"}"
            class="w-full aspect-[4/5] object-cover rounded-lg bg-neutral-100"
          />

          ${
            product.status === "top_pick" || product.status === "Top Pick"
              ? `<span class="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm">Top Pick</span>`
              : ""
          }
        </div>

        <div class="mt-3">
          <p class="text-xs text-neutral-500">${product.categoryDisplay || ""}</p>
          <h3 class="font-medium text-neutral-900 group-hover:underline group-hover:underline-offset-4">
            ${product.name || product.nameOriginal || "Produk"}
          </h3>
          <p class="text-sm text-neutral-700">${product.priceDisplay || ""}</p>
        </div>
      `;

      productGrid.appendChild(card);
    });
  }

  function renderPagination(productList) {
    if (!pagination) return;

    pagination.innerHTML = "";

    const totalPages = Math.ceil(productList.length / PRODUCTS_PER_PAGE);

    if (totalPages <= 1) return;

    pagination.className = "flex flex-wrap justify-center items-center gap-2 py-8";

    const previousButton = document.createElement("button");
    previousButton.textContent = "Previous";
    previousButton.disabled = currentPage === 1;
    previousButton.className =
      "rounded-md border px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed";

    previousButton.addEventListener("click", function () {
      if (currentPage > 1) {
        currentPage = currentPage - 1;
        updatePage();
      }
    });

    pagination.appendChild(previousButton);

    for (let page = 1; page <= totalPages; page++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = page;

      pageButton.className =
        page === currentPage
          ? "rounded-md border bg-indigo-600 px-3 py-2 text-sm text-white"
          : "rounded-md border px-3 py-2 text-sm hover:bg-gray-100";

      pageButton.addEventListener("click", function () {
        currentPage = page;
        updatePage();
      });

      pagination.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;
    nextButton.className =
      "rounded-md border px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed";

    nextButton.addEventListener("click", function () {
      if (currentPage < totalPages) {
        currentPage = currentPage + 1;
        updatePage();
      }
    });

    pagination.appendChild(nextButton);
  }

  function filterProductsBySearch(query) {
    const cleanQuery = normalizeText(query);

    if (!cleanQuery) {
      return productData;
    }

    const queryWords = cleanQuery.split(/\s+/).filter(Boolean);

    return productData.filter(function (product) {
      const searchText = getProductSearchText(product);

      return queryWords.every(function (word) {
        return searchText.includes(word);
      });
    });
  }

  function updatePage() {
    const paginatedProducts = getPaginatedProducts(currentProducts, currentPage);

    renderProducts(paginatedProducts);
    renderPagination(currentProducts);
  }

  function handleSearch() {
    const query = searchInput ? searchInput.value : "";

    currentProducts = filterProductsBySearch(query);
    currentPage = 1;

    updatePage();
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

  updatePage();
})();
