<template>
  <div class="my_echarts">
    <div :id="echartsId" ref="myEcharts" class="chart_container"></div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
// var echarts = require('echarts/lib/echarts');
// // 引入柱状图
// require('echarts/lib/chart/bar');
// // 引入提示框、标题、legend
// require('echarts/lib/component/tooltip');
// require('echarts/lib/component/title');
// require('echarts/lib/component/legend');

var echarts = require('echarts');

export default {
  name: 'my-echarts',
  props: {
    id: {
      type: String,
      default: function() {
        return 'echarts-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    options: {
      type: Object,
      default: function(){
        return {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data:['销量']
          },
          xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        }
      }
    },
  },
  data(){
    return {
      echartsId: this.id,
      myChart: '',
    }
  },
  watch: {
    options: {
      handler(options) {
        console.log('options', this.options);
        this.myChart.setOption(this.options);
      },
      deep: true
    },
  },
  mounted(){
    this.myChart = echarts.init(document.getElementById(this.echartsId), 'light');
    this.myChart.setOption(this.options);
  },
}
</script>

<style lang="scss" scoped>
.my_echarts{
  .chart_container{
    width: 100%;
    height: 600px;
  }
}
</style>


