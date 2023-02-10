<template>
  <!-- 天地图 -->
  <div class="home">
    <div id="mapDiv" @click="addInfo"></div>
    <button @click="map.zoomIn()">+</button>
    <button @click="map.zoomOut()">-</button>
    <button @click="panTo">去北京天安门</button>
    <button @click="move">移动</button>
    <button @click="toggle">控件显示/隐藏</button>
    <button @click="addLine">添加线</button>
    <button @click="addArea">添加面</button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "T",
  components: {},
  data() {
    return {
      map: null, //地图实例
      zoom: 12,
      // imgUrl: 'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={x}&TILECOL={y}&tk=' + '8d370870dfb8d1606ec0399604dfad9e'
      imgUrl:
        "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=" +
        "096130d4c055dde7162dc8190cf0a0a9",
      control: null, // 控件
    };
  },
  created() {},
  mounted() {
    this.map = new T.Map("mapDiv");
    this.map.centerAndZoom(new T.LngLat(116.40769, 39.89945), this.zoom); // 设置中心点和级别
    this.map.disableDoubleClickZoom();
    this.map.setMinZoom(5, 14);
    // console.log(this.map.getSize());
    // console.log(this.map.getBounds());
    // console.log(this.map.getDistance(new T.LngLat(116.40769, 39.89945), new T.LngLat(116.40769, 39.99945))); // getDistance返回两点之间多少米
    // console.log(this.map.getViewport([new T.LngLat(116.40769, 39.89945),new T.LngLat(130.40769, 39.89945)]));
    // // this.map.setStyle()
    // let lnglat = this.map.containerPointToLngLat({x:10,y:100})
    // console.log(lnglat, '返回地理坐标');

    // let lay = new T.TileLayer(this.imgUrl, { minZoom: 1, maxZoom: 18 }); // 添加图层
    // this.map.addLayer(lay);

    var ctrl = new T.Control.MapType();
    this.map.addControl(ctrl); //添加控件

    var marker = new T.Marker(new T.LngLat(116.411794, 39.9068));
    this.map.addOverLay(marker); //向地图上添加标注

    //创建图片对象
    var icon = new T.Icon({
      iconUrl: "http://api.tianditu.gov.cn/img/map/markerA.png",
      iconSize: new T.Point(19, 27),
      iconAnchor: new T.Point(100, 25),
    });
    //向地图上添加自定义标注
    var marker = new T.Marker(new T.LngLat(116.411794, 39.9068), {
      icon: icon,
    });
    this.map.addOverLay(marker);
    // this.map.addControl(this.control);
    // this.control.onRemove()
  },

  methods: {
    panTo() {
      this.map.panTo(new T.LngLat(110.40769, 39.89945)); //将地图的中心点变换到指定的地理坐标
    },
    move() {
      this.map.panBy({ x: 100, y: 50 });
      // this.map.setMaxBounds([new T.LngLat(110.40769, 39.89945),new T.LngLat(130.40769, 42.89945)])//设置地图的显示范围
      // let point = this.map.lngLatToContainerPoint(new T.LngLat(110.40769, 39.89945))// 将地理坐标转化为像素坐标，相对于container左上角
      // let point2 = this.map.lngLatToLayerPoint(new T.LngLat(110.40769, 39.89945))// 将地理坐标转化为像素坐标，相对于地图图层左上角
      // console.log(point);
      // console.log(point2);
    },
    toggle() {
      newControl = new T.Control({ position: T_ANCHOR_TOP_LEFT });

      this.control.onRemove();
      // if (this.control.isVisible()) {
      //   this.control.hide();
      // } else {
      //   this.control.show();
      // }
    },
    addLine() {
      let points = [];
      points.push(new T.LngLat(116.41136, 39.97569));
      points.push(new T.LngLat(116.411794, 39.9068));
      points.push(new T.LngLat(116.32969, 39.9294));
      points.push(new T.LngLat(116.385438, 39.9061));
      //创建线对象
      var line = new T.Polyline(points);
      //向地图上添加线
      this.map.addOverLay(line);
    },
    addArea() {
      var points = [];
      points.push(new T.LngLat(116.51836, 39.97569));
      points.push(new T.LngLat(116.411794, 39.9068));
      points.push(new T.LngLat(116.52969, 39.9294));
      points.push(new T.LngLat(116.385438, 39.9061));
      //创建面对象
      var polygon = new T.Polygon(points, {
        color: "#0f0",
        weight: 3,
        opacity: 0.5,
        fillColor: "#f00",
        fillOpacity: 0.5,
      });
      //向地图上添加面
      this.map.addOverLay(polygon);
    },
    addInfo() {
      this.map.on("click", (e) => {
        console.log(11111);
        var infoWin = new T.InfoWindow();
        infoWin.setLngLat(e.lnglat);
        // //设置信息窗口要显示的内容
        infoWin.setContent(`精度：${e.lnglat.lng}纬度：${e.lnglat.lat}`);
        // //向地图上添加信息窗口
        this.map.addOverLay(infoWin);
      });
    },
  },
};
</script>
<style lang="less" scoped>
.home {
  #mapDiv {
    width: 100vw;
    height: 80vh;
  }
  button {
    margin: 20px 10px;
  }
}
</style>
