<template>
	<view class="movpic-look">
		<image 
		:src="movPic" 
		mode="widthFix"
		@longpress="controller"
		class="movpic-pic">
		</image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				movPic: ""
			}
		},
		onLoad(params) {
			this.movPic = params.movCover;
		},
		methods: {
			controller(){
				var me = this;
				// 底部弹出框    (下载保存在H5上不支持，两个原因：一是后端没做跨域处理，二是uni接口不支持H5上保存
				uni.showActionSheet({
					itemList:["保存图片","转发图片","返回"],
					success: function(res) {
						// 根据下标，也就是tabIndex判断点击的哪个按钮
						if(res.tapIndex == 0){   //保存图片功能
						// debugger
							uni.showLoading({
								title: "保存中..."
							});
							// 下载 保存图片
							uni.downloadFile({
								url:me.movPic,
								success:function(result){
										let tempFilePath = result.tempFilePath;
										uni.saveImageToPhotosAlbum({
											filePath:tempFilePath,
											success:function(){
													uni.showToast({
														title:"保存成功",
														duration:2000
													});
											},
											complete:function(){
												uni.hideLoading();
											}
										});
								},
							});
						}
					}
				})
			},
		}
	}
</script>

<style>
uni-page-body{
		height: 100%;
	}
.movpic-look{
	background-color: #000000;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
}
.movpic-pic{
	margin: auto;
}
</style>
