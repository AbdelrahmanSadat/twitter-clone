module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'client',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // { rel: 'script', href: '/onMessage.js' }
      // { rel: 'manifest', href: '/manifest.json' }
    ],
    // script: [
    //   { src: '/onMessage.js' },
    //   { src: '/fcm.js' }
    // ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  // Modules
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv'
  ],

  // Workbox module (part of the PWA nuxt module)
  // TODO: remove dev option
  workbox: {
    dev:  true,
    importScripts: [
      'firebase-messaging-sw.js'
    ],
  },

  // Manifest module (part of the PWA nuxt module)
  manifest: {
      "short_name": "Clone",
      "name": "Twitter Clone",
      "gcm_sender_id": "103953800507"
  },

  // Plugins
  plugins: [
    { src: '~/plugins/persistedState.js', ssr: false },
    { src: '~/plugins/apolloClient.js', ssr: true},
    { src: '~/plugins/fcm.js', ssr: false}
  ],

  // Server-side middleware
  serverMiddleware: [ "@/serverMiddleware/cookieParser" ],

  // Router middleware
  router: {
    middleware: 'removeErrorMessage'
  }
}

