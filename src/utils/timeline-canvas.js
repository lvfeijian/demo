import Bus from '../utils/bus'
import $ from '../utils/jquery-1.10.2.min.js'

var TimeSlider = function (elementId, options) {
  this.canvasId = elementId.substr(elementId.indexOf('_') + 1, elementId.length)
  this.canvas = document.getElementById(elementId)
  this.canvasOffSetLeft = 0
  this.offsetComputed(this.canvas)
  this.ctx = this.canvas.getContext('2d')
  this.canvansW = this.canvas.width
  this.canVansH = this.canvas.height
  this.timecell = options.init_cells

  this.h_per_step = 72 // 时间轴显示24小时
  this.m_per_step = 12 // 时间轴显示24小时

  this.minTime_ = this.canvas.width // 最小时间刻（长度）
  this.maxTime_ = 0 // 最大时间刻（长度）

  this.g_isMousedown = false // 拖动mousedown标记
  this.g_isMouseRightdown = false // 右键拖动mousedown标记
  this.g_isMousemove = false // 拖动mousemove标记
  this.g_isMouseRightmove = false // 拖动mouseRightmove标记
  this.g_isMouseEntermove = false // 在时间段上移动

  this.winBackName = null
  this.moveEnterTime = null
  this.g_mouseenterCursor = null
  this.g_mousedownCursor = null // 拖动mousedown的位置
  this.g_mousedownRightCursor = null
  this.g_mousedownRightOffset = null

  this.ifDoubleDown = null // 防止多次点击 
  this.ifDoubleUp = null

  this.on_before_click_ruler_callback = null

  this.add_events()

  return this
}

/**
 * 初始化
 * @param {*} timecell 录像段数组
 * @param {*} redrawFlag 是否重绘标记
 */
TimeSlider.prototype.init = function (timecell, redrawFlag) {
  this.minTime_ = this.canvas.width // 最小时间刻（长度）
  this.maxTime_ = 0 // 最大时间刻（长度）

  this.timecell = timecell
  this.add_graduations()
  this.drawCellBg()
  this.drawLine(0, this.canVansH, this.canvansW, this.canVansH, 'rgb(151, 158, 167)', 1) // 底线
  this.add_cells(timecell)
  if (!redrawFlag) { // 只有第一次进入才需要添加事件
    this.add_events()
  }
  // 右键选择下载区域
  if (this.g_mousedownRightCursor && this.g_mousedownRightOffset) {
    this.ctx.fillStyle = 'rgba(135, 216, 152, 0.4)'
    this.ctx.fillRect(this.g_mousedownRightCursor, 0, this.g_mousedownRightOffset, this.canVansH)
  }
}

// 计算dom的offset
TimeSlider.prototype.offsetComputed = function (domObj) {
  let _this = this
  if (domObj.offsetParent !== null) {
    _this.canvasOffSetLeft += domObj.offsetLeft - 0
    _this.offsetComputed(domObj.offsetParent)
  } else {
    return false
  }
}
/**
 * 绘制添加刻度
 */
TimeSlider.prototype.add_graduations = function () {
  var _this = this
  // ************ 绘制小时刻度
  // _this.h_per_step = (_this.canvansW - 2) / 24 // 小时
  for (var i = 0; i < 24; i++) {
    _this.drawLine(i * _this.h_per_step + 1, 0, i * _this.h_per_step + 1, 25, 'rgba(151,158,167,1)', 1)
    _this.ctx.fillText(i + ':00', i * _this.h_per_step - 10, 35)
    _this.ctx.fillStyle = 'rgba(151, 158, 167, 1)'
  }

  // _this.m_per_step = (_this.canvansW - 2) / 144 // 10分钟一次
  for (var i = 0; i < 144; i++) {
    if (i % 6) {
      _this.drawLine(i * _this.m_per_step + 1, 0, i * _this.m_per_step + 1, 20, 'rgba(151,158,167,1)', 1)
    }
    _this.ctx.fillStyle = 'rgba(151,158,167,1)'
  }
  if (this.m_per_step > 12) {
    for (var i = 0; i < 144; i++) {
      _this.ctx.fillText(parseInt(i / 6) + ':' + (i % 6) * 10, i * _this.m_per_step - 10, 35)
      _this.ctx.fillStyle = 'rgba(151,158,167,1)'
    }
  }
  if (this.m_per_step > 60) {
    for (var i = 0; i < 1440; i++) {
      _this.drawLine(i * _this.m_per_step / 10 + 1, 0, i * _this.m_per_step / 10 + 1, 20, 'rgba(151,158,167,1)', 1)
      _this.ctx.fillStyle = 'rgba(151,158,167,1)'
    }
  }
}

