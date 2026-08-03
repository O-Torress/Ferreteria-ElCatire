(function(){
  var Fec = window.Fec;
  var $ = Fec.$;

  $("sedeSelect").addEventListener("change", function(){
    localStorage.setItem("fec_sede", this.value);
    $("cartSedeChip").textContent = this.value;
    Fec.showToast("Sede activa: " + this.value);
    Fec.updateTotals();
  });
  try { $("sedeSelect").value = localStorage.getItem("fec_sede") || "Sede Norte"; } catch(e){}
  $("cartSedeChip").textContent = $("sedeSelect").value;
})();
