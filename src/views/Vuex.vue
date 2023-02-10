<template>
	<div>
		{{ name }}
		{{ age }}
    <button @click="add">+1</button>
    <button @click="decrease">-1</button>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	computed: {
		...mapState(["name", "age"]),
	},
  methods: {
    add(){
      this.$store.commit('incre', '111')
    },
    decrease(){
      this.$store.commit('decre', '222')
    }
  }

};
</script>

<style lang="less" scoped>
button{
  margin: 10px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
