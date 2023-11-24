<!-- MainPage.vue -->
<template>

  <div class="w-screen h-screen " style="background-color: rgb(16,17,41);">
    <img class=" min-w-[1024px] min-w-full absolute top-0 " src="@/assets/image/logo.png">
    <div class=" w-screen h-[92%] top-[8%] relative flex ">
      <div class=" w-[30vw] h-full flex flex-col">
        <dataStatistics class=" w-full h-[15vh] "></dataStatistics>
        <supervisoryList class="w-full h-[50vh]"></supervisoryList>
        <pieSupervisoryAll class="w-full h-[35vh]"></pieSupervisoryAll>
      </div>
      <div class=" w-[calc(40vw-0.75rem)] h-full flex flex-col px-3">
        <watchSupervisory class="w-full h-[65vh]"></watchSupervisory>
        <barSupervisoryAll class="w-full h-[35vh]"></barSupervisoryAll>

      </div>
      <div class=" w-[30vw] h-full flex flex-col ">
        <graphSupervisoryOne class="w-full h-[32.5vh]"></graphSupervisoryOne>
        <graphSupervisoryOne class="w-full h-[32.5vh]"></graphSupervisoryOne>
        <pieSupervisoryOne class="w-full h-[35vh]"></pieSupervisoryOne>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/index.css'
import '@/assets/css/icomoon.css'
import WatchSupervisory from '@/components/watchSupervisory.vue'
import { computed, onMounted, ref } from 'vue'
import mqtt from 'mqtt'
import { useAppGlobal } from '@/store/AppGlobal'
import axios from 'axios'
import Swal from 'sweetalert2'
import dataStatistics from '@/components/dataStatistics.vue'
import supervisoryList from '@/components/supervisoryList.vue'
import barSupervisoryAll from '@/components/barSupervisoryAll.vue'
import graphSupervisoryOne from '@/components/graphSupervisoryOne.vue'
import pieSupervisoryOne from '@/components/pieSupervisoryOne.vue'
import pieSupervisoryAll from '@/components/pieSupervisoryAll.vue'
const AppGlobal = useAppGlobal()

const cameras = ref([
  // 摄像头 URL 列表
  'http://192.168.75.214/live?port=1935&app=myapp&stream=camera_4',
  'http://192.168.75.214/live?port=1935&app=myapp&stream=camera_5',
  'http://192.168.75.214/live?port=1935&app=myapp&stream=camera_5',
  'http://192.168.75.214/live?port=1935&app=myapp&stream=camera_4',
  'http://192.168.75.214/live?port=1935&app=myapp&stream=camera_5'
  // 添加更多摄像头URL
])
const camerasPerPage = ref(4)
const currentPage = ref(0)
const previousPage = ref(0)
const alertQueue = ref([])
const currentCameras = ref([])

const totalPages = computed(() => {
  return Math.floor(cameras.value.length / camerasPerPage.value)
})

const displayedCameras = computed(() => {
  const startIndex = currentPage.value * camerasPerPage.value
  const endIndex = startIndex + camerasPerPage.value
  const camerasToDisplay = cameras.value.slice(startIndex, endIndex)

  if (currentPage.value === totalPages.value && camerasToDisplay.length < 6) {
    const remainingCameras = camerasPerPage.value - camerasToDisplay.length
    for (let i = 0; i < remainingCameras; i++) {
      camerasToDisplay.push('目前无更多监控')
    }
  }
  return camerasToDisplay
})

onMounted(() => {
  // initializePlayers()
  // setupMqtt()

  setInterval(() => {
    getMessage()
  }, 1000)

})

