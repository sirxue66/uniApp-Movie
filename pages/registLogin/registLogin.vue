<template>
	<view class="page">
		<!-- 账号密码登录 -->
		<view class="login">
			<image src="../../static/user.png" mode="scaleToFill" class="login-pic"></image>
			<view class="login-mess">
				<view class="login-lable">用户名：</view>
				<input v-model="userName" type="text" placeholder="请输入用户名" placeholder-class="gray"/>
			</view>
			<view class="login-mess">
				<view class="login-lable">密码：</view>
				<input v-model="password" type="text" password="true" placeholder="请输入密码" placeholder-class="gray"/>
			</view>
				<button @click="login" type="primary" class="login-btn">注册/登录</button>
		</view>
		
		<!-- 第三方登录  H5不支持第三方登录，所以使用条件编译 -->
		<!-- 除了H5端，其他端都编译 -->
		<!-- #ifndef H5 -->
			<view class="login-other">
				<view class="login-other-title">
					<view class="login-other-line"></view>
					<view class="login-other-words">第三方登录</view>
					<view class="login-other-line"></view>
				</view>
				
				<!-- 在微信小程序上编译,实现微信登录 -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="login-other-icon">
					<!-- open-type='getUserInfo' 表示使用微信开放能力 -->
					<button open-type="getUserInfo" @getuserinfo="wxLogin" class="login-wx"></button>
				</view>
				<!-- #endif -->
				
				<!-- 在APP上编译 ，实现微信、QQ、微博 登录-->
				<!-- #ifdef APP-PLUS -->
				<view class="login-other-icon">
					<image data-logintype="weixi" @click="loginByOther" src="../../static/weixin.png" mode="scaleToFill" class="login-app"></image>
					<image data-logintype="qq" @click="loginByOther" src="../../static/QQ.png" mode="scaleToFill" class="login-app"></image>
					<image data-logintype="sinaweibo" @click="loginByOther" src="../../static/weibo.png" mode="scaleToFill" class="login-app"></image>
				</view>
				<!-- #endif -->
			</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userName: '',
				password: ''
			}
		},
		methods: {
			login(){
				uni.showLoading({
					mask:true,
					title:"登录中..."
				});
				uni.request({
					url:this.serverUrl("/user/registOrLogin"),
					data:{
						"username":this.userName,
						"password":this.password
					},
					method:"POST",
					success:(res)=>{
						if(res.data.status === 200){
							let userInfo = res.data.data;
							// console.log(userInfo);
							// 将用户数据存储到缓存中
							uni.setStorageSync("userInfo",userInfo);
							uni.showToast({
								title:"登录成功"
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
					complete:()=>{
						uni.hideLoading();
					}
				})
			},
			// 微信小程序中，微信登录
			wxLogin(e){
				 // 通过微信开放能力获取用户基本信息
				 var userInfo = e.detail.userInfo;
				 // 进行微信登录
				 // debugger
				 uni.login({
				 	provider:"weixin",
					success: (loginResult) => {
						// console.log(loginResult);
						var code = loginResult.code;
						// 获得微信授权的code，进行后台登录
						// 后台设置了接口类型，使用whichMP= 1的接口使用
						var whichMP = 1;
						uni.request({
							url:this.serverUrl("/stu/mpWXLogin/" + code),
							method:"POST",
							data:{
								"avatorUrl": userInfo.avatarUrl,
								"nickName":userInfo.nickName,
								"whichMP":whichMP
							},
							success: (res) => {
								// 后台没有做微信登录的相关业务，所以会返回500，（可以自己去做）
								if(res.data.status === 200){
								var user = res.data.data
								uni.setStorageSync("userInfo",user);
								uni.showToast({
									title:"登录成功",
									mask:true,
									duration:2000
								});
								uni.switchTab({
									url:"../myPage/myPage"
								});
								} else {
									uni.showToast({
										title:"登录失败",
										duration:2000,
										image:"../../static/error.png"
									});
								}
							}
						})
					}
				 })
			},
			// app中 实现第三方登录
			loginByOther(e){
				var me = this;
				var loginType = e.currentTarget.dataset.logintype;
				// 授权登录
				uni.login({
					provider:loginType,
					success: (rest) => {
						// 授权成功,获取用户基本信息
						uni.getUserInfo({
							provider:loginType,
							success: (resInfo) => {
								var user = resInfo.userInfo;
								var face = "";
								var nickname = "";
								var openIdOrUid = "";
								if(loginType == "weixin"){
									face = user.avatarUrl;
									nickname = user.nickName;
									openIdOrUid = user.openId;
								} else if(loginType == "qq"){
									face = user.figureurl_qq_2;
									nickname = user.nickName;
									openIdOrUid = user.openId;
								} else {
									face = userInfo.avatar_large
									nickname = userInfo.nickname
									openIdOrUid = userInfo.id
								};
									}
							});
						// 进行后端登录
						uni.request({
							url:me.serverUrl('appUnionLogin/' + loginType),
							data:{
								"face": face,
								"nickname": nickname,
								"openIdOrUid": openIdOrUid
							},
							method:"POST",
							success: (res) => {
								if(res.data.status == 200){
									var user = res.data.data
									uni.setStorageSync("userInfo",user);
									uni.showToast({
										title:"登录成功",
										mask:true,
										duration:2000
									});
									uni.switchTab({
										url:"../myPage/myPage"
									});
								}
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
@import url("registLogin.css");
</style>