/**
 * 绘制线
 * @param {*} beginX
 * @param {*} beginY
 * @param {*} endX
 * @param {*} endY
 * @param {*} color
 * @param {*} width
 */
TimeSlider.prototype.drawLine = function (beginX, beginY, endX, endY, color, width) {
  this.ctx.beginPath()
  this.ctx.moveTo(beginX, beginY)
  this.ctx.lineTo(endX, endY)
  this.ctx.strokeStyle = color
  this.ctx.lineWidth = width
  this.ctx.stroke()
}

/**
 * 添加录像段
 * @param {*} cells 录像数组
 */
TimeSlider.prototype.add_cells = function (cells) {
  var _this = this
  cells.forEach(cell => {
    _this.draw_cell(cell)
  })
}

/**
 * 绘制录像块
 * @param {*} cell cell包括beginTime ms;endTime ms;style
 */
TimeSlider.prototype.draw_cell = function (cell) {
  let end_
  // 如果是00 :00 :00
  if (cell.endTime.substr(8, 2) === '00' && cell.endTime.substr(10, 2) === '00' && cell.endTime.substr(12, 2) === '00') {
    end_ = this.canvansW - 2
  } else {
    end_ = (cell.endTime.substr(8, 2) - 0) + (cell.endTime.substr(10, 2) * 60 + (cell.endTime.substr(12, 2) - 0)) / 3600
  }
  var _this = this
  let begin_ = (cell.startTime.substr(8, 2) - 0) + (cell.startTime.substr(10, 2) * 60 + (cell.startTime.substr(12, 2) - 0)) / 3600
  var beginX = _this.h_per_step * begin_ + 1
  var endX = _this.h_per_step * end_ + 1
  var cell_width = _this.h_per_step * (end_ - begin_) + 1
  // 取到最大的时间（长度）
  _this.maxTime_ = endX > _this.maxTime_ ? endX : _this.maxTime_
  // 判断是设备录像 （如果设备录像清掉了，之前的告警录像不可选中）
  if (cell.type) {
    // 取到最小的时间（长度）
    _this.minTime_ = beginX < _this.minTime_ ? beginX : _this.minTime_
  }
  _this.ctx.fillStyle = cell.style.background
  _this.ctx.fillRect(beginX, 0, cell_width, 15)
}

/**
 * 绘制录像块背景
 */
TimeSlider.prototype.drawCellBg = function () {
  this.ctx.fillStyle = 'rgba(69, 72, 76, 0.5)'
  this.ctx.fillRect(0, 0, this.canvansW, 15)
}

/**
 * 时间轴事件
 */
TimeSlider.prototype.add_events = function () {
  var _this = this
  if (_this.canvas.addEventListener) {
    // _this.canvas.addEventListener('mousewheel', _this.mousewheelFunc.bind(_this))
    _this.canvas.addEventListener('mousedown', _this.mousedownFunc.bind(_this))
    _this.canvas.addEventListener('mousemove', _this.mousemoveFunc.bind(_this))
    _this.canvas.addEventListener('mouseup', _this.mouseupFunc.bind(_this))
    _this.canvas.addEventListener('mouseout', _this.mouseoutFunc.bind(_this))
  }
}

TimeSlider.prototype.remove_events = function () {
  var _this = this
  if (_this.canvas.addEventListener) {
    _this.canvas.removeEventListener('mousedown', _this.mousedownFunc.bind(_this), false)
    _this.canvas.removeEventListener('mousemove', _this.mousemoveFunc.bind(_this), false)
    _this.canvas.removeEventListener('mouseup', _this.mouseupFunc.bind(_this), false)
    _this.canvas.removeEventListener('mouseout', _this.mouseoutFunc.bind(_this), false)
  }
}

