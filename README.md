# Agrodasin

Este proyecto es una aplicación React creada con Vite y Tailwind CSS. Aquí tienes los pasos más simples para ejecutar, probar y construir el proyecto.

## Requisitos

- Node.js 18 o superior (recomendado)
- npm instalado
- Terminal abierta en la carpeta del proyecto

## Pasos para ejecutar el proyecto

1. Abrir la terminal en la carpeta del proyecto:

   ```bash
   cd c:/Users/judam/OneDrive/Escritorio/agrodasin
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir la dirección que muestra la consola, normalmente:

   ```text
   http://localhost:5173
   ```

## Comandos útiles

- `npm run dev` — inicia el proyecto en modo desarrollo.
- `npm run build` — crea la versión lista para producción en la carpeta `dist`.
- `npm run preview` — sirve la versión de producción localmente para revisar el build.
- `npm run lint` — revisa el código con ESLint.

## Construir para producción

1. Generar el build:

   ```bash
   npm run build
   ```

2. Previsualizar el resultado:

   ```bash
   npm run preview
   ```

## Estructura importante

- `src/` — código fuente de la aplicación.
- `src/components/` — componentes React reutilizables.
- `src/pages/` — páginas principales de la aplicación.
- `public/` — archivos estáticos.
- `vite.config.js` — configuración de Vite.
- `tailwind.config.js` — configuración de Tailwind CSS.

## Notas

- Si no tienes `npm`, instala Node.js desde https://nodejs.org/
- Si hay errores al instalar, asegúrate de usar una versión actual de Node.js.
- El proyecto usa React 19, Vite y Tailwind.
