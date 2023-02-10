<template>
	<div>
		<button @click="download">下载所有图片</button>
		<!-- 生成二维码的demo -->
		<div class="ewm" v-for="item in QRImgUrl">
			<img :src="item.url" />
			<p>{{item.cdlsjzbh}}{{ item.relicName }}</p>
		</div>
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
				// return QRCode.toCanvas(completeLink, opt).then((url) => {
				// 	this.QRImgUrl.push({ url, relicName: item.lsjzmc,cdlsjzbh: item.cdlsjzbh });
				// });
				this.initCanvas(completeLink, 256, item.cdlsjzbh.split('-').pop() + item.lsjzmc).then(res => {
					// console.log(res);
						this.QRImgUrl.push({ url: res, relicName: item.lsjzmc,cdlsjzbh: item.cdlsjzbh })
				})
				// 
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
		// url 二维码内容链接 size 二维码大小（高宽） qrText 底部描述文字 color 二维码颜色
 
		async initCanvas(url, size, qrText, color = '#000') {
      const canvas = await QRCode.toCanvas(url, {
        errorCorrectionLevel: 'H',
        margin: 1, // 设置padding 二维码的padding
        height: size,
        width: size,
      })
      const fontWeight='bold' // 字体 粗体 格式
      const fontSize = 14 // 字体大小
      const tb = 5 // 底部文字上下间距
      const realHeight = size + fontSize + 2*tb //实际高度
      // 画布上下文对象
      const ctx = canvas.getContext("2d");
      // 获取二维码数据
      const data = ctx.getImageData(0, 0, size, size);
			ctx.fillStyle = "#fff"
			console.log(ctx.measureText(qrText).width);
			canvas.setAttribute('height', realHeight); // 重设画布像素高度
      ctx.font = `${fontWeight} ${fontSize}px Arial`;
			// let w = ctx.measureText(qrText).width>128 ?  ctx.measureText(qrText).width + 40: 128
      // canvas.setAttribute('width', w); // 重设画布像素高度
      canvas.style.setProperty('height', realHeight + 'px'); // 重设画布实际高度
      ctx.fillRect(0, 0, size, realHeight)
      ctx.putImageData(data, 0, 0)// 填充二维码数据
      const textWidth = ctx.measureText(qrText).width; //文字真实宽度
      const ftop = size + tb; //文字距顶部位置
      const fleft = (size - textWidth) / 2; //根据字体大小计算文字left
      const textPadding = fontSize / 2; //字体边距为字体大小的一半可以自己设置
      // 设置底部背景色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, size, size, realHeight - 2*tb);
      // 设置字体填充位置
      ctx.fillRect(
          fleft - textPadding / 2,
          ftop - textPadding / 2,
          textWidth + textPadding,
          fontSize + textPadding
      );
      ctx.textBaseline = "top"; //设置绘制文本时的文本基线。
			ctx.fillStyle = "#333";// 字体颜色
			ctx.fillText(qrText, 0, ftop);
			console.log(canvas.toDataURL());
      return canvas.toDataURL()
    }
	},
};
</script>

<style lang="less" scoped>
.ewm {
	margin-bottom: 30px;
}
</style>