// async function initializePlayers () {
//   var vElements = document.querySelectorAll('.centeredVideo')
//   if (flvjs.isSupported()) {
//     const startIndex = currentPage.value * camerasPerPage.value
//     const endIndex = startIndex + camerasPerPage.value
//     for (const [index, element] of vElements.entries()) {
//       if (index >= startIndex && index < endIndex) {
//         const cameraUrl = cameras.value[index]
//         var flvPlayer = flvjs.createPlayer({
//           type: 'flv',
//           enableWorker: true,
//           isLive: true,
//           hasAudio: false,
//           hasVideo: true,
//           autoCleanupSourceBuffer: true,
//           stashInitialSize: 128,
//           enableStashBuffer: false,
//           url: cameraUrl
//         })
//         flvPlayer.attachMediaElement(element)
//         try {
//           await flvPlayer.load()
//           await flvPlayer.play()
//           console.log('Player initialized and playing.')
//         } catch (error) {
//           console.error('Error initializing player:', error)
//         }
//
//         setInterval(async () => {
//           element.playbackRate = 1
//           console.log('时延校正判断')
//           if (element.buffered && element.buffered.length > 0) {
//             var end = element.buffered.end(0)
//             var diff = end - element.currentTime
//             console.log(diff)
//             if (diff >= 3 && diff <= 5) {
//               console.log('二倍速')
//               element.playbackRate = 2
//             }
//             if (diff > 5) {
//               console.log('跳帧')
//               element.currentTime = end
//             }
//           }
//         }, 1000)
//       }
//     }
//   }
// }

function setupMqtt () {
  // eslint-disable-next-line no-undef
  const client = mqtt.connect('ws://192.168.75.214:8083/mqtt')
  client.on('connect', function () {
    console.log('连接MQTT服务器成功')
    client.subscribe('/msg/alarm', function (err) {
      if (!err) {
        console.log('已订阅 /msg/alarm 主题')
      }
    })
  })

  client.on('message', async function (topic, message) {
    const data = JSON.parse(message.toString())
    const imageUrl = data.pic_url
    const datetime = data.datetime
    const location = data.location
    const alarmName = data.alarm_name

    const infoElement = document.createElement('div')
    infoElement.classList.add('info-container')
    infoElement.innerHTML = `
          <p>发生时间：${datetime}</p>
          <p>所属位置：${location}</p>
          <p>异常名称：${alarmName}</p>
        `

    alertQueue.value.push({
      title: `${alarmName}警告`,
      imageUrl: imageUrl,
      imageWidth: 450,
      imageHeight: 265,
      imageAlt: '警告图片',
      html: infoElement,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: '查看',
      cancelButtonText: '忽略',
      allowOutsideClick: false,
      allowEscapeKey: false
    })

    if (alertQueue.value.length === 1) {
      // await showNextAlert()
    }
  })
}

