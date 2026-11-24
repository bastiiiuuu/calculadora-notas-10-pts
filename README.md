# Calculadora de notas ponderadas

Un ejercicio académico en React para calcular promedios de notas en escala 1,0 a 7,0 y estimar la nota necesaria en el porcentaje pendiente.

[Código](https://github.com/bastiiiuuu/calculadora-notas-10-pts) · [Demostración](https://bastiiiuuu.github.io/calculadora-notas-10-pts/)

## Qué se puede revisar

Calcular el mínimo requerido redondeando hacia arriba al siguiente decimal para no recomendar una nota insuficiente. La interfaz separa componentes visuales de las funciones que concentran las reglas o la persistencia. Las pruebas cubren casos de fallo concretos.

## Tecnologías

JavaScript, React, Vite, CSS, ESLint, node:test y GitHub Actions. Los componentes están escritos en JSX, no en TypeScript.

## Instalación

Requiere Node.js 24 LTS y npm.

```sh
git clone https://github.com/bastiiiuuu/calculadora-notas-10-pts.git
cd calculadora-notas-10-pts
npm ci
npm run dev
```

Abre la dirección que indica Vite. Para generar la versión estática:

```sh
npm test
npm run lint
npm run build
npm run preview
```

## Recorrido de demostración

Ingresar nota 4,0 con peso 33 %. La nota recomendada para el 67 % restante debe ser 4,0, porque 3,9 produciría un promedio de 3,933, menor que 3,95.

## Cómo está organizado

- `src/App.jsx` conecta los estados y componentes de la pantalla.
- `src/gradeMath.js` concentra la parte que necesita verificación independiente.
- `tests/` contiene pruebas ejecutables con Node.js, sin un servicio externo.
- `.github/workflows/pages.yml` verifica pruebas, lint y build antes de publicar `dist/`.

## Alcance y límites

Supone aprobación desde 3,95 antes de redondear el promedio. Es una regla del ejercicio, no una política oficial de INACAP. No guarda datos ni reemplaza el sistema académico.

Los datos ingresados se consideran no confiables. El contenido del usuario se presenta mediante el escape de React, sin interpretar cadenas como HTML.

## Publicación

GitHub Pages utiliza el workflow incluido y debe estar configurado con origen GitHub Actions. `base: './'` permite servir los recursos bajo el nombre del repositorio. La compilación local no demuestra por sí sola que una publicación remota haya finalizado.

## Contexto

Proyecto académico incluido en un portafolio de formación. Las mejoras de documentación, pruebas y correcciones se prepararon con asistencia de IA. No se presenta como experiencia laboral ni como producto comercial.
