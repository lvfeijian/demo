<template>
  <div id="index" ref='imgView'>
    <ul class="imgUrl">
      <li v-for="(item,index) of imgArr"><img :src="item" alt="图片描述"></li>
    </ul>
  </div>
</template>
 
<script>
  import Viewer from 'viewerjs';
  import 'viewerjs/dist/viewer.css';
 
  export default {
    data() {
      return {
        imgArr:[
          'https://picsum.photos/id/52/600/400',
          'https://picsum.photos/id/53/600/400',
          'https://picsum.photos/id/54/600/400'
        ]
      }
    },
    mounted(){
      // const ViewerDom = document.getElementById('index');
       const ViewerDom = this.$refs.imgView;
	      const viewer = new Viewer(ViewerDom, {
	        // 相关配置项,详情见下面
	      });
    }
  }
</script>
 
<style scoped>
   .imgUrl {
    display: flex;
    flex-wrap: wrap;
  }
  .imgUrl li{
    width:148px;
    height: 148px;
    list-style: none;
    border:2px solid #CCC;
    border-radius: 3px;
    padding: 1px;
    margin: 10px;
    cursor: pointer;
  }
  .imgUrl li img{
    width:100%;
    height: 100%;
  }
</style>