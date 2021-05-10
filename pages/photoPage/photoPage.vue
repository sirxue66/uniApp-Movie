<template>
<view class="page page-fill">
		
		<view class="pending-wapper">
			<image id="avator" :src="filePath" class="pending-face" mode="scaleToFill"></image>
		</view>
		<view class="footer-opertor">
			<view class="opertor-words" @click="ChoosePicOnce">
				重新选择
			</view>
			<view class="opertor-words" @click="update">
				确认上传
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				filePath: ""
			}
		},
		onLoad(params) {
			var me = this;
			var tempFilePath = params.tempFilePaths;
			me.filePath = tempFilePath;
		},
		methods: {
			// 重新选择照片上传
			ChoosePicOnce(){
			uni.chooseImage({
				count:1,
				sizeType:["compressed"],  //压缩图
				sourceType:["album"],   // album 相册选择  camare 相机拍照
				success:(result)=>{
					this.filePath = result.tempFilePath;
				}
			})	
		},
		// 确认上传
		update(){
			var me = this;
			var userinfo = uni.getStorageSync("userInfo");
			// 发起请求,使用上传文件接口 更换用户头像
			uni.showLoading({
				title:"上传中...",
				mask:true
			});
			uni.uploadFile({
				url:me.serverUrl("user/uploadFace",["userId="+userinfo.id]),
				filePath:me.filePath,   //临时文件路径
				name:"file",
				header:{           //定义请求头，与后端保持一致
					"headerUserId": userinfo.id,
					"headerUserToken":userinfo.userUniqueToken
				},
				success:(res)=>{	
					// console.log(res.data);
					// debugger
					// 返回的是JSON数据，需要转换一下
					var resData = JSON.parse(res.data)
					// console.log(resData);
					if(resData.status == 200){
						uni.setStorageSync("userInfo",resData.data);   //拿到新的用户数据，存入缓存
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
			})
		}
	}
	}
</script>

<style>
/* 页面铺满屏幕 */
.page-fill {
	width:100%;
	height: 100%;
	position: absolute;
	background: black;
}

.pending-wapper {
	display: flex;
	flex-direction: row;
	justify-content: center;
	
	margin-top: 40upx;
}
.pending-face {
	width: 600upx;
	height: 600upx;
}

.notice {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

.notice-words {
	color: gray;
	font-size: 13px;
	margin-top: 30upx;
	width: 600upx;
}

/* 底部操作 start */
.footer-opertor {
	position: fixed;
	bottom: 0;
	
	border-top: #515050 solid 1px;
	width: 100%;
	
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	
	padding: 30upx;
}
.opertor-words {
	color: #e8e5e5;
	font-size: 16px;
	width: 200upx;
}
</style>
