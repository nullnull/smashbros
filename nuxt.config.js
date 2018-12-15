const pkg = require('./package')

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: '#スマブラ参戦ジェネレーター',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'スマブラ参戦風画像を生成するジェネレーターです。画像をドラッグして位置を調整できます。'
      },
      {
        name: 'og:image',
        content: 'https://smashbros-gen.netlify.com/ogp.jpg'
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { property: 'og:url', content: 'https://smashbros-gen.netlify.com/' },
      { property: 'og:title', content: '#スマブラ参戦ジェネレーター' },
      {
        property: 'og:description',
        content:
          'スマブラ参戦風画像を生成するジェネレーターです。画像をドラッグして位置を調整できます。'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/mixin',
    { src: '@/plugins/uikit', ssr: false },
    { src: '@/plugins/konva', ssr: false }
  ],

  /*
  ** Global CSS
  */
  css: ['@/assets/styles/main.scss'],

  /*
  ** Nuxt.js modules
  */
  modules: [],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