/**
 * 拖动/点击 mousedown事件
 */
TimeSlider.prototype.mousedownFunc = function (e) {
  let _this = this
  if (this.timecell.length !== 0) {
    if (this.ifDoubleDown) {
      clearTimeout(this.ifDoubleDown)
    }
    this.ifDoubleDown = setTimeout(() => {
      // 确保点击 在时间条范围之内
      let downPosition = this.get_cursor_x_position(e) - this.canvasOffSetLeft
      if (downPosition >= this.minTime_ && downPosition <= this.maxTime_) {
        if (e.which === 1) {
          this.g_isMousedown = true
          this.ctx.clearRect(0, 0, this.canvansW, this.canVansH)
          this.init(this.timecell, true)
          this.g_mousedownCursor = this.get_cursor_x_position(e) - this.canvasOffSetLeft // 记住mousedown的位置
          Bus.$emit('videoTimeOfSelect', {
            id: this.canvasId,
            time: this.computedTime(_this.g_mousedownCursor)
          })
          this.drawLine(this.g_mousedownCursor, 0, this.g_mousedownCursor, 33, 'rgb(64, 196, 255', 2)
        } else if (e.which === 3) {
          this.g_mousedownRightCursor = downPosition // 记住mousedown的位置
          this.g_isMouseRightdown = true
        }
      }
    }, 300)
  }
}

/**
 * 拖动/鼠标hover显示 mousemove事件
 */
TimeSlider.prototype.mousemoveFunc = function (e) {
  if (this.g_isMousedown) {
    this.g_isMousemove = true
    this.ctx.clearRect(0, 0, this.canvansW, this.canVansH)
    this.init(this.timecell, true)
    this.g_mousedownCursor = this.get_cursor_x_position(e) - this.canvasOffSetLeft // 记住mousedown的位置
    this.drawLine(this.g_mousedownCursor, 0, this.g_mousedownCursor, 33, 'rgb(64, 196, 255', 1) // 中间播放点时间线
  } else if (this.g_isMouseRightdown) {
    this.g_isMouseRightmove = true
  } else {
    this.g_isMouseEntermove = true
    // if (this.timecell.length !== 0) {
    this.ctx.clearRect(0, 0, this.canvansW, this.canVansH)
    this.init(this.timecell, true)
    this.g_mouseenterCursor = this.get_cursor_x_position(e) - this.canvasOffSetLeft // 记住mousedown的位置
    this.moveEnterTime = this.computedTime(this.get_cursor_x_position(e) - this.canvasOffSetLeft)

    // 画当前鼠标移上去显示的时间刻 时间指针
    this.tip_of_time()
    // 当前如果正在播放视频
    if (this.currentPlayTime) {
      this.draw_middle_time(this.currentPlayTimePointer, this.currentPlayTime)
    }
    // }
  }
}
/**
 * 计算时间
 */
TimeSlider.prototype.computedTime = function (w) {
  this.h_ = parseInt(w / this.h_per_step)
  this.allSecond = Math.floor(((w % this.h_per_step) * 3600) / this.h_per_step)
  this.m_ = parseInt(this.allSecond / 60)
  this.s_ = this.allSecond % 60
  return (this.h_ < 10 ? '0' + this.h_ : JSON.stringify(this.h_)) + (this.m_ < 10 ? '0' + this.m_ : JSON.stringify(this.m_)) + (this.s_ < 10 ? '0' + this.s_ : JSON.stringify(this.s_))
}
/**
 * 拖动/点击 mouseup事件
 */
