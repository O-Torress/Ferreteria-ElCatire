export default function Footer() {
  return (
    <footer className="bg-footer text-white mt-10">
      <div className="max-w-[1280px] mx-auto px-5 py-10 grid grid-cols-1 gap-8 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-display font-semibold text-[20px] tracking-[-0.01em]">Redes</h3>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/ferreteriaelnuevocatire/?hl=es-la">
              <img src="/img/ig.svg" alt="ig logo" width="30" height="30" className="transition-transform duration-200 hover:scale-105" />
            </a>
            <a href="https://www.facebook.com/p/Ferreteria-El-Nuevo-Catire-CA-61551781005844/">
              <img src="/img/fb.svg" alt="fb logo" width="30" height="30" className="transition-transform duration-200 hover:scale-105" />
            </a>
            <a href="https://www.tiktok.com/discover/ferreteria-el-nuevo-catire?lang=is">
              <img src="/img/tk.svg" alt="tk logo" width="34" height="34" className="transition-transform duration-200 hover:scale-105" />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="font-display font-semibold text-[20px] tracking-[-0.01em]">Contacto</h3>
          <p className="text-base text-white/70">
            ferreteriacatireca@gmail.com <br /> <br /> +58-424262630
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="font-display font-semibold text-[20px] tracking-[-0.01em]">Horarios</h3>
          <p className="text-sm text-white/70">
            DE LUNES A VIERNES <br /> 8:00AM A 8:00PM <br /> <br /> SABADOS Y DOMINGOS <br /> 8:00AM A 1:00PM
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="font-display font-semibold text-[20px] tracking-[-0.01em]">Ubicación</h3>
          <div className="flex items-center gap-3">
            <a href="https://www.google.com/maps/place/FERRETERÍA+EL+CATIRE,+C.A./@10.7074942,-71.6389073,1110m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8e899f215648d4e5:0x61b9810d11f01967!8m2!3d10.7074942!4d-71.6389073!16s%2Fg%2F11zggzj0f0?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D">
              <img src="/img/gm.svg" alt="gm logo" width="34" height="34" className="transition-transform duration-200 hover:scale-105" />
            </a>
            <p className="text-sm text-white/70">
              AV. 16 GUAJIRA, <br /> C.C FERREMALL
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 py-4 text-xs text-white/50">&nbsp;
          <p>© 2026 Ferreteria el catire C.A. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
