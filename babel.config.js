module.exports = {
  presets: [
    ['@vue/app', { modules: 'commonjs' }]
  ],
  plugins: [],
  env: {
    test: {
      presets: [
        ['@vue/app', { modules: 'commonjs' }]
      ],
      plugins: ['istanbul']
    }
  }
}
