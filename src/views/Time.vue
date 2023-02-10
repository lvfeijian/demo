<template>
  <div class="timeLine" v-if="timeVideoData !== null"
  	:style="'width:'+ timeLineWidth + 'px;'">
    <canvas :id="`timeline_${timeLineId}`"
      :width="timeLineWidth"
      height="62"
      style="border:1px solid #2b2f33;background-color: #2b2f33;"
      @dragstart="dragStart_">
    </canvas>
  </div>
</template>
<script>
import $ from '../utils/jquery-1.10.2.min.js'
import '../utils/timeline-canvas.js'

export default {
  name: '',
  data () {
    return {
      timeLineId_: '',
      style_: '',
      timecell: [
        {
          beginTime: new Date().getTime() - 6 * 3600 * 1000,
          endTime: new Date().getTime() - 4 * 3600 * 1000,
          style: {
            background: 'rgba(132, 244, 180, 0.498039)'
          }
        },
        {
          beginTime: new Date().getTime() - 9 * 3600 * 1000,
          endTime: new Date().getTime() - 5 * 3600 * 1000,
          style: {
            background: 'darkcyan'
          }
        }
      ],
      timeVideoData: [
        {
          startTime:"00:00:00",
          endTime: '10:00:00',
          type: 1,
          
        }
      ]
    }
  },

  methods: {
    initTimeLine (data) {
      $('#' + this.timeLineId_).TimeSlider({
        init_cells: data
      })
    },
    dragStart_ () {
      return false
    },
    getAlarmTypeColor (executorName) {
      return this.alarmTypeArr.find((item) => {
        return item.text === executorName
      }).colorType
    }
  },
  props: [
    'alarmTypeArr',
    'timeLineId',
    'timeLineWidth',
    'backWinName'
  ],
  watch: {
    timeLineWidth (newVal, oldVal) {
      $('#' + this.timeLineId_).TimeSlider('timeLineWidthChange', newVal)
    },
    timeVideoData (newVal, oldVal) {
      if (newVal !== null) {
        this.initTimeLine(newVal.map((it) => {
          return {
            startTime: it.startTime,
            endTime: it.endTime,
            style: {
              background: it.type ? '#13e4bd' : this.getAlarmTypeColor(it.executorName) // type 1 代表设备录像
            },
            type: it.type
          }
        }))
      }
    }
  },

  mounted () {
    // 画布id
    this.timeLineId_ = 'timeline_' + this.timeLineId
    // 进度条对应的 视频窗口
    $('#' + this.timeLineId_).TimeSlider('timeLineOfBackWinName', this.backWinName)
    // 初始化刻度
    this.initTimeLine([])
    // tiemLine 画布宽度
    $('#' + this.timeLineId_).TimeSlider('timeLineWidthChange', this.timeLineWidth)
    // 录像时间段
    this.initTimeLine(this.timeVideoData.map((it) => {
      return {
        startTime: it.startTime,
        endTime: it.endTime,
        style: {
          background: it.type ? '#13e4bd' : this.getAlarmTypeColor(it.executorName) // type 1 代表设备录像
        },
        type: it.type
      }
    }))
    // 录像进度
    this.Bus.$on('sylan_back_prograss', (obj) => {
      if (obj.name === this.backWinName) {
        $('#' + this.timeLineId_).TimeSlider('set_time_to_middle', obj.prograss)
      }
    })
    // 录像下载
    this.Bus.$on('sylanVideoDown', () => {
      $('#' + this.timeLineId_).TimeSlider('sylanVideoDown')
    })
    // 录像停止下载
    this.Bus.$on('sylanVideoStop', () => {
      $('#' + this.timeLineId_).TimeSlider('sylanVideoStop')
    })
  },

  beforeDestroyed () {
    this.Bus.$off('sylan_back_prograss')
    this.Bus.$off('sylanVideoDown')
    this.Bus.$off('sylanVideoStop')
  }
}
</script>
