import * as migration_20260401_205704 from './20260401_205704';

export const migrations = [
  {
    up: migration_20260401_205704.up,
    down: migration_20260401_205704.down,
    name: '20260401_205704'
  },
];
