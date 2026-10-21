"use strict";
(async () => {
  try {
    const response = await fetch("service.json", {cache: "no-store"});
    if (!response.ok) return;
    const {service_url} = await response.json();
    if (!service_url) return;
    const url = new URL(service_url);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (url.username || url.password || url.search || url.hash || (url.protocol !== "https:" && !(local && url.protocol === "http:"))) return;
    if (url.origin === location.origin && url.pathname.replace(/index\.html$/, "") === location.pathname.replace(/index\.html$/, "")) return;
    const button = document.getElementById("launch-button");
    button.href = url.href;
    button.hidden = false;
    document.getElementById("service-status").textContent = "Open the research workspace to explore the reference data and process your feature CSV. Uploads are processed in memory and are not saved.";
  } catch {
    // Keep the useful publication links and the unconfigured-service message visible.
  }
})();
