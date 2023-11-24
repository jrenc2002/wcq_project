<template>

  <div class=" w-full  flex  relative m-1">
    <div class="panel w-full absolute"></div>
    <div class="w-[calc(100%-1rem)] h-[calc(100%-2rem)]  absolute m-2 flex flex-col">
      <div class="w-full h-12  flex flex item-center">
        <div class="text-xl  w-52 text-white  items-center flex justify-center">{{selectStatus}}号监控异常数统计</div>
        <Menu as="div" class="relative inline-block text-left  left-44 top-2">
          <div >
            <MenuButton class="inline-flex w-full justify-center  gap-x-1.5 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600">
              选择监控
              <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </MenuButton>
          </div>

          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <template  v-for="(device,index) in AppGlobal.dataSupervisoryDevice" :key="index" >
                <MenuItem v-slot="{ active }">
                  <a href="#" @click="changeDevice(device.id)"  :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">{{device.camera_name}}</a>
                </MenuItem>
              </template>
              <div class="py-1">


              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
      <div class="w-full h-[calc(100%-3rem)] flex">
        <div class=" w-[100%] h-full justify-center items-center">
          <div ref="chartDiv" :style="{ width: '100%', height: '100%' }"></div>
        </div>


      </div>


    </div>

  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, onUnmounted, ref, watch } from 'vue'
import { ECharts, EChartsOption, init } from 'echarts'
import { useAppGlobal } from '@/store/AppGlobal'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import axios from 'axios'
import Swal from 'sweetalert2'
const chartDiv = ref<HTMLElement | null>(null)
let chartEch: ECharts | null = null
const AppGlobal = useAppGlobal();
const updateChart = () => {

  const option: EChartsOption = {
    //鼠标提示工具
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      // x轴为时间轴
      type: 'time',
      // x轴刻度文字，暂时为空，后面会动态生成
      axisTick: {
        show: false, //去除刻度线
      },
      axisLabel: {
        color: '#4c9bfd', //文本颜色
      },
      axisLine: {
        show: false, //去除轴线
      },
      boundaryGap: false, //去除轴内间距
    },
    yAxis: {
      // 数据作为刻度文字
      type: 'value',
      axisTick: {
        show: false, //去除刻度线
      },
      axisLabel: {
        color: '#4c9bfd', //文本颜色
      },
      axisLine: {
        show: false, //去除轴线
      },
      boundaryGap: false, //去除轴内间距
    },
    //图例组件
    legend: {
      textStyle: {
        color: '#4c9bfd', // 图例文字颜色
      },
      right: '10%', //距离右边10%
    },
    // 设置网格样式
    grid: {
      show: true, // 显示边框
      top: '20%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      borderColor: '#012f4a', // 边框颜色
      containLabel: true, // 包含刻度文字在内
    },
    series: [{
      name: 'area_ratio',
      data: dataRadioStatistics.value,
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#00f2f1',
      },
    }],
  }
  if (chartEch !== null) {

    chartEch.setOption(option)
    chartEch.resize()
  }
}

onMounted(() => {
  setTimeout(() => {
    if (chartDiv.value) {
      chartEch = init(chartDiv.value)
      window.addEventListener('resize', () => {
        if (chartEch) {
          chartEch.resize()
        }
      })
      changeDevice(4)
      updateChart()

    }
  }, 500) // 延迟 500 毫秒

})

onUnmounted(() => {
  if (chartEch) {
    chartEch.dispose()
    chartEch = null
  }
  window.removeEventListener('resize', updateChart)
})

const selectStatus=ref(4)
const dataRadioStatistics=ref([])
// 切换数据渲染的类型
const changeDevice = (id: number) => {
  const oldSelectStatus=selectStatus.value
  selectStatus.value=id
  const token=localStorage.getItem('token');
  axios.get('http://192.168.75.214:8080/intelligent/getRTDatabyCamera/?time%20start=1697869600&camera_id='+id+'&time_end=1698984000', {
      headers: {
        authorization: `${token}`,
      },
    })
    .then(response => {
      if (response.status === 200) {
        console.log(response.data.data)
        // 判断有没有json_data.AreaRatio数据，或json_data数据或空数组
        if (response.data.data.length === 0 || !response.data.data[0].json_data || !response.data.data[0].json_data.AreaRatio) {
          selectStatus.value=oldSelectStatus
          Swal.fire('数据错误', '所选没有AreaRatio', 'error')
          return
        }

        interface Item {
          "@timestamp": string;
          json_data: {
            AreaRatio: number;
          };
        }

        interface Value {
          value: [string, number];
        }

        const dataPoints = response.data.data
          .map((item: Item) => {
            return {
              value: [
                item["@timestamp"], // X轴：时间戳
                item.json_data.AreaRatio // Y轴：AreaRatio
              ]
            } as Value;
          })
          .sort((a: Value, b: Value) => new Date(a.value[0]).getTime() - new Date(b.value[0]).getTime()); // 按照时间戳排序
        dataRadioStatistics.value=dataPoints
        updateChart()
      } else {
        Swal.fire('意外的状态码', `HTTP状态码: ${response.status}`, 'error')
      }
    })
    .catch(error => {
      if (error.response && error.response.status === 400) {
        Swal.fire('服务器错误', error.message, 'error')
      } else {
        Swal.fire('网络错误', error.message, 'error')
      }
    })


}

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
.data {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  background-image: url(@/assets/image/rect.png);
  background-size: cover;
}
</style>
