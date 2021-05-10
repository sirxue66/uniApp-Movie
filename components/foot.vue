<template>
	<view class="page-footer">
			<view class="footer-text">
				仅供学习使用，无任何商业价值.
				如有侵权，立马删除，谢谢！
			</view>
			
	</view>
</template>

<script>
	export default {
		name:"foot",
		data() {
			return {
				
			};
		}
	}
</script>

<style>
	.page-footer{
		height: 160upx;
		width: 100%;
		background-color: #dadada;
		border-radius: 10upx;
	}
	.footer-text{
		height: 80upx;
		width: 100%;
		line-height: 80upx;
		text-align: center;
		color: #eb909c;
	}
</style>
