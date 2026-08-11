const { createClient } = require("@supabase/supabase-js");
const sb = createClient(process.env.SB_URL, process.env.SB_KEY);
const email = "diag." + Date.now() + "@example.com";
(async () => {
  const su = await sb.auth.signUp({ email, password: "prueba12345" });
  if (su.error) { console.log("SIGNUP ERR:", su.error.message); return; }
  console.log("signUp OK | session:", su.data.session ? "SÍ (confirmación OFF)" : "NO (confirmación ON o similar)");
  const ins = await sb.from("Perfiles").insert({ email, nombre: "Prueba", apellido: "Diag", rol_user: "cliente" }).maybeSingle();
  console.log("INSERT Perfiles:", ins.error ? "ERR: " + ins.error.message : "OK");
  console.log("EMAIL TEST:", email);
})().catch((e) => console.error("FATAL:", e.message));
