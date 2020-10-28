<template>
  <div class="test">
    <dh-layout-page-item>
      <dh-config-form :opts="formOpts"/>
    </dh-layout-page-item>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
// import Grid from './Grid/index.vue'
import { Component } from 'vue-property-decorator'
import { Input, Select, DatePicker } from 'ant-design-vue'
import moment from 'moment'
@Component({
  components: {
    // Grid
  }
})
export default class Test extends Vue {
  formOpts = {
    name: {
      label: '姓名',
      comp: Input
    },
    age: {
      label: '年龄',
      comp: Input
    },
    sex: {
      label: '性别',
      comp: Select,
      changeEvent: "change",
      child: [
        {
          comp: Select.Option,
          text: '男',
          value: '0'
        }
      ]
    },
    jg: {
      label: '籍贯',
      comp: Input
    },
    address: {
      label: '住址',
      comp: Input,
      span: 2
    },
    birth: {
      label: '出生年月',
      comp: DatePicker
    }
  }
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
.test {
  // display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 30px;
  width: 1664px;
  // height: 100%;
  background: #fff;
  overflow: auto;
  text-align: left;
  .dhgrid {
    width: 100%;
  }
}
</style>