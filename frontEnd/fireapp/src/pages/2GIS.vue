<template>
  <q-page id = "MPage" class='flex flex-center'>
    <div id='location'>Your position:</div>
    <div id = 'Ob' style='width:100vw; height: 95vh'>
    <div id='map' style='width:100vw; height: 95vh'></div></div>
    <div class="page-reload" @click="reload">Обновить карту</div>
    <ActionButton v-if="Status!='saver'" :IsTurned="true" :Coords="currentCoords" :Adress="currentAdress" @chAdr='chAdr' @Search="Search"/>
    <PulseAnimation v-if="Searching == true && Status!='saver' && !FireStatus" />
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
      currentCoords: null,
      map: null
    }
  },
  watch:{
    Theme: function(NewV){
      document.getElementById('map').style.filter = `invert(${NewV == 'black' ? '100%' : '0%'})`
    }
  },
  mounted () {
    this.activateButton()
    this.forceUpdate()
    this.checkTheme()
    var marker
    var map
    var center
    var self = this
    var locationInfo = document.getElementById('location')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success)
    }
    
    function success(pos) {
      if (navigator.geolocation) {
        if(self.StatusPeople == 'saver') {
          center = [76.93741563189342, 43.24249282996095];
        }
        else {
          center = [pos.coords.longitude, pos.coords.latitude];
        }
      }

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
      // var Interval = setInterval(() => {
      //   if (self.TripStatus == true || self.FireStatus == true) {
      //     clearInterval(Interval)
      //       const directions = new mapgl.Directions(this.map, {
      //         directionsApiKey: 'ruhwrq0201',
      //       });
      //     if(self.TripStatus == true){
      //         markers.push(
      //             new mapgl.Marker(map, {
      //                 coordinates: [76.93741563189342, 43.24249282996095],
      //                 icon: 'https://docs.2gis.com/img/dotMarker.svg',
      //             })
      //         );
      //         markers.push(
      //             new mapgl.Marker(map, {
      //                 coordinates:  [76.92285818015283, 43.23393034436996],
      //                 icon: 'https://docs.2gis.com/img/dotMarker.svg',
      //             })
      //         );
      //         markers.forEach((m) => {
      //             m.destroy();
      //         });

      //         directions.carRoute({
      //             points: [[76.93741563189342, 43.24249282996095], [76.92285818015283, 43.23393034436996]]
      //         });
      //         axios.post('https://catalog.api.2gis.com/carrouting/6.0.0/global?key=YOUR_KEY', 
      //         {
      //           points: [
      //             {
      //               x: 76.93741563189342,
      //               y: 43.24249282996095
      //             },
      //             {
      //               x: 76.92285818015283,
      //               y: 43.23393034436996
      //             }
      //           ]
      //         })
      //         .then(response => {
      //           console.log(response, 'RESPONSE_2GIS_DATA_POINTS');
      //           var array = response.data.result.maneuvers
      //           var i = 0

      //           setInterval(() => {
      //             map.setCenter(array[i])
      //           }, 100);
      //           i++
      //         })
      //         .catch(err => {
      //           console.log(err)
      //         })
      //     }
      //     else if (self.FireStatus == true) {
      //       const markers = []
      //       markers.push(
      //           new mapgl.Marker(map, {
      //               coordinates: [76.93741563189342, 43.24249282996095],
      //               icon: 'https://docs.2gis.com/img/dotMarker.svg',
      //           })
      //       );
      //       markers.push(
      //           new mapgl.Marker(map, {
      //               coordinates:  map.getCenter(),
      //               icon: 'https://docs.2gis.com/img/dotMarker.svg',
      //           })
      //       );
      //       markers.forEach((m) => {
      //           m.destroy();
      //       });

      //       directions.carRoute({
      //           points: [[76.93741563189342, 43.24249282996095], map.getCenter()]
      //       });
      //       axios.post('https://catalog.api.2gis.com/carrouting/6.0.0/global?key=YOUR_KEY', 
      //         {
      //           points: [
      //             {
      //               x: 76.93741563189342,
      //               y: 43.24249282996095
      //             },
      //             {
      //               x: 76.92285818015283,
      //               y: 43.23393034436996
      //             }
      //           ]
      //         })
      //         .then(response => {
      //           console.log(response, 'RESPONSE_2GIS_DATA_POINTS');
      //           var array = response.data.result.maneuvers
      //           var i = 0

      //           setInterval(() => {
      //             marker.setCoordinates(array[i])
      //           }, 100);
      //           i++
      //         })
      //         .catch(err => {
      //           console.log(err)
      //         })
      //     }
      //   }
      // }, 2000);
    }

    function getReturnGeocoding(){
      axios.get(`https://catalog.api.2gis.com/3.0/items/geocode?lon=${map.getCenter()[0]}&lat=${map.getCenter()[1]}&key=ruhwrq0201`)
        .then(function(response) {
          console.log(response);
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
    chAdr(adr){
      this.currentAdress = adr
    },
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
      //window.location.reload()
      this.$forceUpdate();
    },
    checkTheme(){
      document.getElementById('map').style.filter = `invert(${this.Theme == 'black' ? '100%' : '0%'})`
    },
    Search(){
      this.Searching = true
      this.$store.commit('WebSocketSendNewFire', [this.currentAdress, this.currentCoords])
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
    },
    FireStatus(){
      return this.$store.state.FireStatus
    },
    TripStatus(){
      return this.$store.state.TripStatus
    },
    StatusPeople(){
      return this.$store.state.status
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