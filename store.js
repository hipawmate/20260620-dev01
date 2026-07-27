(function () {
  const productGrid = document.getElementById("product-grid");
  const pagination = document.getElementById("pagination");
  const searchInput = document.getElementById("product-search");
  const searchForm = document.getElementById("product-search-form");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const sortSelect = document.getElementById("sort-products");
  const productModal = document.getElementById("product-modal");
const modalBackdrop = document.getElementById("product-modal-backdrop");
const modalClose = document.getElementById("product-modal-close");
const modalCloseSecondary = document.getElementById("modal-close-secondary");

const modalImage = document.getElementById("modal-image");
const modalCategory = document.getElementById("modal-category");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalDescription = document.getElementById("modal-description");
const modalProductLink = document.getElementById("modal-product-link");

  const PRODUCTS_PER_PAGE = 15;

  let currentPage = 1;
  let activeCategory = "all";
  let activeSort = "default";

  const productData =
    window.HIPAWMATE_PRODUCTS ||
    (typeof products !== "undefined" ? products : []);

  function normalizeText(value) {
    return String(value || "").toLowerCase().trim();
  }

  function normalizeStatus(product) {
    return String(product.status || product.includeStatus || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_");
  }

  function isVisibleProduct(product) {
    const status = normalizeStatus(product);

    return status === "show" || status === "top_pick" || status === "";
  }

  const allVisibleProducts = productData.filter(isVisibleProduct);
  let currentProducts = allVisibleProducts;

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
function getProductPrice(product) {
  const rawPrice = product.price || product.priceNumber || product.price_number || 0;

  if (typeof rawPrice === "number") {
    return rawPrice;
  }

  return Number(String(rawPrice).replace(/[^\d]/g, "")) || 0;
}

function getProductName(product) {
  return String(product.name || product.nameOriginal || "").toLowerCase();
}

function sortProducts(productList) {
  const sortedProducts = [...productList];

  if (activeSort === "price-asc") {
    sortedProducts.sort(function (a, b) {
      return getProductPrice(a) - getProductPrice(b);
    });
  }

  if (activeSort === "price-desc") {
    sortedProducts.sort(function (a, b) {
      return getProductPrice(b) - getProductPrice(a);
    });
  }

  if (activeSort === "name-asc") {
    sortedProducts.sort(function (a, b) {
      return getProductName(a).localeCompare(getProductName(b));
    });
  }

  if (activeSort === "name-desc") {
    sortedProducts.sort(function (a, b) {
      return getProductName(b).localeCompare(getProductName(a));
    });
  }

  if (activeSort === "top-pick") {
    sortedProducts.sort(function (a, b) {
      const aIsTopPick = normalizeStatus(a) === "top_pick" ? 1 : 0;
      const bIsTopPick = normalizeStatus(b) === "top_pick" ? 1 : 0;

      return bIsTopPick - aIsTopPick;
    });
  }

  return sortedProducts;
}
  function getFilteredProducts() {
    const query = searchInput ? normalizeText(searchInput.value) : "";
    const queryWords = query.split(/\s+/).filter(Boolean);

    const filteredProducts = allVisibleProducts.filter(function (product) {
  const status = normalizeStatus(product);
  const categorySlug = product.categorySlug || "";
  const searchText = getProductSearchText(product);

  const matchCategory =
    activeCategory === "all" ||
    categorySlug === activeCategory ||
    (activeCategory === "top_pick" && status === "top_pick");

  const matchSearch =
    queryWords.length === 0 ||
    queryWords.every(function (word) {
      return searchText.includes(word);
    });

  return matchCategory && matchSearch;
});

return sortProducts(filteredProducts);
  }

  function getPaginatedProducts(productList, page) {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;

    return productList.slice(startIndex, endIndex);
  }
function getProductDescription(product) {
  return (
    product.descriptorShort ||
    product.descriptor ||
    `Produk pilihan HiPawMate untuk kategori ${product.categoryDisplay || "kebutuhan anabul"}. Cek detail, harga, dan ketersediaan terbaru di halaman retailer.`
  );
}

function openProductModal(product) {
  if (!productModal) return;

  modalImage.src = product.imageUrl || "";
  modalImage.alt = product.name || "Produk HiPawMate";

  modalCategory.textContent = product.categoryDisplay || "";
  modalTitle.textContent = product.name || product.nameOriginal || "Produk HiPawMate";
  modalPrice.textContent = product.priceDisplay || "";
  modalDescription.textContent = getProductDescription(product);

 const whatsappNumber = "6285759997767"; // ganti dengan nomor WA kamu

const whatsappMessage = encodeURIComponent(
  `Halo HiPawMate, aku mau tanya soal ${product.name || product.nameOriginal || "produk ini"} (${product.hpmSku || ""}).`
);

modalProductLink.href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
modalProductLink.textContent = "Tanya via WhatsApp";;

  productModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeProductModal() {
  if (!productModal) return;

  productModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}
  function renderProducts(productList) {
    productGrid.innerHTML = "";

    if (productList.length === 0) {
      productGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-gray-600">Produk belum ketemu.</p>
          <p class="text-sm text-gray-400 mt-2">
            Coba keyword/kategori lain seperti carrier, catnip, grooming, atau scratcher.
          </p>
        </div>
      `;
      return;
    }

    productList.forEach(function (product) {
      const card = document.createElement("button");

card.type = "button";
card.className = "group block product-card text-left";
      card.dataset.sku = product.hpmSku || "";
      card.dataset.category = product.categorySlug || "";
      card.dataset.status = status;

      card.innerHTML = `
        <div class="relative">
          <img
            src="${product.imageUrl || ""}"
            alt="${product.name || "Produk HiPawMate"}"
            class="w-full aspect-[4/5] object-cover rounded-lg bg-neutral-100"
          />

          ${
            status === "top_pick"
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
card.addEventListener("click", function () {
  openProductModal(product);
});
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

  function updateCategoryButtonStyles() {
    categoryButtons.forEach(function (button) {
      const isActive = button.dataset.category === activeCategory;

      button.className = isActive
        ? "category-btn rounded-full border px-4 py-2 text-sm bg-indigo-600 text-white"
        : "category-btn rounded-full border px-4 py-2 text-sm hover:bg-gray-100";
    });
  }
if (sortSelect) {
  sortSelect.addEventListener("change", function () {
    activeSort = sortSelect.value;
    currentPage = 1;
    updatePage();
  });
}
  function updatePage() {
    currentProducts = getFilteredProducts();

    const totalPages = Math.ceil(currentProducts.length / PRODUCTS_PER_PAGE);

    if (currentPage > totalPages) {
      currentPage = 1;
    }

    const paginatedProducts = getPaginatedProducts(currentProducts, currentPage);

    renderProducts(paginatedProducts);
    renderPagination(currentProducts);
    updateCategoryButtonStyles();
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      currentPage = 1;
      updatePage();
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      currentPage = 1;
      updatePage();
    });
  }

  categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeCategory = button.dataset.category || "all";
      currentPage = 1;
      updatePage();
    });
  });
if (modalClose) {
  modalClose.addEventListener("click", closeProductModal);
}

if (modalCloseSecondary) {
  modalCloseSecondary.addEventListener("click", closeProductModal);
}

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", closeProductModal);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeProductModal();
  }
});
  updatePage();
})();
