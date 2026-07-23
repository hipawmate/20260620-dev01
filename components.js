const currentPage =
  window.location.pathname.split("/").pop() || "index.html";

const navigationItems = [
  {
    label: "Home",
    href: "index.html"
  },
  {
    label: "Topik",
    href: "index2topik.html"
  },
  {
    label: "Store",
    href: "index3store.html"
  },
  {
    label: "Tentang",
    href: "index5tentang.html"
  }
];

const navigationLinks = navigationItems
  .map((item) => {
    const isActive = currentPage === item.href;

    return `
      <a
        href="${item.href}"
        ${isActive ? 'class="active" aria-current="page"' : ""}
      >
        ${item.label}
      </a>
    `;
  })
  .join("");

const headerContainer = document.getElementById("site-header");

if (headerContainer) {
  headerContainer.innerHTML = `
    <header class="site-header">
      <a class="brand" href="index.html" aria-label="HiPawMate home">
        <span class="brand-mark">🐾</span>
        <span>HiPawMate</span>
      </a>

      <nav class="nav" aria-label="Main navigation">
        ${navigationLinks}
      </nav>
    </header>
  `;
}

const footerContainer = document.getElementById("site-footer");

if (footerContainer) {
  footerContainer.innerHTML = `
    <footer class="site-footer">
      <p>
        © ${new Date().getFullYear()} HiPawMate. Built for PawMates.
      </p>

      <div class="footer-links">
        <a
          href="https://www.instagram.com/hipawmate"
          target="_blank"
          rel="noopener"
        >
          Instagram
        </a>

        <a
          href="https://www.tiktok.com/@hipawmate"
          target="_blank"
          rel="noopener"
        >
          TikTok
        </a>

        <a
          href="https://wa.me/6285759997767"
          target="_blank"
          rel="noopener"
        >
          WhatsApp
        </a>
      </div>
    </footer>
  `;
}
