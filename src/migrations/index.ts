import * as migration_20260401_205704 from './20260401_205704';
import * as migration_20260403_142821 from './20260403_142821';
import * as migration_20260420_105036 from './20260420_105036';

export const migrations = [
  {
    up: migration_20260401_205704.up,
    down: migration_20260401_205704.down,
    name: '20260401_205704',
  },
  {
    up: migration_20260403_142821.up,
    down: migration_20260403_142821.down,
    name: '20260403_142821',
  },
  {
    up: migration_20260420_105036.up,
    down: migration_20260420_105036.down,
    name: '20260420_105036'
  },
];
