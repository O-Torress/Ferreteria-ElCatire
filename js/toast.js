(function(){
  var Fec = window.Fec;
  var $ = Fec.$;
  var toastTimer = null;

  Fec.showToast = function(msg){
    $("toastMsg").textContent = msg;
    var t = $("toast");
    t.classList.add("opacity-100", "translate-y-0");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ t.classList.remove("opacity-100", "translate-y-0"); }, 2400);
  };
})();
