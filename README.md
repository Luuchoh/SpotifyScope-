# SpotifyScope 🎵

**Advanced Spotify Music Data Analysis Dashboard**

SpotifyScope es una aplicación web profesional que ofrece análisis avanzados de datos musicales de Spotify. Combina funcionalidades públicas accesibles sin autenticación con un dashboard personalizado completo que requiere login, demostrando una arquitectura híbrida que maximiza la experiencia del usuario y showcasea habilidades técnicas de nivel senior.

## ✨ Propósito Principal

- **Demo Mode**: Análisis musical público para atraer usuarios y demostrar capacidades
- **Personal Mode**: Dashboard completo con insights profundos sobre hábitos musicales personales
- **Showcase Técnico**: Demostrar expertise en arquitectura moderna, APIs externas, y análisis de datos

## 🚀 Características Principales

### 🎯 Demo Mode (Público)
- ✅ Búsqueda de tracks y artistas sin autenticación
- ✅ Análisis de audio features en tiempo real
- ✅ Visualizaciones interactivas de datos musicales
- ✅ Análisis de popularidad y características técnicas
- ✅ Preview de tracks y enlaces a Spotify

### 🔐 Personal Mode (Autenticado)
- ✅ OAuth completo con Spotify
- ✅ Dashboard personalizado con métricas avanzadas
- ✅ Top tracks y artistas por período de tiempo
- ✅ Análisis de patrones de escucha
- ✅ Perfil musical con diversidad y mood
- ✅ Historial de reproducción reciente
- ✅ Recomendaciones personalizadas
- ✅ Insights predictivos sobre gustos musicales

### 🎨 UI/UX Features
- ✅ Diseño inspirado en Spotify (dark theme)
- ✅ Responsive design para todos los dispositivos
- ✅ Animaciones fluidas con Framer Motion
- ✅ Iconografía consistente con Lucide React
- ✅ Sistema de colores y tipografía profesional

## 🛠️ Stack Tecnológico

### Backend Architecture
- **Core Framework**: Node.js con Express.js y TypeScript
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Cache & Sessions**: Redis con TTL configurables
- **Autenticación**: JWT + OAuth 2.0 (Spotify)
- **Security**: Helmet, CORS, Rate Limiting, Input Validation
- **API Integration**: Spotify Web API con manejo de tokens
- **Analytics**: Procesamiento de datos musicales avanzado

### Frontend Architecture
- **Framework**: React 18 con TypeScript
- **State Management**: Redux Toolkit con async thunks
- **Routing**: React Router v6 con protección de rutas
- **UI Framework**: TailwindCSS con sistema de diseño custom
- **HTTP Client**: Axios con interceptores para auth
- **Animations**: Framer Motion para transiciones
- **Icons**: Lucide React para consistencia visual

## 📁 Estructura del Proyecto

```
SpotifyScope/
├── back/                     # Backend API
│   ├── src/
│   │   ├── controllers/      # Auth & Music controllers
│   │   ├── services/         # Spotify, Cache, Analytics
│   │   ├── middleware/       # Auth, Rate limiting
│   │   ├── routes/          # API endpoints
│   │   ├── config/          # Database, Redis config
│   │   └── app.ts           # Express app setup
│   ├── prisma/              # Database schema
│   └── package.json         # Backend dependencies
├── front/                   # Frontend React App
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── Layout/      # Header, Layout components
│   │   ├── pages/           # Main application pages
│   │   │   ├── LandingPage.tsx
│   │   │   ├── DemoPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Login.tsx
│   │   ├── store/           # Redux store & slices
│   │   │   ├── authSlice.ts
│   │   │   ├── musicSlice.ts
│   │   │   └── index.ts
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   └── App.tsx          # Main app component
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json         # Frontend dependencies
└── README.md               # Este archivo
```

## 🔧 Configuración e Instalación

### Prerrequisitos
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Cuenta de desarrollador de Spotify

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd SpotifyScope
```

### 2. Configurar Backend
```bash
cd back
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Configurar base de datos
npx prisma generate
npx prisma db push

# Iniciar servidor de desarrollo
npm run dev
```

### 3. Configurar Frontend
```bash
cd ../front
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# Iniciar aplicación
npm start
```

### 4. Configurar Spotify API
1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una nueva aplicación
3. Configura las Redirect URIs:
   - `http://localhost:3000/auth/callback`
4. Copia Client ID y Client Secret al archivo `.env`

## 🌐 Variables de Entorno

### Backend (.env)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/spotifyscope"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/callback

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
REACT_APP_FRONTEND_URL=http://localhost:3000
```

## 🚀 Uso de la Aplicación

### Demo Mode
1. Visita `http://localhost:3000/demo`
2. Busca cualquier track o artista
3. Explora análisis detallados sin necesidad de login
4. Ve características de audio, popularidad y más

### Personal Mode
1. Haz clic en "Login with Spotify" desde la landing page
2. Autoriza la aplicación en Spotify
3. Explora tu dashboard personalizado con:
   - Análisis de tus hábitos de escucha
   - Top tracks y artistas por período
   - Patrones de escucha por hora y día
   - Recomendaciones personalizadas
   - Métricas de diversidad musical

## 🏗️ Arquitectura del Sistema

### Flujo de Autenticación
1. **OAuth Flow**: Spotify OAuth 2.0 con PKCE
2. **JWT Tokens**: Almacenados en cookies httpOnly
3. **Session Management**: Redis para persistencia
4. **Auto-refresh**: Renovación automática de tokens

### Gestión de Datos
1. **Spotify API**: Client Credentials + Authorization Code flows
2. **Caching Strategy**: Redis con TTL por tipo de dato
3. **Analytics Processing**: Análisis en tiempo real de datos musicales
4. **Database**: PostgreSQL para usuarios y snapshots analíticos

### Seguridad
- ✅ Helmet para headers de seguridad
- ✅ CORS configurado con whitelist
- ✅ Rate limiting por IP
- ✅ Input validation con Joi
- ✅ JWT con expiración y refresh
- ✅ Cookies httpOnly y secure

## 📊 Características Técnicas Avanzadas

### Analytics Engine
- **Diversity Score**: Cálculo de variedad musical
- **Mood Profiling**: Análisis de valencia y energía
- **Listening Patterns**: Patrones temporales de escucha
- **Genre Analysis**: Distribución y tendencias de géneros
- **Predictive Insights**: Recomendaciones basadas en ML

### Performance Optimizations
- **Redis Caching**: TTL específicos por tipo de dato
- **API Rate Limiting**: Respeto a límites de Spotify API
- **Lazy Loading**: Componentes y rutas cargadas bajo demanda
- **Memoization**: React.memo y useMemo para optimización
- **Bundle Splitting**: Code splitting automático

## 🎯 Roadmap Futuro

- [ ] WebSocket para actualizaciones en tiempo real
- [ ] Análisis de playlists colaborativas
- [ ] Comparación social de gustos musicales
- [ ] Exportación de datos y reportes
- [ ] Integración con otras plataformas musicales
- [ ] Machine Learning para predicciones avanzadas
- [ ] PWA con funcionalidades offline

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Reconocimientos

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) por los datos musicales
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de diseño
- [Lucide](https://lucide.dev/) por los iconos
- [Framer Motion](https://www.framer.com/motion/) por las animaciones

---

**SpotifyScope** - Transformando datos musicales en insights significativos 🎵✨
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
