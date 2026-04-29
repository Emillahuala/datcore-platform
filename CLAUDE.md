# CLAUDE.md — datcore-platform

Contexto de proyecto para Claude Code. Leer completo antes de cualquier tarea.

---

## Proyecto

**DatCore** es una consultora B2B chilena de gobierno de datos. Esta app (`datcore-platform`) es la **web dinámica — Fase II**: plataforma con autenticación, roles y dashboards por tipo de usuario. La **Fase I** (landing page de conversión) vive en un repo separado.

Deadline de negocio: **1 de diciembre 2026** — entrada en vigencia de la Ley 21.719 de Protección de Datos en Chile. Toda la plataforma debe estar operativa antes de esa fecha.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 — App Router |
| Lenguaje | TypeScript estricto |
| Estilos | Tailwind CSS con tokens DatCore (ver sección Design System) |
| Auth | Supabase Auth + JWT |
| Base de datos | PostgreSQL vía Supabase (esquema `dbasesorias`) |
| Validación | Zod |
| Deploy | Vercel |
| Iconos | Lucide React (única librería de iconos permitida) |

**No hay backend Express en Fase II.** Todo va a través de Next.js API Routes + Supabase client.

---

## Estructura de carpetas

```
datcore-platform/
├── middleware.ts               ← Protección de rutas por rol (Edge)
├── tailwind.config.ts
├── src/
│   ├── app/
│   │   ├── (auth)/             ← Rutas públicas sin sidebar
│   │   │   ├── login/page.tsx
│   │   │   └── recuperar-password/
│   │   │       ├── page.tsx
│   │   │       └── confirmacion/page.tsx
│   │   ├── (dashboard)/        ← Rutas protegidas con sidebar
│   │   │   ├── layout.tsx      ← Sidebar + Navbar compartidos
│   │   │   ├── admin/page.tsx
│   │   │   ├── product-owner/page.tsx
│   │   │   └── encargado/page.tsx
│   │   └── api/auth/callback/route.ts
│   ├── components/
│   │   ├── ui/                 ← Componentes base (Button, Input, Card, Badge, Alert)
│   │   ├── layout/             ← Sidebar, Navbar, RoleBadge
│   │   ├── auth/               ← LoginForm, RecuperarForm
│   │   └── dashboard/
│   │       ├── admin/
│   │       ├── product-owner/
│   │       └── encargado/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       ← Browser client (componentes cliente)
│   │   │   └── server.ts       ← Server client (Server Components, API Routes)
│   │   └── utils.ts
│   ├── hooks/
│   │   └── useUser.ts
│   └── types/
│       ├── database.types.ts   ← Generado por Supabase CLI (no editar a mano)
│       ├── roles.ts
│       └── user.ts
```

---

## Roles y rutas

```typescript
// src/types/roles.ts
export const ROLES = {
  ADMIN:          'admin',
  PRODUCT_OWNER:  'product_owner',
  ENCARGADO_AREA: 'encargado_area',
} as const

export const ROLE_DEFAULT_ROUTES = {
  admin:          '/admin',
  product_owner:  '/product-owner',
  encargado_area: '/encargado',
}
```

El **rol se almacena en `user.user_metadata.role`** del JWT de Supabase. El middleware lo lee sin query a la BD. El `empresa_id` también va en `user_metadata`.

**Reglas de acceso:**
- `/admin` → solo `admin`
- `/product-owner` → solo `product_owner`
- `/encargado` → solo `encargado_area`
- Usuario autenticado en `/login` → redirige a su panel según rol
- Usuario no autenticado en ruta protegida → redirige a `/login`

---

## Design System — Tokens DatCore

### Colores (usar SIEMPRE con clases Tailwind, nunca hex hardcodeados en JSX)

```typescript
// tailwind.config.ts — theme.extend.colors
brand: {
  navy:  '#1B3A5C',  // bg-brand-navy  — primario, headers, botones principales
  teal:  '#2AADAD',  // bg-brand-teal  — acento, CTAs secundarios, íconos activos
  red:   '#D32F2F',  // bg-brand-red   — urgencia, errores críticos, badges de alerta
  dark:  '#1F3864',  // bg-brand-dark  — headers oscuros del documento
}
```

**Paleta de uso:**
- Fondo principal: `bg-neutral-50` (`#F9FAFB`)
- Fondo sidebar: `bg-brand-navy`
- Texto primario: `text-neutral-900`
- Texto secundario: `text-neutral-500`
- Bordes: `border-neutral-200`
- Cards: `bg-white` con `shadow-sm` y `rounded-lg`
- Hover en sidebar: `hover:bg-white/10`
- Ítem activo en sidebar: `bg-white/15 text-white font-semibold`

### Tipografía

Fuente: **Inter** (Google Fonts). Sin fuentes adicionales.

| Uso | Clase |
|-----|-------|
| Título de página | `text-2xl font-bold text-neutral-900` |
| Subtítulo / sección | `text-lg font-semibold text-neutral-700` |
| Body | `text-sm text-neutral-700` |
| Label de input | `text-sm font-medium text-neutral-700` |
| Caption / helper | `text-xs text-neutral-500` |
| Texto en sidebar | `text-sm text-white/80` |

