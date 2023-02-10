<template>
  <div class="home">
    <div id="mapView"></div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";

export default {
  data() {
    return {};
  },
  mounted() {
    this._createMapView();
  },
  methods: {
    _createMapView() {
      const option = {
        url: "https://js.arcgis.com/4.23/",
        css: "https://js.arcgis.com/4.23/esri/themes/light/main.css",
      };
      loadModules(
        [
          "esri/Map",
          "esri/views/MapView",
          "esri/Graphic",
          "esri/layers/GraphicsLayer",
          "esri/layers/FeatureLayer",
          "esri/layers/SceneLayer",
        ],
        option
      )
        .then(([Map, MapView, Graphic, GraphicsLayer, FeatureLayer,SceneLayer]) => {
          let map = new Map({
            basemap: "topo",
          });
          let view = new MapView({
            map: map,
            center: [-114, 32.5],
            zoom: 5,
            container: "mapView",
          });
          const sceneLayer = new SceneLayer({
            url: "https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/SanFrancisco_Bldgs/SceneServer/layers/0",
            title: "San Francisco Downtown",
            popupEnabled: false,
          });
          map.add(sceneLayer);
          const graphicsLayer = new GraphicsLayer();
          map.add(graphicsLayer);

          // 创建一个点
          const point = {
            type: "point",
            longitude: -114.80657463861,
            latitude: 34.0005930608889,
          };
          const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [0, 0, 255], // Orange
            outline: {
              color: [255, 255, 255], // White
              width: 5,
            },
          };
          const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,
          });
          graphicsLayer.add(pointGraphic);

          // Create a line geometry
          const polyline = {
            type: "polyline",
            paths: [
              [-118.821527826096, 3.0139576938577], //Longitude, latitude
              [-130.814893761649, 34.0080602407843], //Longitude, latitude
              [-118.808878330345, 34.0016642996246], //Longitude, latitude
            ],
          };
          const simpleLineSymbol = {
            type: "simple-line",
            color: [226, 119, 40], // Orange
            width: 2,
          };
          const polylineGraphic = new Graphic({
            geometry: polyline,
            symbol: simpleLineSymbol,
          });
          graphicsLayer.add(polylineGraphic);

          const trailheadsLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
          });
          map.add(trailheadsLayer);
          const trailsLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
          });
          map.add(trailsLayer, 0);

          const bikeTrailsRenderer = {
            type: "simple",
            symbol: {
              type: "simple-line",
              style: "short-dot",
              color: "#00ff00",
              width: "1px",
            },
          };
          const bikeTrails = new FeatureLayer({
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
            renderer: bikeTrailsRenderer,
            definitionExpression: "USE_BIKE = 'YES'",
          });
          map.add(bikeTrails, 1);

          
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  width: 100vw;
  height: 100vh;
}
#mapView {
  width: 100%;
  height: 100%;
}
</style>
