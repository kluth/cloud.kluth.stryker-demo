/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/packages/shop/wishlist',
  plugins: [angular(), tsconfigPaths()],
  test: {
    name: 'wishlist',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: [`${__dirname}/src/test-setup.ts`],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/packages/shop/wishlist',
      provider: 'v8' as const,
    },
  },
}));
