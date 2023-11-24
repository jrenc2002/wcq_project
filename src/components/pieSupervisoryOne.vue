<template>

  <div class=" w-full  flex  relative m-1">
    <div class="panel w-full absolute"></div>
    <div class="w-[calc(100%-1rem)] h-[calc(100%-2rem)]  absolute m-2 flex flex-col">
      <div class="w-full h-12  flex flex item-center">
        <div class="text-xl  w-56 text-white  items-center flex justify-center">{{AppGlobal.kindSupervisoryStatistic.selectStatus}}号监控异常类型汇总</div>

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
        <div class=" w-[60%] h-full justify-center items-center">
          <div ref="chartDiv" :style="{ width: '100%', height: '100%' }"></div>
        </div>
        <div class=" w-[40%] flex items-center justify-center p-2">
          <div class="data  h-[100%] w-[80%] ">
            <div class=" w-full h-[50%] items-center justify-center flex flex-col gap-1">
              <div class="w-32 text-2xl text-white justify-start items-center flex">
                {{AppGlobal.kindSupervisoryStatistic.total}}
              </div>
              <span class="flex  items-center w-32 padding-2 ">
                <i class="icon-dot text-lg bg-[rgb(237,63,52)] opacity-100 rounded w-3 mr-2 " style="color: rgb(237,63,52)"></i>
                <div class="text-xl text-[rgb(237,63,52)]">异常总数</div>
                        </span>
            </div>
            <div class=" w-full h-[50%] items-center justify-center flex flex-col gap-1">
              <div class="w-32 text-2xl text-white justify-start items-center flex">
                {{ AppGlobal.kindSupervisoryStatistic.day }}
              </div>
              <span class="flex  items-center w-32 padding-2 ">
                <i class="icon-dot text-lg bg-[#006cff] opacity-100 rounded w-3 mr-2 " style="color: #006cff"></i>
                <div class="text-xl text-[#006cff]">本日新增</div>
                        </span>
            </div>
          </div>

        </div>

      </div>


    </div>

  </div>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, onUnmounted, ref,watch } from 'vue'
import { ECharts, EChartsOption, init } from 'echarts'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { useAppGlobal } from '@/store/AppGlobal'
const chartDiv = ref<HTMLElement | null>(null)
let chartEch: ECharts | null = null

const AppGlobal = useAppGlobal();
const updateChart = () => {

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      textStyle: {
        color: '#fff'
      },
      left: 'center',
      top: 'bottom',
      data:AppGlobal.kindSupervisoryStatistic.statusSet,
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: {
          show: true,
          readOnly: false
        },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: {
      name: '异常类型',
      type: 'pie',
      // 南丁格尔玫瑰图 有两个圆  内圆半径10%  外圆半径70%
      // 百分比基于  图表DOM容器的半径
      radius: ['10%', '70%'],
      // 图表中心位置 left 50%  top 50% 距离图表DOM容器
      center: ['50%', '50%'],
      // 半径模式，另外一种是 area 面积模式
      roseType: 'radius',
      itemStyle: {
        borderRadius: 5
      },
      // 数据集 value 数据的值 name 数据的名称
      data:AppGlobal.kindSupervisoryStatistic.statusPieSupervisory,

      //文字调整
      label: {
        fontSize: 20,
        color: '#fff'
      },
      //引导线
      labelLine: {
        length: 8,
        length2: 10
      }
    }

  }
  if (chartEch !== null) {

    chartEch.setOption(option)
    chartEch.resize()
  }
}

// 监听变化时更新数据
watch(() => AppGlobal.allDataSupervisoryDevice, () => {
  changeDevice(AppGlobal.kindSupervisoryStatistic.selectStatus)
})
onMounted(() => {
  setTimeout(() => {
    if (chartDiv.value) {
      chartEch = init(chartDiv.value)
      window.addEventListener('resize', () => {
        if (chartEch) {
          chartEch.resize()
        }
      })
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

// 切换数据渲染的类型
const changeDevice = (id: number) => {
  AppGlobal.kindSupervisoryStatistic.selectStatus=id
  filterData()
  updateChart()

}
// 筛选数据
const filterData = () => {
  if (!Array.isArray(AppGlobal.allDataSupervisoryDevice)) {
    console.error('AppGlobal.allDataSupervisoryDevice is not an array');
    return [];
  }

  const result = AppGlobal.allDataSupervisoryDevice.filter((item: any) => {
    return item.camera_id === AppGlobal.kindSupervisoryStatistic.selectStatus;
  });
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - 24 * 60 * 60;
  const lastDayData = result.filter((item: any) => {
    const itemTime = Math.floor(new Date(item.datetime).getTime() / 1000);
    return itemTime >= oneDayAgo && itemTime <= now;
  });

  AppGlobal.kindSupervisoryStatistic.total=result.length
  AppGlobal.kindSupervisoryStatistic.day=lastDayData.length

  // 报警状态去重筛选
  const statusSet = new Set<string>();
  lastDayData.forEach((item: any) => {
    statusSet.add(item.alarm_name);
  });
  AppGlobal.kindSupervisoryStatistic.statusSet = Array.from(statusSet);

  // 各个报警状态数量统计
  const statusCount: { [key: string]: number } = {};
  lastDayData.forEach((item: any) => {
    if (typeof item.alarm_name === 'string') {
      statusCount[item.alarm_name] = (statusCount[item.alarm_name] || 0) + 1;
    }
  });

  // 导出为饼状图所需的信息 { value: 1500, name: '异物' }
  const statusPie = Object.entries(statusCount).map(([key, value]) => ({ value, name: key }));
  AppGlobal.kindSupervisoryStatistic.statusPieSupervisory = statusPie;

  return ;
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
