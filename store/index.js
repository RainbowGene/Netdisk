import Vue from 'vue'
import Vuex from "vuex"
Vue.use(Vuex)

import $H from "../common/lib/request.js"

export default new Vuex.Store({
	state: {
		user: null,
		token: null,
		uploadList: [], // 上传列表
		downList: [], // 下载列表
	},
	actions: {
		login({
			state
		}, user) {
			state.user = user
			state.token = user.token

			uni.setStorageSync('user', JSON.stringify(user))
			uni.setStorageSync('token', user.token)
		},
		logout({
			state
		}) {
			$H.post('/logout', {}, {
				token: true
			})
			state.user = null;
			state.token = null;
			uni.removeStorageSync('user');
			uni.removeStorageSync('token');

			uni.reLaunch({
				url: "/pages/login/login"
			})
		},
		initUser({
			state
		}) {
			let user = uni.getStorageSync('user')
			if (user) {
				state.user = JSON.parse(user)
				state.token = state.user.token
			}
		},
		updateSize({
			state
		}, e) {
			state.user.total_size = e.total_size
			state.user.used_size = e.used_size
		},
		// 创建上传任务
		createUploadJob({
			state
		}, obj) {
			state.uploadList.unshift(obj)
			uni.setStorage({ // 保存上传记录
				key: 'uploadList_' + state.user.id,
				data: JSON.stringify(state.uploadList)
			})
		},
		// 更新上传任务进度
		updateUploadJob({
			state
		}, obj) {
			// 找到任务 唯一key值
			let i = state.uploadList.findIndex(item => item.key === obj.key)
			if (i !== -1) {
				// 更新修改进度
				state.uploadList[i].progress = obj.progress;
				state.uploadList[i].status = obj.status;
				// 修改本地存储
				uni.setStorage({ // 保存上传记录
					key: 'uploadList_' + state.user.id,
					data: JSON.stringify(state.uploadList)
				})
			}
		},
		// 创建下载任务
		createDownLoadJob({
			state
		}, obj) {
			state.downList.unshift(obj)
			uni.setStorage({ // 保存上传记录
				key: 'downList_' + state.user.id,
				data: JSON.stringify(state.downList)
			})
		},
		// 更新下载任务进度
		uploadDownLoadJob({
			state
		}, obj) {
			// 找到任务 唯一key值
			let i = state.downList.findIndex(item => item.key === obj.key)
			if (i !== -1) {
				// 更新修改进度
				state.downList[i].progress = obj.progress;
				state.downList[i].status = obj.status;
				// 修改本地存储
				uni.setStorage({ // 保存上传记录
					key: 'downList_' + state.user.id,
					data: JSON.stringify(state.downList)
				})
			}
		},
		// 更新上传/下载列表
		initList({
			state
		}) {
			if (state.user) {
				let d = uni.getStorageSync("downlist_" + state.user.id)
				let u = uni.getStorageSync("uploadlist_" + state.user.id)

				state.downList = d ? JSON.parse(d) : []
				state.uploadList = u ? JSON.parse(u) : []
			}
		},
	}
})
