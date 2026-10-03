<template>
  <div class="qr-code">
    <QrcodeVue
      :value="value"
      :size="size"
      :level="level"
      render-as="svg"
    />
  </div>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue'

defineProps({
  value: {
    type: String,
    required: true
  },

  size: {
    type: Number,
    default: 180
  },

  level: {
    type: String,
    default: 'H'
  }
})
</script>

<style scoped>
.qr-code {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>