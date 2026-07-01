# 💖 WaitingForUs - Shared Financial Goals App

<div align="center">
  <img src="https://img.shields.io/badge/Astro-0C1120?style=for-the-badge&logo=astro&logoColor=white" alt="Astro" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</div>

<br />

Aplicación web progresiva (PWA) diseñada para ayudar a parejas a gestionar sus ahorros compartidos, organizar presupuestos y cumplir metas financieras de forma colaborativa, transparente y en tiempo real.

## 🚀 Características Principales

- **Sincronización en Tiempo Real:** Base de datos reactiva que refleja los aportes de ambos usuarios al instante usando `onSnapshot` de Firestore.
- **Optimistic UI (UI Optimista):** Actualizaciones de interfaz instantáneas (0ms de latencia) al realizar aportes o crear metas, manejadas mediante estimación de *Server Timestamps* y Caché Local Persistente.
- **Gamificación y Recompensas:** Sistema de trofeos y medallas (SVG dinámicos) que se desbloquean al alcanzar hitos de ahorro para incentivar la constancia.
- **Widgets Sociales:** Paneles dinámicos de aniversarios y cumpleaños con cálculos de tiempo relativos e interfaces modo "celebración".
- **Responsive Design:** Interfaz "Mobile-First" fluida, construida con Tailwind CSS y componentes de UI modernos (Lucide Icons, Glassmorphism).

## 🛠️ Arquitectura y Stack Tecnológico

El proyecto está construido bajo una arquitectura moderna orientada al rendimiento y la experiencia de usuario:

- **Frontend Framework:** [Astro](https://astro.build/) - Elegido por su velocidad de carga (arquitectura de islas) y su flexibilidad para renderizar componentes.
- **Librería UI:** [React 18](https://react.dev/) - Utilizado para los componentes altamente interactivos (formularios, modales, animaciones de estado).
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) - Sistema de diseño basado en utilidades para mantener consistencia y un CSS bundle ultraligero.
- **Tipado:** [TypeScript](https://www.typescriptlang.org/) - Tipado estricto en toda la aplicación para modelos de datos (Goals, Contributions, Users) garantizando seguridad en el código.
- **Backend as a Service (BaaS):** [Firebase Firestore](https://firebase.google.com/) - Base de datos NoSQL con sincronización bidireccional y soporte *Offline-first*.

## 🧠 Buenas Prácticas Aplicadas (Ingeniería de Software)

- **Data Converters (Firebase):** Uso de `withConverter` de Firestore en conjunto con interfaces genéricas de TypeScript para garantizar *Type Safety* entre la base de datos y la UI. Evita el uso del tipo `any`.
- **Prevención de Fugas de Memoria (Memory Leaks):** Limpieza rigurosa de suscripciones web-sockets (`unsubscribe`) en los hooks `useEffect` de React para evitar re-renders infinitos.
- **Separation of Concerns:** Componentes de React modulares, mantenibles y atómicos, separando la lógica de la vista (ej. `Timeline.tsx`, `GoalDetail.tsx`).
- **Soporte Offline:** Configuración de `persistentMultipleTabManager` para que la aplicación no pierda datos ni se rompa si se pierde la conexión a internet.

## ⚙️ Configuración Local

Sigue estos pasos para correr el proyecto en tu máquina local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU-USUARIO/waiting-for-us.git
   cd waiting-for-us
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto y agrega tus credenciales de Firebase:
   ```env
   PUBLIC_FIREBASE_API_KEY="tu-api-key"
   PUBLIC_FIREBASE_AUTH_DOMAIN="tu-dominio"
   PUBLIC_FIREBASE_PROJECT_ID="tu-project-id"
   PUBLIC_FIREBASE_STORAGE_BUCKET="tu-bucket"
   PUBLIC_FIREBASE_MESSAGING_SENDER_ID="tu-sender-id"
   PUBLIC_FIREBASE_APP_ID="tu-app-id"
   ```

4. **Levantar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:4321](http://localhost:4321) en tu navegador para ver la aplicación.
