<template>
	<view class="search">
		<view class="search-header">
			<view class="header-pic">
				<image class="header-img" src="../../static/search01.png" mode="scaleToFill"></image>
			</view>
			<input 
			v-model="keywords"
			type="text" 
			placeholder="搜索影片" 
			class="header-input"
			confirm-type="search"
			@confirm="searchMov()"
			/>
		</view>
		
		<view class="search-content">
			<view class="search-mov" v-for="mov in searchList">
				<image 
				class="search-mov-pic" 
				:src="mov.cover" 
				@click="toMovInfo(mov.id)"
				mode="scaleToFill">
				</image>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchList: [],
				keywords: "",
				currentPage: 1,
				totalPage: 1,
				
			}
		},
		onLoad() {
			let me = this;
			me.search();
		},
		onReachBottom() {
			this.currentPage += 1;
			if(this.currentPage > this.totalPage){
				uni.showToast({
					title:"到达底线了！",
					icon:"none",
					duration:1000,
				});
			} else {
				this.search();
				// uni.showToast({
				// 	title:"努力加载中",
				// 	icon:"none",
				// 	duration:2000,
				// });
			}
		},
		methods: {
			// 获取数据
			search(){
				uni.showLoading({
					mask:true,
					title:"加载中",
				});
				uni.request({
					url: this.serverUrl("/search/list", ["keywords=" + this.keywords + "&page=" + this.currentPage +"&pageSize=15"]),
					method:"POST",
					success:(res) => {
						// debugger;
						if(res.data.status == 200){
							let tempList = res.data.data.rows;
							this.searchList = this.searchList.concat(tempList);
							this.totalPage = res.data.data.total;
						}else {
							console.log("搜索列表请求出错");
						}
					},
					complete() {
						uni.hideLoading();
					},
				});
			},
			// 搜索
			searchMov(){
				this.currentPage = 1;
				this.totalPage = 1;
				this.searchList = [];
				this.search();
			},
			// 跳转详情页
			toMovInfo(movId){
				uni.navigateTo({
					url:"../movInfo/movInfo?movId=" + movId,
				})
			},
		}
	}
</script>

<style>
@import url("search.css");
</style>
