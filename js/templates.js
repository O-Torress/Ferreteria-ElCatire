(function(){
  var Fec = window.Fec;
  var fmtUSD = Fec.fmtUSD;
  var fmtBs = Fec.fmtBs;

  Fec.productCard = function(p){
    return '<article class="bg-white border border-line rounded-lg overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(26,37,54,0.12)]" data-od-id="product-card-' + p.id + '">' +
      '<div class="relative aspect-square bg-media overflow-hidden group">' +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">' +
        '<span class="absolute top-2.5 left-2.5 bg-stock text-ink text-xs font-semibold px-2.5 py-1 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.22)]">' + p.stock + '</span>' +
      '</div>' +
      '<div class="p-4 pt-3.5 flex flex-col gap-1.5 flex-1">' +
        '<h2 class="font-display text-base font-semibold leading-snug tracking-[-0.01em]">' + p.name + '</h2>' +
        '<p class="text-[12.5px] text-muted">Ref. ' + p.sku + '</p>' +
        '<div class="flex items-baseline gap-2.5 mt-0.5">' +
          '<span class="font-display text-[19px] font-bold tracking-[-0.01em]">' + fmtUSD(p.price) + '</span>' +
          '<span class="text-[13px] text-muted font-medium">≈ ' + fmtBs(p.price * Fec.RATE) + '</span>' +
        '</div>' +
        '<button class="add mt-auto bg-action hover:bg-actionhover text-white font-semibold text-sm tracking-[0.02em] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 min-h-11 transition-colors" data-id="' + p.id + '">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' +
          'Añadir al carrito' +
        '</button>' +
      '</div>' +
    '</article>';
  };

  Fec.placeholderCard = function(){
    return '<article class="bg-white border border-line rounded-lg overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(26,37,54,0.12)]" data-od-id="product-card-placeholder">' +
      '<div class="relative aspect-square bg-media">' +
        '<span class="absolute top-2.5 left-2.5 bg-stock text-ink text-xs font-semibold px-2.5 py-1 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.22)]">En stock</span>' +
      '</div>' +
      '<div class="p-4 pt-3.5 flex flex-col gap-2 flex-1">' +
        '<div class="h-4 bg-media rounded-md w-3/4"></div>' +
        '<div class="h-3 bg-media rounded-md w-1/3"></div>' +
        '<div class="flex items-baseline gap-2.5 mt-0.5">' +
          '<div class="h-5 bg-media rounded-md w-20"></div>' +
          '<div class="h-3.5 bg-media rounded-md w-24"></div>' +
        '</div>' +
        '<button class="add mt-auto bg-action hover:bg-actionhover text-white font-semibold text-sm tracking-[0.02em] py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 min-h-11 transition-colors">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' +
          'Añadir al carrito' +
        '</button>' +
      '</div>' +
    '</article>';
  };
})();
