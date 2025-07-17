# SpotifyScope 🎵

**Advanced Spotify Music Data Analysis Dashboard**

SpotifyScope es una aplicación web profesional que ofrece análisis avanzados de datos musicales de Spotify. Combina funcionalidades públicas accesibles sin autenticación con un dashboard personalizado completo que requiere login, demostrando una arquitectura híbrida que maximiza la experiencia del usuario.

## 🚀 Características Principales

### Demo Mode
- Análisis musical público para atraer usuarios
- Visualizaciones interactivas sin necesidad de login
- Demostración de capacidades de análisis

### Personal Mode
- Dashboard completo con insights profundos
- Análisis personalizado de hábitos musicales
- Insights predictivos sobre gustos musicales
- Experiencia fluida desde demo público hasta dashboard personal

## 🛠️ Stack Tecnológico

### Backend Architecture
- **Core Framework**: Node.js 22+ con Express.js
- **Lenguaje**: TypeScript 5.6 (strict mode)
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Cache**: Redis para sesiones y datos de Spotify
- **Queue System**: Bull para tareas en background
- **Logging**: Winston con structured logging
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS, Rate Limiting

### Frontend Architecture
- **Framework**: React 18 con TypeScript
- **Build Tool**: Vite con HMR y code splitting
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **UI Framework**: TailwindCSS con design system
- **Charts**: Recharts + D3.js para visualizaciones
- **Animations**: Framer Motion
- **HTTP Client**: Axios con interceptors
- **Testing**: Jest + React Testing Library

## 📁 Estructura del Proyecto

```
CASTOR/
├── back/                 # Backend API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── eslint.config.js
├── front/               # Frontend React App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── jest.config.js
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 22+
- PostgreSQL 14+
- Redis 6+
- Cuenta de Spotify Developer

### Backend Setup

1. **Navegar al directorio backend**
   ```bash
   cd back
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Configurar base de datos**
   ```bash
   pnpm run db:generate
   pnpm run db:push
   pnpm run db:seed
   ```

5. **Ejecutar en desarrollo**
   ```bash
   pnpm run dev
   ```

### Frontend Setup

1. **Navegar al directorio frontend**
   ```bash
   cd front
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   pnpm run dev
   ```

## 🧪 Testing

### Backend Tests
```bash
cd back
pnpm test                 # Ejecutar tests
pnpm run test:watch      # Tests en modo watch
pnpm run test:coverage   # Tests con coverage
```

### Frontend Tests
```bash
cd front
pnpm test                 # Ejecutar tests
pnpm run test:watch      # Tests en modo watch
pnpm run test:coverage   # Tests con coverage
```

## 🔧 Scripts Disponibles

### Backend
- `pnpm run dev` - Desarrollo con hot reload
- `pnpm run build` - Build para producción
- `pnpm run start` - Ejecutar build de producción
- `pnpm run lint` - Linting con ESLint
- `pnpm run db:generate` - Generar cliente Prisma
- `pnpm run db:migrate` - Ejecutar migraciones

### Frontend
- `pnpm run dev` - Desarrollo con Vite
- `pnpm run build` - Build para producción
- `pnpm run preview` - Preview del build
- `pnpm run lint` - Linting con ESLint
- `pnpm run type-check` - Verificación de tipos

## 🔐 Configuración de Spotify API

1. Crear una aplicación en [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Obtener `Client ID` y `Client Secret`
3. Configurar Redirect URI: `http://localhost:3000/callback`
4. Añadir credenciales al archivo `.env`

## 🌟 Características Técnicas

### Seguridad
- Helmet para headers de seguridad
- CORS configurado
- Rate limiting
- Validación con Zod
- JWT para autenticación

### Performance
- Code splitting automático
- Lazy loading de componentes
- Optimización de bundles
- Cache con Redis
- Compresión gzip

### Desarrollo
- Hot Module Replacement
- TypeScript strict mode
- ESLint + Prettier
- Husky pre-commit hooks
- Structured logging

## 📊 Análisis y Visualizaciones

- **Top Tracks**: Canciones más escuchadas
- **Artists Analytics**: Análisis de artistas favoritos
- **Genre Distribution**: Distribución por géneros
- **Listening Patterns**: Patrones de escucha
- **Audio Features**: Análisis de características de audio
- **Recommendations**: Recomendaciones personalizadas

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Luis Hernandez**
- GitHub: [@luishernandez](https://github.com/luishernandez)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
