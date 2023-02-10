<template>
<!-- 老虎机抽奖插件 -->
	<div>
		<SlotMachine
			ref="myLucky"
			width="300px"
			height="300px"
			:prizes="prizes"
			:blocks="blocks"
			:slots="slots"
			@end="endCallback"
		/>
		<button @click="init">初始化</button>
		<button @click="play">抽奖</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			blocks: [{ padding: "13px" }],
			prizes: [
				{ fonts: [{ text: "1", top: "10%" }], background: "#b8c5f2" },
				{ fonts: [{ text: "2", top: "30%" }], background: "#e9e8fe" },
				{ fonts: [{ text: "3", top: "10%" }], background: "#b8c5f2" },
				{ fonts: [{ text: "4", top: "10%" }], background: "#e9e8fe" },
				{ fonts: [{ text: "5", top: "10%" }], background: "#b8c5f2" },
				{ fonts: [{ text: "6", top: "10%" }], background: "#b8c5f2" },
			],
			slots: [
				{
					order: [1, 2, 3, 4, 5, 6],
					speed: 40,
					direction: 1,
				},
				{
					order: [1, 2, 3, 4, 5, 6],
					speed: 30,
					direction: 1,
				},
				{
					order: [1, 2, 3, 4, 5, 6],
					speed: 20,
					direction: 1,
				},
			],
		};
	},
	methods: {
		// 点击抽奖按钮会触发star回调
		startCallback() {
			// // 调用抽奖组件的play方法开始游戏
			// this.$refs.myLucky.play()
			// // 模拟调用接口异步抽奖
			// setTimeout(() => {
			//   // 假设后端返回的中奖索引是0
			//   const index = 0
			//   // 调用stop停止旋转并传递中奖索引
			//   this.$refs.myLucky.stop(index)
			// }, 3000)
		},
		init() {
			this.$refs.myLucky.init();
		},
		play() {
			this.$refs.myLucky.play();
			setTimeout(() => {
				const index = 0;
				this.$refs.myLucky.stop(index);
			}, 3000);
		},
		// 抽奖结束会触发end回调
		endCallback(prize) {
			console.log(prize);
		},
	},
};
</script>
<style lang="less" scoped>
button{
  margin: 20px;
  padding: 10px;
}
</style>
