import type { Instrument } from '@/types/domain';

/**
 * 首期支持乐器，见 mobile-client.md §6.3 / api.md §2.5。
 * 展示文案：guitar → Guitar，pipa → Pipa（不可写作“枇杷”）。
 * 用作后端 config 接口不可用时的回退。
 */
export const INSTRUMENTS: Instrument[] = [
  { code: 'pipa', name: 'Pipa', enabled: true },
  { code: 'suona', name: 'Suona', enabled: true },
  { code: 'guzheng', name: 'Guzheng', enabled: true },
  { code: 'erhu', name: 'Erhu', enabled: true },
  { code: 'dizi', name: 'Dizi', enabled: true },
  { code: 'piano', name: 'Piano', enabled: true },
  { code: 'guitar', name: 'Guitar', enabled: true },
  { code: 'violin', name: 'Violin', enabled: true },
  { code: 'flute', name: 'Flute', enabled: true },
  { code: 'bass', name: 'Bass', enabled: true },
];
