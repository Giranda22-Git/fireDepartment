<template>
  <q-page style="display: flex; align-items: center; flex-direction: column">
    <q-icon
    name="settings"
    style="font-size: 9em;"
    />
    <span style="font-size: 3em;">Settings</span>
    <div class="q-pa-md q-gutter-md" style="width: 95vw">
      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>Your Name</q-item-section>
          <q-item-section side>Изменить</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="signal_wifi_off" />
          </q-item-section>
          <q-item-section>Your Adress</q-item-section>
          <q-item-section side>Изменить</q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Settings'
}
</script>
