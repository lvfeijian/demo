<template>
  <div>
    <div id="timeSlider"></div>
    <button @click="play">play</button>
    <button @click="stop">stop</button>
  </div>
</template>

<script>

import initTimeSlider from '../index.js'
export default {
  data() {
    return {
      timeSliderInstance: null
    }
  },
  mounted() {
    this.timeSliderInstance = new initTimeSlider('#timeSlider', {
      curDaytimeChunkArray: ['012200-023000-A', '002200-003000-A', '001200-002000-A', '000000-001000-A'],
      presentSeconds: 0,
      timeChunkType: {
        A: 'red',
        B: 'yellow',
        C: 'blue'
      },
      speed: 1,
      isInitialPlay: false,
    })
  },
  methods: {
    play() {
      this.timeSliderInstance.timeLinePlay()
    },
    stop() {
      this.timeSliderInstance.timeLineStop()
    }
  },
}
</script>

<style lang="scss" scoped>

</style>