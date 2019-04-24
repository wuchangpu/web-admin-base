<template>
  <div class="check_in_map">
    <div class="check_in_map_container" v-show="showMap">
      <el-form :model="form" :rules="relus" :label-width="labelWidth" ref="ruleForm">
        <el-row v-show="!disabled">
          <el-col :span="6">
            <el-form-item label="搜索地点：">
              <el-autocomplete v-model="form.searchText" value-key="name" suffix-icon="el-icon-search" :fetch-suggestions="querySearchAsync" placeholder="搜索附近位置" @select="mapSearch" :disabled="disabled" style="width:100%" />
            </el-form-item>
            <!-- <el-select placeholder="搜索附近位置" prefix-icon="el-icon-search" v-model="form.searchText" filterable remote :remote-method="remoteMethod" :loading="searching" @change="mapSearch">
              <el-option v-for="v in searchOption" :key="v.id" :value="v" :label="v.name">{{ v.name }}</el-option>
            </el-select> -->
          </el-col>
          <el-col :span="6">
            <el-form-item label="签到范围：" prop="radius">
              <el-input style="width:100%" v-model="form.radius" placeholder="请输入" @input="rangeInput" @focus="rangeInputFocus" ref="rangeInput" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item label-width="10px">
              km
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="签到地点：">
              <span class="placeholder" v-show="!place && !disabled">地图上选点后回显</span>
              <span v-show="place">
                {{ place }}
                <span v-show="form.radius">方圆{{ form.radius }}km范围内</span>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="map_container">
        <div :id="id" :style="{ width: width, height: height }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/utils/eventBus'

