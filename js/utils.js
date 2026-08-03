(function(){
  var Fec = window.Fec;
  Fec.$ = function(id){ return document.getElementById(id); };
  Fec.fmtUSD = function(n){ return "$ " + n.toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2}); };
  Fec.fmtBs = function(n){ return "Bs " + n.toLocaleString("es-VE",{minimumFractionDigits:2,maximumFractionDigits:2}); };
})();
