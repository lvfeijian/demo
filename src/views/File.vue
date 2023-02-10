<template>
  <div>
    <input type="file" @change="fileChange">
  </div>
</template>

<script>
import publicMethod from '../utils/publiceMethod'
  export default {
    data(){
      return {
        userInfo:{}
      }
    },
    methods:{
      // 文件上传
      fileChange(e){
        const file = e.target.files[0]
        if(!file){
          console.log('用户没有选择图片，只是点击了文件上传这个按钮')
          return
        }
        let formData = new FormData() // 创建FormData对象
        formData.append('file', file)
        // this.$axios({
        //   method: 'post',
        //   url: '123123',
        //   data: formData
        // }).then(res => {
          
        // })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>