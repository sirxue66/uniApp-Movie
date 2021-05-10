<template>
	<view class="hot-movscore">
		<!-- <image src="../static/score.png" mode="scaleToFill" class="mov-score"></image>
		<image src="../static/score.png" mode="scaleToFill" class="mov-score"></image>
		<image src="../static/score.png" mode="scaleToFill" class="mov-score"></image>
		<image src="../static/score.png" mode="scaleToFill" class="mov-score"></image>
		<image src="../static/score01.png" mode="scaleToFill" class="mov-score"></image>
		<view>9.0</view> -->
		<image
		 v-for="y in yellow"
		 src="../static/score.png" mode="scaleToFill" 
		 class="mov-score">
		 </image>
		 <image
		  v-for="g in gray"
		  src="../static/score01.png" mode="scaleToFill" 
		  class="mov-score">
		  </image>
		  <view class="mov-scores" v-if="showNum == 1">{{movScores}}</view>
	</view>
</template>

<script>
	export default {
		name:"scores",
		data() {
			return {
				yellow: 0,
				gray: 5,
			};
		},
		props:{
			movScores: {
				type: Number,
				default: 0,
			},    // 传入的分数值
			showNum: {
				type: String,
				default: "0",
			}    //是否显示具体分数   0 不显示   1 显示
		},
		created() {
			let handlescore = 0;
			if(this.movScores !== null && this.movScores !== undefined && this.movScores !== ''){
				handlescore = this.movScores;
			};
			this.yellow = parseInt(handlescore / 2);
			this.gray = 5 - this.yellow;
		}
	}
</script>

<style>
	.hot-movscore{
		width: 100%;
		height: 30upx;
		display: flex;
	}
	.mov-score{
		height: 30upx;
		width: 30upx;
	}
	.mov-scores{
		font-size: 15px;
		line-height: 30upx;
		font-weight: bold;
	}
</style>
