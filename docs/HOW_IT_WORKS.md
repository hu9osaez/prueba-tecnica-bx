# Cómo Funciona el Reto

## Idea Principal

Una app donde votas si te gustan o no personajes de diferentes universos. Cada vez que votas, aparece un nuevo personaje. Los votos se guardan en MongoDB y puedes consultar estadísticas.

## Flujo Básico

1. **Usuario abre la app** → Se crea una sesión de votación (dura 1 hora)
2. **App pide personaje** → Backend busca uno que NO hayas votado en esta sesión
3. **Usuario vota** → Se guarda en MongoDB + se agrega a la lista de "ya votados"
4. **App pide siguiente** → Ciclo se repite

## Por Qué Sesiones en MongoDB

Antes usaba localStorage para guardar IDs de personajes votados, pero:
- La URL se hacía muy larga
- localStorage tiene límite de espacio
- No compartía estado entre dispositivos

Ahora el backend maneja las sesiones:
```javascript
{
  id: "uuid-v4",
  excludeIds: ["id1", "id2", ...],  // IDs votados en esta sesión
  expiresAt: Date + 1 hora
}
```

MongoDB las elimina automáticamente cuando expiran (TTL index).

## Cómo Evita Repeticiones

Cuando pides un personaje random:
```javascript
GET /characters/random?sessionId=xxx
```

El backend:
1. Busca la sesión en MongoDB
2. Obtiene el array `excludeIds`
3. Filtra personajes que NO estén en ese array
4. Si uno falla, prueba con otra API externa

## APIs Externas

Uso 4 fuentes, con fallback si una falla:

| API | URL | Qué devuelve |
|-----|-----|--------------|
| Rick & Morty | rickandmortyapi.com | Personajes del show |
| Pokémon | pokeapi.co | Pokémons con sprites |
| Superhéroes | superheroapi.com | Héroes de DC/Marvel |
| Star Wars | akabab.github.io | Personajes de SW |

Todas se transforman a formato común:
```javascript
{
  id: "uuid-generado",
  name: "Pikachu",
  image: "https://...",
  source: "pokemon",
  externalId: "25"  // ID original de la API
}
```

## Estadísticas

Todo es agregación de MongoDB:

**Most Liked:**
```javascript
[
  { $group: { _id: "$characterId", likes: { $sum: { $cond: ["$vote", true, 0] } } } },
  { $sort: { likes: -1 } },
  { $limit: 1 }
]
```

**Pikachu Status:**
```javascript
findOne({ source: 'pokemon', externalId: '25' })
// Si existe, calcula likes, dislikes, porcentaje y ranking
```

## Cache

Para no golpear las APIs externas todo el tiempo:
- Cache en memoria (Map)
- Key: `character:id`
- TTL: 1 hora

## Seguridad

- **CORS**: Solo permite peticiones desde orígenes configurados
- **Helmet**: Headers de seguridad (X-XSS-Protection, etc.)
- **Rate Limiting**: 100 requests/minuto por IP
- **Validation**: DTOs con class-validator

## Bonus Features

1. **Sesiones MongoDB**: Backend maneja excludeIds, expiran en 1 hora
2. **Pikachu endpoint**: `GET /statistics/pikachu-status`
3. **Star Wars API**: 4ta fuente de personajes
4. **Skeletons**: Estados de carga mientras cargan imágenes
5. **Coverage visual**: `pnpm test:cov:open` abre reporte en navegador
6. **Responsive**: Mobile-first, funciona en smartphone
7. **Microinteracciones**: Hover effects, transiciones suaves
8. **Imágenes estandarizadas**: Todas 1:1 con StandardizedImage component
9. **Unit tests**: Cobertura de servicios principales

## Tecnologías

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: NestJS 11, Mongoose, MongoDB Atlas
- **Tests**: Jest con coverage visual
- **Monorepo**: Turborepo + pnpm
