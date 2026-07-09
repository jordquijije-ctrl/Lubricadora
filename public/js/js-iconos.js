// ICONOS SVG HAND-DRAWN (Inline)
// Usar como: ICONOS.factura(), ICONOS.entrada(), etc.

const ICONOS = {
  factura: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline;">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
      <polyline points="13 2 13 9 20 9"></polyline>
      <line x1="9" y1="15" x2="15" y2="15"></line>
      <line x1="9" y1="11" x2="15" y2="11"></line>
    </svg>
  `,

  entrada: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline;">
      <polyline points="12 19 19 12 12 5"></polyline>
      <line x1="19" y1="12" x2="5" y2="12"></line>
    </svg>
  `,

  salida: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline;">
      <polyline points="5 12 12 19 19 12"></polyline>
      <line x1="12" y1="19" x2="12" y2="5"></line>
    </svg>
  `,

  proveedor: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline;">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,

  movimientos: () => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline;">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  `,

  alerta_critica: () => `
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" stroke="#00B4D8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;">
      <path d="M32 4 L56 44 Q56 50 50 56 L14 56 Q8 50 8 44 L32 4" stroke-linejoin="miter"></path>
      <circle cx="32" cy="40" r="3" fill="#00B4D8"></circle>
      <line x1="32" y1="20" x2="32" y2="36"></line>
    </svg>
  `,

  alerta_advertencia: () => `
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" stroke="#00B4D8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;">
      <circle cx="32" cy="32" r="24" stroke-dasharray="4"></circle>
      <path d="M32 16 L46 48 L18 48 Z"></path>
      <circle cx="32" cy="40" r="2" fill="#00B4D8"></circle>
      <line x1="32" y1="24" x2="32" y2="36"></line>
    </svg>
  `,

  alerta_info: () => `
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none" stroke="#00B4D8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: 0 auto;">
      <circle cx="32" cy="32" r="28"></circle>
      <circle cx="32" cy="20" r="2" fill="#00B4D8"></circle>
      <line x1="32" y1="28" x2="32" y2="48"></line>
    </svg>
  `,

  pagada: () => `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display: inline; color: #4CAF50;">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"></path>
    </svg>
  `,

  pendiente: () => `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display: inline; color: #FFC107;">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4" stroke="white" fill="none" stroke-width="2"></circle>
    </svg>
  `,

  anulada: () => `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display: inline; color: #F44336;">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="8" y1="16" x2="16" y2="8" stroke="white" stroke-width="2"></line>
    </svg>
  `
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ICONOS;
}
