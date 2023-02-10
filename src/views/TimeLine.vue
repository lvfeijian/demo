<template>
	<div class="time-ruler" :style="{ width: width +'px' }">
    <div class="time-ruler-operation">
      <div @click="increment" class="time-ruler-operation--btn">+</div>
      <div @click="decrement" class="time-ruler-operation--btn">-</div>
    </div>
		<div v-if="tipShow" id="tooltip_div" ref="tooltip_div">{{ pointTime }}</div>
		<canvas id="is_have_video" ref="is_have_video" :width="width" height="50"></canvas>
		<canvas id="time_line" ref="time_line" :width="width" height="50"></canvas>
		<canvas id="time_line_layer" ref="time_line_layer" :width="width" height="50"></canvas>
	</div>
</template>

<script>
export default {
	computed: {
		changeProps() {
			let { width, currentTime, videoRecords,zoom } = this;
			return { width, currentTime, videoRecords,zoom };
		},
    pointTime() {
      let d
      if (this.zoom == 1) {
        d = this.getTime(this.currentTime + this.mouseSite * 60 - (this.currentTime % 60) - parseInt(this.width / 2) * 60);
      } else if (this.zoom == 2) {
        d = this.getTime(this.currentTime + this.mouseSite * 2 - (this.currentTime % 2) - parseInt(this.width));
      } else if (this.zoom == 3) {
        d = this.getTime(this.currentTime + this.mouseSite - parseInt(this.width / 2));
      }
      return `${d[0]}-${d[1]}-${d[2]} ${d[3]}:${d[4]}:${d[5]}`
		},
	},
	watch: {
		changeProps(val) {
      if (this.allowDarw) {
        this.timeChange(val.width, val.currentTime);
      }
    },
	},
	props: {
		width: {
			default: 1500,
		},
		currentTime: {
			default: 1637300821,
		},
		videoRecords: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			mouseSite: 0,
			tipShow: false,
      allowDarw: true, // 是否允许重绘刻度，指针，时间，视频区域
      // 1 1px=1分钟
      // 2 1px = 2秒
      // 3 1px = 1秒
      zoom: 1
		};
	},
  mounted() {
		this.timeChange(this.width, this.currentTime);
		this.addanvasEvent();
	},
	methods: {
		// 计算时间偏移并画线，时间刻度线，半时短线，小时长线,一像素代表一分钟
    carveTimeScale(width, currentTime) {
			// let canvasId = document.getElementById("time_line");
			console.log(this.$refs.time_line);
			let canvasId = this.$refs.time_line;
			let ctx = canvasId.getContext("2d");
			ctx.clearRect(0, 0, width, 50);

			// 将时间戳转为分，再减去到时间轴中部所需分数（为了将指针所指出与startTime时间等同），再取除小时的余数（方便后续刻度显示准确），得到时间戳超过整小时的分数
			let remainder = (parseInt(currentTime / 60) - parseInt(width / 2)) % 60;
			for (var i = 0; i < width; i++) {
				// 半时刻度；
				if ((remainder + i) % 30 == 0) {
					this.drawLine(i, 0, i, 10, "white", 1);
				}

				// 获取当前刻度的秒数：  当前时间加上当前刻度再减去时间轴一半的时间（当前时间处于时间轴中间），再减去当前时间取小时的余数（方便后续刻度显示准确）
				let ct = currentTime + i * 60 - (currentTime % 60) - parseInt(width / 2) * 60;

				// 小时刻度，及显示时间；
				if ((remainder + i) % 60 == 0) {
					this.drawLine(i, 0, i, 20, "white", 1);
					// let canvasId = document.getElementById("time_line");
					let canvasId = this.$refs.time_line;

					let ctx = canvasId.getContext("2d");
					ctx.font = "12px Arial";
					let d = this.getTime(ct);
          ctx.fillStyle = "white";
					ctx.fillText(`${d[3]}:${d[4]}`, i - 16, 30);
				}
			}
		},
		// 计算时间偏移并画线，时间刻度线，半时短线，小时长线,1像素代表2秒钟
		carveTimeScale2(width, currentTime) {
			// let canvasId = document.getElementById("time_line");
			let canvasId = this.$refs.time_line;

			let ctx = canvasId.getContext("2d");
			ctx.clearRect(0, 0, width, 50);
			ctx.font = "12px Arial";

			// 将当前时间减去到时间轴中部所需秒,得到时间轴起点秒数
			let remainder = parseInt(currentTime) - parseInt((width / 2) * 2);
			for (var i = 0; i < width * 2; i++) {
				// 分；
				if ((remainder + i) % 60 == 0) {
					this.drawLine(i / 2, 0, i / 2, 5, "white", 1);
				}
				// 刻；
				if ((remainder + i) % (60 * 15) == 0) {
					this.drawLine(i / 2, 0, i / 2, 10, "white", 1);
					let d = this.getTime(remainder + i);
					ctx.fillStyle = "white";
					ctx.fillText(`${d[3]}:${d[4]}:${d[5]}`, i / 2, 25);
				}

				// 半时；
				if ((remainder + i) % (60 * 30) == 0) {
					this.drawLine(i / 2, 0, i / 2, 15, "white", 1);
					let d = this.getTime(remainder + i);
					ctx.fillStyle = "white";
					ctx.fillText(`${d[3]}:${d[4]}:${d[5]}`, i / 2, 25);
				}

				// 时；
				if ((remainder + i) % (60 * 60) == 0) {
					this.drawLine(i / 2, 0, i / 2, 20, "white", 1);
					let d = this.getTime(remainder + i);
					ctx.fillStyle = "white";
					ctx.fillText(`${d[3]}:${d[4]}:${d[5]}`, i / 2, 25);
				}
			}
		},
		// 计算时间偏移并画线，时间刻度线，半时短线，小时长线,一像素代表一秒钟
		carveTimeScale3(width, currentTime) {
			// let canvasId = document.getElementById("time_line");
			let canvasId = this.$refs.time_line;

			let ctx = canvasId.getContext("2d");
			ctx.clearRect(0, 0, width, 50);
			ctx.font = "12px Arial";

			// 将当前时间减去到时间轴中部所需秒,得到时间轴起点秒数
			let remainder = parseInt(currentTime) - parseInt(width / 2);
			for (var i = 0; i < width; i++) {
				// 分；
				if ((remainder + i) % 60 == 0) {
					this.drawLine(i, 0, i, 5, "white", 1);
				}
				// 刻；
				if ((remainder + i) % (60 * 15) == 0) {
					this.drawLine(i, 0, i, 10, "white", 1);
					let d = this.getTime(remainder + i);
					ctx.fillStyle = "white";
					ctx.fillText(`${d[3]}:${d[4]}:${d[5]}`, i, 25);
				}

				// 半时；
				if ((remainder + i) % (60 * 30) == 0) {
					this.drawLine(i, 0, i, 15, "white", 1);
					let d = this.getTime(remainder + i);
					ctx.fillStyle = "white";
					ctx.fillText(`${d[3]}:${d[4]}:${d[5]}`, i, 25);
				}

				// 时；
				if ((remainder + i) % (60 * 60) == 0) {
					this.drawLine(i, 0, i, 20, "white", 1);
					let d = this.getTime(remainder + i);
					ctx.fillStyle = "white";
					ctx.fillText(`${d[3]}:${d[4]}:${d[5]}`, i, 25);
				}
			}
		},
		// 画线
		drawLine(beginX, beginY, endX, endY, color, width) {
			// let canvasId = document.getElementById("time_line");
			let canvasId = this.$refs.time_line;

			let ctx = canvasId.getContext("2d");
			ctx.beginPath();
			ctx.moveTo(beginX, beginY);
			ctx.lineTo(endX, endY);
			ctx.strokeStyle = color;
			ctx.lineWidth = width;
			ctx.stroke();
		},
		// 获取时间
		getTime(timeStamp) {
			let date = new Date(timeStamp * 1000);
			let year = date.getFullYear();
			let month =
				date.getMonth() + 1 < 10
					? "0" + (date.getMonth() + 1)
					: date.getMonth() + 1;
			let currentDate =
				date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
			let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
			let minute =
				date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
			let second =
				date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
			return [year, month, currentDate, hour, minute, second];
		},
    pointSite(e) {
			this.mouseSite = e.layerX;
			this.tipShow = true;
			this.$nextTick(() => {
				let ele = this.$refs.tooltip_div;
				console.log(this.$refs.tooltip_div);
        ele.style.left = e.x - 40 + "px";
				ele.style.top = "0px";
			});
		},
		// canvas事件
		addanvasEvent() {
			// let canvasId = document.getElementById("time_line_layer");
			let canvasId = this.$refs.time_line_layer;
			
			canvasId.onmouseleave = (e) => {
				this.tipShow = false;
				canvasId.onmousemove = (e) => {
					this.pointSite(e);
				};
			};
			// 鼠标按下时的位置；
			let start = 0;
			// 鼠标按下时的currentTime
			let oldTime = 0;
			canvasId.onmousedown = (e) => {
				this.allowDarw = false;
				start = e.layerX;
				oldTime = this.currentTime;
				canvasId.onmousemove = (e1) => {
					this.tipShow = false;
          let end = e1.layerX;
          let current
          if (this.zoom == 1) {
            current = (start - end) * 60 + oldTime;
          }
          else if (this.zoom == 2) {
            current = (start - end) / 2 + oldTime;
          } else if (this.zoom == 3) {
            current = start - end + oldTime;
          }
					this.timeChange(this.width, current);
					// emit('changCurrentTime', current);
				};
			};
			// 鼠标弹起向外传出当前时间
			canvasId.onmouseup = (e) => {
        let end = e.layerX;
        let current
				if (this.zoom == 1) {
          current = (start - end) * 60 + oldTime;
        }
        else if (this.zoom == 2) {
          current = (start - end) / 2 + oldTime;
        } else if (this.zoom == 3){
          current = start - end + oldTime;
        }
				this.$emit("changCurrentTime", current);
				this.allowDarw = true;
				canvasId.onmousemove = (e1) => {
					this.pointSite(e1);
				};
			};

			canvasId.onmousemove = (e) => {
				this.pointSite(e);
			};
		},
		// 有视频的区域渲染颜色
    carveVideoScope(width, currentTime) {
			// let canvas = document.getElementById("is_have_video");
			let canvas = this.$refs.is_have_video
			let ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, width, 50);
      let maxTime
      let minTime
			// 当前时间轴包括的时间段；
      if (this.zoom == 1) {
        maxTime = currentTime + parseInt(width / 2) * 60;
        minTime = currentTime - parseInt(width / 2) * 60;
      }
      else if (this.zoom == 2 || this.zoom == 3) {
        maxTime = currentTime + parseInt(width / 2)*2;
        minTime = currentTime - parseInt(width / 2)*2;
      }

			let d = this.videoRecords.filter((item) => {
				return (
					parseInt(item.startTime) < maxTime && parseInt(item.endTime) > minTime
				);
			});
			d.map((item) => {
				// currentTime在中间位置，所以还得加上时间轴中间位置的秒数
        let startPoint
        let endPoint
        if (this.zoom == 1) {
          startPoint = (parseInt((parseInt(item.startTime) + width * 60 / 2 - currentTime + currentTime % 60) / 60));
          endPoint = parseInt((parseInt(item.endTime) + width * 60 / 2 - currentTime + currentTime % 60) / 60)
        }
        else if (this.zoom == 2) {
          startPoint = (parseInt((parseInt(item.startTime) + width * 2 / 2 - currentTime + currentTime % 2) / 2));
          endPoint = parseInt((parseInt(item.endTime) + width * 2 / 2 - currentTime + currentTime % 2) / 2)
        } else if(this.zoom == 3){
          startPoint = parseInt(item.startTime) - currentTime + parseInt(width / 2);
          endPoint = parseInt(item.endTime) - currentTime + parseInt(width / 2);;
        }
        
				// 起点不能为负数，
				startPoint = startPoint > 0 ? startPoint : 0;
				// 终点不能超出时间尺总长度。
				endPoint = endPoint < width ? endPoint : width;

				let w = endPoint - startPoint;
        ctx.fillStyle = "rgb(255, 121, 115)";
				ctx.fillRect(startPoint, 0, w, 50);
			});
		},
		// 当前时间改变，重绘刻度，指针，时间
    timeChange(width, time) {
      if (this.zoom == 1) {
				this.carveTimeScale(width, time);
				return
        this.carveVideoScope(width, time);
        this.drawLine(parseInt(width / 2), 0, parseInt(width / 2), 35, 'blue', 1)
				// let canvasId = document.getElementById('time_line');
				let canvasId = this.$refs.time_line;
				
        let ctx = canvasId.getContext('2d');
        ctx.font = '12px Arial';
        ctx.fillStyle = "white";
        let d = this.getTime(time)
        ctx.fillText(`${d[0]}-${d[1]}-${d[2]} ${d[3]}:${d[4]}:${d[5]}`, parseInt(width / 2) - 50, 48)
      }
      else if (this.zoom == 2) {
        this.carveVideoScope(width, time);
        this.carveTimeScale2(width, time);
        this.pointCurrent(width, time);
      } else if(this.zoom == 3) {
        this.carveVideoScope(width, time);
        this.carveTimeScale3(width, time);
        this.pointCurrent(width, time);
      }
    },
    // 时间轴中间指示当前时间刻度
    pointCurrent(width, time) {
			// let canvasId = document.getElementById('is_have_video');
			let canvasId = this.$refs.is_have_video
      let ctx = canvasId.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(parseInt(width / 2), 0);
      ctx.lineTo(parseInt(width / 2), 35);
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.font = '12px Arial';
      ctx.fillStyle = "white";
      let d = this.getTime(time)
      ctx.fillText(`${d[0]}-${d[1]}-${d[2]} ${d[3]}:${d[4]}:${d[5]}`, parseInt(width / 2) - 50, 48)
    },
    increment() {
      if (this.zoom < 3) {
        this.zoom++
      }
    },
    decrement() {
      if (this.zoom > 1) {
        this.zoom--
      }
      
    }
	},
};
</script>

<style lang="less" scoped>
.time-ruler{
  position: relative;
  padding-top: 32px;
	height: 80px;
	box-sizing: border-box;
  &-operation{
    position: absolute;
    right: 0px;
    top: 34px;
    z-index: 10;
    display: flex;
    &--btn{
      width: 20px;
      height: 20px;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 5px;
      cursor: pointer;
      user-select: none;
    }
  }
}
#time_line {
	background-color: rgba(0, 255, 234, 0);
	position: absolute;
}
#is_have_video {
	background-color: gray;
	position: absolute;
}
#time_line_layer {
	background-color: rgba(0, 255, 234, 0);
	position: absolute;
  user-select: none;
}
#tooltip_div {
	background-color: rgba(50, 121, 115,1);
	position: absolute;
	font-size: 10px;
	width: 75px;
	text-align: center;
  user-select: none;
}
</style>
