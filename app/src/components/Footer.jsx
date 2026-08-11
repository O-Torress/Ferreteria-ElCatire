export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-10">
      <div className="max-w-[1280px] mx-auto px-5 py-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-display font-semibold text-[15px] tracking-[-0.01em]">Sobre nosotros</h3>
          <p className="text-sm text-white/70">&nbsp;</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="font-display font-semibold text-[15px] tracking-[-0.01em]">Contacto</h3>
          <p className="text-sm text-white/70">&nbsp;</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="font-display font-semibold text-[15px] tracking-[-0.01em]">Horarios</h3>
          <p className="text-sm text-white/70">&nbsp;</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 py-4 text-xs text-white/50">&nbsp;</div>
      </div>
    </footer>
  )
}
