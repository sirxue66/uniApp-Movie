<template>
	<view class="page">
		<!-- vedio 区域 -->
		<view class="movInfo-mp4">
			<video 
			id="myVideo"
			:src="movMessage.trailer" 
			:poster="movMessage.poster"
			controls 
			class="movInfo-video">
			</video>
		</view>
		<!-- 影片详情 -->
		<view class="movInfo">
			<view class="movInfo-pic">
				<navigator :url="'../movPic/movPic?movCover=' + movMessage.cover">
				<image :src="movMessage.cover" mode="scaleToFill" class="movInfo-img"></image>
				</navigator>
			</view>
			<view class="movInfo-mess">
				<view class="movInfo-title">{{movMessage.name}}</view>
				<view class="movInfo-introduction">
					{{movMessage.basicInfo}} <br/>
					{{movMessage.totalTime}}<br/>
					{{movMessage.releaseDate}}<br/>
				</view>
				<view class="movInfo-score">
					<view class="score-num">综合评分：<br/>
					<h2>{{movMessage.score}}</h2>
					</view>
					<view class="socre-star">
						<!-- 此处判断解决还没拿到数据就将对象传给组件，导致数据一直是undefined的问题 -->
						<block v-if="movMessage.score >= 0">
						<Scores :movScores = "movMessage.score" showNum = "0" />
						</block>
						<view class="socre-good">
							<h4>{{movMessage.prisedCounts}}</h4> 人点赞
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 分割线 -->
		<Lines />
		<!-- 剧情 -->
		<view class="movInfo-detail">
			<view class="detail-title">剧情介绍：</view>
			<scroll-view scroll-y="true" class="detail-text">
			{{movMessage.plotDesc}}
			</scroll-view>
		</view>
		<!-- 演员 -->
		<view class="mov-people">
			<view class="people-title">出演明星：</view>
			<scroll-view scroll-x="true">
				<view class="people-scroll">
				<view class="people" v-for="(star,starIndex) in starPics">
				<view class="people-pic">
					<image 
					class="people-img" 
					:src="star.photo" 
					:data-starIndex="starIndex"
					@click="lookStar"
					mode="scaleToFill">
					</image>
				</view>
				<view class="people-name">{{star.name}}</view>
				</view>
				</view>
			</scroll-view>
		</view>
		<!-- 剧照 -->
		<view class="mov-people">
			<view class="people-title">剧照：</view>
			<scroll-view scroll-x="true">
				<view class="people-scroll">
				<view class="people" v-for="(mov, movIndex) in movPics">
				<view class="people-pic">
					<image 
					class="people-img" 
					:src="mov" 
					:data-movIndex="movIndex"
					mode="scaleToFill"
					@click="lookIt">
					</image>
				</view>
				</view>
				</view>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
	import Scores from "../../components/scores.vue"
	import Lines from "../../components/lines.vue"
	export default {
		components:{
			Scores,
			Lines
			},
		data() {
			return {
				movMessage: {},
				starPics:[],
				movPics:[],
			}
		},
		onReady() {
			this.myVideo = uni.createVideoContext('myVideo');
		},
		// #ifndef H5
		onHide() {
			this.myVodeo.pause();
		},
		// #endif
		onShow() {
			if(this.myVideo){
			this.myVideo.play();
			}
		},
		onLoad(params) {
			let me = this;
			let movieId = params.movId;
			uni.request({
				url: me.serverUrl("/search/trailer/" + movieId),
				method:"POST",
				success:(res) => {
					// debugger;
					if(res.data.status == 200){
						me.movMessage = res.data.data;
						// 获取剧照的JSON数据，并做转换
						me.movPics = JSON.parse(res.data.data.plotPics);
					}else {
						console.log("预告片请求出错");
					}
				},
			});
			// 获取演员信息
			uni.request({
				url: me.serverUrl("/search/staff/" + movieId + "/" + 2),
				method:"POST",
				success:(res) => {
					// debugger;
					if(res.data.status == 200){
						me.starPics = res.data.data;
					}else {
						console.log("预告片请求出错");
					}
				},
			});
		},
		// 设置微信小程序分享功能，分享到群或好友
		onShareAppMessage(res) {
			// 没有判断，所以只给当前页面设置了分享功能
			return{
				title: this.movMessage.name,
				path: '/pages/movInfo/movInfo?movId=' + this.movMessage.id,
			}
		},
		// TODO  微信开发工具中不显示  需要真机调试
		// 监听自定义导航栏并添加相应事件
		onNavigationBarButtonTap(e) {
			var barIndex = e.index;
			let me = this;
			let movInfo = me.movMessage;
			let movId = movInfo.id;
			let movName = movInfo.name;
			let movCover = movInfo.cover;
			// 根据index给自定义导航栏添加事件
			if(barIndex == 0){
				uni.share({
					provider:"weixin",
					scene:"WXSenceTimeline",
					type:0,
					href:"https://www.imovietrailer.com/superhero//search/trailer/?movId="+ movId,
					title:"《" + movName + "》",
					summary:"《" + movName + "》",
					imageUrl:movCover,
					success: (res) => {
						uni.showToast({
							title:"分享成功"
						});
					}
				});
			}
		},
		methods: {
			// 预览图片
			lookIt(e){
				let movIndex = e.currentTarget.dataset.movIndex;
				uni.previewImage({
					current:this.movPics[movIndex],
					urls:this.movPics,
					// 开启循环预览
					// loop:true,
					// indicator:Number
				})
			},
			lookStar(e){
				let starIndex = e.currentTarget.dataset.starIndex;
				let newStarPics = [];
				newStarPics = this.starPics.map(item => {
					return item.photo;
				});
				uni.previewImage({
					current:newStarPics[starIndex],
					urls:newStarPics,
					// loop:true
				})
			},
		}
	}
</script>

<style>
@import url("movInfo.css");
</style>
