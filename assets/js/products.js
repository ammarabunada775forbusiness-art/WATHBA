// Filter the existing static cards. Product text and links never depend on JS.
(function () {
  const cards = Array.from(document.querySelectorAll("#allProducts [data-product-card]"));
  const filters = Array.from(document.querySelectorAll("[data-filter]"));
  const search = document.getElementById("productSearch");
  const count = document.getElementById("catalogCount");
  const empty = document.getElementById("catalogEmpty");
  const lang = document.documentElement.lang;
  if (!cards.length || !search || !count) return;
  let currentFilter = "all";
  const normalize = value => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, "").replace(/[أإآ]/g,"ا").replace(/ة/g,"ه");
  function readQuery() {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter") || "all";
    currentFilter = filters.some(button => button.dataset.filter === filter) ? filter : "all";
    search.value = params.get("q") || "";
  }
  function apply(updateUrl = true) {
    const query = normalize(search.value.trim());
    let visible = 0;
    cards.forEach(card => {
      const match = (currentFilter === "all" || card.dataset.category === currentFilter) && normalize(card.dataset.search).includes(query);
      card.hidden = !match;
      if (match) visible++;
    });
    filters.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === currentFilter)));
    count.textContent = lang === "ar" ? `${visible} من ${cards.length} منتجًا` : `${visible} of ${cards.length} products`;
    empty.hidden = visible > 0;
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (currentFilter === "all") url.searchParams.delete("filter"); else url.searchParams.set("filter",currentFilter);
      if (search.value.trim()) url.searchParams.set("q",search.value.trim()); else url.searchParams.delete("q");
      history.replaceState(null,"",url);
    }
  }
  filters.forEach(button => button.addEventListener("click", () => { currentFilter = button.dataset.filter; apply(); }));
  search.addEventListener("input", () => apply());
  document.querySelector("[data-clear-filters]")?.addEventListener("click", () => { currentFilter = "all"; search.value = ""; apply(); search.focus(); });
  window.addEventListener("popstate", () => { readQuery(); apply(false); });
  readQuery(); apply(false);
})();
