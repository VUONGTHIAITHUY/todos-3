<template>
  <div class="container m-auto border-4 border-black">
    <HeaderNav />
    <router-view />
  </div>
</template>

<script>
import HeaderNav from '@/components/HeaderNav.vue'

export default {
  components: {
    HeaderNav
  }
}
</script>

<style lang="scss"></style>
