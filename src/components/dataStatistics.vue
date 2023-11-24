<template>

  <div class=" w-full  flex  relative m-1">
    <div class="panel w-full absolute"></div>
    <div class="w-[calc(100%-1rem)] h-[calc(100%-2rem)]  absolute m-2 flex">


      <div class="flex-col w-1/3 h-full  p-4 justify-center items-center flex ">
        <div class="text-2xl font-bold text-white w-full pl-2 pb-1">{{ AppGlobal.dataStatistics.totalitySupervisory }}</div>
        <span class="flex items-center w-full pl-2">
                            <i class="icon-dot text-lg bg-[#006cff] opacity-100 rounded w-3 mr-2" style="color: #006cff"></i>
          <div class="text-xl text-[#006cff]">监控总数</div>
                        </span>
      </div>
      <div class="flex-col w-1/3 h-full  p-4 justify-center items-center flex ">
        <div class="text-2xl font-bold text-white w-full pl-2 pb-1">{{ AppGlobal.dataStatistics.normalSupervisory }}</div>
        <span class="flex items-center w-full pl-2">
                            <i class="icon-dot text-lg bg-[#6acca3] opacity-100 rounded w-3 mr-2" style="color: #6acca3"></i>
          <div class="text-xl text-[#6acca3]">正常监控</div>
                        </span>
      </div>
      <div class="flex-col w-1/3 h-full  p-4 justify-center items-center flex ">
        <div class="text-2xl font-bold text-white w-full pl-2 pb-1 ">{{ AppGlobal.dataStatistics.abnormalSupervisory }}</div>
        <span class="flex items-center w-full pl-2">
                            <i class="icon-dot text-lg bg-[#ed3f35] opacity-100 rounded w-3 mr-2" style="color: #ed3f35"></i>
          <div class="text-xl text-[#ed3f35]">监控异常</div>
                        </span>
      </div>

    </div>

  </div>
</template>

<script setup>
import { useAppGlobal } from '@/store/AppGlobal'
import { onMounted, ref, watch, watchEffect } from 'vue'
import { isReactive,isRef } from 'vue';

const a=ref(1)

const AppGlobal = useAppGlobal();
onMounted(() => {

})





</script>

<style scoped>
.panel {
  /* 边框 */
  box-sizing: border-box;
  border-image: url(@/assets/image/border.png) 51 38 21 132;
  border-width: 2.125rem 1.583rem 0.875rem 5.5rem;
}

.icon-dot:before {
  content: "\e900";
}
</style>
