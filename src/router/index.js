import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import getMenuRoutes from '@/utils/permission';
import Home from '../views/layout/Home.vue';
import Login from '../views/layout/Login.vue';

Vue.use(VueRouter);

const asyncRouterMap = [{
  path: '/product',
  name: 'Product',
  meta: {
    title: '商品',
    icon: 'inbox',
    hidden: false,
  },
  component: Home,
  children: [
    {
      path: 'list',
      name: 'ProductList',
      meta: {
        title: '商品列表',
        icon: 'unordered-list',
        hidden: false,
      },
      component: () => import('@/views/page/productList.vue'),
    },
    {
      path: 'add',
      name: 'ProductAdd',
      meta: {
        title: '新增商品',
        icon: 'file-add',
        hidden: false,
      },
      component: () => import('@/views/page/productAdd.vue'),
    },
    {
      path: 'edit/:id',
      name: 'ProductEdit',
      meta: {
        title: '编辑商品',
        icon: 'file-add',
        hidden: true,
      },
      component: () => import('@/views/page/productAdd.vue'),
    },
    {
      path: 'category',
      name: 'Category',
      meta: {
        title: '类目管理',
        icon: 'project',
        hidden: false,
      },
      component: () => import('@/views/page/category.vue'),
    },
  ],
}];

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/index',
    meta: {
      title: '首页',
      icon: 'home',
      hidden: false,
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        meta: {
          title: '统计',
          icon: 'number',
          hidden: false,
        },
        // 懒加载
        component: () => import('../views/page/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      hidden: true,
    },
    component: Login,
  },
];

const router = new VueRouter({
  routes,
});
let isAddRoutes = false;
// 进行登录验证
router.beforeEach((to, from, next) => {
  // 如果 页面进入的路径不是登录页面 但cookie中的用户名、appkey、role不为空，则继续下面操作
  if (to.path !== '/login') {
    if (store.state.user.appkey && store.state.user.username && store.state.user.role) {
      if (!isAddRoutes) {
        const menuRoutes = getMenuRoutes(store.state.user.role, asyncRouterMap);
        store.dispatch('changeMenuRoutes', routes.concat(menuRoutes)).then(() => {
          router.addRoutes(menuRoutes);
          next();
        });
        isAddRoutes = true;
      }
      return next();
    }
    // 否则 跳到登录页面
    return next('/login');
  }
  return next();
});
export default router;
