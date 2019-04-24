<template>
  <span>
    {{ Prefix }} <span ref="countTo"></span> {{ Suffix }}
  </span>
</template>

<script>
import CountUp from 'countup.js'
export default {
  name: 'count-to',
  data () {
    return {
      numAnim: null
    }
  },
  props: {
    start: {
      type: Number,
      default: 0
    },
    end: {
      type: Number,
      default: 2019
    },
    decimals: {   // 保留几位有限数字
      type: Number,
      default: 0
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 2
    },
    options: {
      type: Object,
      default: function(){
        return {
          useEasing: true, 
          useGrouping: true, 
          separator: ',', 
          decimal: '.',
        }
      },
    },
    Prefix: {
      type: String,
      default: '￥',
    },
    Suffix: {
      type: String,
      default: '元',
    },
  },
  mounted(){
    this.initCountUp()
  },
  methods:{
    initCountUp(){
      this.numAnim = new CountUp( this.$refs.countTo, this.start, this.end, this.decimals, this.duration, this.options );
      if(this.autoPlay){
        this.numAnim.start();
      }
    }
  },
}
</script>
