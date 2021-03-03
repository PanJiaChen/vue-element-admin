
const enrollmentRoute = [
  {
    path: '/userEnrollment',
    component: () => import('@/views/login/userEnrollment'),
    hidden: true
  },
  {
    path: '/forgotPassword',
    component: () => import('@/views/login/forgotPassword'),
    hidden: true
  },
  {
    path: '/passwordReset',
    name: 'passwordReset',
    component: () => import('@/views/login/setPassword'),
    hidden: true
  },
  {
    path: '/createPassword',
    name: 'createPassword',
    component: () => import('@/views/login/setPassword'),
    hidden: true
  }
]

export default enrollmentRoute
