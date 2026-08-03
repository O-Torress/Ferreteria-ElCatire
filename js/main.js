(function(){
  const URL = 'https://ve.dolarapi.com/v1/dolares/oficial';

  // Ensure a simple $ helper exists (falls back to getElementById)
  const $ = window.$ || function(id){ return document.getElementById(id); };

  // Fetch the official rate from the API and update the UI.
  async function loadRate(){
    try{
      var res = await fetch(URL);
      if(!res.ok) throw new Error('Network response was not ok: ' + res.status);
      var data = await res.json();
      console.log('dolarapi response:', data);

      // Try to extract a numeric rate from common response shapes
      var rate = null;
      if (Array.isArray(data) && data.length){
        rate = data[0].ask || data[0].bid || data[0].valor || data[0].price || data[0].promedio;
      } else if (data && typeof data === 'object'){
        rate = data.ask || data.bid || data.valor || data.price || data.rate || data.valor_oficial;
        if (!rate){
          // inspect nested values
          for (var v of Object.values(data)){
            if (v && typeof v === 'object'){
              rate = v.ask || v.bid || v.valor || v.price || rate;
              if (rate) break;
            }
          }
        }
      }

      rate = Number(rate);
      if (!isFinite(rate) || rate <= 0) throw new Error('Rate not found in API response');

      window.Fec = window.Fec || {};
      window.Fec.RATE = rate;
      var Fec = window.Fec;

      // Update visible label if present
      try{
        var label = $('rateLabel');
        var text = (Fec.fmtBs ? Fec.fmtBs(Fec.RATE) : ('Bs ' + Number(Fec.RATE).toFixed(2))).replace('Bs ','') + ' por US$ 1,00';
        if (label) label.textContent = text;
        console.log('Updated rateLabel to', text);
      } catch(e){ console.warn('Could not update rateLabel', e); }

      // If the app exposes helpers to recalc totals, call them
      try{ if (Fec && typeof Fec.updateTotals === 'function') Fec.updateTotals(); else if (Fec && typeof Fec.renderCart === 'function') Fec.renderCart(); } catch(e){}

    }catch(err){
      console.error('Error loading rate:', err);
      // Ensure the UI still shows a sensible value from config
      try{
        window.Fec = window.Fec || {};
        var def = window.Fec.RATE || 36.50;
        var label = $('rateLabel');
        var text = (window.Fec.fmtBs ? window.Fec.fmtBs(def) : ('Bs ' + Number(def).toFixed(2))).replace('Bs ','') + ' por US$ 1,00';
        if (label) label.textContent = text;
        console.log('Set fallback rateLabel to', text);
      }catch(e){}
    }
  }

  loadRate();

  let Fec = window.Fec;

  $("rateLabel").textContent = Fec.fmtBs(Fec.RATE).replace("Bs ","") + " por US$ 1,00";
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
