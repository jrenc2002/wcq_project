<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

// 禁止缩放
window.addEventListener(
  'mousewheel',
  function (event) {
    if (event.ctrlKey === true || event.metaKey) {
      event.preventDefault()
    }
  }
)
</script>
<style>
body {
  margin: 0 auto;
  height: 100%;
  position: relative;
  background: #000a13 url(@/assets/image/bg.jpg) no-repeat top center;
  font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei", "HanHei SC", "Helvetica Neue", "Open Sans", Arial, "Hiragino Sans GB", "微软雅黑", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
}
</style>