### Componentes base

**Button:**
```tsx
// Variantes y clases Tailwind
primario:    "bg-brand-navy text-white hover:bg-brand-navy/90 px-4 py-2 rounded-lg text-sm font-medium"
secundario:  "bg-brand-teal text-white hover:bg-brand-teal/90 px-4 py-2 rounded-lg text-sm font-medium"
outline:     "border border-brand-navy text-brand-navy hover:bg-brand-navy/5 px-4 py-2 rounded-lg text-sm font-medium"
peligro:     "bg-brand-red text-white hover:bg-brand-red/90 px-4 py-2 rounded-lg text-sm font-medium"
// Estado loading: agregar disabled + spinner (Loader2 de Lucide con animate-spin)
// Estado disabled: opacity-50 cursor-not-allowed
```

**Input:**
```tsx
"w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm
 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent
 placeholder:text-neutral-400"
// Error: border-brand-red focus:ring-brand-red
// Siempre acompañado de <label> y mensaje de error debajo
```

**Card:**
```tsx
"bg-white rounded-lg border border-neutral-200 shadow-sm p-6"
```

**Badge de rol:**
```tsx
admin:          "bg-brand-navy/10 text-brand-navy text-xs font-medium px-2 py-0.5 rounded-full"
product_owner:  "bg-brand-teal/10 text-brand-teal text-xs font-medium px-2 py-0.5 rounded-full"
encargado_area: "bg-neutral-100 text-neutral-600 text-xs font-medium px-2 py-0.5 rounded-full"
```

**Banner Ley 21.719 (urgencia):**
```tsx
"bg-brand-red/5 border border-brand-red/20 rounded-lg p-4 flex items-start gap-3"
// Ícono: AlertTriangle de Lucide en text-brand-red
// Texto: "X días para la entrada en vigencia de la Ley 21.719"
// Solo visible en panel Admin (no en PO ni Encargado)
```

---

## Vistas — Especificaciones

### Vista 1: Login (`/login`)

**Layout:** Split screen en desktop (1280px).
- **Panel izquierdo (40%):** `bg-brand-navy`. Logo DatCore (blanco) centrado. Tagline: *"Gobierno de datos para empresas que quieren cumplir"*. Contador regresivo a 1-dic-2026 en `text-brand-teal`. Footer: `© 2026 DatCore`.
- **Panel derecho (60%):** `bg-white`. Formulario centrado verticalmente, ancho máximo 400px.

**Formulario:**
```
Título: "Iniciar sesión"
Subtítulo: "Accede a tu panel DatCore"
Campo: Email (type="email", placeholder="correo@empresa.cl")
Campo: Contraseña (type="password", con toggle mostrar/ocultar — ícono Eye/EyeOff)
Enlace: "¿Olvidaste tu contraseña?" → /recuperar-password (alineado derecha)
Botón: "Ingresar" (primario, ancho completo)
```

**Estados del botón:**
- Default: habilitado
- Loading: `disabled` + spinner `Loader2` + texto "Ingresando..."
- Error: mensaje debajo del botón en `text-brand-red text-sm` — "Correo o contraseña incorrectos"

**Mobile (375px):** El panel izquierdo desaparece. Solo el formulario centrado con logo arriba.

**Implementación:**
```tsx
// Usar supabase.auth.signInWithPassword({ email, password })
// En caso de éxito: router.push(ROLE_DEFAULT_ROUTES[user.user_metadata.role])
// Validación con Zod antes del submit
```

---

### Vista 2: Recuperar contraseña (`/recuperar-password`)

**Paso 1 — Solicitar enlace:**
- Layout: centrado, card ancho máximo 440px en `bg-neutral-50`
- Ícono: `KeyRound` de Lucide en `text-brand-teal` (48px, centrado)
- Título: "Recuperar contraseña"
- Subtítulo: "Te enviaremos un enlace a tu correo"
- Campo: Email
- Botón: "Enviar enlace" (primario)
- Enlace: "← Volver al inicio de sesión"

**Paso 2 — Confirmación (`/recuperar-password/confirmacion`):**
- Ícono: `MailCheck` de Lucide en `text-brand-teal`
- Título: "Revisa tu correo"
- Texto: "Enviamos un enlace de recuperación a [email]"
- Botón: "Volver al inicio de sesión" (outline)

**Implementación:**
```tsx
// supabase.auth.resetPasswordForEmail(email, {
//   redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/nueva-password`
// })
```

---

### Vista 3: Panel Admin (`/admin`)

**Layout:** Sidebar fijo izquierdo (240px) + área de contenido.

**Sidebar:**
```
Logo DatCore (blanco, 32px alto)
─────────────
Navegación:
  LayoutDashboard  Panel
  Building2        Empresas
  Users            Usuarios
  FileText         Cuestionarios
  BarChart3        Reportes
  Settings         Configuración
