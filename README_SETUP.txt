================================================================
  PERITAJE DIGITAL PRO v4.0 — GUÍA COMPLETA DE SETUP
  Desarrollado por WalterDP para Lic. DarianaDLRM
================================================================

ESTRUCTURA DEL PAQUETE
━━━━━━━━━━━━━━━━━━━━━━

  peritaje_digital/           ← Programa Python (el .exe)
  ├── peritaje_digital.py     ← Código fuente v4.0
  ├── COMPILAR_WINDOWS.bat    ← Genera el .exe (doble clic)
  ├── icono_peritaje.ico      ← Icono del .exe
  └── requirements.txt

  peritaje-licencias/         ← Web de licencias (Next.js)
  ├── DESPLEGAR_VERCEL.bat    ← Despliega a Vercel (doble clic)
  ├── SUPABASE_SETUP.sql      ← Ejecutar en Supabase SQL Editor
  ├── .env.example            ← Variables de entorno necesarias
  └── src/                    ← Código fuente web


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 1: CONFIGURAR SUPABASE (base de datos de licencias)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Ve a https://supabase.com y crea una cuenta gratuita
2. Crea un nuevo proyecto (elige región USA East para latencia baja)
3. Espera ~2 minutos a que el proyecto esté listo
4. Ve a SQL Editor → New Query
5. Copia y pega el contenido de SUPABASE_SETUP.sql
6. Clic en "Run" — debes ver que se crearon 2 tablas
7. Ve a Settings → API y anota:
   - Project URL (ej: https://abcxyz.supabase.co)
   - anon/public key (empieza con eyJ...)
   - service_role key (empieza con eyJ... — NUNCA la compartas)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 2: DESPLEGAR LA WEB EN VERCEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Ve a la carpeta peritaje-licencias/
2. Doble clic en DESPLEGAR_VERCEL.bat
3. Sigue las instrucciones en pantalla
4. Cuando termine, copia la URL (ej: https://peritaje-digital-licencias.vercel.app)

Configurar variables de entorno en Vercel:
  a) Ve a vercel.com → tu proyecto → Settings → Environment Variables
  b) Agrega TODAS estas variables:

  ┌─────────────────────────────────┬─────────────────────────────────────┐
  │ VARIABLE                        │ VALOR                               │
  ├─────────────────────────────────┼─────────────────────────────────────┤
  │ NEXT_PUBLIC_SUPABASE_URL        │ https://xxxx.supabase.co            │
  │ NEXT_PUBLIC_SUPABASE_ANON_KEY   │ eyJ... (anon key de Supabase)       │
  │ SUPABASE_SERVICE_KEY            │ eyJ... (service_role de Supabase)   │
  │ JWT_SECRET                      │ cualquier_texto_secreto_largo_2026  │
  │ OFFLINE_SECRET                  │ peritaje_offline_hmac_secret_2026   │
  │ ADMIN_EMAIL                     │ admin@peritaje.com                  │
  │ ADMIN_PASSWORD                  │ PeritajeAdmin2026!                  │
  └─────────────────────────────────┴─────────────────────────────────────┘

  c) Settings → Deployments → Redeploy (para que tome las variables)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 3: CONECTAR EL PROGRAMA CON LA WEB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Abre peritaje_digital/peritaje_digital.py con cualquier editor
2. Busca la línea (alrededor de la línea 60):
      LICENSE_SERVER = "https://peritaje-digital-licencias.vercel.app"
3. Cámbiala por la URL real de tu despliegue Vercel
4. Guarda el archivo
5. Corre COMPILAR_WINDOWS.bat para generar el .exe actualizado


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASO 4: CREAR Y VENDER LICENCIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Panel Admin: https://tu-sitio.vercel.app/login
  Usuario:   admin@peritaje.com
  Password:  PeritajeAdmin2026!

Desde el panel puedes:
  ✓ Crear nuevas licencias (mensual/anual/lifetime)
  ✓ Activar/desactivar licencias
  ✓ Ver qué equipo (HWID) tiene activada cada licencia
  ✓ Resetear HWID si el cliente cambia de PC
  ✓ Generar código offline mensual para clientes sin internet
  ✓ Publicar nuevas versiones del programa
  ✓ Ver el email y nombre de cada cliente


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLUJO DE ACTIVACIÓN (cliente final)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CON INTERNET:
  1. Cliente abre el .exe por primera vez
  2. Aparece ventana de activación
  3. Ingresa su License Key (PD-XXXX-XXXX-XXXX-XXXX) + email
  4. El programa verifica con el servidor
  5. ✔ Activado — se guarda en el PC cifrado

SIN INTERNET (código offline):
  1. Cliente abre el .exe → ventana de activación → pestaña "Offline"
  2. Le das el código mensual desde el panel admin
     (Admin → ver licencia → "Código Offline" → ingresa el HWID del cliente)
  3. El código es válido solo ese mes calendario
  4. Después del mes, pide nuevo código

CONTADOR OFFLINE:
  - Si tiene internet, verifica cada 10 minutos
  - Si pierde internet estando activo, tiene hasta 72h offline
  - Al llegar a 0h, el programa pide reautenticación
  - Esto evita que alguien solo desconecte el internet para evitar la verificación


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
URLS DE LA WEB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /              → Landing page con planes de precios
  /login         → Panel admin
  /admin         → CRUD completo de licencias
  /activate      → Verificación pública de licencia
  /terms         → Términos y condiciones

  API (usada por el programa .exe):
  POST /api/license/activate       → Activar licencia
  POST /api/license/heartbeat      → Verificar cada 10 min
  POST /api/license/offline-verify → Verificar código offline
  GET  /api/updates/check          → Verificar actualizaciones


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREGUNTAS FRECUENTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Cuánto cuesta el hosting?
  Supabase: GRATIS (500MB base de datos, suficiente para miles de licencias)
  Vercel:   GRATIS (100GB bandwidth/mes, suficiente para uso comercial moderado)

¿Puedo cambiar los precios de los planes?
  Sí, edita src/app/page.tsx y cambia los números en la sección PLANES.

¿Cómo cambio la contraseña del admin?
  En Vercel → Settings → Environment Variables → ADMIN_PASSWORD

¿El cliente puede ver mis licencias?
  No. La API usa la service_role key de Supabase que nunca se expone al cliente.
  El cliente solo puede activar/verificar su propia licencia.

¿Qué pasa si revocan una licencia con el programa abierto?
  En el siguiente heartbeat (máx 10 min), el programa se cierra automáticamente
  y muestra el mensaje de revocación.
