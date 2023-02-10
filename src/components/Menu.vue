<template>
	<!-- 递归封装多级菜单栏 -->
	<div class="navMenu">
		<div
			v-for="(item, index) in list"
			class="item"
			@click.stop.prevent="handleLink($event, item, index)"
		>
			<div
				class="item-cont"
				:class="{ 'is-disabled': !(item.url || item.child) }"
			>
				{{ item.name }}
				<i class="icon" v-if="item.child"></i>
			</div>
			<div class="list-child" :class="{ active: !item.isOpen }" v-if="item.child">
				<Menu
					:list="item.child"
					@handleLink="handleLink"
				></Menu>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Menu",
	props: {
		list: {
			type: Array,
			default: [],
		},
	},
	methods: {
		handleLink($event, item, index) {
			this.$emit("handleLink", $event, item, index);
		},
	},
};
</script>

<style lang="less" scoped>
.navMenu {
	height: auto;
	background: #fff;
	cursor: pointer;
	.item {
		width: 200px;
		color: black;
		.child,
		.item-cont {
			min-height: 50px;
			line-height: 50px;
			position: relative;
			&:hover {
				background: #94bce4;
			}
			&.is-disabled {
				opacity: 0.25;
				cursor: not-allowed;
			}
			.icon {
				content: "";
				border: 8px solid;
				border-color: #f00 transparent transparent transparent;
				position: absolute;
				top: calc(50% - 4px);
				right: 0;
			}
		}
		.list-child {
			margin-left: 30px;
			&.active {
				display: none;
			}
		}
	}
}
</style>
