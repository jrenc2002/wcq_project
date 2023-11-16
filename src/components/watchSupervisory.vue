<template>

  <div class=" w-full h-full flex  relative m-1">

    <div class="w-[calc(100%-1rem)] h-[calc(100%-2rem)]  absolute m-2 flex flex-col ">
      <div class="w-full h-12 mt-6 flex flex item-center">
        <div class="text-xl  w-56 text-white  items-center flex justify-start">监控实时数据</div>

      </div>
      <div class="bg-green-400 w-full h-[calc(100%-3rem)]">


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
