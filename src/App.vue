<template>
  <div id="app">
    <router-view/>
    <div class="btn" @click="go">返回首页</div>
    <div @click="golink">跳转到全景</div>
  </div>
</template>
<script>
export default {
  data(){
    return{

    }
  },
  methods:{
    go(){
      this.$router.push('/')
    },
    golink(){
      location.href = 'http://sdvrcdn.shidongvr.com/sdvrvnavi/10081330968945/tour.html'
    }
  }
}
</script>
<style lang="less">
*{
  margin: 0;
  padding: 0;
}
#app{
  >.btn{
    z-index: 100000;
    border: 1px solid rgb(104, 104, 161);
    padding: 10px 20px;
    display: inline-block;
    border-radius: 5px;
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    &:hover{
      color: #fff;
      background-color: rgb(132, 81, 145);
    }
  }
}

</style>