// async function showNextAlert () {
//   if (alertQueue.value.length > 0) {
//     const alert = alertQueue.value[0]
//     // await Swal.fire(alert).then((result) => {
//       if (result.isConfirmed) {
//         // 用户点击了 "查看" 按钮，处理逻辑
//       }
//       if (result.isDismissed) {
//         // 用户点击了 "忽略" 按钮，处理逻辑
//       }
//
//       // 从队列中移除已显示的警告
//       this.alertQueue.shift()
//
//       // 显示下一个警告（如果有的话）
//       if (this.alertQueue.length > 0) {
//         this.showNextAlert()
//       }
//     })
//   }
// }
function getMessage () {

  const token = localStorage.getItem('token')
  // 获取摄像头相关信息
  axios.get('http://192.168.75.214:8080/intelligent/CameraAll/', {
      headers: {
        authorization: `${token}`,
      },
    })
    .then(response => {
      if (response.status === 200) {

        //  左1-dataStatisics统计
        AppGlobal.dataStatistics.totalitySupervisory = response.data.length
        AppGlobal.dataStatistics.normalSupervisory = response.data.length

        //  左2
        AppGlobal.dataSupervisoryDevice = response.data
        // 将watchList遍历一遍，数据存入

      } else {
        Swal.fire('意外的状态码', `HTTP状态码: ${response.status}`, 'error')
      }
    })
    .catch(error => {
      if (error.response && error.response.status === 400) {
        Swal.fire(title, text, 'error')
      } else {
        Swal.fire('网络错误', error.message, 'error')
      }
    })
  // 获取当前时间的时间戳（单位：秒）
  const now = Math.floor(Date.now() / 1000)
  const twoHoursAgo = now - 2 * 60 * 60 // 2小时 = 2 * 60分钟 * 60秒
  // 请求所有报警数据
  axios.get('http://192.168.75.214:8080/getAlarmList/', {
      headers: {
        authorization: `${token}`,
      },
      params: {
        time_start: twoHoursAgo.toString(),
        time_end: now.toString()
      },
    })
    .then(response => {
      if (response.status === 200) {

        // console.log(response.data)
        const allData = response.data
        const now = Math.floor(Date.now() / 1000)
        const twoHoursAgo = now - 2 * 60 * 60
        const todayAgo = now - 24 * 60 * 60
        AppGlobal.allDataSupervisoryDevice = allData
        // 近两个小时的数据
        const lastTwoHoursData = allData.filter(item => {
          const itemTime = Math.floor(new Date(item.datetime).getTime() / 1000)
          return itemTime >= twoHoursAgo && itemTime <= now
        })

        // 近一天的数据
        const lastDayData = allData.filter(item => {
          const itemTime = Math.floor(new Date(item.datetime).getTime() / 1000)
          return itemTime >= todayAgo && itemTime <= now
        })

        // 单个设备近一天的数据
        // 假设设备ID为1
        const deviceOneLastDayData = lastDayData.filter(item => item.camera_id === 1)

        // ————————————————————————两个小时数据表————————————————————————
        AppGlobal.dataSupervisoryStatus = lastDayData
        // ————————————————————————今日数据表————————————————————————
        AppGlobal.dataSupervisoryStatusDay.statusSupervisory = lastDayData
        // 本日新增数量
        AppGlobal.dataSupervisoryStatusDay.statusSupervisoryAdd = lastDayData.length
        // ————————————————————————今日数据饼图————————————————————————
        // 报警状态去重筛选
        const statusSet = new Set()
        lastDayData.forEach(item => {
          statusSet.add(item.alarm_name)
        })
        AppGlobal.kindSupervisoryStatistics.statusSet = [...statusSet]
        // 各个报警状态数量统计
        const statusCount = {}
        lastDayData.forEach(item => {
          if (item.alarm_name && typeof item.alarm_name === 'string') {
            statusCount[item.alarm_name] = (statusCount[item.alarm_name] || 0) + 1
          }
        })
        // 导出为饼状图所需的信息 { value: 1500, name: '异物' },
        const statusPie = Object.entries(statusCount).map(([key, value]) => ({
          value,
          name: key
        }))
        AppGlobal.kindSupervisoryStatistics.statusPieSupervisory = statusPie

        // ————————————————————————各设备总数据异常量————————————————————————
        AppGlobal.dataSupervisoryTotality = allData.length

        // ————————————————————————柱状图数据————————————————————————
        function generateChartDataByDevice (allData) {
          // 初始化计数对象
          const deviceCounts = {}
          console.log(AppGlobal.dataSupervisoryDevice)
          // 对数据进行分类并计数
          allData.forEach(item => {
            const deviceName = item.camera_name // 假设设备名称字段为 device_name
            deviceCounts[deviceName] = (deviceCounts[deviceName] || 0) + 1
          })
          // 把他的设备名称导成一个数组
          let deviceNameList = []
          AppGlobal.dataSupervisoryDevice.forEach((item, index) => {
            deviceNameList[index] = item.camera_name
          })
          // 生成柱状图数据,格式为 { xData: ['设备名称',....], yData: [100,....] }
          const chartData = {
            xData: deviceNameList,
            yData: deviceNameList.map(deviceName => deviceCounts[deviceName] || 0)
          }
          return chartData
        }

        // 获取最近7天的日期数组
        function getLast7Days () {
          const dates = []
          for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            dates.push(date.toLocaleDateString())
          }
          return dates
        }

        // 使用示例
        const chartData = generateChartDataByDevice(allData)
        AppGlobal.dataSupervisoryAbnormalStatistics = chartData

      } else {
        Swal.fire('意外的状态码', `HTTP状态码: ${response.status}`, 'error')
      }
    })
    .catch(error => {
      Swal.fire('网络错误', error.message, 'error')
    })

}
</script>

<style scoped>
/* 添加组件特定的样式 */
</style>
