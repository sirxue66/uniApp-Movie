<template>
	<view class="page">
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :circular="true" class="page-swip">
			<swiper-item v-for="image in images">
				<image class="page-pic" :src="image.src1" mode="scaleToFill"></image>
			</swiper-item>
		</swiper>
		<!-- 热门电影 -->
		<view class="page-hot">
			<view class="hot-head">
				<image src="../../static/hot.png" mode="scaleToFill" class="hot-pic"></image>
				<view class="hot-title">热门电影</view>
			</view>
			<scroll-view scroll-x="true" class="hot-scroll">
				<view style="display: flex;">
				<view class="hot-mov" v-for="hotmove in hotmoves">
					<image 
					:src="hotmove.cover" 
					@click="toMovInfo(hotmove.id)"
					mode="scaleToFill" 
					class="hot-movpic">
					</image>
					<view class="hot-movtitle"> {{hotmove.name}}</view>
					<Scores :movScores="hotmove.score" showNum = "1"></Scores>
				</view>
				</view>
			</scroll-view>
		</view>
		<!-- 热门预告 -->
		<view class="page-video">
			<view class="hot-head">
				<image src="../../static/hot2.png" mode="scaleToFill" class="hot-pic"></image>
				<view class="hot-title">热门预告</view>
			</view>
			<scroll-view scroll-x="true" class="hot-scroll2">
				<view class="hot-videos">
					<view v-for="movie in moviehead" class="hot-video1">
					<video
					 :id="movie.id"
					 :data-playingMovie = "movie.id"
					 @play="mePlay"
					@click="toMovInfo(movie.id)"
					:src="movie.trailer"
					:poster="movie.poster"
					controls 
					class="hot-video">
					</video>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 猜你喜欢 -->
		<view>
			<view class="hot-head">
				<image src="../../static/like.png" mode="scaleToFill" class="hot-pic"></image>
				<view class="hot-title">猜你喜欢</view>
			</view>
			<view class="like-container">
				<view class="like-movie" v-for="like in likemovies">
					<image
					 @click="toMovInfo(like.id)"
					 :src="like.cover" 
					 mode="scaleToFill" 
					 class="like-pic">
					 </image>
					<view class="like-describe">
						<view class="like-title">{{like.name}}</view>
						<Scores :movScores="like.score" showNum = "0"></Scores>
						<view class="like-info">{{like.basicInfo}}</view>
						<view class="like-info">{{like.releaseDate}}</view>
					</view>
					<view class="like-good">
						<image src="../../static/good.png" mode="scaleToFill" class="good-pic"></image>
						<view class="good-text">
							点赞+1
						</view>
					</view>
				</view>
			</view>
		</view>
		<Foot />
	</view>
</template>

<script>
	import Scores from "../../components/scores.vue"
	import Foot from "../../components/foot.vue"
	export default {
		components:{
			Scores,
			Foot
		},
		data() {
			return {
				images:[
					{
						"id":1,
						"src1": "../../static/01.png"
					},
					{
						"id":2,
						"src1": "../../static/02.png"
					},
					{
						"id":3,
						"src1": "../../static/03.png"
					},
					{
						"id":4,
						"src1": "../../static/04.png"
					},
					{
						"id":5,
						"src1": "../../static/05.png"
					},
					{
						"id":6,
						"src1": "../../static/06.png"
					}
				],
				hotmoves: [],
				moviehead: [],
				likemovies: [],
				
			}
		},
		onPullDownRefresh() {
			let me = this;
			me.refashMovie();
		},
		onHide() {
			if(this.currentPlay){
				this.currentPlay.pause();
			}
		},
		onLoad() {
			let me = this;
			// 查询热门预告
			uni.request({
				url: me.serverUrl("/index/movie/hot", ['type=superhero']),
				method:"POST",
				success:(res) => {
					// debugger;
					if(res.data.status == 200){
						me.hotmoves = res.data.data;
					}else {
						console.log("热门电影请求出错");
					}
				}
			});
			// 查询预告片
			uni.request({
				url: me.serverUrl("/index/movie/hot", ['type=trailer']),
				method:"POST",
				success:(res) => {
					// debugger;
					if(res.data.status == 200){
						me.moviehead = res.data.data;
					}else {
						console.log("电影预告请求出错");
					}
				}
			});
			me.refashMovie();
		},
		methods: {
			// 猜你喜欢请求更新方法
			refashMovie(){
				// 刷新数据时显示Loading，提高用户交互效果
				uni.showLoading({
					mask: true,
				});
				
				// 随机查询猜你喜欢
				uni.request({
					url: this.serverUrl("/index/guessULike"),
					method:"POST",
					success:(res) => {
						// debugger;
						if(res.data.status == 200){
							this.likemovies = res.data.data;
						}else {
							console.log("猜你喜欢请求出错");
						}
					},
					// 下拉刷新成功关闭刷新图标
					complete: () => {
						uni.stopPullDownRefresh();
						uni.hideLoading();
					}
				});
			},
			// 跳转详情页
			toMovInfo(movId){
				uni.navigateTo({
					url:"../movInfo/movInfo?movId=" + movId,
				})
			},
			// 控制只播放一个视频
			mePlay(e){
				var movId = "";
				if(e){
					movId = e.currentTarget.dataset.playingMovie;
					this.currentPlay = uni.createVideoContext(movId);
				};
				for(var i = 0; i < this.moviehead.length; i ++){
					if(this.moviehead[i].id != movId){
						uni.createVideoContext(this.moviehead[i].id).pause();
					}
				}
			},
		}
	}
</script>

<style>
	@import url("index.css");
</style>
