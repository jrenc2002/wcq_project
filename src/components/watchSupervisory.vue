<template>

  <div class=" w-full  flex  relative m-1">

    <div class="w-[calc(100%-1rem)] h-[calc(100%-2rem)]  absolute m-2 flex flex-col ">
      <div class="w-full h-12 mt-6 flex flex item-center">
        <div class="text-xl  w-56 text-white  items-center flex justify-start">监控实时数据</div>

      </div>
      <div class=" w-full h-[calc(100%-3rem)] flex-col flex items-center justify-center">
        <div class="w-[100%] h-[100%] ">
          <div class="videoGrid mt-1 ">
            <div class=" videoBox bg-green-400" v-for="(camera, index) in cameras" :key="index">
<!--                          <easy-player  class="centeredVideo" controls width="100%" height="100%"  :video-url="camera"-->
<!--                                        :live="true">Your browser is too old-->
<!--                            which doesn't support HTML5 video.</easy-player>-->

              <div  class="centeredVideo">Your browser is too old
                which doesn't support HTML5 video.</div>
            </div>
          </div>
          <div class="relative  flex h-[10vh]  justify-center items-center gap-3">
            <button class="h-12 w-32 bg-green-50 text-white  text-lg rounded bg-[rgb(0,116,217)] hover:bg-[rgb(0,116,180)]">上一页</button>
            <button class="h-12 w-32 bg-green-50 text-lg text-white rounded bg-[rgb(0,116,217)] hover:bg-[rgb(0,116,180)]">下一页</button>


          </div>



        </div>


      </div>


    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
const cameras=ref([ // 包含摄像头URL的数组
  'http://192.168.75.214/live?port=1935&app=myapp&stream=camera_4',
  'http://192.168.75.214/live?port=1935&app=myapp&stream=camera_5',
  'http://192.168.75.214/live?port=1935&app=myapp&stream=camera_5',
  'http://192.168.75.214/live?port=1935&app=myapp&stream=camera_4'
  // 添加更多摄像头URL
])
</script>

<style scoped>
.panel {
  /* 边框 */
  box-sizing: border-box;
  border-image: url(@/assets/image/border.png) 51 38 21 132;
  border-width: 2.125rem 1.583rem 0.875rem 5.5rem;
}

.videoGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
}
.videoBox {
  width: 100%;
  height: 20vh;
  padding: 0;
  margin: 0;
  position: relative;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;
}
.videoBox:hover {
  transform: scale(1.05);
}
.centeredVideo {
  display: block;
  width: 100%;
  height: 100%;
}

</style>
