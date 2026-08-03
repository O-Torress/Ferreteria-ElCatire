(function(){
  var Fec = window.Fec;
  var $ = Fec.$;

  function setCartOpen(open){
    $("cart").classList.toggle("translate-x-0", open);
    $("cartOverlay").classList.toggle("opacity-100", open);
    $("cartOverlay").classList.toggle("pointer-events-auto", open);
    $("cart").setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  }

  $("cartBtn").addEventListener("click", function(){ setCartOpen(true); });
  $("cartClose").addEventListener("click", function(){ setCartOpen(false); });
  $("cartOverlay").addEventListener("click", function(){ setCartOpen(false); });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") setCartOpen(false); });
})();
