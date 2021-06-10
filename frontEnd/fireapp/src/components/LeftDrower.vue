<template>
  <q-layout view="lHh Lpr lFf" style = 'min-height: 0'>
    <q-btn
      style="position: absolute; z-index: 2002;"
      flat
      dense
      round
      icon="menu"
      aria-label="Menu"
      @click="leftDrawerOpen = !leftDrawerOpen"
    />
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          v-if="isLoggedIn"
          header
          class="text-grey-8"
          style="display: flex; align-items: center; flex-direction: column"
        >
          <span class = "userName">{{userPhoneNumber}}</span>
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
        <div class="button" @click="ExitAction">Выйти</div>
        <div class="button" @click="SwichTheme">{{theme == 'black' ? 'Дневной режим' : 'Ночной режим'}}</div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'LeftDrower',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: []
    }
  },
  beforeMount(){
    if(this.status == 'ordinary'){
      return this.essentialLinks = [
      {
        title: '2GIS',
        caption: '2gis maps',
        icon: 'public',
        link: '/'
      },
      {
        title: 'Settings',
        caption: 'Settings',
        icon: 'settings',
        link: '/settings'
      }]
    }else if(this.status == 'saver'){
      this.essentialLinks = [
      {
        title: '2GIS',
        caption: '2gis maps',
        icon: 'public',
        link: '/'
      },
      {
        title: 'Calls',
        caption: 'fire calls',
        icon: 'sensors',
        link: '/fireCalls'
      },
      {
        title: 'Settings',
        caption: 'Settings',
        icon: 'settings',
        link: '/settings'
      }]
    }
  },
  mounted(){
    let button = document.querySelector('.button')
    button.addEventListener('touchstart', function(){
      button.style.background = "rgb(245,245,245)"
    })
    button.addEventListener('touchend', function(){
      button.style.background = "#fff"
    })
  },
  methods:{
    ExitAction(){
      this.$store.commit('logout')
      location.reload()
    },
    SwichTheme(){
      this.$store.commit('swichTheme')
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn','status']),
    userName () {
      return this.$store.state.name
    },
    userPhoneNumber(){
      return this.$store.state.phone
    },
    theme(){
      return this.$store.state.theme
    },
    status(){
      return this.$store.state.status
    }
  }
}
</script>

<style>
*{
  box-sizing: border-box;
}
.userName{
  margin: 1vw;
  font-size: 1.4em;
}
.button{
  width: 70%;
  margin: 20px auto;
  padding: 1.7vh 0 1.7vh 0;
  background: #fff;
  border-radius: 20px;
  text-align: center;
  font-weight: 800;
  color:rgb(65, 62, 62);
  cursor: pointer;
  border: none;
  outline: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
</style>
