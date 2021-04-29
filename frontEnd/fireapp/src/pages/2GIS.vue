<template>

  <q-page id = "MPage" class='flex flex-center'>
    <div id='location'>Your position:</div>
    <div id = 'Ob' style='width:100vw; height: 95vh'>
    <div id='map' style='width:100vw; height: 95vh'></div></div>
    <div class="page-reload" @click="reload">Обновить карту</div>
    <ActionButton :IsTurned="true" :Coords="currentCoords" :Adress="currentAdress" @Search="Search"/>
    <PulseAnimation v-if="Searching == true" />
  </q-page>
</template>

<script>
// <svg class = 'svg' width='35' height='90' viewBox='0 0 29 47' fill='none' xmlns='http://www.w3.org/2000/svg'><ellipse cx='15' cy='43' rx='8' ry='2' fill='black' fill-opacity='0.1'/><line x1='15' y1='28' x2='15' y2='42' stroke='#FF2600' stroke-width='2' stroke-linecap='round'/><circle cx='14.5' cy='14.5' r='14.5' fill='#FF583B'/><circle cx='14.5' cy='14.5' r='6.5' fill='#FFCC81'/><defs><filter id='filter0_f' x='5' y='39' width='20' height='8' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'><feFlood flood-opacity='0' result='BackgroundImageFix'/><feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/><feGaussianBlur stdDeviation='1' result='effect1_foregroundBlur'/></filter></defs></svg>
import ActionButton from '../components/ActionButton.vue'
import PulseAnimation from '../components/PulseAnimation.vue'
import axios from 'axios'
// import mapgl from '@2gis/mapgl'
export default {
  name: 'TwoGis',
  data(){
    return{
      Searching: false,
      currentAdress: 'Ваш Адрес не определен',
      currentCoords: null
    }
  },
  watch:{
    Theme: function(oldV, NewV){
      document.getElementById('map').style.filter = `invert(${oldV == 'black' ? '100%' : '0%'})`
    }
  },
  mounted () {
    this.activateButton()
    this.forceUpdate()
    this.checkTheme()
    var marker
    var map
    var self = this
    var locationInfo = document.getElementById('location')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success)
    }
    
    function success(pos) {
      const center = [pos.coords.longitude, pos.coords.latitude];

      map = new mapgl.Map('map', {
        key: '519f87ba-c90a-4500-9c57-71034960435b',
        center: center,
        zoom: 18,
        draggable: true,
        zoomControl: false,
        fullscreenControl: false
      });
      map.setCenter(center)
      // map.showTraffic()
      marker = new mapgl.Marker(map, {
        coordinates: map.getCenter()
      });
      self.currentCoords = map.getCenter()
      getReturnGeocoding()
      map.on('move', function (e) {
        marker.setCoordinates(map.getCenter())
        // locationInfo.innerHTML = marker._latlng.lat + ', ' + marker._latlng.lng
      })
      map.on('movestart', function(){
        document.querySelector('svg').style.marginTop = '-20px'
        document.querySelector('ellipse').style.cy = '60'
        document.querySelector('ellipse').style.rx = '12'
      })
      map.on('moveend', function(){
        document.querySelector('svg').style.marginTop = '0'
        document.querySelector('ellipse').style.cy = '43'
        document.querySelector('ellipse').style.rx = '8'
        getReturnGeocoding()
      })
////////////////////////////
        const directions = new mapgl.Directions(map, {
            directionsApiKey: 'ruhwrq0201',
        });
        const markers = [];

        let firstPoint;
        let secondPoint;
        // A current selecting point
        let selecting = 'a';

        map.on('click', (e) => {
          const coords = e.lngLat;

          if (selecting != 'end') {
              // Just to visualize selected points, before the route is done
              markers.push(
                  new mapgl.Marker(map, {
                      coordinates: coords,
                      icon: 'https://docs.2gis.com/img/dotMarker.svg',
                  }),
              );
          }

          if (selecting === 'a') {
              firstPoint = coords;
              selecting = 'b';
          } else if (selecting === 'b') {
              secondPoint = coords;
              selecting = 'end';
          }

          // If all points are selected — we can draw the route
          if (firstPoint && secondPoint) {
              directions.carRoute({
                  points: [firstPoint, secondPoint],
              });
               marker.hide()
              markers.forEach((m) => {
                  m.destroy();
              });
          }
        });
    }

    function getReturnGeocoding(){
      axios.get(`https://catalog.api.2gis.com/3.0/items/geocode?lon=${map.getCenter()[0]}&lat=${map.getCenter()[1]}&fields=items.point&key=ruhwrq0201`)
        .then(function(response) {
          locationInfo.innerHTML = response.data.result.items[0].address_name || response.data.result.items[0].full_name
          // console.log(response)
          self.currentAdress = response.data.result.items[0].address_name || response.data.result.items[0].full_name
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
    // map.getCenter
  },
  methods:{
    forceUpdate(){
      if (this.Status == 'true') {
        this.$store.commit('st_ch', 'false')
        this.$forceUpdate();
      } else {
        this.$store.commit('st_ch', 'true')
      }
    },
    activateButton(){
      let button = document.querySelector('.page-reload')
      button.addEventListener('touchstart', function(){
        button.style.background = "rgb(245,245,245)"
      })
      button.addEventListener('touchend', function(){
        button.style.background = "#e0e0e0"
      })
    },
    reload(){
      window.location.reload()
    },
    checkTheme(){
      document.getElementById('map').style.filter = `invert(${this.Theme == 'black' ? '100%' : '0%'})`
    },
    Search(){
      this.Searching = true
    }
  },
  components:{
    ActionButton,
    PulseAnimation
  },
  computed: {
    Status () {
      return this.$store.state.updated
    },
    Theme(){
      return this.$store.state.theme
    }
  }
}
</script>

<style>
/* #map{
  filter: invert(100%)
} */
#location{
  height: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  padding: 0 5px 0 10vw;
  box-sizing: border-box;
  text-align: center;
}
.leaflet-marker-icon{
  visibility: hidden;
}
.svg{
  visibility: visible;
  transition: 0.5s;
}
ellipse{
  transition: 0.5s;
}
g{
    position: absolute;
  z-index: 1000;
}
.page-reload{
  position: absolute;
  top: 7vh;
  width: 50%;
  margin: 0 auto;
  padding: 1vh 0 1vh 0;
  background:#e0e0e0;
  border-radius: 20px;
  text-align: center;
  font-weight: 600;
  color: rgb(121, 121, 121);
  border: none;
  outline: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
</style>