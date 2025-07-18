# SpotifyScope 🎵

**Advanced Spotify Music Analytics Platform**

## 📝 Descripción

SpotifyScope es una aplicación web profesional que ofrece análisis avanzados de datos musicales de Spotify. Combina funcionalidades públicas accesibles sin autenticación con un dashboard personalizado completo que requiere login, demostrando una arquitectura híbrida que maximiza la experiencia del usuario.

## 🎯 Características Principales

### Demo Mode (Público)
- Búsqueda de tracks y artistas
- Análisis de audio features
- Visualizaciones interactivas
- Preview de tracks

### Personal Mode (Autenticado)
- Dashboard personalizado
- Top tracks y artistas
- Análisis de patrones de escucha
- Recomendaciones personalizadas
- Insights predictivos

## 🛠️ Tecnologías

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- Redis para caché
- JWT + OAuth 2.0
- Spotify Web API

### Frontend
- React 18 + TypeScript
- Redux Toolkit
- TailwindCSS
- Framer Motion
- React Router v6

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Cuenta de desarrollador de Spotify

### Variables de Entorno
Crea un archivo `.env` en el directorio `back/` con:
```
DATABASE_URL="postgresql://user:password@localhost:5432/spotifyscope"
REDIS_URL="redis://localhost:6379"
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
JWT_SECRET=tu_jwt_secret
FRONTEND_URL=http://localhost:3000
```

### Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   # Backend
   cd back
   pnpm install
   
   # Frontend
   cd ../front
   pnpm install
   ```

3. Configuración de la base de datos:
   ```bash
   cd back
   npx prisma migrate dev
   ```

4. Iniciar los servicios:
   ```bash
   # En una terminal
   redis-server
   
   # En otra terminal (backend)
   cd back
   pnpm dev
   
   # En otra terminal (frontend)
   cd front
   pnpm dev
   ```

## 🔐 Configuración de Spotify API

1. Crear una aplicación en [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Obtener `Client ID` y `Client Secret`
3. Configurar Redirect URI: `http://localhost:3000/callback`
4. Añadir credenciales al archivo `.env`

## 🧪 Testing

### Backend
```bash
cd back
pnpm test                 # Ejecutar tests
pnpm run test:watch      # Tests en modo watch
pnpm run test:coverage   # Tests con coverage
```

### Frontend
```bash
cd front
pnpm test                 # Ejecutar tests
pnpm run test:watch      # Tests en modo watch
pnpm run test:coverage   # Tests con coverage
```

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT - Ver [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Luis Hernandez**
- GitHub: [@luuchoh](https://github.com/luuchoh)

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
