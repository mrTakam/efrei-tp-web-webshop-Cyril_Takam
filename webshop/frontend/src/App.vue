<template>
  <div id="app" class="container">
    <Menu></Menu>
    <IndexPage></IndexPage>
  </div>
</template>

<script>

import Menu from "./components/Menu";
import IndexPage from "./components/IndexPage";
export default {
  name: 'App',
  components: {
    IndexPage,
    Menu
  }
}
</script>

<style>
</style>
