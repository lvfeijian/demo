<template>
  <div>
    <button @click="link('T')">天地图</button>
    <button @click="link('ArcGis')">ArcGis</button>
    <button @click="link('Lucky')">老虎机抽奖</button>
    <button @click="link('Vuex')">vuex基本使用</button>
    <button @click="link('NavMenu')">左侧导航菜单栏</button>
    <button @click="link('File')">文件上传</button>
    <button @click="link('Time')">时间组件</button>
    <button @click="link('Qrcode')">二维码组件</button>
    <button @click="link('Viewer')">图片浏览组件</button>
    <button @click="link('EpsgLatlng')">epsg.io经纬度转换</button>
    <button @click="link('Highcharts')">Highcharts</button>
  </div>
</template>

<script>
export default {
  data(){
    return {

    }
  },
  created(){

  },
  mounted(){

  },
  methods:{
    link(url){
      this.$router.push(url)
    }
  }
}
</script>

<style lang="less" scoped>
button{
  margin: 20px 10px;
  padding: 10px;
  cursor: pointer;
}
</style>
