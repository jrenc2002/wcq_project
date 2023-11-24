<template>

  <div class=" w-full  flex  relative m-1">
    <div class="panel w-full absolute"></div>
    <div class="w-[calc(100%-1rem)] h-[calc(100%-2rem)]  absolute m-2 flex flex-col">
      <div class="w-full h-12  flex flex item-center">
        <div class="text-xl  w-52 text-white  items-center flex justify-center">各监控异常数统计</div>

      </div>
      <div class="w-full h-[calc(100%-3rem)] flex">
        <div class=" w-[70%] h-full justify-center items-center">
          <div ref="chartDiv" :style="{ width: '100%', height: '100%' }"></div>
        </div>
        <div class=" w-[30%] flex items-center justify-center p-2">
          <div class="data  h-[100%] w-[80%] ">
            <div class=" w-full h-[50%] items-center justify-center flex flex-col gap-1">
              <div class="w-32 text-2xl text-white justify-start items-center flex">
                {{AppGlobal.dataSupervisoryTotality}}
              </div>
              <span class="flex  items-center w-32 padding-2 ">
                <i class="icon-dot text-lg bg-[rgb(237,63,52)] opacity-100 rounded w-3 mr-2 " style="color: rgb(237,63,52)"></i>
                <div class="text-xl text-[rgb(237,63,52)]">异常总数</div>
                        </span>
            </div>
            <div class=" w-full h-[50%] items-center justify-center flex flex-col gap-1">
              <div class="w-32 text-2xl text-white justify-start items-center flex">
                {{AppGlobal.dataSupervisoryStatusDay.statusSupervisoryAdd}}
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
import { defineProps, onMounted, onUnmounted, ref, watch } from 'vue'
import { ECharts, EChartsOption, init } from 'echarts'

import { useAppGlobal } from '@/store/AppGlobal'
const AppGlobal = useAppGlobal();
const props = defineProps<{ id: string }>()
const chartDiv = ref<HTMLElement | null>(null)
let chartEch: ECharts | null = null
let frequencies = ref()
let amplitudes = ref()
let phases = ref()
let alarmLimit = ref(0)
let standardValue = ref(0)

const updateChart = () => {
  var item = {
    name: '',
    value: 1200,
    // 柱子颜色
    itemStyle: {
      color: '#254065'
    },
    // 鼠标经过柱子颜色
    emphasis: {
      itemStyle: {
        color: '#254065'
      }
    },
    // 工具提示隐藏
    tooltip: {
      extraCssText: 'opacity:0'
    }
  };
  const option: EChartsOption = {

    // 工具提示
    tooltip: {
      // 触发类型  经过轴触发axis  经过轴触发item
      trigger: 'item',
      // 轴触发提示才有效
      axisPointer: {
        // 默认为直线，可选为：'line' 线效果 | 'shadow' 阴影效果
        type: 'shadow'
      }
    },
    // 图表边界控制
    grid: {
      // 距离 上右下左 的距离
      left: '0',
      right: '3%',
      bottom: '3%',
      top: '5%',
      // 大小是否包含文本【类似于boxsizing】
      containLabel: true,
      //显示边框
      show: true,
      //边框颜色
      borderColor: 'rgba(0, 240, 255, 0.3)'
    },
    // 控制x轴
    xAxis: [
      {
        // 使用类目，必须有data属性
        type: 'category',
        // 使用 data 中的数据设为刻度文字
        data: AppGlobal.dataSupervisoryAbnormalStatistics.xData,
        // 刻度设置
        axisTick: {
          // true意思：图形在刻度中间
          // false意思：图形在刻度之间
          alignWithLabel: false,
          show: false
        },
        //文字
        axisLabel: {
          color: '#4c9bfd',
          interval: 0, // 设置为 0 以显示所有标签
        }
      }
    ],
    // 控制y轴
    yAxis: [
      {
        // 使用数据的值设为刻度文字
        type: 'value',
        axisTick: {
          // true意思：图形在刻度中间
          // false意思：图形在刻度之间
          alignWithLabel: false,
          show: false
        },
        //文字
        axisLabel: {
          color: '#4c9bfd'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(0, 240, 255, 0.3)'
          }
        },
      }
    ],
    // 控制x轴
    series: [

      {
        // series配置

        // 图表数据名称
        name: '异常统计',
        // 图表类型
        type: 'bar',
        // 柱子宽度
        barWidth: '60%',
        // 数据
        data: AppGlobal.dataSupervisoryAbnormalStatistics.yData
      }
    ]
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

      updateChart()
    }
  }, 500) // 延迟 500 毫秒
})
//更新数据
watch(() => AppGlobal.dataSupervisoryAbnormalStatistics, () => {
  updateChart()
})
onUnmounted(() => {
  if (chartEch) {
    chartEch.dispose()
    chartEch = null
  }
  window.removeEventListener('resize', updateChart)
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
.data {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  background-image: url(@/assets/image/rect.png);
  background-size: cover;
}
</style>
