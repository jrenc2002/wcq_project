<template>

  <div class=" w-full  flex  relative m-1">
    <div class="panel w-full absolute"></div>
    <div class="w-[calc(100%-1rem)] h-[calc(100%-2rem)]  absolute  m-2 flex flex-col">
      <div class="w-full h-12  flex flex item-center">
        <div :class="[!chanceContent?'text-white':'text-[#4c9bfd]']" class="text-xl  w-40  items-center flex justify-center cursor-pointer"
             @click="chanceContent=false">监控设备列表
        </div>
        <div :class="[chanceContent?'text-white':'text-[#4c9bfd]']" class="text-xl  w-40  items-center flex justify-center cursor-pointer"
             @click="chanceContent=true">监控情况统计
        </div>

      </div>
      <div class=" w-full h-[calc(100%-3rem)] overflow-y-auto">
        <div>

          <div class=" flow-root ">
            <div class="mx-auto max-w-7xl px-4">
              <table class="w-full text-left">
                <thead>
                <tr>
                  <th class="relative isolate py-3.5 pr-3 text-center text-sm font-semibold text-blue-400 justify-center items-center flex"
                      scope="col">
                    设备名称
                  </th>
                  <th class="hidden px-3 py-3.5 text-center text-sm font-semibold text-blue-400 sm:table-cell justify-center items-center flex "
                      scope="col">
                    {{ chanceContent ? '异常类型' : '设备状态' }}
                  </th>
                  <th class="hidden px-3 py-3.5 text-center text-sm font-semibold text-blue-400 md:table-cell justify-center items-center flex"
                      scope="col">
                    {{ chanceContent ? '异常时间' : '操作' }}
                  </th>


                </tr>
                </thead>
                <tbody v-show="chanceContent">
                <tr v-for="(info,index) in AppGlobal.dataSupervisoryStatus" :key="index" class="hover:bg-[rgb(40,41,63)] cursor-pointer">

                  <td
                    class="hidden px-3 py-4 text-sm text-center text-gray-500 sm:table-cell justify-center items-center flex">
                    {{ info.camera_name }}
                  </td>
                  <td
                    class="hidden px-3 py-4 text-sm text-center text-gray-500 sm:table-cell justify-center items-center flex">
                    {{ info.alarm_name }}
                  </td>
                  <td
                    class="hidden px-3 py-4 text-sm text-center text-gray-500 md:table-cell justify-center items-center flex">
                    {{ formatDateTime(info.datetime) }}
                  </td>


                </tr>
                </tbody>


                <tbody v-show="!chanceContent">
                <tr v-for="(device,index) in AppGlobal.dataSupervisoryDevice" :key="index" class="hover:bg-[rgb(40,41,63)] cursor-pointer">

                  <td
                    class="hidden px-3 py-4 text-sm text-center text-gray-500 sm:table-cell justify-center items-center flex">
                    {{ device.camera_name }}
                  </td>
                  <td
                    class="hidden px-3 py-4 text-sm text-center text-gray-500 sm:table-cell justify-center items-center flex">
                    正常
                  </td>
                  <td
                    class="relative px-3 py-4 text-sm text-center text-gray-500 md:table-cell justify-center items-center flex">
                    <div class="flex justify-center items-center gap-2">
                      <div class="w-2 hover:text-blue-500 hover:cursor-pointer" @click="pushWatchList(1,device.id,device.stream_url)" :class="[isWatched(device.id,1)?'text-blue-500':'text-white']">1</div>
                      <div class="w-2 hover:text-blue-500 hover:cursor-pointer" @click="pushWatchList(2,device.id,device.stream_url)" :class="[isWatched(device.id,2)?'text-blue-500':'text-white']">2</div>
                      <div class="w-2 hover:text-blue-500 hover:cursor-pointer" @click="pushWatchList(3,device.id,device.stream_url)" :class="[isWatched(device.id,3)?'text-blue-500':'text-white']">3</div>
                      <div class="w-2 hover:text-blue-500 hover:cursor-pointer" @click="pushWatchList(4,device.id,device.stream_url)" :class="[isWatched(device.id,4)?'text-blue-500':'text-white']">4</div>
                    </div>
                  </td>



                </tr>
                </tbody>

              </table>
            </div>
          </div>
        </div>

      </div>


    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAppGlobal } from '@/store/AppGlobal'
import Swal from 'sweetalert2'

const AppGlobal = useAppGlobal();
const chanceContent = ref(false)
// 检查AppGlobal.watchControl.watchList有没有一个设备id和当前设备id相同，如果有，说明当前设备正在被监控,他是响应式的
const isWatched = computed(() => {
  return (deviceId, id) => {
    if (AppGlobal.watchControl.watchList.length >= id && id > 0) {
      return AppGlobal.watchControl.watchList[id - 1].id === deviceId;
    }
    return false;
  };
});

// 将视频源和视频ID更改到指定watchList里
const pushWatchList = (id,deviceID,videoUrl) => {
  // 如果更改前发现当前设备被锁定，将取消更改
  if(AppGlobal.watchControl.watchList[id-1].isLock){
    let title, text
    title = '该窗口已被锁定'
    text = 'The window is locked.'
    Swal.fire(title, text, 'error')
    return
  }
  // 如果更改前发现目标设备被锁定，将取消更改
  for(let i=0;i<AppGlobal.watchControl.watchList.length;i++){
    if(AppGlobal.watchControl.watchList[i].id === deviceID ){
      if(AppGlobal.watchControl.watchList[i].isLock){
        let title, text
        title = '该窗口已被锁定'
        text = 'The window is locked.'
        Swal.fire(title, text, 'error')
      return
    }}
  }

  // 先检查之前的watchList是否有相同的id，如果isLock为false，就删除path和id的数据
  if(!AppGlobal.watchControl.watchList[id-1].isLock){
    AppGlobal.watchControl.watchList[id-1].path = ''
    AppGlobal.watchControl.watchList[id-1].id = ''
  }
  // 然后检查当要更改的设备id是否再watchlist有相同的id,如果有就将其清零
  for(let i=0;i<AppGlobal.watchControl.watchList.length;i++){
    if(AppGlobal.watchControl.watchList[i].id === deviceID){
      AppGlobal.watchControl.watchList[i].path = ''
      AppGlobal.watchControl.watchList[i].id = ''
    }
  }
  AppGlobal.watchControl.watchList[id-1].path = videoUrl
  AppGlobal.watchControl.watchList[id-1].id = deviceID
  console.log('____________',AppGlobal.watchControl.watchList)
}

function formatDateTime(datetime) {
  if (!datetime) return '';
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
}

</script>

<style scoped>
.panel {
  /* 边框 */
  box-sizing: border-box;
  border-image: url(@/assets/image/border.png) 51 38 21 132;
  border-width: 2.125rem 1.583rem 0.875rem 5.5rem;
}


</style>
