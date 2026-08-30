<template>
  <div class="card">
    <div class="card-header">
      <div>
        <span class="card-header-title">{{ title }}</span>
        <strong class="card-value">{{ value }}</strong>
      </div>
      <div class="card-icon">
        <component
          :is="icon"
          :size="size"
        />   
      </div>
    </div>
  </div>
</template>

<script setup>
    import '../assets/css/Card.css'

    defineProps({
        title: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        icon: {
            type: Object,
            required: true
        }
    })
</script>