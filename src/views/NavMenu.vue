// 左侧导航菜单封装
<template>
  <div class="nav">
    <Menu @handleLink="handleLink" :list="list">
    </Menu>
    <div>{{value}}</div>
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'
  export default {
    components:{
      Menu
    },
    data(){
      return {
        value: '',
        list: [
          {
            name: '导航1',
            child: [
              {
                name: '选项1',
                child: [
                  {
                    name: '选项1-1',
                    url: 'aaa-1'
                  },
                  {
                    name: '选项2-1',
                    url: 'bbb-1'
                  },
                  {
                    name: '选项3-1',
                    url: 'ccc-1'
                  },
                ]
              },
              {
                name: '选项2',
                url: 'bbb'
              },
              {
                name: '选项3',
                url: 'ccc'
              },
              {
                name: '选项4',
                url: 'ddd'
              },
            ]
          },
          {
            name: '导航2',
            child: [
              {
                name: '选项1',
                url: 'aaa'
              },
              {
                name: '选项2',
                url: 'bbb'
              },
            ]
          },
          {
            name: '导航3',
            url: 'eee'
          },
          {
            name: '导航4',
          }
        ]
      }
    },
    
    methods: {
      handleLink($event,item,index){
        if(item.url){
          this.value = '跳转到' + item.url
        } else {
          if(item.isOpen == undefined){
            this.$set(item,'isOpen', true)
          } else {
            item.isOpen = !item.isOpen
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .nav{
    display: flex;
  }

</style>