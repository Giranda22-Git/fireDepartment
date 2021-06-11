<template>
  <q-page id = "MPage" class='flex flex-center'>
    <div id='location'>Your position:</div>
    <div id = 'Ob' style='width:100vw; height: 95vh'>
    <div id='map' style='width:100vw; height: 95vh'></div></div>
    <!-- <div class="page-reload" @click="reload">Обновить карту</div> -->
    <ActionButton v-if="StatusPeople!='saver'" :IsTurned="true" :Coords="currentCoords" :Adress="currentAdress" @chAdr='chAdr' @Search="Search" @GetCenter="SetCenter"/>
    <PulseAnimation v-if="Searching == true && StatusPeople!='saver' && !FireStatus" />
    <SearchingButton v-if="Searching == true && StatusPeople!='saver' && !FireStatus" />
    <ArrivedPage v-if="Arrived.length > 0" :text='Arrived'/>
  </q-page>
</template>

<script>
// <svg class = 'svg' width='35' height='90' viewBox='0 0 29 47' fill='none' xmlns='http://www.w3.org/2000/svg'><ellipse cx='15' cy='43' rx='8' ry='2' fill='black' fill-opacity='0.1'/><line x1='15' y1='28' x2='15' y2='42' stroke='#FF2600' stroke-width='2' stroke-linecap='round'/><circle cx='14.5' cy='14.5' r='14.5' fill='#FF583B'/><circle cx='14.5' cy='14.5' r='6.5' fill='#FFCC81'/><defs><filter id='filter0_f' x='5' y='39' width='20' height='8' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'><feFlood flood-opacity='0' result='BackgroundImageFix'/><feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/><feGaussianBlur stdDeviation='1' result='effect1_foregroundBlur'/></filter></defs></svg>
import ActionButton from '../components/ActionButton.vue'
import PulseAnimation from '../components/PulseAnimation.vue'
import ArrivedPage from '../components/Arrived.vue'
import SearchingButton from '../components/SearchingButton.vue'
import axios from 'axios'
// import mapgl from '@2gis/mapgl'
export default {
  name: 'TwoGis',
  data(){
    return{
      Searching: false,
      currentAdress: 'Ваш Адрес не определен',
      currentCoords: null,
      Arrived: '',
      MarkerCoords: null,
      map: null
    }
  },
  watch:{
    Theme: function(NewV){
      document.getElementById('map').style.filter = `invert(${NewV == 'black' ? '100%' : '0%'})`
    }
  },
  mounted () {
    // this.activateButton()
    this.forceUpdate()
    this.checkTheme()
    var marker, marker2
    var map
    var Radian = 190/Math.PI
    var center
    var self = this
    var locationInfo = document.getElementById('location')
        function success(pos) {
      if (navigator.geolocation) {
        if(self.StatusPeople == 'saver') {
          center = [76.93741563189342, 43.24249282996095];
        }
        else {
          center = [pos.coords.longitude, pos.coords.latitude];
        }
      }
      self.map = new mapgl.Map('map', {
        key: '519f87ba-c90a-4500-9c57-71034960435b',
        center: center,
        zoom: 18,
        draggable: true,
        zoomControl: false,
        fullscreenControl: false
      });
      self.map.setCenter(center)
      // self.map.showTraffic()
      marker = new mapgl.Marker(self.map, {
        coordinates: self.map.getCenter(),
        icon: 'Cursor.svg'
      });
      self.MarkerCoords = self.map.getCenter()
      self.currentCoords = self.map.getCenter()
      getReturnGeocoding()
      function MarkerAction(){
        if (self.TripStatus != true && self.FireStatus != true) {
          marker.setCoordinates(self.map.getCenter())
          self.MarkerCoords = self.map.getCenter()
        }
      }
      self.map.on('move', MarkerAction)
      self.map.on('moveend', getReturnGeocoding)
      var Interval = setInterval(() => {
        if (self.TripStatus == true || self.FireStatus == true) {
          clearInterval(Interval)
          self.map.off('move', MarkerAction)
          self.map.off('moveend', getReturnGeocoding)
          marker.destroy()
          const directions = new mapgl.Directions(self.map, {
            directionsApiKey: 'ruhwrq0201',
          });
          const markers = []
          if(self.TripStatus == true){
              markers.push(
                  new mapgl.Marker(self.map, {
                      coordinates: [76.93741563189342, 43.24249282996095],
                      icon: 'https://docs.2gis.com/img/dotMarker.svg',
                  })
              );
              markers.push(
                  new mapgl.Marker(self.map, {
                      coordinates:  self.VictimCoords,
                      icon: 'https://docs.2gis.com/img/dotMarker.svg',
                  })
              );
              markers.forEach((m) => {
                  m.destroy();
              });

              axios.post('https://catalog.api.2gis.com/carrouting/6.0.0/global?key=ruhwrq0201', 
              {
                points: [
                  {
                    type: "pedo",
                    x: 76.93741563189342,
                    y: 43.24249282996095
                  },
                  {
                    type: "pedo",
                    x: self.VictimCoords[0],
                    y: self.VictimCoords[1]
                  }
                ]
              })
              .then(response => {
                console.log(response, 'RESPONSE_2GIS_DATA_POINTS');
                var array = response.data.result.maneuvers
                var i = 0

                console.log(response, 'RESPONSE_2GIS_DATA_POINTS');
                var array = response.data.result[0].maneuvers
                var maneuvers = []
                var count = 0
                var pointss = []

                for(let o = 0; o < array.length; o++){
                  console.log(o);
                  array[o]?.outcoming_path?.geometry.forEach(element => {
                    maneuvers = maneuvers.concat(element.selection.split('LINESTRING(').pop().split(')').shift().split(' '));
                  })
                  // marker.setCoordinates(array[i].outcoming_path.geometry)
                }
                var maneuvers = maneuvers.map(function(el) {
                  return el.split(',').shift()
                });
                console.log(maneuvers,'KKKKKKKK');
                for(let j = 0; j < maneuvers.length; j+=2){
                  pointss.push([maneuvers[j], maneuvers[j + 1]])
                }
                console.log(pointss,'LLLLLLLLLLL');
                var c = Math.round(pointss.length / 12)
                directions.carRoute({
                    points: [[76.93741563189342, 43.24249282996095],pointss[c*2], pointss[c*4], pointss[c*6], pointss[c*8], self.VictimCoords],
                    style: {
                      routeLineWidth: [
                          'interpolate',
                          ['linear'],
                          ['zoom'],
                          10,
                          10, // width will change from 30 px at zoom level 10 and below...
                          14,
                          10, // ...to 3 px at zoom level 14 and above
                      ],
                      substrateLineWidth: [
                          'interpolate',
                          ['linear'],
                          ['zoom'],
                          10,
                          0, // width will change from 3 px at zoom level 10 and below...
                          14,
                          0, // ...to 50 px at zoom level 14 and above
                      ],
                      haloLineWidth: 0
                  },
                });
                var Angle = 0;
                var time = setInterval(() => {
                  locationInfo.innerHTML = `Оставшееся время: ${pointss.length - count/2}`
                  marker2.setCoordinates([maneuvers[count], maneuvers[count + 1]])

                  Angle = [maneuvers[count + 3] - maneuvers[count + 1], maneuvers[count + 2] - maneuvers[count]]
                  console.log(Math.atan2(Angle[0],Angle[1]) * Radian - 90, Angle);
                  self.map.setRotation(Math.atan2(Angle[0],Angle[1]) * Radian - 90)

                  count+=2
                  if (count%4 == 0) {
                    self.map.setCenter([maneuvers[count], maneuvers[count + 1]])
                  }
                  if(count == maneuvers.length - 2){
                    self.map.on('move', MarkerAction)
                    self.map.on('moveend', getReturnGeocoding)
                    marker2.destroy()
                    getReturnGeocoding()
                    clearInterval(time)
                    directions.clear();
                    self.Arrived = 'Saver'
                    self.$store.commit('FiremanArrived')
                    marker = new mapgl.Marker(self.map, {
                      coordinates: self.map.getCenter(),
                      icon: 'Cursor.svg'
                    });
                  }
                }, 1000);
                marker2 = new mapgl.Marker(self.map, {
                  coordinates: self.map.getCenter(),
                  icon: 'https://docs.2gis.com/img/mapgl/marker.svg',
                  zIndex: 100
                });
              })
              .catch(err => {
                console.log(err)
              })
          }
          else if (self.FireStatus == true) {
            markers.push(
                new mapgl.Marker(self.map, {
                    coordinates: [76.93741563189342, 43.24249282996095],
                    icon: 'https://docs.2gis.com/img/dotMarker.svg',
                })
            );
            markers.push(
                new mapgl.Marker(self.map, {
                    coordinates:  self.map.getCenter(),
                    icon: 'https://docs.2gis.com/img/dotMarker.svg',
                })
            );
            markers.forEach((m) => {
                m.destroy();
            });

           axios.post('https://catalog.api.2gis.com/carrouting/6.0.0/global?key=ruhwrq0201', 
              {
                points: [
                  {
                    type: "pedo",
                    x: 76.93741563189342,
                    y: 43.24249282996095
                  },
                  {
                    type: "pedo",
                    x: self.map.getCenter()[0],
                    y: self.map.getCenter()[1]
                  }
                ]
              })
              .then(response => {
                console.log(response, 'RESPONSE_2GIS_DATA_POINTS');
                var array = response.data.result[0].maneuvers
                var maneuvers = []
                var count = 0
                var pointss = []

                for(let o = 0; o < array.length; o++){
                  console.log(o);
                  array[o]?.outcoming_path?.geometry.forEach(element => {
                    maneuvers = maneuvers.concat(element.selection.split('LINESTRING(').pop().split(')').shift().split(' '));
                  })
                  // marker.setCoordinates(array[i].outcoming_path.geometry)
                }
                var maneuvers = maneuvers.map(function(el) {
                  return el.split(',').shift()
                });
                console.log(maneuvers,'KKKKKKKK');
                for(let j = 0; j < maneuvers.length; j+=2){
                  pointss.push([maneuvers[j], maneuvers[j + 1]])
                }
                console.log(pointss,'LLLLLLLLLLL');
                var c = Math.round(pointss.length / 12)
                directions.carRoute({
                    points: [[76.93741563189342, 43.24249282996095],pointss[c*2], pointss[c*4], pointss[c*6], pointss[c*8], [76.92285818015283, 43.23393034436996]],
                    style: {
                      routeLineWidth: [
                          'interpolate',
                          ['linear'],
                          ['zoom'],
                          10,
                          10, // width will change from 30 px at zoom level 10 and below...
                          14,
                          10, // ...to 3 px at zoom level 14 and above
                      ],
                      substrateLineWidth: [
                          'interpolate',
                          ['linear'],
                          ['zoom'],
                          10,
                          0, // width will change from 3 px at zoom level 10 and below...
                          14,
                          0, // ...to 50 px at zoom level 14 and above
                      ],
                      haloLineWidth: 0
                  },
                });
                var time = setInterval(() => {
                  locationInfo.innerHTML = `Оставшееся время: ${pointss.length - count/2}`
                  marker2.setCoordinates([maneuvers[count], maneuvers[count + 1]])
                  count+=2
                  if (count%10 == 0) {
                    self.map.setCenter([maneuvers[count], maneuvers[count + 1]])
                  }
                  if(count == maneuvers.length - 2){
                    self.map.on('move', MarkerAction)
                    self.map.off('moveend', getReturnGeocoding)
                    marker2.destroy()
                    getReturnGeocoding()
                    clearInterval(time)
                    directions.clear();
                    self.Arrived = 'Ord'
                    self.Searching = false
                    self.$store.commit('FiremanArrived')
                    marker = new mapgl.Marker(self.map, {
                      coordinates: self.map.getCenter(),
                      icon: 'Cursor.svg'
                    });
                  }
                }, 1000);
                marker2 = new mapgl.Marker(self.map, {
                  coordinates: self.map.getCenter(),
                  icon: 'https://docs.2gis.com/img/mapgl/marker.svg',
                  zIndex: 100
                });
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      }, 2000);
    }
    function error(err){
      alert(`ERROR(${err.code}): ${err.message}`);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success,error)
    } else {
      alert('NAVIGATOR_ERROR');
    }

    function getReturnGeocoding(){
      axios.get(`https://catalog.api.2gis.com/3.0/items/geocode?lon=${self.map.getCenter()[0]}&lat=${self.map.getCenter()[1]}&key=ruhwrq0201`)
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
    SetCenter(){
      var options = {
        animate: true,
        duration: 1000,
        easing: 'easeInQuart'
      }
      this.map.setCenter(this.currentCoords, options)
    },
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
    // activateButton(){
    //   let button = document.querySelector('.page-reload')
    //   button.addEventListener('touchstart', function(){
    //     button.style.background = "rgb(245,245,245)"
    //   })
    //   button.addEventListener('touchend', function(){
    //     button.style.background = "#e0e0e0"
    //   })
    // },
    reload(){
      //window.location.reload()
      this.$forceUpdate();
    },
    checkTheme(){
      document.getElementById('map').style.filter = `invert(${this.Theme == 'black' ? '100%' : '0%'})`
    },
    Search(){
      this.Searching = true
      this.$store.commit('WebSocketSendNewFire', [this.currentAdress, this.MarkerCoords])
    }
  },
  components:{
    ActionButton,
    PulseAnimation,
    ArrivedPage,
    SearchingButton
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
    },
    VictimCoords(){
      return this.$store.state.VictimCoords
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
  padding: 0 40px 0 40px;
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