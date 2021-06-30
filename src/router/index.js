
import about from '../components/about'
import home from '../components/home'
import concat from '../components/dropBox/index'
import homePage from '../views/home'

const router = [
    {
        path: '/',
        component: homePage
    },
    {
        path: '/about',
        component: about
    },
    {
        path: '/home',
        component: home
    },
    {
        path: '/concat',
        component: concat
    },

    
]

export default router;