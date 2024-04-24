<script>
import AppHeader from "@/components/AppHeader.vue";
export default {
  components: {
    AppHeader,
  }
};

</script>

<template>
  <div id="app">
    <AppHeader :key="$route.fullPath"/>
      <div class="container mt-3">
      <router-view :key="$route.path"/>
    </div>
  </div>
</template>

<style>
.page {
  max-width: 400px;
  margin: auto;
}
</style>