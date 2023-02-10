<template>
  <div>
    <!-- <video id="videoElement" controls autoplay muted width="1130px" height="430px"></video> -->
    <!-- <button @click="play">播放</button> -->
    <div class="sty"></div>
    <timeLine
      v-for="(item,index) in 10"
      :width="width"
      :currentTime="currentTime"
      :videoRecords="videoRecords"
      @changCurrentTime="changCurrentTime"
    />
  </div>
</template>

<script>
import flvjs from 'flv.js'
import timeLine from './TimeLine.vue'
export default {
  components: {
    timeLine
  },
  data() {
    return {
      currentTime: 0,
      startPoint: 1636971900,
      width: 1500,
      videoRecords: [
        {
    "startTime": "1636971324",
    "endTime":   "1636972324",
  },
      ],
      flvPlayer: null
    }
  },
  computed: {

  },
  mounted() {
    const cancalDebounce = this.debounce(this.getWindowInfo, 500);
    window.addEventListener('resize', cancalDebounce);
    this.currentTime = this.startPoint
    // if (flvjs.isSupported()) {
    //   var videoElement = document.getElementById('videoElement');
    //   this.flvPlayer = flvjs.createPlayer({
    //     type: 'flv',
    //     isLive: true,
    //     url: 'http://183.6.56.136:9938/live?port=9909&app=live&stream=1',
    //     hasVideo: true
    //   });
    //   this.flvPlayer.attachMediaElement(videoElement);
    //   this.flvPlayer.load();
    //   this.flvPlayer.play();
    // }
  },
  methods: {
    
    getWindowInfo () {
      this.width = window.innerWidth
    },
    debounce (fn, delay) {
      let timer;
      return function() {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fn();
        }, delay);
      }
    },
 
    play() {
      this.flvPlayer.play();
    },
    changCurrentTime(time) {
      console.log(time, '当前时间');
      this.currentTime = time
      // this.setCurrentTime(time - this.startPoint)
    },
    setCurrentTime(data) {
      console.log(data);
      this.flvPlayer.currentTime = data
    },
  }
}
</script>

<style lang="less" scoped>
.sty{
  width: 500px;
  height: 500px;
}
</style>