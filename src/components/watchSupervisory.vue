<template>

  <div class=" w-full  flex  relative m-1">

    <div class="w-[calc(100%-1rem)] h-[calc(100%-2rem)]  absolute m-2 flex flex-col ">
      <div class="w-full h-12 mt-6 flex flex item-center">
        <div class="text-xl  w-56 text-white  items-center flex justify-start">监控实时数据</div>

      </div>
      <div class=" w-full h-[calc(100%-3rem)] flex-col flex items-center justify-center">
        <div class="w-[100%] h-[100%] ">
          <div class="videoGrid mt-1 ">
            <div class=" videoBox " v-for="(watchList, index) in cameraList" :key="index">
              <div class="m-2 z-30 w-12">
                <div class="m-2 z-30 w-12 relative" v-show="AppGlobal.watchControl.watchList[index].isLock" @click="AppGlobal.watchControl.watchList[index].isLock=false">
                  <svg t="1700377569179" class="icon  w-6 h-6" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4571" width="200" height="200"><path d="M385.150849 385.662338l-128.895105 0 0-150.377622q0-49.102897 19.436563-91.556444t53.706294-74.677323 80.815185-50.637363 101.786214-18.413586q49.102897 0 94.625375 18.413586t80.815185 50.637363 56.263736 74.677323 20.971029 91.556444l0 150.377622-123.78022 0 0-121.734266q0-64.447552-35.804196-99.74026t-97.182817-35.292707q-55.240759 0-88.999001 35.292707t-33.758242 99.74026l0 121.734266zM826.053946 447.040959q27.62038 0 47.568432 19.948052t19.948052 47.568432l0 317.122877q0 27.62038-9.718282 51.66034t-26.597403 41.942058-39.896104 28.131868-50.637363 10.22977l-516.603397 0q-27.62038 0-50.125874-10.22977t-38.361638-27.108891-24.551449-39.384615-8.695305-48.07992l0-324.283716q0-27.62038 19.436563-47.568432t47.056943-19.948052l61.378621 0 128.895105 0 255.744256 0 123.78022 0 61.378621 0z" p-id="4572" fill="#8a8a8a"></path></svg>    </div>
                <div class="m-2 z-30 w-12 relative" v-show="!AppGlobal.watchControl.watchList[index].isLock" @click="AppGlobal.watchControl.watchList[index].isLock=true">
                  <svg t="1700377642871" class="icon w-6 h-6" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4781" width="200" height="200"><path d="M768.25422 0q48.810328 0 94.061569 18.303873t80.333664 50.33565 56.436941 74.740814 21.354518 91.519364l0 150.49851-123.042701 0 0-122.025819q0-64.063555-36.099305-99.654419t-97.112214-35.590864q-54.911619 0-88.468719 35.590864t-33.5571 99.654419l0 124.059583-128.12711 0 0-152.532274q0-48.810328 19.320755-91.519364t53.386296-74.740814 80.333664-50.33565 101.179742-18.303873zM766.220457 693.513406l0 87.451837 0 47.793446q0 27.455809-9.660377 51.860973t-26.438928 41.692155-39.658391 27.455809-50.33565 10.168818l-514.542205 0q-27.455809 0-49.82721-9.660377t-38.641509-26.438928-24.913605-39.14995-8.643496-47.793446l0-323.368421q0-28.472691 19.829196-47.793446t46.268123-19.320755l629.449851 0q28.472691 0 47.793446 19.320755t19.320755 47.793446l0 179.988083z" p-id="4782" fill="#8a8a8a"></path></svg>
                </div>

              </div>
                          <easy-player  class="centeredVideo"  :ref="setVideoRef"  autoplay width="100%" height="100%"
                                    :video-url="watchList.stream_url"    :live="true"></easy-player>

            </div>
         </div>
          <div class="relative  flex h-[10vh]  justify-center items-center gap-3">
            <button @click="prevPage()" class="h-12 w-32  text-white  text-lg rounded bg-[rgb(0,116,217)] " :class="[AppGlobal.watchControl.currentPage===0?'bg-gray-400':' hover:bg-[rgb(0,116,180)]']">上一页</button>
            <button @click="nextPage()" class="h-12 w-32  text-lg text-white rounded bg-[rgb(0,116,217)] " :class="[AppGlobal.watchControl.currentPage===1?'bg-gray-400':'hover:bg-[rgb(0,116,180)]']">下一页</button>


          </div>



        </div>


      </div>


    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useAppGlobal } from '@/store/AppGlobal'
