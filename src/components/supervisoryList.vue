<template>

  <div class=" w-full h-full flex  relative m-1">
    <div class="panel w-full absolute"></div>
    <div class="w-[calc(100%-1rem)] h-[calc(100%-2rem)]  absolute  m-2 flex">
      <div class="w-full h-12  flex flex item-center">
        <div class="text-xl  w-40  items-center flex justify-center" :class="[true?'text-white':'text-[#4c9bfd]']" >监控情况统计</div>
        <div class="text-xl text-[#4c9bfd] w-40  items-center flex justify-center">监控设备列表</div>
      </div>
      <div>


      </div>



    </div>

  </div>
</template>

<script setup>

</script>

<style scoped>
.panel {
  /* 边框 */
  box-sizing: border-box;
  border-image: url(@/assets/image/border.png) 51 38 21 132;
  border-width: 2.125rem 1.583rem 0.875rem 5.5rem;
}


</style>
