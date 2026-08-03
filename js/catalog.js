(function(){
  var Fec = window.Fec;
  var $ = Fec.$;
  var PRODUCTS = Fec.PRODUCTS;
  var CAT_BASE = Fec.CLASSES.CAT_BASE;
  var CAT_IDLE = Fec.CLASSES.CAT_IDLE;
  var CAT_ON = Fec.CLASSES.CAT_ON;

  var activeCat = "all";
  var query = "";
  var cats = document.querySelectorAll("[data-cat]");

  function matches(p){
    var inCat = activeCat === "all" || p.cat === activeCat;
    var q = query.trim().toLowerCase();
    var inQ = !q || p.name.toLowerCase().indexOf(q) !== -1 || p.sku.toLowerCase().indexOf(q) !== -1;
    return inCat && inQ;
  }

  function renderGrid(){
    var grid = $("grid");
    if (PRODUCTS.length === 0){
      var ph = "";
      for (var i = 0; i < Fec.PLACEHOLDER_CARDS; i++) ph += Fec.placeholderCard();
      grid.innerHTML = ph;
      return;
    }
    var list = PRODUCTS.filter(matches);
    if (list.length === 0){
      grid.innerHTML = '<div class="sm:col-span-3 text-center py-16 text-muted">Sin resultados para esa búsqueda.</div>';
      return;
    }
    grid.innerHTML = list.map(Fec.productCard).join("");
  }

  function cls(el, addCls, rmCls){
    el.classList.remove.apply(el.classList, rmCls.split(" "));
    el.classList.add.apply(el.classList, addCls.split(" "));
  }

  function setActiveCat(btn){
    cats.forEach(function(b){
      if (b === btn) cls(b, CAT_ON, CAT_IDLE);
      else cls(b, CAT_IDLE, CAT_ON);
    });
  }

  Fec.resetFilters = function(){
    activeCat = "all";
    query = "";
    $("searchInput").value = "";
    setActiveCat(document.querySelector('[data-cat="all"]'));
    renderGrid();
  };

  Fec.setActiveCat = setActiveCat;
  Fec.renderGrid = renderGrid;

  cats.forEach(function(btn){
    btn.addEventListener("click", function(){
      setActiveCat(btn);
      activeCat = btn.getAttribute("data-cat");
      renderGrid();
    });
  });
  $("searchInput").addEventListener("input", function(){ query = this.value; renderGrid(); });
  $("searchBtn").addEventListener("click", function(){ query = $("searchInput").value; renderGrid(); });
  $("searchInput").addEventListener("keydown", function(e){ if(e.key === "Enter"){ query = this.value; renderGrid(); } });
})();