import flvjs from 'flv.js'; // 确保已经正确导入flv.js库

const AppGlobal = useAppGlobal();
const cameraList = ref(AppGlobal.watchControl.watchList)
// 用于存储视频元素的引用
const videoRefs = ref([]);

// 设置视频元素的引用
const setVideoRef = el => {
  if (el) {
    videoRefs.value.push(el);
  }
};

watch(() => AppGlobal.watchControl.watchList, (newVal) => {
  cameraList.value = newVal
})

onMounted(() => {
  initializePlayers()
})

function prevPage () {
  if (AppGlobal.watchControl.currentPage>0){
  AppGlobal.watchControl.currentPage-=1;}
  // 遍历watchList然后将isLock为false的id置于其页数与索引的和，如果currentPage为0，就不变
  AppGlobal.watchControl.watchList.forEach((element, index) => {
    if (!element.isLock) {
      element.id = AppGlobal.watchControl.currentPage * AppGlobal.watchControl.camerasPerPage + index + 1;
    }
  });


  // initializePlayers()
}

function nextPage () {
  if (AppGlobal.watchControl.currentPage<1){
  AppGlobal.watchControl.currentPage+=1;}
  // 遍历watchList然后将isLock为false的id置于其页数与索引的和，如果currentPage为0，就不变

  AppGlobal.watchControl.watchList.forEach((element, index) => {
    if (!element.isLock) {
      element.id = AppGlobal.watchControl.currentPage * AppGlobal.watchControl.camerasPerPage + index + 1;
    }
  });
  // initializePlayers()
}

async function initializePlayers() {
  if (!flvjs.isSupported()) {
    console.error("FLV.js is not supported in this browser.");
    return;
  }

  const startIndex = AppGlobal.watchControl.currentPage * AppGlobal.watchControl.camerasPerPage;
  const endIndex = Math.min(startIndex + AppGlobal.watchControl.camerasPerPage, cameraList.value.length);

  videoRefs.value.forEach((element, index) => {
    if (index >= startIndex && index < endIndex) {
      setupPlayer(element, cameraList.value[index]?.stream_url);
    }
  });
}
async function setupPlayer(element, cameraUrl) {
  if (!cameraUrl) {
    console.error("Invalid camera URL");
    return;
  }

  var flvPlayer = flvjs.createPlayer({
    enableWorker: true,
    isLive: true,
    hasAudio: false,
    hasVideo: true,
    autoCleanupSourceBuffer: true,
    stashInitialSize: 128,
    enableStashBuffer: false,
    url: cameraUrl
  });
  flvPlayer.attachMediaElement(element);

  try {
    await flvPlayer.load();
    await flvPlayer.play();
    console.log("Player initialized and playing.");
    setupPlaybackRateAdjustment(element);
  } catch (error) {
    console.error("Error initializing player:", error);
  }
}

function setupPlaybackRateAdjustment(element) {
  setInterval(() => {
    adjustPlaybackRate(element);
  }, 1000);
}

function adjustPlaybackRate(element) {
  element.playbackRate = 1;
  if (element.buffered && element.buffered.length > 0) {
    var end = element.buffered.end(0);
    var diff = end - element.currentTime;
    if (3 <= diff && diff <= 5) {
      element.playbackRate = 2;
    } else if (diff > 5) {
      element.currentTime = end;
    }
  }
}
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
