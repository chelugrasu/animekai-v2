import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/LandingPage.vue'
import HomePage from '../components/HomePage.vue'
import SeriesPage from '../components/SeriesPage.vue'
import MoviesPage from '../components/MoviesPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import LoginPage from '../components/LoginPage.vue'
import VerifyPage from '../components/VerifyPage.vue'
import ForgotPassPage from '../components/ForgotPassPage.vue'
import ResetPasswordPage from '../components/ResetPasswordPage.vue'
import uploadFilesPage from '../components/UploadPhotoPage.vue'
import episodesPage from '../components/EpisodesPage.vue'
import WatchPage from '../components/WatchPage.vue'
import MemberPage from '../components/ProfilePage.vue'
import ChangeEmailPage from '../components/ChangeEmail.vue'



const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/series',
    name: 'SeriesPage',
    component: SeriesPage
  },
  {
    path: '/movies',
    name: 'Movies Page',
    component: MoviesPage
  },
  {
    path: '/register',
    name: 'Register Page',
    component: RegisterPage
  },
  {
    path: '/login',
    name: 'Login Page',
    component: LoginPage
  },
  {
    path: '/verify',
    name: 'Verify Page',
    component: VerifyPage
  },
  {
    path: '/forgot-password',
    name: 'Forgot Password Page',
    component: ForgotPassPage
  },
  {
    path: '/reset-password',
    name: 'Reset Password Page',
    component: ResetPasswordPage
  },
  {
    path: '/upload-files',
    name: 'Upload Files Page',
    component: uploadFilesPage
  },
  {
    path: '/:episodesPage', // Dynamic segment for the series name directly under the root route
    name: 'Episodes Page',
    component: episodesPage
  },
  {
    path: '/watch/:episode', // Dynamic segment for the series name directly under the root route
    name: 'Watch Episode Page',
    component: WatchPage
  },
  {
    path: '/member/:username', // Dynamic segment for the series name directly under the root route
    name: 'Member Page',
    component: MemberPage
  },
  {
    path: '/change-email', // Dynamic segment for the series name directly under the root route
    name: 'Change Email Page',
    component: ChangeEmailPage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
