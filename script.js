console.log("HiPawMate V2 loaded 🐾");

document.addEventListener("DOMContentLoaded", function () {
  // Auto-update footer year
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Safe dataLayer setup for GTM
  window.dataLayer = window.dataLayer || [];

  function trackEvent(eventName, eventData = {}) {
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
  }

  // Track outbound clicks: Instagram, TikTok, etc.
  const outboundLinks = document.querySelectorAll('a[href^="http"]');

  outboundLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      const href = link.href;
      const text = link.textContent.trim();

      let platform = "external";

      if (href.includes("instagram.com")) {
        platform = "instagram";
      }

      if (href.includes("tiktok.com")) {
        platform = "tiktok";
      }

      trackEvent("hipawmate_outbound_click", {
        link_url: href,
        link_text: text,
        platform: platform
      });
    });
  });

  // Track internal navigation clicks
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      trackEvent("hipawmate_nav_click", {
        link_text: link.textContent.trim(),
        section: link.getAttribute("href")
      });
    });
  });
});
