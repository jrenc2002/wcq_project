import {defineStore} from "pinia";

// 给开发人员使用的debug
const debug = false;


const state = () => {
  return {
    // 左一
    dataStatistics: {
      // 监控总数
      totalitySupervisory:0,
      // 正常监控数
      normalSupervisory:0,
      // 监控异常数
      abnormalSupervisory:0
    },
    // 左二
    // 两个小时前监控情况统计
    dataSupervisoryStatus:[],

    // 监控设备统计
    dataSupervisoryDevice:[],
    // 所有监控数据
    allDataSupervisoryDevice:[],
    // 左三
    // 今日监控情况统计
    dataSupervisoryStatusDay:{
      // 本日新增
      statusSupervisoryAdd:0,
      // 今日监控情况
      statusSupervisory:0,
    },
    // 监控总数
    dataSupervisoryTotality:0,
    // 饼图数据
    kindSupervisoryStatistics:{
      // 饼图数据-value、name
      statusPieSupervisory:[],
      // 饼图数据-报错类型
      statusSet:[]
    },
    // 中二
    dataSupervisoryAbnormalStatistics:{
      // 柱状图数据
      xData:[],
      yData:[]
    },
    //右一,二
    dataRadioStatistics:[],

    // 右三
    kindSupervisoryStatistic : {
    statusPieSupervisory: <any>[],
    statusSet: <any>[],
    selectStatus: 1,
    total: 0,
    day:0
    },
    watchControl:{
      camerasPerPage:4,
      currentPage:0,
      watchList:[
        {
          // 监控设备id
          id:1,
          // 监控设备路由
          path:"http://192.168.75.214/live?port=1935&app=myapp&stream=camera_1",
          // 是否锁定
          isLock:false,

        },
        {
          // 监控设备id
          id:2,
          // 监控设备路由
          path:"http://192.168.75.214/live?port=1935&app=myapp&stream=camera_1",
          // 是否锁定
          isLock:false,

        },
        {
          // 监控设备id
          id:3,
          // 监控设备路由
          path:"http://192.168.75.214/live?port=1935&app=myapp&stream=camera_1",
          // 是否锁定
          isLock:false,

        },
        {
          // 监控设备id
          id:4,
          // 监控设备路由
          path:"http://192.168.75.214/live?port=1935&app=myapp&stream=camera_1",
          // 是否锁定
          isLock:false,

        },

      ],

    }





  }
}

/**
 * 提供可视窗口的公共状态
 */
export const useAppGlobal = defineStore('AppGlobal', {
  state,

  actions: {
    upadateDataStatistics(dataStatistics:any) {
      this.dataStatistics=dataStatistics;
    }

  },
});