TimeSlider.prototype.mouseupFunc = function (e) {
  if (this.timecell.length !== 0) {
    setTimeout(() => {
      var _this = this
      // 确保up 在时间条范围之内
      let upPosition = this.get_cursor_x_position(e) - this.canvasOffSetLeft
      if (upPosition >= this.minTime_ && upPosition <= this.maxTime_) {
        if (_this.g_isMousemove) { // 拖动 事件
        } else if (this.g_isMouseRightmove) {
          // 获取下载区间
          _this.g_mousedownRightOffset = (_this.get_cursor_x_position(e) - _this.canvasOffSetLeft) - _this.g_mousedownRightCursor
          // 渲染
          _this.ctx.fillStyle = 'rgba(135, 216, 152, 0.4)'
          _this.ctx.fillRect(_this.g_mousedownRightCursor, 0, Math.abs(_this.g_mousedownRightOffset), _this.canVansH)
          // 下载
          Bus.$emit('videoTimeDownSelect', {
            id: this.canvasId,
            // 判断往左拉还是往右拉
            startTime: _this.g_mousedownRightOffset > 0 ? _this.computedTime(_this.g_mousedownRightCursor) : _this.computedTime(_this.get_cursor_x_position(e) - _this.canvasOffSetLeft),
            endTime: _this.g_mousedownRightOffset > 0 ? _this.computedTime(_this.get_cursor_x_position(e) - _this.canvasOffSetLeft) : _this.computedTime(_this.g_mousedownRightCursor),
            // 判断是否大于0.5h
            times_: (Math.abs(this.g_mousedownRightOffset) / this.h_per_step) > 0.5
          })
        } else { // up 事件
          // if (this.ifDoubleUp) {
          //   clearTimeout(this.ifDoubleUp)
          // }
          // this.ifDoubleUp = setTimeout(() => {
          //   Bus.$emit('videoTimeOfSelect', {
          //     id: this.canvasId,
          //     time: this.computedTime(_this.g_mousedownCursor)
          //   })
          // }, 300)
        }
      }
      _this.g_isMousemove = false
      _this.g_isMousedown = false
      _this.g_isMouseRightmove = false
      _this.g_isMouseRightdown = false
    }, 400) // 延时器等到down事件处理完毕
  }
}

/**
 * 鼠标移出隐藏时间 mouseout事件
 * @param {*} e
 */
TimeSlider.prototype.mouseoutFunc = function (event) {

  this.g_isMousedown = false
  this.g_isMousemove = false

  this.g_isMouseEntermove = false
  this.g_isMouseRightdown = false
  this.g_isMouseRightmove = false

  this.ctx.clearRect(0, 0, this.canvansW, this.canVansH)
  this.init(this.timecell, true)
  // 当前如果正在播放视频
  if (this.currentPlayTime) {
    this.draw_middle_time(this.currentPlayTimePointer, this.currentPlayTime)
  }
}

/**
 * 滚轮放大缩小，以时间轴中心为准 mousewheel事件
 */
TimeSlider.prototype.mousewheelFunc = function (event) {
  this.clearCanvas()
  this.init(this.timecell, true)
}

/**
 *  画布宽度
 *  @param {*} time
 */
TimeSlider.prototype.timeLineWidthChange = function (val) {
  this.clearCanvas()
  this.canvansW = val

  this.h_per_step = val / 24 // 时间轴显示24小时
  this.m_per_step = val / 24 / 6 // 时间轴显示24小时
  setTimeout(() => {
    this.init(this.timecell, true)
  }, 0)
}

/**
 *  画布对应的视频窗口
 *  @param {*} time
 */
TimeSlider.prototype.timeLineOfBackWinName = function (winBackName) {
  this.winBackName = winBackName
}

/**
 * 播放，指针移动
 *  @param {*} time 单位ms
 */
TimeSlider.prototype.set_time_to_middle = function (time_, time) {
  this.clearCanvas()
  this.init(this.timecell, true)
  // 画当前播放时间刻 时间指针
  this.draw_middle_time(time_, time)
  if (this.g_isMouseEntermove) {
    // 画当前鼠标移上去显示的时间刻 时间指针
    this.tip_of_time()
  }
}

/**
 * 画当前播放时间刻 时间指针
 *  @param {*} time 单位ms
 */
TimeSlider.prototype.draw_middle_time = function (time_, time) {
  // 画指针
  this.drawLine(time_ * this.h_per_step, 0, time_ * this.h_per_step, 33, 'rgb(64, 196, 255', 2) // 中间播放点时间线
  // 画时间
  this.ctx.fillStyle = 'rgb(194, 202, 215)'
  this.ctx.fillText(time.substr(8, 2) + ':' + time.substr(10, 2) + ':' + time.substr(12, 2), time_ * this.h_per_step - 15, 55)
}

