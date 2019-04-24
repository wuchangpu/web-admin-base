<template>
  <div class="date-picker">
    <el-date-picker v-model="myValue" :type="type" :placeholder="placeholder" :value-format="valueFormat" @input="input" :class="{'full_width': fullWidth || fullWidth === ''}"  clearable :size="size" @change="change" :disabled="disabled" :picker-options="pickerOptions" :default-value="defaultValue" />
  </div>
</template>

<script>
export default {
  name: 'date-picker',
  data(){
    return {
      myValue: ''
    }
  },
  props: {
    value: {
    },
    type: {
      type: String,
      default: 'date'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    valueFormat: {
      type: String,
      default: 'timestamp'
    },
    fullWidth: {  // 和父元素等宽
      type: Boolean,
      default: false
    },
    end: {  // type为date的时候加此属性，则结束时间为当天23'59'59
      type: Boolean | String,
      default: false
    },
    size: {
      type: String,
      default: 'large'
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    pickerOptions: {
      type: Object,
      default: function() {
        return {}
      }
    },
    defaultValue: {
      type: Date,
      default: function() {
        return new Date()
      }
    },
  },
  watch: {
    value(val){
      this.myValue = val
    }
  },
  created(){
    if(this.value){
      this.myValue = this.value;
    }
  },
  methods: {
    input(val){
      if(val){
        if( this.type === 'date' && (this.end || this.end === '') ){
          val += (3600*1000*24 -1);
        }
      } else {
        val = ''
      }
      this.$emit('input', val);
    },
    change(e){
      this.$emit('change', e);
    },
  },
}
</script>

<style lang="scss">
.date-picker{
  .full_width{
    width: 100%;
  }
}
</style>

