<template>
	<div class="time_picker" ref="timePicker">
		<div class="ipt" @click="handleClick">
			<input type="text" placeholder="选择时间" v-model="formatTime" readonly />
			<span @click.stop="handleClose" v-if="formatTime">x</span>
		</div>
		<div class="content" :class="isShowList ? '' : 'hide'">
			<div class="choose_list">
				<ul ref="yearRef">
					<li
						v-for="(item, index) in yearList"
						:key="item"
						@click="handleYear(item)"
						:class="year == item ? 'active' : ''"
					>
						{{ year == item ? item + "年" : item }}
					</li>
				</ul>
				<ul ref="monthRef">
					<li
						v-for="(item, index) in monthlist"
						:key="item"
						@click="handleMonth(item)"
						:class="month == item ? 'active' : ''"
					>
						{{ month == item ? item + "月" : item }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			yearList: [],
			monthlist: [],
			isShowList: false, // true显示 false隐藏
			year: null,
			month: null,
		};
	},
	computed: {
		formatTime() {
			if (this.year == null) {
				return null;
			}
			if (this.month == null) {
				return null;
			}
			return this.year + "-" + this.month.toString().padStart(2, 0);
		},
	},
	mounted() {
    for (let j = 1; j <= 12; j++) {
			this.monthlist.push(j);
		}
		let year = new Date().getFullYear();
		for (let i = year - 10; i <= year + 10; i++) {
			this.yearList.push(i);
		}
		document.addEventListener("click", (e) => {
			if (this.$refs.timePicker && !this.$refs.timePicker.contains(e.target)) {
				//点击的元素不在timePicker里面
				this.isShowList = false;
			}
		});
	},
	methods: {
		handleClick() {
			this.isShowList = !this.isShowList;
      if(this.isShowList && this.formatTime) {
        let monthIndex = this.monthlist.indexOf(this.month)
        let yearIndex = this.yearList.indexOf(this.year)
        this.$nextTick(() => {
          this.$refs.yearRef.scrollTo({top: yearIndex*40})
          this.$refs.monthRef.scrollTo({top: monthIndex*40})
        })
      }
      if(this.isShowList && !this.formatTime){
        this.$nextTick(() => {
          this.$refs.yearRef.scrollTo({top: 0})
          this.$refs.monthRef.scrollTo({top: 0})
        })
      }
		},
		handleYear(item) {
			this.year = item;
			// if(this.formatTime){
			//   this.isShowList = false
			// }
		},
		handleMonth(item) {
			this.month = item;
			// if(this.formatTime){
			//   this.isShowList = false
			// }
		},
		handleClose() {
			this.year = null;
			this.month = null;
			this.isShowList = false;
		},
	},
};
</script>

<style lang="less" scoped>
.time_picker {
  width: 200px;
	.ipt {
		width: 200px;
    box-sizing: border-box;
		height: 40px;
		line-height: 40px;
		border-radius: 4px;
		border: 2px solid #00f;
		position: relative;
		cursor: pointer;
		&:hover {
			span {
				display: block;
			}
		}
		input {
			width: 100%;
			outline: none;
			background: none;
			border: none;
			padding-left: 8px;
      height: 40px;
      display: block;
      line-height: 40px;
		}
		span {
			display: none;
			position: absolute;
			right: 10px;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	.content {
		&.hide {
			display: none;
		}
		.choose_list {
			display: flex;
			height: 300px;
			overflow: hidden;

			ul {
				list-style: none;
				overflow-y: scroll;
        padding: 0;
        margin: 0;
				&::-webkit-scrollbar {
					display: none;
				}
				li {
					color: #666;
					text-align: center;
					width: 100px;
					list-style: none;
					height: 40px;
					line-height: 40px;
					cursor: pointer;
					&:hover {
						color: #000;
						font-weight: bold;
					}
					&.active {
						color: #000;
						font-weight: bold;
					}
					&:hover {
						background: #ccc;
					}
				}
			}
		}
	}
}
</style>