/**
 * 画当前鼠标移上去显示的时间刻 时间指针
 *  @param {*} time 单位ms
 */
TimeSlider.prototype.tip_of_time = function () {
  // 展示覆盖的时间线
  this.drawLine(this.g_mouseenterCursor, 0, this.g_mouseenterCursor, 33, 'rgb(255, 255, 255', 1)
  this.ctx.fillStyle = 'rgb(194, 202, 215)'
  // 展示覆盖的时间
  this.ctx.fillText(this.moveEnterTime.substr(0, 2) + ':' + this.moveEnterTime.substr(2, 2) + ':' + this.moveEnterTime.substr(4, 2), this.g_mouseenterCursor - 15, 55)
}

/**
 * 清空下载区域
 */
TimeSlider.prototype.sylanVideoDown = function () {
  this.g_mousedownRightCursor = null
  this.g_mousedownRightOffset = null
  this.ctx.clearRect(0, 0, this.canvansW, this.canVansH)
  this.init(this.timecell, true)
  // this.drawLine(this.g_mousedownCursor, 0, this.g_mousedownCursor, 33, 'rgb(64, 196, 255', 2)
}

/**
 * 清空光标
 */
TimeSlider.prototype.sylanVideoStop = function () {
  this.ctx.clearRect(0, 0, this.canvansW, this.canVansH)
  this.init(this.timecell, true)
}

/**
 * 获取鼠标posx
 * @param {*} e
 */
TimeSlider.prototype.get_cursor_x_position = function (e) {
  var posx = 0

  if (!e) {
    e = window.event
  }

  if (e.pageX || e.pageY) {
    posx = e.pageX
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
  }

  return posx + document.getElementsByClassName('timeLine_')[0].scrollLeft
}

/**
 * 返回时间轴上刻度的时间
 * @param {*} datetime new Date 格式
 */
TimeSlider.prototype.graduation_title = function (datetime) {
  if (datetime.getHours() == 0 && datetime.getMinutes() == 0 && datetime.getMilliseconds() == 0) {
    return ('0' + datetime.getDate().toString()).substr(-2) + '.' +
      ('0' + (datetime.getMonth() + 1).toString()).substr(-2) + '.' +
      datetime.getFullYear()
  }
  return datetime.getHours() + ':' + ('0' + datetime.getMinutes().toString()).substr(-2)
}

/**
 * 清除canvas 每次重新绘制需要先清除
 */
TimeSlider.prototype.clearCanvas = function () {
  this.ctx.clearRect(0, 0, this.canvansW, this.canVansH)
}

/**
 * 插件设置
 * @param {*} options
 */
function Plugin(options, val, cell, callback) {
  return this.each(function () {
    var _this = $(this)
    var _thisId = this.id
    var data = _this.data('timeslider')
    if (!data) {
      _this.data('timeslider', new TimeSlider(_thisId, options))
    } else {
      if (typeof options === 'string') {
        switch (options) {
          case 'timeLineWidthChange':
            data.timeLineWidthChange(val)
            break
          case 'timeLineOfBackWinName':
            data.timeLineOfBackWinName(val)
            break
          case 'set_time_to_middle':
            data.currentPlayTimePointer = (val.substr(8, 2) - 0) + val.substr(10, 2) / 60 + val.substr(12, 2) / 3600
            data.currentPlayTime = val
            data.set_time_to_middle(data.currentPlayTimePointer, val)
            break
          case 'sylanVideoDown':
            data.sylanVideoDown()
            break
          case 'sylanVideoStop':
            data.sylanVideoStop()
            break
          case 'init':
            break
        }
      } else {
        data.clearCanvas()
        data.init(options.init_cells, true)
      }
    }
  })
}

var old = $.fn.TimeSlider

$.fn.TimeSlider = Plugin

$.fn.TimeSlider.noConflict = function () {
  $.fn.TimeSlider = old
  return this
}
