import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'dist/main.js',
  output: {
    file: 'main.js',
    format: 'cjs'
  },
  plugins: [resolve()]
};
