# Reto Técnico 

## Like o Dislike

### Descripción del Proyecto:
Desarrolla una aplicación que permita a los usuarios dar likes y dislikes a personajes de "Rick and Morty", Pokémon y superhéroes. La aplicación debe mostrar aleatoriamente un personaje de alguna categoría y permitir que los usuarios voten por ellos mediante botones de like o dislike. Una vez que se ha dado un voto, el personaje actual debe desaparecer, y se debe cargar un nuevo personaje aleatorio para ser evaluado.

### ¿Que voy a evaluar?
1. Que la documentación para levantar el proyecto (README) en mi local este hecha “for dummies”
2. Que pueda levantar el proyecto siguiento el paso a paso en el README (todos los pasos considerados)
3. Si hay credenciales de algun tipo, estas estan seteadas por medio de variables de entorno entregadas por mail
4. Que lo descrito como funcionalidad… ¡funcione!

### ¿Como entregar el reto?
- Se debe entregar por medio de un correo las url de todos los repositorios de github/gitlab necesarios para hacer funcionar la aplicación.
- En el correo deben estar los archivos de ambientes de ser necesarios

# HEY!
Lo anterior tiene que ver con cumplir con el objetivo de un producto, pero ahora, por debajo hay consideraciones que tomaré en cuenta para evaluar en el reto.

### Consideraciones Front-end:
- Muestra una interfaz clara y atractiva con la foto y el nombre del personaje
- Uso de componentes UI
- Incluye botones distintivos para "like" y "dislike"
- Microinteracciones (opcional PUNTOS EXTRA)
- Todas las fotos mantienen la misma relacion de aspecto (opcional PUNTOS EXTRA)
- Version para smartphone (opcional PUNTOS EXTRA)

### Consideraciones Back-end:
- Procesos para obtener información sobre los personajes de "Rick and Morty", Pokémon y Superhéroes de forma aleatoria (APIs en sección de Recursos)
- Endpoint para consultar por:
    - Personaje con mas like
    - Personaje con mas dislike
    - Ultimo personaje evaluado
    - Estatus de PIKACHU: quiero saber si pikachu (pokemon) existe en DB, los likes, dislike, etc etc (opcional PUNTOS EXTRA)
- Endpoint para sumar likes o sumar dislike a un personaje (opcional PUNTOS EXTRA)
- Manejo de errores (opcional PUNTOS EXTRA)
- Postman (opcional PUNTOS EXTRA)
- Agrega una API o personajes de otra fuente (opcional PUNTOS EXTRA)

### Consideraciones Seguridad:
- Donde sea y si es pertinente, incluir encriptación  (opcional PUNTOS EXTRA)
- Donde sea y si es pertinente, incluir configuracion de cors  (opcional PUNTOS EXTRA)
- Donde sea y si es pertinente, incluir ocultar datos en las llamadas  (opcional PUNTOS EXTRA)

### Consideraciones BD:
- Uso de Mongo atlas (servicio con capa gratuita) para guardar los like y dislike
- Documentación y ejemplos de documentos de mongo (opcional PUNTOS EXTRA)

### Consideraciones Git:
- Uso de conventional commit (opcional PUNTOS EXTRA)
- Commits separados segun desarrollo (opcional PUNTOS EXTRA)

### Consideraciones construcción y arquitectura:
- Diagramas de solución (opcional PUNTOS EXTRA)
- Diagramas de flujo (opcional PUNTOS EXTRA)
- Documentación sobre como funciona tu reto (opcional PUNTOS EXTRA)

### Consideraciones Pruebas:
- Agregar pruebas unitarias (opcional PUNTOS EXTRA)
- Agregar pruebas automatizadas de integración (opcional PUNTOS EXTRA)

## RECURSOS
- API de Rick y Morty: https://rickandmortyapi.com/
- Api de pokemon: https://pokeapi.co/
- Api de Superheroes: https://superheroapi.com/

# NOTAS FINALES
1. Este reto no espero que lo completes al 100% espero que definas tu, según el tiempo lo que puedes y no puedes hacer de toda la lista.
2. Las cosas que estan en la lista que no estan marcadas como PUNTOS EXTRA no significa que sea obligatorio, si para cumplir con el objetivo te tienes que saltar algunas reglas, asume el riesgo y defiendelo en el correo de la entrega.
3. Yo prefiero que esto se realice en java, javascript y/o typescript usando lo que definas que quieras usar; pero si tienes que adaptarte para cumplir con el objetivo principal, haslo y usa cualquier tecnologia con la que logres el objetivo.
4. Concentrate en el objetivo que esta en la “Descripción del Proyecto”.
5. Si tienes dudas puedo apoyarte via mail, pero si resuelves y me cuentas que fue lo que paso ¡PUNTOS EXTRA!.
6. Sobre la documentación para correr el proyecto en mi local, no des por sentado que tengo o no algo instalado en mi maquina, usa links de tutoriales, links de videos, has tu los paso a paso, pero deja toda la documentación necesaria para que cualquier persona pueda instalar, hacer correr y disfrutar de tu proyecto.
7. Sea lo que sea que decidas entregarme, que sea el codigo y el nivel que te represente.

