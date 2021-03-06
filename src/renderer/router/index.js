import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
      children: [{
          path: '/',
          name: '/',
          component: require('@/components/IndexPage').default
        },
        {
          path: 'exampapers',
          name: 'exampapers',
          component: require('@/components/ExampapersPage').default
        },
        {
          path: 'questions',
          name: 'questions',
          component: require('@/components/QuestionsPage').default
        },
        {
          path: 'articles',
          name: 'articles',
          component: require('@/components/ArticlesPage').default
        },
        {
          path: 'students',
          name: 'students',
          component: require('@/components/StudentsPage').default
        },
        {
          path: 'files',
          name: 'files',
          component: require('@/components/FilesPage').default
        },
        {
          path: 'admin',
          name: 'admin',
          component: require('@/components/AdminPage').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})