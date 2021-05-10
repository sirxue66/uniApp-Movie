<template>
	<view class="page">
		<form @submit="submitMeInfo">
			<view class="meinfo">
				<input 
				type="text" 
				@blur="nimeChange"
				:value="userinfo.nickname" 
				placeholder="请输入昵称"
				maxlength="10"
				class="nickName"/>
			</view>
			<view class="meinfo">
				<picker mode="date" @change="birthdayChange">
					<view>{{userinfo.birthday}}</view>
				</picker>
			</view>
			<view class="meinfo">
				<radio-group class="radio-sex" @change="sexChange">
					<label>
						<radio value="1" :checked="userinfo.sex === 1"/> 男
					</label>
					<label class="sex-choose">
						<radio value="0" :checked="userinfo.sex === 0"/> 女
					</label>
				</radio-group>
			</view>
			<button class="btn" type="default" form-type="submit">提交</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userinfo: {},
				nickName: "",
				birthday: "",
				sex:null
			}
		},
		onLoad() {
			this.userinfo = uni.getStorageSync("userInfo");
			this.nickName = this.userinfo.nickname;
			this.birthday = this.userinfo.birthday;
			this.sex = this.userinfo.sex;
		},
		methods: {
			// 获取输入的昵称
			nimeChange(e){
				this.nickName = e.detail.value;
				// console.log(this.nickName);
			},
			// 选择日期
			birthdayChange(e){
				this.birthday = e.detail.value;
				// console.log(this.birthday);
			},
			// 选择性别
			sexChange(e){
				this.sex = e.detail.value;
				// console.log(this.sex);
			},
			// 向后端提交信息
			submitMeInfo(){
				uni.showLoading({
					title: "请稍后...",
					mask: true
				});
				// debugger
				uni.request({
					url:this.serverUrl('user/modifyUserinfo'),
					data:{
						"userId":this.userinfo.id,
						"birthday":this.birthday,
						"nickname":this.nickName,
						"sex":this.sex
					},
					header:{
						"headerUserId":this.userinfo.id,
						"headerUserToken":this.userinfo.userUniqueToken
					},
					method:"POST",
					success: (res) => {
						if(res.data.status === 200){
							uni.setStorageSync("userInfo",res.data.data);   //拿到新的用户数据，存入缓存
								uni.navigateBack({
									delta:1
								});   // 返回上一页
							}else{
								uni.showToast({
									title:res.data.msg,
									image:"../../static/error.png",
									duration:2000
								});
							}
						},
						complete:()=>{
							uni.hideLoading();
						}	
				});
			}
	   }
	}
</script>

<style>
@import url("editMeInfo.css");
</style>
