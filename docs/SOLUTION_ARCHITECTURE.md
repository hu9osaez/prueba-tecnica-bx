# Arquitectura de Solución

## Vista General

```
┌─────────────┐     HTTP      ┌─────────────┐     ┌─────────────┐
│  Frontend   │ ────────────> │   Backend   │ ───> │  MongoDB    │
│  Next.js    │               │   NestJS    │     │   Atlas     │
│  :3001      │               │   :3000     │     │             │
└─────────────┘               └─────────────┘     └─────────────┘
                                       │
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  External APIs  │
                              │  - Rick & Morty │
                              │  - Pokémon     │
                              │  - Superhéroes │
                              │  - Star Wars   │
                              └─────────────────┘
```

## Stack Tecnológico

**Frontend:**
- Next.js 16 + React 19
- TypeScript
- Tailwind CSS
- Custom hooks para lógica de negocio

**Backend:**
- NestJS 11
- TypeScript
- Mongoose (MongoDB ODM)
- MongoDB Atlas (cloud DB)

**DevOps:**
- Turborepo (monorepo)
- pnpm (package manager)

## Estructura del Proyecto

```
apps/
├── backend/src/
│   ├── characters/      # Obtiene personajes de APIs externas
│   ├── votes/           # Guarda votos en MongoDB
│   ├── sessions/        # Sesiones de votación (1 hora)
│   ├── statistics/      # Agregaciones de votos
│   ├── health/          # Health check
│   ├── external/        # Clients de APIs externas
│   └── common/          # Utilidades compartidas
│
└── frontend/
    ├── app/             # Páginas Next.js
    ├── components/      # Componentes React
    ├── hooks/           # Custom hooks (useSession, useVoting, etc.)
    └── lib/             # Cliente API
```

## Base de Datos

**Colecciones en MongoDB:**

```javascript
// votes
{
  _id: ObjectId,
  characterId: "uuid",
  characterName: "Pikachu",
  source: "pokemon",
  externalId: "25",
  vote: true,          // true = like, false = dislike
  createdAt: Date
}

// sessions
{
  _id: ObjectId,
  id: "uuid-v4",
  excludeIds: ["uuid1", "uuid2"],  // Personajes ya votados
  expiresAt: Date,                 // +1 hora desde creación
  createdAt: Date
}
```

## API Integradas

| Source | API | Client |
|--------|-----|--------|
| Rick & Morty | rickandmortyapi.com | RickAndMortyClient |
| Pokémon | pokeapi.co | PokemonClient |
| Superhéroes | superheroapi.com | SuperheroClient |
| Star Wars | akabab.github.io | StarWarsClient |

## Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Orígenes permitidos configurados
- **Rate Limiting**: 100 requests/minuto por IP
- **Validación**: class-validator en todos los DTOs
- **Error Handling**: Filtro global de excepciones

## Cache

- In-memory cache para respuestas de APIs externas
- TTL: 1 hora
- Key: `${source}:${characterId}`
