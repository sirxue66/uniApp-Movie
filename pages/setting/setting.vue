<template>
	<view class="page">
		<view class="my-setting">
			<!-- 头像 -->
			<view class="my-pic" @click="updatePic">
				<view class="my-text">头像</view>
				<image :src="userinfo.faceImage" mode="scaleToFill" class="my-img"></image>
				<image src="../../static/right.png" mode="scaleToFill" class="my-img-right"></image>
			</view>
			<Lines />
			<!-- 昵称 -->
			<view class="my-call">
				<view class="my-text1">昵称</view>
				<view class="my-text2">{{userinfo.nickname}}</view>
				<image src="../../static/right.png" mode="scaleToFill" class="my-img-right"></image>
			</view>
			<Lines />
			<!-- 生日 -->
			<view class="my-call">
				<view class="my-text1">生日</view>
				<view class="my-text2">{{userinfo.birthday}}</view>
				<image src="../../static/right.png" mode="scaleToFill" class="my-img-right"></image>
			</view>
			<Lines />
			<!-- 性别 -->
			<view class="my-call">
				<view class="my-text1">性别</view>
				<view v-if="userinfo.sex == null" class="my-text2">未设置</view>
				<view v-else class="my-text2">{{userinfo.sex == 0 ? "女" : "男"}}</view>
				<image src="../../static/right.png" mode="scaleToFill" class="my-img-right"></image>
			</view>
			<Lines />
			<view class="my-btn" @click="toEdit">编辑信息</view>
			<!-- 清理缓存 -->
			<view class="my-btn" @click="clearStorage">清理缓存</view>
			<!-- 退出 -->
			<view class="my-btn" @click="logout">退出</view>
		</view>
	</view>
</template>

<script>
	import Lines from "../../components/lines.vue"
	export default {
		components:{
			Lines
		},
		data() {
			return {
				userinfo: {}
			}
		},
		onShow() {
			let userinfo = uni.getStorageSync('userInfo');
			if(userinfo != "" && userinfo != null && userinfo != undefined){
				this.userinfo = userinfo;
			} else {
				return
			}
		},
		onHide() {
			this.userinfo = {};
		},
		methods: {
			clearStorage(){
				uni.removeStorageSync("userInfo");
				// uni.clearStorageSync();  //清除所有缓存
				uni.showToast({
					title:"清理成功",
					mask:true,
					duration:1000
				});
			},
			logout(){
				let userID = this.userinfo.id;
				uni.showLoading({
					title:"退出中..."
				});
				uni.request({
					url: this.serverUrl("/user/logout",["userId=" + userID]),
					method:"POST",
					success: (res) => {
						if(res.data.status === 200){
							uni.removeStorageSync("userInfo");
							uni.showToast({
								title:"退出成功",
								duration:1000
							});
							uni.switchTab({
								url:"../myPage/myPage"
							});
						} else {
							uni.showToast({
								title: res.data.msg,
								duration:1000,
								image:"../../static/error.png"
							});
						}
					},
					complete:() => {
						uni.hideLoading();
					}
				});
			},
			// 上传头像
			updatePic(){
				var me =this;
				uni.showActionSheet({
					itemList:["预览头像","更换头像"],
					success: (result) => {
						if(result.tapIndex == 0){
							uni.navigateTo({
								url:"../movPic/movPic?movCover="+me.userinfo.faceImage
							});
						} else if(result.tapIndex == 1){
							console.log("从相册选择图片上传");
							
							// 从相册选取图片上传
							uni.chooseImage({
								count:1,
								sizeType:["compressed"],  //压缩图
								sourceType:["album"],   // album 相册选择  camare 相机拍照
								success: (res) => {
									var temppath = res.tempFilePaths[0];
									uni.navigateTo({
										url:"../photoPage/photoPage?tempFilePaths="+temppath
									});
								}
							})
							
						}
					},
				});
			},
			// 跳转编辑页面
			toEdit(){
				uni.navigateTo({
					url:"../editMeInfo/editMeInfo"
				});
			}
		}
	}
</script>

<style>
@import url("setting.css");
</style>
