import {
    createRouter,
    createWebHistory
} from "vue-router";

const MainHome = () => import('@/views/backstage/main/MainHome.vue')
const MainLogin = () => import('@/views/backstage/main/MainLogin.vue')
const MainRegister = () => import('@/views/backstage/main/MainRegister.vue')
const main = [
    {
        path: "/",
        component: MainHome,
        name: 'Home'
    },
    {
        path: '/login',
        component: MainLogin,
        name: 'Login'
    },
    {
        path: '/register',
        component: MainRegister,
        name: 'Register'
    },
]

const MenuManage = () => import('@/views/backstage/management/MenuManage.vue')
const menu = [
    {
        path: '/menu',
        component: MenuManage,
        name: 'MenuManage'
    }
]

const NotFound = () => import('@/views/backstage/other/NotFound.vue')
const other = [
    {
        path: "/404",
        name: "NotFound",
        component: NotFound
    },
    {
        path: '/:pathMatch(.*)*', // 此处需特别注意置于最底部
        redirect: "/404"
    }
]

const routes: any = []
routes.push(...main, ...menu, ...other)

const routesUse: any = []
const OrderDish = () => import('@/views/frontdesk/OrderDish.vue')
const DeskDish = () => import('@/views/frontdesk/DeskDish.vue')
const QrCode = () => import('@/views/frontdesk/QrCode.vue')
const routesMobile: any = [
    {
        path: '/:table_number',
        component: OrderDish,
        name: 'OrderDish'
    },
    {
        path: '/order/:table_number',
        component: DeskDish,
        name: 'DeskDish'
    },
    {
        path: '/QrCode',
        component: QrCode,
        name: 'QrCode'
    },
    {
        path: "/404",
        name: "NotFound",
        component: NotFound
    },
    {
        path: '/:pathMatch(.*)*', // 此处需特别注意置于最底部
        redirect: "/404"
    }
];

if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    routesUse.push(...routesMobile)
    localStorage.isMobile = true
} else {
    routesUse.push(...routes)
}



const router = createRouter({
    history: createWebHistory(),
    routes: routesUse,
})

router.beforeEach(async (to) => {
    // console.log(to);
    // console.log(localStorage);
    // console.log(localStorage.isMobile);

    // console.log(!localStorage.isAuthenticated &&
    //     // ❗️ 避免无限重定向
    //     to.name !== 'Login' &&
    //     to.name !== 'Register' &&
    //     !localStorage.isMobile);

    if (
        // 检查用户是否已登录
        !localStorage.isAuthenticated &&
        // ❗️ 避免无限重定向
        to.name !== 'Login' &&
        to.name !== 'Register' &&
        !localStorage.isMobile
    ) {
        // 将用户重定向到登录页面
        return { name: 'Login' }
    }
    // if (
    //     localStorage.isMobile &&
    //     to.name !== 'OrderDish'
    // ) {
    //     return { name: 'OrderDish' }
    // }
})

export default router