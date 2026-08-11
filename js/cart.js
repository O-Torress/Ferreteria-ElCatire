(function(){
  var Fec = window.Fec;
  var $ = Fec.$;
  var fmtUSD = Fec.fmtUSD;
  var fmtBs = Fec.fmtBs;
  var PRODUCTS = Fec.PRODUCTS || [];

  var cart = {};
  try { cart = JSON.parse(localStorage.getItem("fec_cart") || "{}"); } catch(e){ cart = {}; }

  function badgeCount(){ return Object.keys(cart).reduce(function(s,k){ return s + cart[k]; }, 0); }

  function updateBadge(){
    var n = badgeCount();
    var b = $("cartBadge");
    b.textContent = n;
    b.classList.toggle("hidden", n === 0);
  }

  function totals(){
    var t = 0;
    Object.keys(cart).forEach(function(id){
      var p = PRODUCTS.filter(function(x){ return x.id === id; })[0];
      if(p) t += p.price * cart[id];
    });
    return t;
  }

  function renderCart(){
    var wrap = $("cartItems");
    var keys = Object.keys(cart).filter(function(id){ return cart[id] > 0 && PRODUCTS.some(function(x){ return x.id === id; }); });
    if(keys.length === 0){
      $("cartEmpty").classList.remove("hidden");
      $("cartFoot").classList.add("hidden");
      wrap.innerHTML = "";
      updateBadge();
      updateTotals();
      return;
    }
    $("cartEmpty").classList.add("hidden");
    $("cartFoot").classList.remove("hidden");
    wrap.innerHTML = keys.map(function(id){
      var p = PRODUCTS.filter(function(x){ return x.id === id; })[0];
      return '<div class="ci flex gap-3 items-center" data-id="' + id + '">' +
        '<img src="' + p.img + '" alt="' + p.name + '" class="w-[58px] h-[58px] rounded-lg object-cover border border-line bg-media flex-none">' +
        '<div class="flex-1 min-w-0">' +
          '<p class="font-semibold text-sm leading-snug">' + p.name + '</p>' +
          '<p class="text-[12.5px] text-muted mt-0.5 mb-1.5">' + fmtUSD(p.price) + ' · ' + fmtBs(p.price * Fec.RATE) + '</p>' +
          '<div class="flex items-center gap-2">' +
            '<div class="flex items-center border border-line rounded-lg overflow-hidden">' +
              '<button class="w-7 h-8 grid place-items-center text-ink font-semibold hover:bg-canvas transition-colors" data-act="dec" aria-label="Reducir cantidad">−</button>' +
              '<span class="min-w-[32px] text-center text-sm font-semibold">' + cart[id] + '</span>' +
              '<button class="w-7 h-8 grid place-items-center text-ink font-semibold hover:bg-canvas transition-colors" data-act="inc" aria-label="Aumentar cantidad">+</button>' +
            '</div>' +
            '<span class="font-display font-semibold text-sm tracking-[-0.01em]">' + fmtUSD(p.price * cart[id]) + '</span>' +
          '</div>' +
        '</div>' +
        '<button class="text-muted w-[30px] h-[30px] rounded-md grid place-items-center flex-none hover:text-action hover:bg-[#fdeeee] transition-colors" data-act="rm" aria-label="Quitar del carrito">' +
          '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>' +
        '</button>' +
      '</div>';
    }).join("");
    updateBadge();
    updateTotals();
  }

  function updateTotals(){
    var t = totals();
    $("totalUsd").textContent = fmtUSD(t);
    $("totalBs").textContent = fmtBs(t * Fec.RATE);
    $("totalBig").textContent = fmtUSD(t);
    $("waLink").classList.toggle("pointer-events-none", t === 0);
    $("waLink").classList.toggle("opacity-50", t === 0);
    var sede = $("sedeSelect").value;
    var lines = Object.keys(cart).filter(function(id){ return cart[id] > 0 && PRODUCTS.some(function(x){ return x.id === id; }); }).map(function(id){
      var p = PRODUCTS.filter(function(x){ return x.id === id; })[0];
      return "• " + cart[id] + " × " + p.name + " — " + fmtUSD(p.price * cart[id]) + " (" + fmtBs(p.price * Fec.RATE * cart[id]) + ")";
    });
    var msg = "Hola Ferretería El Catire, quiero confirmar mi pedido para " + sede + ":\n\n" +
      lines.join("\n") +
      "\n\nTotal: " + fmtUSD(t) + " (" + fmtBs(t * Fec.RATE) + ")";
    $("waLink").href = "https://wa.me/" + Fec.WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
    $("waNote").textContent = "Pedido para " + sede + " · El enlace abre WhatsApp con el resumen.";
  }

  function persist(){ localStorage.setItem("fec_cart", JSON.stringify(cart)); }

  function addToCart(id){
    cart[id] = (cart[id] || 0) + 1;
    persist(); updateBadge(); renderCart();
    var p = PRODUCTS.filter(function(x){ return x.id === id; })[0];
    Fec.showToast(p.name + " añadido al carrito");
  }

  Fec.updateBadge = updateBadge;
  Fec.renderCart = renderCart;
  Fec.updateTotals = updateTotals;

  $("grid").addEventListener("click", function(e){
    var btn = e.target.closest(".add");
    if(btn && btn.getAttribute("data-id")) addToCart(btn.getAttribute("data-id"));
  });
  $("cartItems").addEventListener("click", function(e){
    var btn = e.target.closest("button");
    if(!btn) return;
    var row = btn.closest(".ci");
    var id = row.getAttribute("data-id");
    var act = btn.getAttribute("data-act");
    if(act === "inc") cart[id] += 1;
    if(act === "dec"){ cart[id] -= 1; if(cart[id] <= 0) delete cart[id]; }
    if(act === "rm") delete cart[id];
    persist(); renderCart(); updateBadge();
  });
})();
