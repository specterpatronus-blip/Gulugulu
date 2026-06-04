/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           GULUGULU — SVG ICON ENGINE v1.2                    ║
 * ║  Replaces Unicode emojis with consistent, beautiful SVGs.    ║
 * ║  Works with Vanilla JS + Vue 3. No dependencies.             ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Usage:
 *   GIconEngine.render('cactus', { size: 48, color: '#10B981' })
 *   GIconEngine.html('star')  → returns SVG string for v-html
 *   GIconEngine.fromEmoji('🌵') → 'cactus'
 */

(function (global) {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // 1.5 IMAGE ASSETS — High quality replacements
  // ─────────────────────────────────────────────────────────────
  const IMAGES = {
    'sprout': '/static/images/minijuegos/brote.webp',
    'owl': '/static/images/minijuegos/buho.png',
    'camel': '/static/images/minijuegos/camello.png',
    'heart': '/static/images/minijuegos/corazon.png',
    'sphere': '/static/images/minijuegos/esfera.webp',
    'star': '/static/images/minijuegos/estrella.png',
    'flower': '/static/images/minijuegos/flor.png',
    'leaf': '/static/images/minijuegos/hoja.png',
    'coin': '/static/images/minijuegos/moneda.webp',
    'polar_bear': '/static/images/minijuegos/oso polar.png',
    'dog': '/static/images/minijuegos/perro.png',
    'seed': '/static/images/minijuegos/semilla.png',
    'question': '/static/images/minijuegos/signo interrogacion.png',
    'shark': '/static/images/minijuegos/tiburon.png',
    'clock': '/static/images/minijuegos/reloj gif.gif',
    'apple': '/static/images/minijuegos/manzana.png',
    'girl': '/static/images/minijuegos/niña.png',
    'jump': '/static/images/minijuegos/saltar.webp',
    'run': '/static/images/minijuegos/corre.webp',
    'blue': '/static/images/minijuegos/azul.webp',
    'circle': '/static/images/minijuegos/circulo.png',
    'square': '/static/images/minijuegos/cuadrado.jpg',
    'triangle': '/static/images/minijuegos/triangulo.png'
  };

  const CACHE = {};

  // ─────────────────────────────────────────────────────────────
  // 1. SVG PATHS — Each icon is a clean, minimalista path.
  //    Design principles: rounded, friendly, 24x24 grid.
  //    Colors use `currentColor` for dynamic theming.
  // ─────────────────────────────────────────────────────────────
  const SVG_DEFS = {

    /* ── NATURE & PLANTS ──────────────────────── */
    plant: {
      label: 'Planta',
      color: '#22c55e',
      paths: [
        { d: 'M12 20V10', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
        { d: 'M12 10C12 10 8 8 8 4C8 4 10 6 12 6C14 6 16 4 16 4C16 8 12 10 12 10Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 14C12 14 9 13 8 10C8 10 10 11 12 11C14 11 16 10 16 10C15 13 12 14 12 14Z', fill: 'currentColor', stroke: 'none', opacity: 0.75 },
      ]
    },

    seed: {
      label: 'Semilla',
      color: '#a16207',
      paths: [
        { d: 'M12 20V15', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' },
        { d: 'M12 15C10 15 9 14 9 12C9 10 10.5 9 12 9C13.5 9 15 10 15 12C15 14 14 15 12 15Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M6 20H18', stroke: '#854d0e', fill: 'none', sw: 2, lc: 'round' }
      ]
    },

    sprout: {
      label: 'Brote',
      color: '#4ade80',
      paths: [
        { d: 'M12 20V12', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' },
        { d: 'M12 12Q9 10 7 12Q9 14 12 12Q15 10 17 12Q15 14 12 12', fill: 'currentColor', stroke: 'none' }
      ]
    },

    leaf: {
      label: 'Hoja',
      color: '#16a34a',
      paths: [
        { d: 'M12 21C12 21 4 16 4 10C4 6.7 7.6 4 12 4C16.4 4 20 6.7 20 10C20 16 12 21 12 21Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 21V10M12 10C12 10 9 12 7 10', stroke: '#fff', fill: 'none', sw: 1.5, lc: 'round', opacity: 0.6 },
      ]
    },

    flower: {
      label: 'Flor',
      color: '#f472b6',
      paths: [
        { d: 'M12 9C12 9 14.5 6 18 6C18 6 17 9.5 12 9Z', fill: '#fb923c', stroke: 'none' },
        { d: 'M12 9C12 9 9.5 6 6 6C6 6 7 9.5 12 9Z', fill: '#fb923c', stroke: 'none' },
        { d: 'M12 9C12 9 14.5 12 14 15.5C14 15.5 11 14 12 9Z', fill: '#fb923c', stroke: 'none' },
        { d: 'M12 9C12 9 9.5 12 10 15.5C10 15.5 13 14 12 9Z', fill: '#fb923c', stroke: 'none' },
        { d: 'M12 9C12 9 12 5.5 12 4C12 4 14.5 6 12 9Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 9C12 9 12 12.5 12 15C12 15 9.5 13 12 9Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 9C9.8 9 8 10.8 8 13C8 15.2 9.8 17 12 17C14.2 17 16 15.2 16 13C16 10.8 14.2 9 12 9Z', fill: '#fbbf24', stroke: 'none' },
      ]
    },

    /* ── ANIMALS ──────────────────────────────── */
    caterpillar: {
      label: 'Oruga',
      color: '#84cc16',
      paths: [
        { d: 'M4 14C4 12.3 5.3 11 7 11C8.7 11 10 12.3 10 14C10 15.7 8.7 17 7 17C5.3 17 4 15.7 4 14Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M9 13C9 11.3 10.3 10 12 10C13.7 10 15 11.3 15 13C15 14.7 13.7 16 12 16C10.3 16 9 14.7 9 13Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M14 12C14 10.3 15.3 9 17 9C18.7 9 20 10.3 20 12C20 13.7 18.7 15 17 15C15.3 15 14 13.7 14 12Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M17 9L19 7', stroke: 'currentColor', fill: 'none', sw: 1.5, lc: 'round' },
        { d: 'M17 9L18 7', stroke: 'currentColor', fill: 'none', sw: 1.5, lc: 'round' },
      ]
    },

    frog: {
      label: 'Rana',
      color: '#4ade80',
      paths: [
        { d: 'M12 18C8 18 5 15.3 5 12C5 8.7 8 6 12 6C16 6 19 8.7 19 12C19 15.3 16 18 12 18Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M8 6C8 4 6 3 6 3C6 5 7 6 8 6Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M16 6C16 4 18 3 18 3C18 5 17 6 16 6Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M9 11C9 10.4 9.4 10 10 10C10.6 10 11 10.4 11 11C11 11.6 10.6 12 10 12C9.4 12 9 11.6 9 11Z', fill: '#1a2e35', stroke: 'none' },
        { d: 'M13 11C13 10.4 13.4 10 14 10C14.6 10 15 10.4 15 11C15 11.6 14.6 12 14 12C13.4 12 13 11.6 13 11Z', fill: '#1a2e35', stroke: 'none' },
        { d: 'M9 14.5Q12 16.5 15 14.5', stroke: '#1a2e35', fill: 'none', sw: 1.5, lc: 'round' },
      ]
    },

    eagle: {
      label: 'Águila',
      color: '#92400e',
      paths: [
        { d: 'M12 5L4 13H8L6 20H12L12 13L12 20H18L16 13H20L12 5Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 5L10 8H14L12 5Z', fill: '#fbbf24', stroke: 'none' },
      ]
    },

    shark: {
      label: 'Tiburón',
      color: '#475569',
      paths: [
        { d: 'M2 17C6 17 9 15 12 11C13 8 16 5 19 5C17 9 16 13 19 16C15 16 10 18 2 17Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 11L15 6L14 12', fill: 'currentColor', stroke: 'none' },
        { d: 'M2 17C6 18 10 18 14 17', stroke: '#0284c7', fill: 'none', sw: 2, lc: 'round' }
      ]
    },

    owl: {
      label: 'Búho',
      color: '#78350f',
      paths: [
        { d: 'M12 4C8 4 6 7 6 12C6 16 8 20 12 20C16 20 18 16 18 12C18 7 16 4 12 4Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M9 10C9 8.9 9.9 8 11 8C12.1 8 13 8.9 13 10C13 11.1 12.1 12 11 12C9.9 12 9 11.1 9 10Z', fill: '#fff', stroke: 'none' },
        { d: 'M13 10C13 8.9 13.9 8 15 8C16.1 8 17 8.9 17 10C17 11.1 16.1 12 15 12C13.9 12 13 11.1 13 10Z', fill: '#fff', stroke: 'none' },
        { d: 'M11 10C11 9.4 11.4 9 12 9C12.6 9 13 9.4 13 10C13 10.6 12.6 11 12 11C11 11.6 11.4 12 11 10Z', fill: '#000', stroke: 'none' },
        { d: 'M14 10C14 9.4 14.4 9 15 9C15.6 9 16 9.4 16 10C16 10.6 15.6 11 15 11C14.4 11 14 10.6 14 10Z', fill: '#000', stroke: 'none' },
        { d: 'M12 12L11 14H13L12 12Z', fill: '#f59e0b', stroke: 'none' }
      ]
    },

    camel: {
      label: 'Camello',
      color: '#b45309',
      paths: [
        { d: 'M4 17V12C4 12 6 9 9 9C11 9 12 11 14 11C16 11 18 7 20 7C21 7 22 9 20 12C19 13 18 17 18 17H4Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M6 17V21M9 17V21M13 17V21M16 17V21', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' }
      ]
    },

    polar_bear: {
      label: 'Oso Polar',
      color: '#cbd5e1',
      paths: [
        { d: 'M12 5C7.5 5 5 8 5 13C5 17 8 19 12 19C16 19 19 17 19 13C19 8 16.5 5 12 5Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M8 6C6.5 6 6 7 6 7C6 7 6.5 8 8 8C9.5 8 9.5 6 8 6Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M16 6C14.5 6 14 7 14 7C14 7 14.5 8 16 8C17.5 8 17.5 6 16 6Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M10 12C10 11.4 10.4 11 11 11C11.6 11 12 11.4 12 12C12 12.6 11.6 13 11 13C10.4 13 10 12.6 10 12Z', fill: '#0f172a', stroke: 'none' },
        { d: 'M14 12C14 11.4 14.4 11 15 11C15.6 11 16 11.4 16 12C16 12.6 15.6 13 15 13C14.4 13 14 12.6 14 12Z', fill: '#0f172a', stroke: 'none' },
        { d: 'M11 15C11 15 12 16 13 16C14 16 15 15 15 15', stroke: '#0f172a', fill: 'none', sw: 1.5, lc: 'round' }
      ]
    },

    whale: {
      label: 'Ballena',
      color: '#0284c7',
      paths: [
        { d: 'M2 13C2 13 5 9 12 9C18 9 22 12 22 15C22 16.5 20 17 18 17C12 17 6 15 2 13Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M22 15L24 13M22 15L24 17', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' },
        { d: 'M12 9Q12 6 11 4M12 9Q13 6 14 4', stroke: '#bae6fd', fill: 'none', sw: 1.5, lc: 'round' }
      ]
    },

    lion: {
      label: 'León',
      color: '#d97706',
      paths: [
        { d: 'M12 2C6.5 2 4 4.5 4 10C4 15.5 6.5 18 12 18C17.5 18 20 15.5 20 10C20 4.5 17.5 2 12 2Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 5C8.7 5 7 6.5 7 10C7 13.5 8.7 15 12 15C15.3 15 17 13.5 17 10C17 6.5 15.3 5 12 5Z', fill: '#f59e0b', stroke: 'none' },
        { d: 'M10 9.5C10 9 10.4 8.5 11 8.5C11.6 8.5 12 9 12 9.5C12 10 11.6 10.5 11 10.5C10.4 10.5 10 10 10 9.5Z', fill: '#000', stroke: 'none' },
        { d: 'M13 9.5C13 9 13.4 8.5 14 8.5C14.6 8.5 15 9 15 9.5C15 10 14.6 10.5 14 10.5C13.4 10.5 13 10 13 9.5Z', fill: '#000', stroke: 'none' },
        { d: 'M11 12H13', stroke: '#000', fill: 'none', sw: 1.5, lc: 'round' }
      ]
    },

    jaguar: {
      label: 'Jaguar',
      color: '#ca8a04',
      paths: [
        { d: 'M12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M9 10C9 9.5 9.4 9 10 9C10.6 9 11 9.5 11 10C11 10.6 10.6 11 10 11C9.4 11 9 10.6 9 10Z', fill: '#000', stroke: 'none' },
        { d: 'M13 10C13 9.5 13.6 9 14.2 9C14.8 9 15.2 9.5 15.2 10C15.2 10.6 14.8 11 14.2 11C13.6 11 13 10.6 13 10Z', fill: '#000', stroke: 'none' },
        { d: 'M6 8L8 9M18 8L16 9', stroke: '#78350f', fill: 'none', sw: 1.5, lc: 'round' },
        { d: 'M6 14H8M7 16H9M17 14H15M16 16H14', stroke: '#000', fill: 'none', sw: 1.2, lc: 'round' }
      ]
    },

    cactus: {
      label: 'Cactus',
      color: '#15803d',
      paths: [
        { d: 'M12 22V6C12 4.3 13.3 3 15 3C16.7 3 18 4.3 18 6V22', stroke: 'currentColor', fill: 'none', sw: 3, lc: 'round' },
        { d: 'M12 12H7C5.3 12 4 10.7 4 9C4 7.3 5.3 6 7 6V11', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
        { d: 'M12 15H17C18.7 15 20 13.7 20 12C20 10.3 18.7 9 17 9V14', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' }
      ]
    },

    dog: {
      label: 'Perro',
      color: '#b45309',
      paths: [
        { d: 'M12 5C8.1 5 6 7.5 6 12C6 16.5 8.1 19 12 19C15.9 19 18 16.5 18 12C18 7.5 15.9 5 12 5Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M4 8C4 8 5 13 7 13C9 13 8 8 8 8C8 8 6 6 4 8Z', fill: '#78350f', stroke: 'none' },
        { d: 'M20 8C20 8 19 13 17 13C15 13 16 8 16 8C16 8 18 6 20 8Z', fill: '#78350f', stroke: 'none' },
        { d: 'M9.5 11C9.5 10.4 9.9 10 10.5 10C11.1 10 11.5 10.4 11.5 11C11.5 11.6 11.1 12 10.5 12C9.9 12 9.5 11.6 9.5 11Z', fill: '#fff', stroke: 'none' },
        { d: 'M12.5 11C12.5 10.4 12.9 10 13.5 10C14.1 10 14.5 10.4 14.5 11C14.5 11.6 14.1 12 13.5 12C12.9 12 12.5 11.6 12.5 11Z', fill: '#fff', stroke: 'none' },
        { d: 'M11 14H13V15.5H11V14Z', fill: '#000', stroke: 'none' }
      ]
    },

    kangaroo: {
      label: 'Canguro',
      color: '#c2410c',
      paths: [
        { d: 'M5 19C7 17 9 14 11 11C12 9 14 6 17 6C19 6 20 8 18 10C17 11 15 12 15 14C15 16 17 18 20 18', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
        { d: 'M11 11L9 16H6', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' },
        { d: 'M14 6L15 3', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' }
      ]
    },

    fish: {
      label: 'Pez',
      color: '#38bdf8',
      paths: [
        { d: 'M2 12C4 8 8 5 14 5C20 5 22 9 22 12C22 15 20 19 14 19C8 19 4 16 2 12Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M2 12L6 8M2 12L6 16', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' },
        { d: 'M17 10C17 9.4 17.4 9 18 9C18.6 9 19 9.4 19 10C19 10.6 18.6 11 18 11C17.4 11 17 10.6 17 10Z', fill: '#0f172a', stroke: 'none' }
      ]
    },

    /* ── WATER / MATTER STATES ──────────────── */
    ice: {
      label: 'Hielo',
      color: '#7dd3fc',
      paths: [
        { d: 'M12 3V21M3 12H21M6.3 6.3L17.7 17.7M17.7 6.3L6.3 17.7', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
        { d: 'M12 3L10 6H14L12 3ZM12 21L10 18H14L12 21Z', fill: 'currentColor', stroke: 'none', opacity: 0.5 },
      ]
    },

    water: {
      label: 'Agua',
      color: '#3b82f6',
      paths: [
        { d: 'M12 3C12 3 5 11 5 15C5 18.9 8.1 22 12 22C15.9 22 19 18.9 19 15C19 11 12 3 12 3Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M9 17C9 15.3 10.3 14 12 14', stroke: '#fff', fill: 'none', sw: 1.8, lc: 'round', opacity: 0.6 },
      ]
    },

    steam: {
      label: 'Vapor',
      color: '#94a3b8',
      paths: [
        { d: 'M7 20Q9 16 7 12Q9 8 7 4', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round', lj: 'round' },
        { d: 'M12 20Q14 16 12 12Q14 8 12 4', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round', lj: 'round' },
        { d: 'M17 20Q19 16 17 12Q19 8 17 4', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round', lj: 'round' },
      ]
    },

    rock: {
      label: 'Piedra',
      color: '#78716c',
      paths: [
        { d: 'M5 19C5 19 3 16 3 13C3 9 6 6 12 6C18 6 21 9 21 13C21 16 19 19 19 19H5Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M7 19L5 14L10 10L15 12L19 10L21 14', stroke: '#fff', fill: 'none', sw: 1.2, opacity: 0.2 },
      ]
    },

    milk: {
      label: 'Leche',
      color: '#e2e8f0',
      paths: [
        { d: 'M8 4H16L18 8V20C18 20.6 17.6 21 17 21H7C6.4 21 6 20.6 6 20V8L8 4Z', fill: 'currentColor', stroke: '#cbd5e1', sw: 1.5 },
        { d: 'M6 9H18', stroke: '#94a3b8', fill: 'none', sw: 1.5 },
        { d: 'M9 4V7H15V4', stroke: '#94a3b8', fill: 'none', sw: 1.5, lc: 'round' },
        { d: 'M10 14Q12 12 14 14Q12 16 10 14Z', fill: '#94a3b8', stroke: 'none' },
      ]
    },

    /* ── HABITATS & ECOSYSTEMS ────────────────── */
    ocean: {
      label: 'Mar',
      color: '#0ea5e9',
      paths: [
        { d: 'M2 10C5 7 7 13 10 10C13 7 15 13 18 10C21 7 22 10 22 10', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
        { d: 'M2 15C5 12 7 18 10 15C13 12 15 18 18 15C21 12 22 15 22 15', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round', opacity: 0.7 }
      ]
    },

    forest: {
      label: 'Bosque',
      color: '#15803d',
      paths: [
        { d: 'M12 22V16M8 16H16L12 8L8 16Z', stroke: 'currentColor', fill: 'currentColor', sw: 2, lc: 'round', lj: 'round' },
        { d: 'M6 22H18', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' },
        { d: 'M12 8L15 11M12 10L9 13', stroke: '#fff', fill: 'none', sw: 1, opacity: 0.3 }
      ]
    },

    desert: {
      label: 'Desierto',
      color: '#eab308',
      paths: [
        { d: 'M2 18Q8 12 14 18Q18 15 22 18', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
        { d: 'M18 6C18 4.3 16.7 3 15 3C13.3 3 12 4.3 12 6', stroke: '#f97316', fill: 'none', sw: 2, lc: 'round' },
        { d: 'M7 21V19C7 19 8 18 9 18', stroke: 'currentColor', fill: 'none', sw: 1.5 }
      ]
    },

    savanna: {
      label: 'Sabana',
      color: '#d97706',
      paths: [
        { d: 'M12 22V12', stroke: 'currentColor', fill: 'none', sw: 2.5 },
        { d: 'M4 12C4 12 8 8 12 9C16 10 20 8 20 8C20 8 18 14 12 12C6 10 4 12 4 12Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M2 22H22', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' }
      ]
    },

    reef: {
      label: 'Arrecife de Coral',
      color: '#f43f5e',
      paths: [
        { d: 'M6 22V10C6 8.3 7.3 7 9 7C10.7 7 12 8.3 12 10V22', stroke: 'currentColor', fill: 'none', sw: 2.5 },
        { d: 'M12 14H15C16.7 14 18 12.7 18 11V15', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
        { d: 'M6 14H3V9', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' }
      ]
    },

    jungle: {
      label: 'Selva Tropical',
      color: '#047857',
      paths: [
        { d: 'M12 22V10', stroke: 'currentColor', fill: 'none', sw: 2.5 },
        { d: 'M12 10Q12 6 8 4Q12 7 12 10', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 12Q12 8 16 6Q12 9 12 12', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 15Q12 12 7 12Q11 14 12 15', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 17Q12 14 17 14Q13 16 12 17', fill: 'currentColor', stroke: 'none' }
      ]
    },

    /* ── SPACE / SOLAR SYSTEM ──────────────── */
    mercury: {
      label: 'Mercurio',
      color: '#9ca3af',
      paths: [
        { d: 'M12 4C8 4 5 7 5 11C5 15 8 18 12 18C16 18 19 15 19 11C19 7 16 4 12 4Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M8 8.5C9 7.8 10 8 11 9C10 7.5 11 6.5 13 7', stroke: '#fff', fill: 'none', sw: 1, opacity: 0.35 },
      ]
    },

    venus: {
      label: 'Venus',
      color: '#fbbf24',
      paths: [
        { d: 'M12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M9 9C10 8 12 8 13 10C11 9 9 10 9 13C11 11 13 12 14 14', stroke: '#fff', fill: 'none', sw: 1, opacity: 0.3 },
      ]
    },

    earth: {
      label: 'Tierra',
      color: '#3b82f6',
      paths: [
        { d: 'M12 3C7 3 3 7 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 7 17 3 12 3Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M3 12H21M12 3Q15 8 15 12Q15 16 12 21M12 3Q9 8 9 12Q9 16 12 21', stroke: '#fff', fill: 'none', sw: 1, opacity: 0.3 },
        { d: 'M5 7C7 9 8 8 10 9C11 10 10 11 12 11C13 11 14 9 16 9C17 9 18 10 19 10L16 14L13 13L10 15L7 13Z', fill: '#16a34a', stroke: 'none' },
      ]
    },

    mars: {
      label: 'Marte',
      color: '#ef4444',
      paths: [
        { d: 'M12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M8 10C9 9 11 9.5 12 11', stroke: '#fff', fill: 'none', sw: 1.2, opacity: 0.4 },
        { d: 'M14 14C13 15 11 15 10 14', stroke: '#fff', fill: 'none', sw: 1.2, opacity: 0.4 },
      ]
    },

    jupiter: {
      label: 'Júpiter',
      color: '#fb923c',
      paths: [
        { d: 'M12 3C7 3 3 7 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 7 17 3 12 3Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M3.5 10H20.5M4 14H20M5 8H19', stroke: '#fde68a', fill: 'none', sw: 1.5, opacity: 0.5 },
        { d: 'M8 12C8 10.9 8.9 10 10 10C11.1 10 12 10.9 12 12C12 13.1 11.1 14 10 14C8.9 14 8 13.1 8 12Z', fill: '#dc2626', stroke: 'none' },
      ]
    },

    saturn: {
      label: 'Saturno',
      color: '#f59e0b',
      paths: [
        { d: 'M12 6C9 6 7 8.7 7 12C7 15.3 9 18 12 18C15 18 17 15.3 17 12C17 8.7 15 6 12 6Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M3 11C3 11 7 9 12 10C17 11 21 9 21 9', stroke: '#fde68a', fill: 'none', sw: 2.5, lc: 'round', opacity: 0.85 },
        { d: 'M4 14C4 14 8 12.5 12 13C16 13.5 20 12 20 12', stroke: '#fde68a', fill: 'none', sw: 1.5, lc: 'round', opacity: 0.5 },
      ]
    },

    uranus: {
      label: 'Urano',
      color: '#67e8f9',
      paths: [
        { d: 'M12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M4 12H20', stroke: '#fff', fill: 'none', sw: 2, opacity: 0.5 },
        { d: 'M12 4V20', stroke: '#fff', fill: 'none', sw: 1, opacity: 0.3 },
      ]
    },

    neptune: {
      label: 'Neptuno',
      color: '#1d4ed8',
      paths: [
        { d: 'M12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M9 8H15M9 12H15M9 16H15', stroke: '#93c5fd', fill: 'none', sw: 1.5, lc: 'round', opacity: 0.6 },
      ]
    },

    /* ── GENERAL GAME & UI ICONS ────────────── */
    star: {
      label: 'Estrella',
      color: '#f59e0b',
      paths: [
        { d: 'M12 2L15.1 8.3L22 9.3L17 14.1L18.2 21L12 17.8L5.8 21L7 14.1L2 9.3L8.9 8.3L12 2Z', fill: 'currentColor', stroke: 'none' },
      ]
    },

    coin: {
      label: 'Moneda',
      color: '#f59e0b',
      paths: [
        { d: 'M12 3C7 3 3 7 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 7 17 3 12 3Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 7C8.7 7 6 9.7 6 13C6 16.3 8.7 19 12 19C15.3 19 18 16.3 18 13C18 9.7 15.3 7 12 7Z', fill: '#fbbf24', stroke: 'none' },
        { d: 'M10.5 10H13.5C14.3 10 15 10.7 15 11.5C15 12.3 14.3 13 13.5 13H10.5V10ZM10.5 13H14C14.8 13 15.5 13.7 15.5 14.5C15.5 15.3 14.8 16 14 16H10.5V13Z', fill: '#92400e', stroke: 'none' },
      ]
    },

    trophy: {
      label: 'Trofeo',
      color: '#f59e0b',
      paths: [
        { d: 'M8 4H16L15 14C15 16.2 13.6 18 12 18C10.4 18 9 16.2 9 14L8 4Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M8 7H5C5 7 4 11 8 12', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' },
        { d: 'M16 7H19C19 7 20 11 16 12', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' },
        { d: 'M10 18H14V20H10V18Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M7 20H17', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
      ]
    },

    heart: {
      label: 'Corazón',
      color: '#ef4444',
      paths: [
        { d: 'M12 21C12 21 3 15 3 9C3 6.2 5.2 4 8 4C9.5 4 11 4.8 12 6C13 4.8 14.5 4 16 4C18.8 4 21 6.2 21 9C21 15 12 21 12 21Z', fill: 'currentColor', stroke: 'none' },
      ]
    },

    fire: {
      label: 'Fuego',
      color: '#f97316',
      paths: [
        { d: 'M12 2C12 2 8 7 8 11C8 13 9 14 10 14C9 12 10 10 10 10C10 10 11 14 12 14C13 14 14 13 14 11C14 13 15 14 16 14C16 14 14 18 12 18C10 18 8 16.4 8 14C8 11 10 8 12 2Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 18C10 18 8.5 19.3 8.5 21C8.5 21 10 20 12 20C14 20 15.5 21 15.5 21C15.5 19.3 14 18 12 18Z', fill: '#fbbf24', stroke: 'none' },
        { d: 'M12 12C12 12 11 13 11 14C11 14.5 11.4 15 12 15C12.6 15 13 14.5 13 14C13 13 12 12 12 12Z', fill: '#fbbf24', stroke: 'none' },
      ]
    },

    lightning: {
      label: 'Rayo',
      color: '#eab308',
      paths: [
        { d: 'M13 2L5 14H12L11 22L19 10H12L13 2Z', fill: 'currentColor', stroke: 'none' },
      ]
    },

    check: {
      label: 'Correcto',
      color: '#22c55e',
      paths: [
        { d: 'M4 12L10 18L20 6', stroke: 'currentColor', fill: 'none', sw: 3, lc: 'round', lj: 'round' },
      ]
    },

    cross: {
      label: 'Incorrecto',
      color: '#ef4444',
      paths: [
        { d: 'M6 6L18 18M18 6L6 18', stroke: 'currentColor', fill: 'none', sw: 3, lc: 'round' },
      ]
    },

    clock: {
      label: 'Reloj',
      color: '#6366f1',
      paths: [
        { d: 'M12 3C7 3 3 7 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 7 17 3 12 3Z', stroke: 'currentColor', fill: 'none', sw: 2.5 },
        { d: 'M12 7V12L15 14', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' }
      ]
    },

    tag: {
      label: 'Etiqueta',
      color: '#ec4899',
      paths: [
        { d: 'M4 12L12 4H20V12L12 20H4V12Z', stroke: 'currentColor', fill: 'none', sw: 2.5, lj: 'round' },
        { d: 'M16 8C16 8.6 15.6 9 15 9C14.4 9 14 8.6 14 8C14 7.4 14.4 7 15 7C15.6 7 16 7.4 16 8Z', fill: 'currentColor', stroke: 'none' }
      ]
    },

    palette: {
      label: 'Paleta',
      color: '#d946ef',
      paths: [
        { d: 'M12 3C7 3 3 7 3 12C3 17 7 21 12 21C14.5 21 15 19 17 19C19 19 21 16 21 13C21 7.5 17 3 12 3Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M7 10C7 10.6 6.6 11 6 11C5.4 11 5 10.6 5 10C5 9.4 5.4 9 6 9C6.6 9 7 9.4 7 10Z', fill: '#ef4444', stroke: 'none' },
        { d: 'M10 7C10 7.6 9.6 8 9 8C8.4 8 8 7.6 8 7C8 6.4 8.4 6 9 6C9.6 6 10 6.4 10 7Z', fill: '#3b82f6', stroke: 'none' },
        { d: 'M14 7C14 7.6 13.6 8 13 8C12.4 8 12 7.6 12 7C12 6.4 12.4 6 13 6C13.6 6 14 6.4 14 7Z', fill: '#10b981', stroke: 'none' },
        { d: 'M12 15C12 16.7 10.3 18 8.5 18C6.7 18 7.5 15 9.5 15C11.5 15 12 13.3 12 15Z', fill: '#fff', stroke: 'none' }
      ]
    },

    die: {
      label: 'Dado',
      color: '#6366f1',
      paths: [
        { d: 'M4 4H20V20H4V4Z', stroke: 'currentColor', fill: 'none', sw: 2.5, lj: 'round' },
        { d: 'M8 8C8 8.6 7.6 9 7 9C6.4 9 6 8.6 6 8C6 7.4 6.4 7 7 7C7.6 7 8 7.4 8 8Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M18 8C18 8.6 17.6 9 17 9C16.4 9 16 8.6 16 8C16 7.4 16.4 7 17 7C17.6 7 18 7.4 18 8Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M8 18C8 18.6 7.6 19 7 19C6.4 19 6 18.6 6 18C6 17.4 6.4 17 7 17C7.6 17 8 17.4 8 18Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M18 18C18 18.6 17.6 19 17 19C16.4 19 16 18.6 16 18C16 17.4 16.4 17 17 17C17.6 17 18 17.4 18 18Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M13 13C13 13.6 12.6 14 12 14C11.4 14 11 13.6 11 13C11 12.4 11.4 12 12 12C12.6 12 13 12.4 13 13Z', fill: 'currentColor', stroke: 'none' }
      ]
    },

    /* ── BODY ORGANS ──────────────────────────── */
    stomach: {
      label: 'Estómago',
      color: '#f43f5e',
      paths: [
        { d: 'M12 4C9 4 5 7 5 11C5 15 9 18 13 18C17 18 19 15 19 12C19 9 15 4 12 4Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M7 6Q12 10 17 6', stroke: '#ffe4e6', fill: 'none', sw: 1.5, opacity: 0.4 }
      ]
    },

    lungs: {
      label: 'Pulmones',
      color: '#ec4899',
      paths: [
        { d: 'M11 6V18M11 6C9 4 4 6 4 11C4 16 9 17 11 17M11 6C13 4 18 6 18 11C18 16 13 17 11 17', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' }
      ]
    },

    brain: {
      label: 'Cerebro',
      color: '#d946ef',
      paths: [
        { d: 'M12 20C12 20 8 19 7 17C5 17 4 15 4 13C4 11 6 9 8 9C8 8 9 6 11 6C12 6 12 7 12 7C12 7 12 6 13 6C15 6 16 8 16 9C18 9 20 11 20 13C20 15 19 17 17 17C16 19 12 20 12 20Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 6V20M8 13H16M8 10H16M8 16H16', stroke: '#fdf4ff', fill: 'none', sw: 1.2, opacity: 0.3 }
      ]
    },

    bone: {
      label: 'Hueso',
      color: '#e5e7eb',
      paths: [
        { d: 'M8 6C8 4.3 9.3 3 11 3C11 4.7 9.7 6 8 6Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M8 6C6.3 6 5 7.3 5 9C5 10.7 6.3 12 8 12L16 12C17.7 12 19 10.7 19 9C19 7.3 17.7 6 16 6', fill: 'currentColor', stroke: '#9ca3af', sw: 1 },
        { d: 'M16 6C17.7 6 19 4.7 19 3C17.3 3 16 4.3 16 6Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M8 12C6.3 12 5 13.3 5 15C5 16.7 6.3 18 8 18', fill: 'currentColor', stroke: 'none' },
        { d: 'M8 12L16 12L16 18', stroke: '#9ca3af', fill: 'none', sw: 1 },
        { d: 'M16 18C17.7 18 19 16.7 19 15C19 13.3 17.7 12 16 12Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M8 18C6.3 18 5 19.3 5 21C6.7 21 8 19.7 8 18Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M16 18C17.7 18 19 19.3 19 21C17.3 21 16 19.7 16 18Z', fill: 'currentColor', stroke: 'none' },
      ]
    },

    /* ── CHEMISTRY & SCIENCE ───────────────────── */
    atom: {
      label: 'Elemento',
      color: '#8b5cf6',
      paths: [
        { d: 'M12 12C13.1 12 14 11.1 14 10C14 8.9 13.1 8 12 8C10.9 8 10 8.9 10 10C10 11.1 10.9 12 12 12Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 3C17 3 20 7 20 12C20 17 17 21 12 21C7 21 4 17 4 12C4 7 7 3 12 3Z', stroke: 'currentColor', fill: 'none', sw: 1.5, opacity: 0.5 },
        { d: 'M3 12C3 17 7 20 12 20C17 20 21 17 21 12C21 7 17 4 12 4C7 4 3 7 3 12Z', stroke: 'currentColor', fill: 'none', sw: 1, opacity: 0.3 }
      ]
    },

    link: {
      label: 'Compuesto',
      color: '#6366f1',
      paths: [
        { d: 'M9 15C7.3 15 6 13.7 6 12C6 10.3 7.3 9 9 9H11', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
        { d: 'M15 9C16.7 9 18 10.3 18 12C18 13.7 16.7 15 15 15H13', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
        { d: 'M8 12H16', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' }
      ]
    },

    salad: {
      label: 'Mezcla',
      color: '#10b981',
      paths: [
        { d: 'M2 12C2 17 6 20 12 20C18 20 22 17 22 12H2Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M6 10C7.7 10 9 8.7 9 7', stroke: '#34d399', fill: 'none', sw: 2, lc: 'round' },
        { d: 'M18 10C16.3 10 15 8.7 15 7', stroke: '#34d399', fill: 'none', sw: 2, lc: 'round' },
        { d: 'M12 11V6', stroke: '#f59e0b', fill: 'none', sw: 2, lc: 'round' }
      ]
    },

    observe: {
      label: 'Observar',
      color: '#0ea5e9',
      paths: [
        { d: 'M10 17C13.9 17 17 13.9 17 10C17 6.1 13.9 3 10 3C6.1 3 3 6.1 3 10C3 13.9 6.1 17 10 17Z', stroke: 'currentColor', fill: 'none', sw: 2.5 },
        { d: 'M15 15L21 21', stroke: 'currentColor', fill: 'none', sw: 3, lc: 'round' }
      ]
    },

    lightbulb: {
      label: 'Hipótesis',
      color: '#fbbf24',
      paths: [
        { d: 'M9 18H15M9 20H15M12 3C8.1 3 5 6.1 5 10C5 12.5 6.5 15.5 8 17H16C17.5 15.5 19 12.5 19 10C19 6.1 15.9 3 12 3Z', stroke: 'currentColor', fill: 'none', sw: 2 },
        { d: 'M12 7V13', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' }
      ]
    },

    experiment: {
      label: 'Experimentar',
      color: '#ec4899',
      paths: [
        { d: 'M9 3H15M10 3V11L5 19C4 20.6 5.4 21 7 21H17C18.6 21 20 20.6 19 19L14 11V3', stroke: 'currentColor', fill: 'none', sw: 2.2, lj: 'round' },
        { d: 'M8 15H16', stroke: 'currentColor', fill: 'none', sw: 1.5 }
      ]
    },

    chart: {
      label: 'Analizar',
      color: '#10b981',
      paths: [
        { d: 'M4 4V20H20', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
        { d: 'M7 16L11 11L15 14L19 8', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' }
      ]
    },

    gold: {
      label: 'Oro puro',
      color: '#fbbf24',
      paths: [
        { d: 'M2 18L5 6H19L22 18H2Z', fill: 'currentColor', stroke: '#d97706', sw: 1.5 },
        { d: 'M8 12H16', stroke: '#fff', fill: 'none', sw: 1.5, opacity: 0.5 }
      ]
    },

    wind: {
      label: 'Oxígeno',
      color: '#38bdf8',
      paths: [
        { d: 'M2 8H16C17.7 8 19 6.7 19 5C19 3.3 17.7 2 16 2', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round' },
        { d: 'M2 13H20C21.7 13 23 11.7 23 10C23 8.3 21.7 7 20 7', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round', opacity: 0.7 },
        { d: 'M2 18H14C15.7 18 17 16.7 17 15C17 13.3 15.7 12 14 12', stroke: 'currentColor', fill: 'none', sw: 2, lc: 'round', opacity: 0.5 }
      ]
    },

    salt: {
      label: 'Sal',
      color: '#94a3b8',
      paths: [
        { d: 'M8 8V20C8 20.6 8.4 21 9 21H15C15.6 21 16 20.6 16 20V8L14 4H10L8 8Z', stroke: 'currentColor', fill: 'none', sw: 2 },
        { d: 'M11 4V6M13 4V6', stroke: 'currentColor', fill: 'none', sw: 1.5 },
        { d: 'M8 12H16', stroke: 'currentColor', fill: 'none', sw: 1.5, opacity: 0.3 }
      ]
    },

    /* ── 3D SHAPES & FIGURES ──────────────────── */
    cube: {
      label: 'Cubo',
      color: '#6366f1',
      paths: [
        { d: 'M12 2L20 6.5V17.5L12 22L4 17.5V6.5L12 2Z', stroke: 'currentColor', fill: 'none', sw: 2, lj: 'round' },
        { d: 'M12 22V12M12 12L20 6.5M12 12L4 6.5', stroke: 'currentColor', fill: 'none', sw: 2 }
      ]
    },

    sphere: {
      label: 'Esfera',
      color: '#3b82f6',
      paths: [
        { d: 'M12 3C7 3 3 7 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 7 17 3 12 3Z', stroke: 'currentColor', fill: 'none', sw: 2.5 },
        { d: 'M3 12C3 15.3 7 18 12 18C17 18 21 15.3 21 12', stroke: 'currentColor', fill: 'none', sw: 1.5, opacity: 0.5 }
      ]
    },

    pyramid: {
      label: 'Pirámide',
      color: '#f59e0b',
      paths: [
        { d: 'M12 2L21 18L12 22L3 18L12 2Z', stroke: 'currentColor', fill: 'none', sw: 2, lj: 'round' },
        { d: 'M12 2V22', stroke: 'currentColor', fill: 'none', sw: 1.8 }
      ]
    },

    cylinder: {
      label: 'Cilindro',
      color: '#10b981',
      paths: [
        { d: 'M5 7V17C5 19.2 8.1 21 12 21C15.9 21 19 19.2 19 17V7', stroke: 'currentColor', fill: 'none', sw: 2 },
        { d: 'M12 9C15.9 9 19 8.1 19 7C19 5.9 15.9 5 12 5C8.1 5 5 5.9 5 7C5 8.1 8.1 9 12 9Z', stroke: 'currentColor', fill: 'none', sw: 2 }
      ]
    },

    /* ── SYLLABLE COMPONENT IMAGES ────────────── */
    house: {
      label: 'Casa',
      color: '#f59e0b',
      paths: [
        { d: 'M12 3L3 11H5V20C5 20.6 5.4 21 6 21H18C18.6 21 19 20.6 19 20V11H21L12 3Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M10 21V15H14V21H10Z', fill: '#78350f', stroke: 'none' }
      ]
    },

    tomato: {
      label: 'Tomate',
      color: '#ef4444',
      paths: [
        { d: 'M12 6C8.1 6 5 9.1 5 13C5 16.9 8.1 20 12 20C15.9 20 19 16.9 19 13C19 9.1 15.9 6 12 6Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 6L11 3M12 6L13 3M12 6V3', stroke: '#15803d', fill: 'none', sw: 2, lc: 'round' }
      ]
    },

    shirt: {
      label: 'Camisa',
      color: '#3b82f6',
      paths: [
        { d: 'M6 4L2 8L5 11L8 8V20C8 20.6 8.4 21 9 21H15C15.6 21 16 20.6 16 20V8L19 11L22 8L18 4H6Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 4V9', stroke: '#fff', fill: 'none', sw: 1.5, opacity: 0.5 }
      ]
    },

    banana: {
      label: 'Plátano',
      color: '#eab308',
      paths: [
        { d: 'M6 4C6 4 12 4 16 8C20 12 20 18 20 18C20 18 14 18 10 14C6 10 6 4 6 4Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M6 4L4 3', stroke: '#78350f', fill: 'none', sw: 2, lc: 'round' }
      ]
    },

    nucleus: {
      label: 'Núcleo',
      color: '#a855f7',
      paths: [
        { d: 'M12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16C14.2 16 16 14.2 16 12C16 9.8 14.2 8 12 8Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M12 4C12 4 16 6 18 10', stroke: '#c084fc', fill: 'none', sw: 1.5, lc: 'round', opacity: 0.7 },
        { d: 'M18 10C18 10 20 14 18 18', stroke: '#c084fc', fill: 'none', sw: 1.5, lc: 'round', opacity: 0.5 },
        { d: 'M18 18C18 18 14 20 10 18', stroke: '#c084fc', fill: 'none', sw: 1.5, lc: 'round', opacity: 0.7 },
        { d: 'M10 18C10 18 6 16 6 12', stroke: '#c084fc', fill: 'none', sw: 1.5, lc: 'round', opacity: 0.5 },
      ]
    },

    mitochondria: {
      label: 'Mitocondria',
      color: '#f97316',
      paths: [
        { d: 'M7 12C7 8.7 9.2 6 12 6C14.8 6 17 8.7 17 12C17 15.3 14.8 18 12 18C9.2 18 7 15.3 7 12Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M9 9Q11 11 9 13Q11 15 9 17', stroke: '#fff', fill: 'none', sw: 1.2, opacity: 0.5, lc: 'round' },
        { d: 'M12 9Q14 11 12 13Q14 15 12 17', stroke: '#fff', fill: 'none', sw: 1.2, opacity: 0.5, lc: 'round' },
      ]
    },

    chloroplast: {
      label: 'Cloroplasto',
      color: '#16a34a',
      paths: [
        { d: 'M12 4C8.7 4 6 7 6 12C6 17 8.7 20 12 20C15.3 20 18 17 18 12C18 7 15.3 4 12 4Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M8 11C9 10 10 10 11 11', stroke: '#86efac', fill: 'none', sw: 1.5, lc: 'round' },
        { d: 'M13 11C14 10 15 10 16 11', stroke: '#86efac', fill: 'none', sw: 1.5, lc: 'round' },
        { d: 'M9 15Q12 13 15 15', stroke: '#86efac', fill: 'none', sw: 1.5, lc: 'round' },
      ]
    },

    planet: {
      label: 'Planeta',
      color: '#6366f1',
      paths: [
        { d: 'M12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4Z', fill: 'currentColor', stroke: 'none' },
      ]
    },

    fraction: {
      label: 'Fracción',
      color: '#6366f1',
      paths: [
        { d: 'M8 7H10V9H8V7ZM14 7H16V9H14V7Z', fill: 'currentColor', stroke: 'none' },
        { d: 'M6 12H18', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
        { d: 'M8 15H10V17H8V15ZM14 15H16V17H14V15Z', fill: 'currentColor', stroke: 'none' },
      ]
    },

    question: {
      label: '?',
      color: '#94a3b8',
      paths: [
        { d: 'M9 9C9 7.3 10.3 6 12 6C13.7 6 15 7.3 15 9C15 10.7 13.7 12 12 12V13', stroke: 'currentColor', fill: 'none', sw: 2.5, lc: 'round' },
        { d: 'M12 17C12.6 17 13 16.6 13 16C13 15.4 12.6 15 12 15C11.4 15 11 15.4 11 16C11 16.6 11.4 17 12 17Z', fill: 'currentColor', stroke: 'none' },
      ]
    },

    /* ── DIRECTIONAL ARROWS ─────────────────────── */
    arrow_right: {
      label: 'Derecha',
      color: '#6366f1',
      paths: [
        { d: 'M4 12H20', stroke: 'currentColor', fill: 'none', sw: 3, lc: 'round', lj: 'round' },
        { d: 'M13 5L20 12L13 19', stroke: 'currentColor', fill: 'none', sw: 3, lc: 'round', lj: 'round' },
      ]
    },

    arrow_left: {
      label: 'Izquierda',
      color: '#ec4899',
      paths: [
        { d: 'M20 12H4', stroke: 'currentColor', fill: 'none', sw: 3, lc: 'round', lj: 'round' },
        { d: 'M11 19L4 12L11 5', stroke: 'currentColor', fill: 'none', sw: 3, lc: 'round', lj: 'round' },
      ]
    },
  };

  // ─────────────────────────────────────────────────────────────
  // 2. EMOJI → KEY MAPPER
  // ─────────────────────────────────────────────────────────────
  const EMOJI_TO_KEY = {
    // Correct / Wrong
    '✅': 'check',
    '❌': 'cross',
    // Space
    '🌑': 'mercury',
    '🌕': 'venus',
    '🌍': 'earth',
    '🌎': 'earth',
    '🔴': 'mars',
    '🟠': 'jupiter',
    '🪐': 'saturn',
    '🔵': 'neptune',
    '💎': 'uranus',
    // Matter / Water States
    '🧊': 'ice',
    '💧': 'water',
    '💨': 'steam',
    '🪨': 'rock',
    '🥛': 'milk',
    // Food chain / Plants
    '🌿': 'plant',
    '🐛': 'caterpillar',
    '🐸': 'frog',
    '🦅': 'eagle',
    '🌱': 'plant',
    '🎋': 'leaf',
    '🍃': 'leaf',
    '🌸': 'flower',
    '🌴': 'jungle',
    '🌾': 'savanna',
    '🐠': 'fish',
    '🦈': 'shark',
    '🦉': 'owl',
    '🐪': 'camel',
    '🐻‍❄️': 'polar_bear',
    '🐋': 'whale',
    '🐆': 'jaguar',
    '🦁': 'lion',
    '🌵': 'cactus',
    '🐕': 'dog',
    '👧': 'girl', 
    '🏃': 'run',
    '🍎': 'apple',
    '🔼': 'triangle',
    '🔵': 'blue',
    '🔴': 'circle',
    '🦘': 'jump',
    // Organs
    '🫃': 'stomach',
    '🫁': 'lungs',
    '❤️': 'heart',
    '🧠': 'brain',
    '🦴': 'bone',
    // Ecosystems / Science
    '🏜️': 'desert',
    '❄️': 'ice',
    '🌊': 'ocean',
    '🌲': 'forest',
    '🕐': 'clock',
    '🏷️': 'tag',
    '⚡': 'lightning',
    '🎨': 'palette',
    '🪙': 'coin',
    '⭐': 'star',
    '🌟': 'star',
    '🔥': 'fire',
    '🏆': 'trophy',
    '🎲': 'die',
    '⚛️': 'atom',
    '🔗': 'link',
    '🥗': 'salad',
    '🔍': 'observe',
    '❓': 'question',
    '💡': 'lightbulb',
    '🧪': 'experiment',
    '📊': 'chart',
    '🥇': 'gold',
    '🌬️': 'wind',
    '🧂': 'salt',
    '⛺': 'pyramid',
    '🥤': 'cylinder',
    '🏠': 'house',
    '🍅': 'tomato',
    '👕': 'shirt',
    '🍌': 'banana'
  };

  // ─────────────────────────────────────────────────────────────
  // 3. SVG BUILDER — Converts def to inline SVG string
  // ─────────────────────────────────────────────────────────────
  function buildSVG(key, opts = {}) {
    const cacheKey = key + JSON.stringify(opts);
    if (CACHE[cacheKey]) return CACHE[cacheKey];

    let result;
    if (IMAGES[key]) {
      const size = opts.size || 24;
      const cls = opts.className || '';
      const style = opts.style || '';
      result = `<img src="${IMAGES[key]}" width="${size}" height="${size}" class="gicon-img ${cls}" style="display:inline-block;vertical-align:middle;object-fit:contain;${style}" alt="${key}">`;
    } else {
      const def = SVG_DEFS[key] || SVG_DEFS.question;
      const size = opts.size || 24;
      const color = opts.color || def.color;
      const cls = opts.className || '';
      const style = opts.style || '';

      // Build inner paths
      const innerPaths = def.paths.map(p => {
        const attrs = [];
        if (p.fill && p.fill !== 'none') attrs.push(`fill="${p.fill === 'currentColor' ? color : p.fill}"`);
        else if (p.fill === 'none') attrs.push('fill="none"');
        if (p.stroke === 'currentColor') attrs.push(`stroke="${color}"`);
        else if (p.stroke && p.stroke !== 'none') attrs.push(`stroke="${p.stroke}"`);
        if (p.sw) attrs.push(`stroke-width="${p.sw}"`);
        if (p.lc) attrs.push(`stroke-linecap="${p.lc}"`);
        if (p.lj) attrs.push(`stroke-linejoin="${p.lj}"`);
        if (p.opacity !== undefined) attrs.push(`opacity="${p.opacity}"`);
        return `<path d="${p.d}" ${attrs.join(' ')}/>`;
      }).join('');

      result = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" class="gicon ${cls}" style="display:inline-block;vertical-align:middle;flex-shrink:0;${style}" aria-label="${def.label}" role="img">${innerPaths}</svg>`;
    }

    CACHE[cacheKey] = result;
    return result;
  }

  // ─────────────────────────────────────────────────────────────
  // 4. PLANET TAG FORMAT — handles "🌑Mercurio" style strings
  //    (used in grado3.js g4.planets array)
  // ─────────────────────────────────────────────────────────────
  const PLANET_NAME_TO_KEY = {
    'Mercurio': 'mercury',
    'Venus': 'venus',
    'Tierra': 'earth',
    'Marte': 'mars',
    'Júpiter': 'jupiter',
    'Saturno': 'saturn',
    'Urano': 'uranus',
    'Neptuno': 'neptune',
  };

  function parsePlanetTag(tag) {
    const match = tag.match(/^(\S+?)([A-ZÁÉÍÓÚa-záéíóú].+)$/u);
    if (!match) return { emoji: '', name: tag, key: 'planet' };
    const name = match[2];
    return { emoji: match[1], name, key: PLANET_NAME_TO_KEY[name] || 'planet' };
  }

  // ─────────────────────────────────────────────────────────────
  // 5. FOOD CHAIN TAG FORMAT — handles "🌿Planta" style strings
  // ─────────────────────────────────────────────────────────────
  const CHAIN_NAME_TO_KEY = {
    'Planta': 'plant',
    'Oruga': 'caterpillar',
    'Rana': 'frog',
    'Águila': 'eagle',
  };

  function parseChainTag(tag) {
    const match = tag.match(/^(\S+?)([A-ZÁÉÍÓÚa-záéíóú].+)$/u);
    if (!match) return { emoji: '', name: tag, key: 'question' };
    const name = match[2];
    return { emoji: match[1], name, key: CHAIN_NAME_TO_KEY[name] || 'question' };
  }

  // ─────────────────────────────────────────────────────────────
  // 6. PLANT PARTS MAP (g18 in grado3)
  // ─────────────────────────────────────────────────────────────
  const PLANT_PART_TO_KEY = {
    'Raíz': 'plant',
    'Tallo': 'leaf',
    'Hoja': 'leaf',
    'Flor': 'flower',
  };

  // ─────────────────────────────────────────────────────────────
  // 7. MATTER STATE MAP (g8 items)
  // ─────────────────────────────────────────────────────────────
  const MATTER_EMOJI_TO_KEY = {
    '🧊': 'ice',
    '💧': 'water',
    '💨': 'steam',
    '🪨': 'rock',
    '🥛': 'milk',
  };

  // ─────────────────────────────────────────────────────────────
  // 8. PUBLIC API
  // ─────────────────────────────────────────────────────────────
  const GIconEngine = {
    fromEmoji(emoji) {
      return EMOJI_TO_KEY[emoji] || 'question';
    },

    html(key, opts = {}) {
      return buildSVG(key, opts);
    },

    fromEmojiHtml(emoji, opts = {}) {
      return buildSVG(this.fromEmoji(emoji), opts);
    },

    render(el, key, opts = {}) {
      if (typeof el === 'string') el = document.querySelector(el);
      if (el) el.innerHTML = buildSVG(key, opts);
    },

    parsePlanet(tag, opts = {}) {
      const p = parsePlanetTag(tag);
      return { ...p, svg: buildSVG(p.key, { size: opts.size || 32, ...opts }) };
    },

    parseChain(tag, opts = {}) {
      const p = parseChainTag(tag);
      return { ...p, svg: buildSVG(p.key, { size: opts.size || 32, ...opts }) };
    },

    matterSVG(item, opts = {}) {
      const key = MATTER_EMOJI_TO_KEY[item.e] || 'question';
      return buildSVG(key, { size: opts.size || 48, ...opts });
    },

    plantPartSVG(part, opts = {}) {
      const key = PLANT_PART_TO_KEY[part] || 'plant';
      return buildSVG(key, { size: opts.size || 48, ...opts });
    },

    defs: SVG_DEFS,
    planetMap: PLANET_NAME_TO_KEY,
    chainMap: CHAIN_NAME_TO_KEY,
  };

  global.GIconEngine = GIconEngine;

})(window);
