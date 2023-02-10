import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import T from '../views/T.vue'
import ArcGis from '../views/ArcGis.vue'
import Lucky from '../views/Lucky.vue'
import Vuex from '../views/Vuex.vue'
import NavMenu from "../views/NavMenu.vue";
import File from "../views/File.vue";
import Time from "../views/Time.vue";
import Qrcode from "../views/Qrcode.vue";
import Viewer from "../views/Viewer.vue";
import EpsgLatlng from "../views/epsg.latlng.vue";
import Highcharts from "../views/Highcharts.vue"
import Flv from "../views/Flv.vue"
import test from "../views/test.vue"

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		name: "home",
		component: HomeView,
	},
	{
		path: "/T",
		name: "T",
		component: T,
	},
	// {
	// 	path: "/ArcGis",
	// 	name: "ArcGis",
	// 	component: ArcGis,
	// },
	{
		path: "/lucky",
		name: "lucky",
		component: Lucky,
	},
	{
		path: "/vuex",
		name: "vuex",
		component: Vuex,
	},

	{
		path: "/navMenu",
		name: "navMenu",
		component: NavMenu,
	},
	{
		path: '/file',
		name: 'file',
		component: File
	},
	{
		path: '/time',
		name: 'time',
		component: Time
	},
	{
		path: '/qrcode',
		name: 'qrcode',
		component: Qrcode
	},
	{
		path: '/viewer',
		name: 'viewer',
		component: Viewer
	},
	{
		path: '/epsgLatlng',
		name: 'epsgLatlng',
		component: EpsgLatlng
	},
	{
		path: '/highcharts',
		name: 'highcharts',
		component: Highcharts
	},
	{
		path: '/flv',
		name: 'flv',
		component: Flv
	},
	{
		path: '/test',
		name: 'test',
		component: test
	},
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
