<template>
	<div>
		<button @click="download">下载所有图片</button>
		<!-- 生成二维码的demo -->
		<div class="ewm" v-for="item in QRImgUrl">
			<img :src="item.url" />
			<p>{{item.cdlsjzbh}}{{ item.relicName }}</p>
		</div>
		<canvas id="myCanvas" width="200px" height="200px"></canvas>
	</div>
</template>

<script>
import QRCode from "qrcode";
import axios from "axios";
export default {
	data() {
		return {
			QRImgUrl: [],
			listData: [],
			ewmNameList: [
				"巫氏大夫第",
				"苏继贤旧居",
				"贺麟故居",
				"原华西协合大学校长楼",
				"南桥",
				"夹关镇解放渡槽",
				"广益学社旧址",
				"黄龙溪镇正街61-63号民居",
				"平乐镇花楸村李家院子",
				"四川锅炉厂旧址",
				"郑小康公馆",
				"洛带公园峨亭",
			],
		};
	},
	// 初始化容器
	async created() {
		await this.getList();
		await this.getQRcode();
	},
	methods: {
		getList() {
			return axios({
				method: "post",
				url: "http://183.6.56.136:6030/api/hadb/building/map/homePageList",
				data: {
					jzlb: [],
					jznd: [],
					lsjzmc: "",
					page: 0,
					pageSize: 0,
					qxdm: [],
				},
			}).then((res) => {
				console.log(res.data.data);
				let list = res.data.data;
				// for (let index = 0; index < list.length; index++) {
					// for (let key = 0; key < this.ewmNameList.length; key++) {
						// if (list[index].lsjzmc == this.ewmNameList[key]) {
							// console.log(this.ewmNameList[key], '===',list[index]);
							this.listData.push(...list);
						// }
					// }
				// }
				if (this.listData.length == this.ewmNameList.length) {
					console.log(this.listData.length);
				}
			});
		},
		getQRcode() {
			let opt = {
				errorCorrectionLevel: "H",
				margin: 2,
				width: 128,
				type: "image/png",
			};
			this.listData.map((item) => {
				let completeLink =
					"https://zw.cdzjryb.com/lsjz/#/mapIndex/" + item.buildingUid;
				// console.log(completeLink);
				return QRCode.toDataURL(completeLink, opt).then((url) => {
					this.QRImgUrl.push({ url, relicName: item.lsjzmc,cdlsjzbh: item.cdlsjzbh });
				});
			});
		},
		download() {
			console.log(this.QRImgUrl.length);
			let a= 0
			this.QRImgUrl.map((item,index) => {
				setTimeout(() => {
					if (item.url.length>5) {
						a++
					}
					let link = document.createElement("a");
					link.href = item.url;
					let name = item.cdlsjzbh.split('-').pop()
					link.download = name + item.relicName + ".png";
					link.click();
					link.remove();
				}, index*500);
				
			});
			console.log(a,'++++');
		},
		getCanvas() {
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
		}
	},
};
</script>

<style lang="less" scoped>
.ewm {
	margin-bottom: 30px;
}
</style>