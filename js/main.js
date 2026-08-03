(function(){
  var URL = 'https://ve.dolarapi.com/v1/dolares/oficial';

  var $ = function(id){ return document.getElementById(id); };

  function labelText(rate){
    var n = Number(rate) || 0;
    return n.toLocaleString("es-VE", {minimumFractionDigits:2, maximumFractionDigits:2}) + " por US$ 1,00";
  }

  function setRateLabel(rate){
    var label = $("rateLabel");
    if (label) label.textContent = labelText(rate);
  }

  async function loadRate(){
    try{
      var res = await fetch(URL);
      if(!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();

      var rate = null;
      if (Array.isArray(data) && data.length){
        var first = data[0] || {};
        rate = first.promedio || first.venta || first.compra || first.ask || first.bid || first.valor || first.price;
      } else if (data && typeof data === 'object'){
        rate = data.promedio || data.venta || data.compra || data.ask || data.bid || data.valor || data.price || data.rate || data.valor_oficial;
      }
      rate = Number(rate);
      if (!isFinite(rate) || rate <= 0) throw new Error('Rate not found in API response');

      Fec.RATE = rate;
      setRateLabel(Fec.RATE);

      if (typeof Fec.renderGrid === 'function') Fec.renderGrid();
      if (typeof Fec.updateTotals === 'function') Fec.updateTotals();
      if (typeof Fec.renderCart === 'function') Fec.renderCart();

      console.log('Tasa oficial cargada:', Fec.RATE);
    }catch(err){
      console.error('Error loading rate:', err);
      setRateLabel(Fec.RATE);
    }
  }

  loadRate();

  setRateLabel(Fec.RATE);
  Fec.setActiveCat(document.querySelector('[data-cat="all"]'));
  Fec.updateBadge();
  Fec.renderGrid();
  Fec.renderCart();

  $("logoLink").addEventListener("click", function(e){
    e.preventDefault();
    Fec.resetFilters();
    window.scrollTo(0, 0);
  });
})();