export default {
  name: 'gaode-map',
  props: {
    showMap: {
      type: Boolean,
      required: false
    },
    id: {
      type: String,
      default: function() {
        return 'map-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    width: {
      type: String,
      default: '1000px'
    },
    height: {
      type: String,
      default: '500px'
    },
    labelWidth: {
      type: String,
      default: '110px'
    },
    disabled: {
      type: Boolean,
      required: false
    },
    echoData: {  // 回显的数据（安卓此格式）
      type: Object,
      default: function(){
        return {
          center: [],
          radius: ''
        }
      },
    },
  },
  data(){
    const positiveInteger = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入'));
      } else if (!this.$reg.positiveInteger.test(value)) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    };
    return {
      map: '',  // map对象
      placeSearch: '',  // 地图搜索组件
      autocomplete: '', // 地图搜索文字提示组件
      searchOption: [], // 搜索下拉框数据
      searching: false, // 搜索下拉框数据搜索中
      form: {
        searchText: '',
        radius: '',
      },
      place: '',
      relus: {
        searchText: [
          { required: true, message: "请选择搜索地点", trigger: "change" }
        ],
        radius: [
          { required: true, message: "请输入搜索范围", trigger: "change" },
          { validator: positiveInteger, trigger: 'blur' }
        ]
      },
      circle: '',
      circleOption: {
        center: [],
        radius: 1000, //半径
        borderWeight: 3,
        strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10], 
        // 线样式还支持 'dashed'
        fillColor: '#1791fc',
        zIndex: 50,
      },
      markerOption: {
        position: [],
        map: this.map
      },
      inited: false, // 初始化完毕
      requiredsetCircleMap: false,
      geocoder: '',
    }
  },
  mounted(){
    this.init();
  },
  watch: {
    echoData: {
      handler(val){
        console.log('echoData',val)
        this.place = val.address;
        this.form.searchText = val.searchText;
        this.form.radius = val.radius;
        this.circleOption.center = val.center;
        this.circleOption.radius = val.radius * 1000;
        if(this.inited){
          this.setCircleMap();
          this.marker.setPosition(this.circleOption.center);
        } else {
          this.requiredsetCircleMap = true;
        }
      },
      deep: true,
    },
    // showMap(val){
    //   if(val && this.requiredsetCircleMap && this.inited){
    //     this.$nextTick(() => {
    //       this.setCircleMap();
    //     });
    //   }
    // },
  },
  methods: {
    init(){
      let has = this.addGaodeScript();
      if(has){  // 已经引入过map-script
        this.setCheckInMap();
      } else {
        EventBus.$once('gaode-init', () => {
          this.setCheckInMap();
        });
      }
    },
    // init(){
    //   window.setMap = () => {
    //     this.setCheckInMap();
    //   }
    //   this.addScript();
    // },
    setCheckInMap(){
      this.map = new AMap.Map(this.id, {
        resizeEnable: true,
        zoom: 17,
        // center: this.coordinate
      });
      // AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],() => { // 异步同时加载多个插件
      //   this.autocomplete = new AMap.Autocomplete({ input: this.$refs[this.inputRef] });
      //   this.map.addControl(autocomplete);
      //   this.placeSearch = new AMap.PlaceSearch({ map: this.map }); // 构造地点查询类
      //   this.map.addControl(this.placeSearch);
      // });
      this.autocomplete = new AMap.Autocomplete({ datatype: 'all' }); // 初始化搜索插件
      this.placeSearch = new AMap.PlaceSearch({ map: this.map }); // 初始化构造地点查询类插件
      this.circle = new AMap.Circle(this.circleOption); // 初始化圆圈覆盖物
      this.marker = new AMap.Marker({ map: this.map }); // 初始化marker标记
      this.geocoder = new AMap.Geocoder({ radius: 100 }); // 初始化地理编码与逆地理编码插件，radius：范围，默认：500
      AMap.event.addListener(this.placeSearch, 'markerClick', this.markerClick); // 注册监听，当选中“搜索地点的marker标记”时会触发
      AMap.event.addListener(this.map, 'click', this.mapClick); // 注册监听，点击地图上的点回调
      AMap.event.addListenerOnce(this.map, 'complete', this.mapComplete); // 注册监听，地图加载完成
    },
    // 关键字查询（根据搜索结果设置地图标记）
    mapSearch(val) {
      this.placeSearch.setCity(val.adcode);
      this.placeSearch.search(val.name);
    },
    // 远程搜索下拉框数据
    // remoteMethod(val){
    //   if(!val) return;
    //   this.searching = true;
    //   this.autocomplete.search(val, (status, result) => {
    //     this.searching = false;
    //     if(status === 'complete'){
    //       this.searchOption = result.tips;
    //     } else if (status === 'no_data'){
    //       this.searchOption = [];
    //     } else {
    //       console.warn(result);
    //     }
    //   })
    // },
    // 异步远程搜索方法
    querySearchAsync(val, cb){
      if(!val) return cb([]);
      this.autocomplete.search(val, (status, result) => {
        let searchOption;
        if(status === 'complete'){
          searchOption = result.tips;
        } else if (status === 'no_data'){
          searchOption = [];
        } else {
          console.warn(result);
        }
        cb(searchOption);
      })
    },
    // 地图加载完成回调
    mapComplete(e){
      console.log('mapComplete')
      if(this.requiredsetCircleMap){
        this.setCircleMap();
        this.marker.setPosition(this.circleOption.center);
      }
      this.inited = true;
    },
    // 地图点击回调
    mapClick(e){
      // console.info('mapClick',e);
      // 给点击的地点加标记
      this.marker.setPosition(e.lnglat);
      // 通过点击地点的经纬度进行“逆地理编码”，获取地址
      this.geocoder.getAddress(e.lnglat, (status, result) => {
        // console.log('geocoder', status, result)
        if(status === 'complete'){
          this.place = result.regeocode.formattedAddress;
          this.circleOption.center = e.lnglat;
          if(this.form.radius){
            this.setCircleMap();
            this.$emit('complete', { center: this.circleOption.center, radius: this.form.radius, address: this.place, searchText: this.form.searchText });
          }
        } else if (status === 'no_data'){
          this.$message.error('无法获取改点地理位置，请重新选址');
        } else {
          this.$message.error('获取地址失败，请重试');
          console.warn(result);
        }
      });
    },
    // 地图选点，点击搜索的marker
    markerClick(val){
      this.place = val.data.pname + val.data.cityname + val.data.adname + val.data.address + val.data.name;
      this.circleOption.center = [val.data.location.lng, val.data.location.lat];
    },
    // 签到范围选择框change
    rangeInput(val){
      this.circleOption.radius = val * 1000;
      this.setCircleMap();
      this.$emit('complete', { center: this.circleOption.center, radius: val, address: this.place, searchText: this.form.searchText });
    },
    // 设置地图的范围覆盖
    setCircleMap(){
      // console.log('setCircleMap', this.circleOption);
      this.circle.setOptions(this.circleOption);
      this.circle.setMap(this.map);
      // 缩放地图到合适的视野级别
      this.map.setFitView([ this.circle ]);
    },
    // 签到范围选择框focus
    rangeInputFocus(){
      if(!this.place){
        this.$message.info('请先在地图上选点');
        this.$refs.rangeInput.blur();
      }
    },
    // 校验表单
    validate(){
      let status;
      this.$refs.ruleForm.validate((isSuccess, obj) => {
        status = isSuccess;
      });
      return status;
    },
  }
}
</script>

<style lang="scss" scoped>
.check_in_map{
  .check_in_map_container{
    .map_container{
      width: 100%;
      padding: 0 20px;
    }
  }
}
</style>