─────────────
Abajo:
  Badge rol: "Administrador"
  Nombre usuario
  Botón logout (LogOut icon)
```

**Contenido principal:**
1. **Header:** "Panel de Administración" + badge rol Admin + nombre usuario
2. **Banner urgencia Ley 21.719:** días restantes hasta 1-dic-2026
3. **Métricas (4 cards en grid 2×2 o 4 columnas):**
   - Total Empresas
   - Cuestionarios completados
   - Cuestionarios pendientes
   - Nivel de cumplimiento promedio (%)
4. **Tabla de empresas:** columnas Empresa / Sector / Product Owner / Estado / Progreso / Acciones
   - Filtros: por sector, por estado
   - Estado con badge: Completado (verde), En progreso (teal), Pendiente (gris), Vencido (rojo)
5. **Grid de plantillas:** todos los cuestionarios de todos los PO y Encargados

---

### Vista 4: Panel Product Owner (`/product-owner`)

**Sidebar:** mismo patrón que Admin pero con ítems reducidos:
```
  LayoutDashboard  Mi Panel
  FolderOpen       Mis Proyectos
  FileText         Plantillas
  Users            Mi Equipo
  HelpCircle       Ayuda
```

**Contenido:**
1. Header con saludo + badge "Product Owner" + nombre empresa
2. Métricas (3 cards): Proyectos activos / Cuestionarios asignados / Áreas completadas
3. **Mis plantillas de proyecto** (cuestionarios que el PO configuró)
4. **Plantillas de mis Encargados** filtradas por área (RRHH, Marketing, Finanzas, etc.)
5. Filtro por área visible en la sección de plantillas de encargados

---

### Vista 5: Panel Encargado de Área (`/encargado`)

**Sidebar reducido:**
```
  LayoutDashboard  Mi Panel
  FileText         Mis Cuestionarios
  HelpCircle       Ayuda
```
El selector de empresa está fijo (no puede cambiar).

**Contenido:**
1. Card contextual (color `bg-brand-teal/5 border-brand-teal/20`): explica el rol del encargado y qué se espera de él
2. Header: "Mis Cuestionarios — Área [nombre área]"
3. Lista de sus cuestionarios asignados (máximo 3 en Fase II):
   - Card por cuestionario con: título, descripción, estado (badge), progreso (barra), botón "Completar" o "Ver"
4. Panel lateral (o sección inferior en mobile): Tareas pendientes + Recursos de ayuda

---

## Flujo de autenticación completo

```
Usuario → /login
  ↓ submit (email + password)
supabase.auth.signInWithPassword()
  ↓ éxito
Leer user.user_metadata.role
  ↓
  admin          → /admin
  product_owner  → /product-owner
  encargado_area → /encargado

Usuario → /recuperar-password
  ↓ submit (email)
supabase.auth.resetPasswordForEmail(email, { redirectTo: callback })
  ↓
/recuperar-password/confirmacion (mostrar mensaje)
  ↓ usuario hace click en email
/api/auth/callback?code=XXX
  ↓
supabase.auth.exchangeCodeForSession(code)
  ↓ éxito
/nueva-password (formulario nueva contraseña)
  ↓
supabase.auth.updateUser({ password })
  ↓
/login (con mensaje de éxito)
```

---

## Convenciones de código

- **Server Components por defecto.** Agregar `'use client'` solo cuando se necesita estado, eventos, o hooks.
- **Validación con Zod** en todos los formularios antes del submit.
- **Manejo de errores visible:** siempre mostrar feedback al usuario, nunca swallow silencioso.
- **Imports:** usar alias `@/` para todo (configurado en tsconfig).
- **Nombres de archivos:** `PascalCase` para componentes, `camelCase` para hooks y utils.
- **Clases Tailwind:** no usar valores arbitrarios (`text-[#1B3A5C]`) — usar los tokens definidos en `tailwind.config.ts`.
- **Iconos:** solo `lucide-react`. Un ícono por elemento, tamaño consistente (`size={16}` o `size={20}`).
- **No usar `any` en TypeScript.** Si el tipo no está definido, crearlo en `src/types/`.

---

## Variables de entorno requeridas

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Esquema de base de datos (resumen)

El modelo completo está en Supabase. Las tablas principales relevantes para Fase II:

- `mae_empresa` — empresas cliente
- `mae_usuario` — perfil de usuarios (vinculado a `auth.users` de Supabase)
- `mae_proyecto` — proyectos por empresa, con `id_mae_usuario_po` como FK al PO
- `movusuariorol` — tabla de roles con ámbito (`id_mae_empresa`, `id_mae_proyecto`, `id_area`)
- El email del usuario vive en `auth.users.email` — nunca duplicado en tablas de la app

Los tipos TypeScript se generan con:
```bash
npx supabase gen types typescript --project-id <id> > src/types/database.types.ts
```

---

## Comandos útiles

```bash
npm run dev          # Desarrollo local (localhost:3000)
npm run build        # Build de producción
npm run lint         # ESLint
npx supabase gen types typescript --project-id <id> > src/types/database.types.ts
```
