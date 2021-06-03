import { defineConfig } from 'umi';

export default defineConfig({
  publicPath: './',
  base: '/music',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  fastRefresh: {},
});
