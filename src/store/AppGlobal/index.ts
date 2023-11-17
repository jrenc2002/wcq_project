import {defineStore} from "pinia";

// 给开发人员使用的debug
const debug = false;


const state = () => {
  return {
    // 左一
    dataStatistics: {
      totalitySupervisory:0,
      normalSupervisory:0,
      abnormalSupervisory:0
    },
    // 左二
    dataSupervisoryStatus:[],
    dataSupervisoryDevice:[],
    // 左三
    kindSupervisoryStatistics:{},
    // 中二
    dataSupervisoryAbnormalStatistics:{},
    //右一,二
    dataRadioStatisticsOne:{},
    dataRadioStatisticsTwo:{},

    // 右三
    kindSupervisoryStatistic:{},





  }
}

/**
 * 提供可视窗口的公共状态
 */
export const useAppGlobal = defineStore('AppGlobal', {
  state,
  actions: {


  },
});
