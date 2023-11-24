<template>

  <div class=" w-full  flex  relative m-1">

    <div class="w-[calc(100%-1rem)] h-[calc(100%-2rem)]  absolute m-2 flex flex-col ">
      <div class="w-full h-12 mt-6 flex flex item-center">
        <div class="text-xl  w-56 text-white  items-center flex justify-start">监控实时数据</div>

      </div>
      <div class=" w-full h-[calc(100%-3rem)] flex-col flex items-center justify-center">
        <div class="w-[100%] h-[100%] ">
          <div class="videoGrid mt-1 ">
            <div v-for="(watchList, index) in cameraList" :key="index" class=" videoBox ">
              <div class="m-2 z-30 w-12">
                <div v-show="AppGlobal.watchControl.watchList[index].isLock" class="m-2 z-30 w-12 relative"
                     @click="AppGlobal.watchControl.watchList[index].isLock=false">
                  <svg class="icon  w-6 h-6" height="200" p-id="4571" t="1700377569179"
                       version="1.1" viewBox="0 0 1024 1024" width="200" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M385.150849 385.662338l-128.895105 0 0-150.377622q0-49.102897 19.436563-91.556444t53.706294-74.677323 80.815185-50.637363 101.786214-18.413586q49.102897 0 94.625375 18.413586t80.815185 50.637363 56.263736 74.677323 20.971029 91.556444l0 150.377622-123.78022 0 0-121.734266q0-64.447552-35.804196-99.74026t-97.182817-35.292707q-55.240759 0-88.999001 35.292707t-33.758242 99.74026l0 121.734266zM826.053946 447.040959q27.62038 0 47.568432 19.948052t19.948052 47.568432l0 317.122877q0 27.62038-9.718282 51.66034t-26.597403 41.942058-39.896104 28.131868-50.637363 10.22977l-516.603397 0q-27.62038 0-50.125874-10.22977t-38.361638-27.108891-24.551449-39.384615-8.695305-48.07992l0-324.283716q0-27.62038 19.436563-47.568432t47.056943-19.948052l61.378621 0 128.895105 0 255.744256 0 123.78022 0 61.378621 0z"
                      fill="#8a8a8a" p-id="4572"></path>
                  </svg>
                </div>
                <div v-show="!AppGlobal.watchControl.watchList[index].isLock" class="m-2 z-30 w-12 relative"
                     @click="AppGlobal.watchControl.watchList[index].isLock=true">
                  <svg class="icon w-6 h-6" height="200" p-id="4781" t="1700377642871"
                       version="1.1" viewBox="0 0 1024 1024" width="200" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M768.25422 0q48.810328 0 94.061569 18.303873t80.333664 50.33565 56.436941 74.740814 21.354518 91.519364l0 150.49851-123.042701 0 0-122.025819q0-64.063555-36.099305-99.654419t-97.112214-35.590864q-54.911619 0-88.468719 35.590864t-33.5571 99.654419l0 124.059583-128.12711 0 0-152.532274q0-48.810328 19.320755-91.519364t53.386296-74.740814 80.333664-50.33565 101.179742-18.303873zM766.220457 693.513406l0 87.451837 0 47.793446q0 27.455809-9.660377 51.860973t-26.438928 41.692155-39.658391 27.455809-50.33565 10.168818l-514.542205 0q-27.455809 0-49.82721-9.660377t-38.641509-26.438928-24.913605-39.14995-8.643496-47.793446l0-323.368421q0-28.472691 19.829196-47.793446t46.268123-19.320755l629.449851 0q28.472691 0 47.793446 19.320755t19.320755 47.793446l0 179.988083z"
                      fill="#8a8a8a" p-id="4782"></path>
                  </svg>
                </div>

              </div>
              <video :id="'video-container-' + index" autoplay controls height="576" muted width="1024">
                Your browser is too old which doesn't support HTML5 video.
              </video>
            </div>
          </div>
          <div class="relative  flex h-[10vh]  justify-center items-center gap-3">
            <button :class="[AppGlobal.watchControl.currentPage===0?'bg-gray-400':' hover:bg-[rgb(0,116,180)]']"
                    class="h-12 w-32  text-white  text-lg rounded bg-[rgb(0,116,217)] "
                    @click="prevPage()">上一页
            </button>
            <button :class="[AppGlobal.watchControl.currentPage===1?'bg-gray-400':'hover:bg-[rgb(0,116,180)]']"
                    class="h-12 w-32  text-lg text-white rounded bg-[rgb(0,116,217)] "
                    @click="nextPage()">下一页
            </button>


          </div>


        </div>


      </div>


    </div>

  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useAppGlobal } from '@/store/AppGlobal'
import flvjs from 'flv.js'

const AppGlobal = useAppGlobal()
const cameraList = ref(AppGlobal.watchControl.watchList)
let isUpdating = false //其newFlv的资源是不可以被同时调用的

