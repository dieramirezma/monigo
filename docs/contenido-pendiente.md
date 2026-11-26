# Contenido pendiente: verificación en campo y fotos

MoniGo no publica como hecho nada que no esté verificado. Hoy **todas las láminas están en estado `review`**: muestran la esquina perforada ("por verificar en campo"). Esta es la lista de trabajo para pasarlas a `published`.

## 1. Verificación por lámina

Para cada lugar, en `packages/content/src/data.ts`:

- [ ] Confirmar la ubicación (las coordenadas de OSM pueden ser aproximadas) o tomarla con GPS.
- [ ] Acceso: a pie, en carro o mixto; estado del camino; si es finca privada y hay que pedir permiso.
- [ ] `swimming`: solo `true` si es seguro nadar (y en qué época).
- [ ] Mejor hora y tiempo de visita.
- [ ] Al terminar: `status: "published"` y `verifiedAt: "AAAA-MM-DD"` (el schema lo exige).

### Sin coordenadas todavía (no aparecen en el mapa)

| Nº | Lugar | Nota |
|---|---|---|
| 01 | Cascada Real | ~25 m según la Alcaldía; ubicar |
| 07 | Salto de Los Micos | no confundir con el de Barichara |
| 08 | Salto de Las Golondrinas | en OSM existe "Hotel Las Golondrinas" (5.847, -73.521); ¿está cerca? |
| 09 | Quebrada La Sicha | |
| 11 | Río Moniquirá | la foto es del tramo entre Gachantivá y Santa Sofía |
| 15 | PNR Serranía del Peligro | |
| 26 | Cueva de las momias | en borrador; ¿es la misma de Pueblo Viejo? Acceso responsable |
| 21–22 | Mute / panela | gastronomía: ¿asociarlos a un restaurante o trapiche concreto? |
| 25 | Comfaboy | |

### Dudas abiertas de la investigación

- El "parque natural de las 7 cascadas" con lajas-tobogán y entrada gratis (Pulzo, 2025): ¿cuál es su nombre real?
- La Chorrera (OSM 5.935, -73.481) queda en **Togüí**, no en Moniquirá, y se dejó fuera.
- Paso del Ángel es de Santa Sofía; se dejó fuera.
- Fechas exactas de las fiestas de cada año (Alcaldía).

## 2. Fotos

Reglas: solo fotos con licencia o con permiso escrito. **Nunca** fotos de Google Maps (son de quienes las subieron y los términos de Google prohíben extraerlas). Cada foto queda en `packages/content/media/manifest.json` con autor, fuente y licencia.

Hoy hay 6 fotos con licencia (Wikimedia Commons): Basílica (CC BY-SA 4.0), parque principal ×4 (CC BY-SA 3.0), Río Moniquirá (CC0). Ninguna de cascadas.

### Lista de tomas para Diego (prioridad)

1. Cascada El Cajón, Salto de Pómeca, Salto del Zorro (Ruta de las Cascadas)
2. Alto del Granadillo al amanecer (vertical y horizontal)
3. Fábrica de bocadillo: hojas de bijao, cajitas, el corte del bocadillo
4. Termales El Salitre
5. Un plato de mute moniquireño

Formato: vertical 4:5 para la lámina y una horizontal para la galería; mínimo 2400 px por el lado largo.

## 3. Solicitud de permiso de fotos (plantilla)

> **Asunto:** Autorización de uso de fotografías turísticas de Moniquirá — proyecto MoniGo
>
> Respetados señores de la Alcaldía de Moniquirá / Secretaría de Turismo de Boyacá:
>
> Soy moniquireño y estoy desarrollando MoniGo, una guía web gratuita y sin ánimo de lucro de los atractivos turísticos de Moniquirá, publicada en https://monigo.dieramirezma.dev.
>
> Solicito autorización para reproducir en el sitio las fotografías del portafolio turístico "Moniquirá, naturalmente dulce" y de los canales oficiales del municipio, con el crédito del autor y de la entidad en cada imagen, sin modificar su contenido y sin uso comercial.
>
> Agradezco indicarme el nombre del autor de cada fotografía y la forma de crédito que prefieran.
>
> Cordialmente,
> Diego Ramírez
