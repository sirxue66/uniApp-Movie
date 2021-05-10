<template>
	<view class="page">
		<view v-if="isLogin" class="my-header">
			<navigator :url="'../movPic/movPic?movCover='+ user.faceImage">
			<image :src="user.faceImage" mode="scaleToFill" class="my-pic"></image>
			</navigator>
			<view class="my-info">
			<view class="my-name">{{user.nickname}}</view>
			<view class="my-id">Id：{{user.id}}</view>
			</view>
				<image @click="toSetting" src="../../static/set.png" mode="scaleToFill" class="my-set"></image>
		</view>
		<view v-else class="my-header">
			<navigator url="../movPic/movPic?movCover=../../static/user.png">
			<image src="../../static/user.png" mode="scaleToFill" class="my-pic"></image>
			</navigator>
			<navigator url="../registLogin/registLogin">
				<view class="my-info my-name">登录 / 注册</view>
			</navigator>
		</view>
		<!-- 推荐 -->
			<view class="recommended">
				<view class="movName">晴雅集</view>
				<view class="qyPic"></view>
			</view>
			<view class="myself">
				<view class="movName">微博</view>
				<view class="weibo">
				https://www.weibo.com/5852703221/profile?
				</view>
			</view>
			<view class="myself">
				<view class="movName">博客</view>
				https://sirxue66.github.io/
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLogin: false,
				user: {}
			}
		},
		onShow() {
			var user = uni.getStorageSync("userInfo");
			if(user != "" && user != null && user != undefined){
				this.isLogin = true;
				this.user = user
			} else {
				this.isLogin = false;
				this.user = {};
			}
		},
		methods: {
			// 跳转设置
			toSetting(){
				uni.navigateTo({
					url:"../setting/setting"
				});
			}
		}
	}
</script>

<style>
@import url("myPage.css");
</style>