watch(() => AppGlobal.watchControl.watchList, async (newVal) => {
  console.log('watchList改变',newVal)
  // 检验更改后的path是否不同
  newVal.forEach((element, index) => {
    // console.log(flvPlayer.value[index].statisticsInfo.url,index,'2131221')
    if (element.path === null||element.path !== flvPlayer.value[index].statisticsInfo.url) {
      console.log('path不同')
      cameraList.value[index].path = element.path
      changeFlv()
    }
  })

}, { deep: true })
// 监听dataSupervisoryDevice的更新
watch(()=>AppGlobal.dataSupervisoryDevice,(newVal)=>{
  newVal.forEach((e,index)=>{

    // 如果设备数据变化，就将watchList中的path更新
    // 这个index小于3还是有用的，因为如果不加index就会出现watchList越界的问题
    if (index<=3&&AppGlobal.watchControl.watchList[index].id==index){
      AppGlobal.watchControl.watchList[index].path=e.stream_url
    }
  })

}, { deep: true })

function prevPage () {
  if (AppGlobal.watchControl.currentPage > 0) {
    AppGlobal.watchControl.currentPage -= 1
    // 遍历watchList然后将isLock为false的id置于其页数与索引的和，如果currentPage为0，就不变
    AppGlobal.watchControl.watchList.forEach((element, index) => {
      if (!element.isLock) {

        element.id = AppGlobal.watchControl.currentPage * AppGlobal.watchControl.camerasPerPage + index
        if (element.id >= 0) {
          element.path=AppGlobal.dataSupervisoryDevice[element.id].stream_url

        }
      }
    })
  }


}

function nextPage () {
  if (AppGlobal.watchControl.currentPage < 1) {
    AppGlobal.watchControl.currentPage += 1
    // 遍历watchList然后将isLock为false的id置于其页数与索引的和，如果currentPage为0，就不变

    AppGlobal.watchControl.watchList.forEach((element, index) => {
      if (!element.isLock) {
        let newId=AppGlobal.watchControl.currentPage * AppGlobal.watchControl.camerasPerPage + index
        if (newId <= AppGlobal.dataSupervisoryDevice.length-1) {

          element.id = newId
          console.log(element.id,AppGlobal.dataSupervisoryDevice[element.id].stream_url)
          element.path=AppGlobal.dataSupervisoryDevice[element.id].stream_url
        }


      }
    })
  }



}

const flvPlayer = ref([])
onMounted(() => {
  // console.log('isSupported: ' + flvjs.isSupported())
  // console.log('是否支持点播视频：' + flvjs.getFeatureList().mseFlvPlayback)
  // console.log('是否支持httpflv直播流：' + flvjs.getFeatureList().mseLiveFlvPlayback)
  initFlv()
})


const initFlv = async () => {
  isUpdating = true
  for (const camera of cameraList.value) {
    const index = cameraList.value.indexOf(camera)
    const ele = document.getElementById('video-container-' + index)
    flvPlayer.value[index] = flvjs.createPlayer({
      type: 'flv',
      isLive: true,
      hasAudio: false,
      cors: true,
      url: camera.path ? camera.path :null,
    })
    flvPlayer.value[index].attachMediaElement(ele)
    await play(index)
    flvEvent(index)
  }
  isUpdating = false
}

const changeFlv = async () => {
  if (isUpdating) {
    return
  }
  isUpdating = true
  // 改变全部挂载的视频源的内容
  for (const camera of cameraList.value) {

    const index = cameraList.value.indexOf(camera)
    // 创建新的前销毁之前挂载的视频源
    flvPlayer.value[index].pause()
    flvPlayer.value[index].unload()
    flvPlayer.value[index].detachMediaElement()
    flvPlayer.value[index].destroy()
    flvPlayer.value[index] = null
    const ele = document.getElementById('video-container-' + index)
    flvPlayer.value[index] = flvjs.createPlayer({
      type: 'flv',
      isLive: true,
      hasAudio: false,
      cors: true,
      url: camera.path ? camera.path :null,
    })
    flvPlayer.value[index].attachMediaElement(ele)
    await play(index)
    flvEvent(index)
  }
  isUpdating = false
}
const play = (index) => {
  flvPlayer.value[index].load()
  const playPromise = flvPlayer.value[index].play()
  if (playPromise !== undefined) {
    playPromise.then(_ => {
      console.log('播放成功')
    }).catch(error => {
      console.log('播放失败', error)
    })
  }
}

const flvEvent = (index) => {
  flvPlayer.value[index].on(flvjs.Events.ERROR, (errorType, errorDetail, errorInfo) => {
    // console.log('类型:' + JSON.stringify(errorType), '报错内容:' + errorDetail, '报错信息:' + JSON.stringify(errorInfo, null, 2))
    // console.log('flvPlayer状态:', flvPlayer.value[index].getState())
  })
  flvPlayer.value[index].on(flvjs.Events.STATISTICS_INFO, (errorType, errorDetail, errorInfo) => {
    // console.log('类型:' + JSON.stringify(errorType), '报错内容:' + errorDetail, '报错信息:' + JSON.stringify(errorInfo, null, 2))
  })
}


// const destory = () => {
//   flvPlayer.value.pause()
//   flvPlayer.value.unload()
//   flvPlayer.value.detachMediaElement()
//   flvPlayer.value.destroy()
//   flvPlayer.value = null
// }
//
// onUnmounted(() => {
//   destory()
// })


</script>

<style scoped>


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
  cursor: pointer;
}

.videoBox:hover {
}


</style>
