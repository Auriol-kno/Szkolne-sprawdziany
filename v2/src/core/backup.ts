/* Kopia zapasowa i synchronizacja postępów.
   Wszystko zapisuje się automatycznie w przeglądarce (localStorage) i zostaje po aktualizacji aplikacji.
   Kopia (plik JSON albo tekst) służy do przeniesienia wyników na inne urządzenie/przeglądarkę lub do odtworzenia. */

export const APP_ID = 'szkolne-sprawdziany';
export const FORMAT = 1;
/** klucze starej wersji (moduł matematyki i stare przedmioty) – też trafiają do kopii */
const LEGACY_KEYS = ['lid4-v1', 'hist4-v1', 'prz4-v1', 'ang4-v1', 'school-tests-v1', 'subj-order-v1', 'subj-order-v2'];
const PREFIX = 'sprawdziany-';
const PREV = 'sprawdziany-backup-prev';

export interface Backup { app: string; format: number; date: string; data: Record<string, string> }

function ourKeys(): string[] {
  const out: string[] = [];
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i)!; if ((k.startsWith(PREFIX) && k !== PREV) || LEGACY_KEYS.includes(k)) out.push(k); } } catch { /* */ }
  return out.sort();
}
export function makeBackup(): Backup {
  const data: Record<string, string> = {};
  for (const k of ourKeys()) { const v = localStorage.getItem(k); if (v != null) data[k] = v; }
  return { app: APP_ID, format: FORMAT, date: new Date().toISOString(), data };
}
export const backupText = () => JSON.stringify(makeBackup());

/** sprawdza i wczytuje kopię; poprzedni stan zostaje w 'sprawdziany-backup-prev' (można cofnąć) */
export function restore(text: string): { ok: true; keys: number; date: string } | { ok: false; error: string } {
  let b: Backup;
  try { b = JSON.parse(text.trim()); } catch { return { ok: false, error: 'To nie jest plik kopii (zły format).' }; }
  if (!b || b.app !== APP_ID || typeof b.data !== 'object') return { ok: false, error: 'To nie jest kopia tej aplikacji.' };
  if (b.format > FORMAT) return { ok: false, error: 'Kopia pochodzi z nowszej wersji aplikacji – najpierw odśwież aplikację.' };
  const keys = Object.keys(b.data).filter(k => (k.startsWith(PREFIX) && k !== PREV) || LEGACY_KEYS.includes(k));
  try {
    localStorage.setItem(PREV, backupText());
    for (const k of keys) localStorage.setItem(k, b.data[k]);
  } catch { return { ok: false, error: 'Nie udało się zapisać (brak miejsca albo tryb prywatny).' }; }
  return { ok: true, keys: keys.length, date: b.date };
}
export const hasPrev = () => { try { return !!localStorage.getItem(PREV); } catch { return false; } };
export function undoRestore(): boolean {
  try { const t = localStorage.getItem(PREV); if (!t) return false; const b = JSON.parse(t) as Backup; for (const k of ourKeys()) localStorage.removeItem(k); for (const [k, v] of Object.entries(b.data)) localStorage.setItem(k, v); localStorage.removeItem(PREV); return true; } catch { return false; }
}
export function download(): void {
  const blob = new Blob([JSON.stringify(makeBackup(), null, 1)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `sprawdziany-kopia-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  try { localStorage.setItem('sprawdziany-last-backup', new Date().toISOString()); } catch { /* */ }
}
export const lastBackup = () => { try { return localStorage.getItem('sprawdziany-last-backup'); } catch { return null; } };
