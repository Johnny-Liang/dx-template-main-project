<template>
  <Table class="DTable" ref="DTable" v-bind="{...options, scroll}" size="small" />
</template>
<script lang="ts">
import Vue from 'vue'
import { Table, Input } from 'ant-design-vue'
import { throttle } from '@/utils'
import { Component, Prop, Watch } from 'vue-property-decorator'
type column = {
  dataIndex: string;
}
@Component({
  components: {
    Table,
    Input
  }
})
export default class Grid extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      dataSource: [],
      columns: []
    })
  }) antdOpts!: Table
  // 开启编辑功能
  @Prop({
    type: Boolean,
    default: false
  }) editable!: boolean
  // 指定单元格标记编辑状态
  @Prop({
    type: Object,
    default: () => ({})
  }) appointEditedCell!: {[propName: string]: number[]}
  // 不允许编辑的列，需要指定哪几行
  @Prop({
    type: Object,
    default: () => ({})
  }) disabledEditDataIndex !: {
    [propName: string]: number[]
  }
  // 不允许编辑的行
  @Prop({
    type: Array,
    default: () => []
  }) disabledEditIndex!: number[]
  // 不允许编辑的单元格内容
  @Prop({
    type: Array,
    default: () => []
  }) disabledEditVal!: string[]
  // 根据行下标自定义样式，可追加dataIndex严格到单元格
  @Prop({
    type: Object,
    default: () => ({})
  }) styleToRowIndex!: {
    [propName: string]: any
  }
  // 跨列合并
  @Prop({
    type: Object,
    default: () => ({})
  }) colSpan!: {
    [propName: number]: {
      startCol: string;
      span: number;
    }[]
  }
  // 跨行合并
  @Prop({
    type: Object,
    default: () => ({})
  }) rowSpan!: {
    [propName: number]: {
      index: number;
      span: number;
    }[]
  }
  // 禁止选中
  @Prop({
    type: Boolean,
    default: false
  }) activeDisabled!: boolean
  // 斑马线
  @Prop({
    type: Boolean,
    default: false
  }) striped!: boolean
  // 滚动时始终显示表头，传递过来的是父级滚动对象
  @Prop({
    type: Function,
    default: () => {}
  }) headerShowAuto!: Function

  hoverCell: [string, number] = ['', 0]
  curEditCell: [string, number, boolean?] = ['', 0]
  preEditCell: [string, number, boolean?] = ['', 0]
  editedCell: {[propName: string]: number[]} = {}
  tableRowLength = this.antdOpts.dataSource.length
  // 把column dataIndex存为数组，get index key
  colIndexs: string[] = []
  headerFixedTop = false
  parentListener = false

  timeout = 0

  @Watch('antdOpts', {deep: true}) onAntdOptsChanged (n: Table) {
    this.tableRowLength = n.dataSource ? n.dataSource.length : 0
  }

  get options () {
    let {columns, flatColumns} = this.columnsDecorate([...this.antdOpts.columns], [...this.antdOpts.dataSource], [])
    // columns.unshift({
    //   title: '',
    //   width: '1px'
    // })
    this.colIndexs = flatColumns.reduce((acc: string[], cur: column, index: number) => {
      acc.push(cur.dataIndex)
      return acc
    }, [])
    return { ...this.antdOpts, columns }
  }
  get scroll () {
    let scroll: {
      x?: number | boolean;
      y?: number | boolean;
    } = {}
    if (this.antdOpts) {
      scroll = this.antdOpts.scroll || {}
      const parentScrollEvt = this.headerShowAuto()
      if (parentScrollEvt) {
        scroll.y = parentScrollEvt.offsetHeight - 37
        if (!this.parentListener) {
          this.$nextTick(() => {
            if (this.$refs.DTable) {
              (this.$refs.DTable as any).$el.querySelector('.ant-table-body').addEventListener('scroll', throttle(this.onScroll, 300))
              parentScrollEvt.addEventListener('scroll', throttle(this.onParentScroll, 300))
            }
          })
          this.parentListener = true
        }
      }
    }
    return scroll
  }

  mounted() {
    document.documentElement.addEventListener('mousedown', this.cancelHover)
  }
  beforeDestroy() {
    (this.$refs.DTable as any).$el.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild.removeEventListener('scroll',  throttle(this.onScroll, 300))
    document.documentElement.removeEventListener('mousedown', this.cancelHover) 
    const parentScrollEvt = this.headerShowAuto()
    if (parentScrollEvt) {
      parentScrollEvt.removeEventListener('scroll', throttle(this.onParentScroll, 300))
    }
  }

  // 合并指定编辑单元格与grid产生的编辑标记
  editedCellMerge() {
    let editedCellMerge = {...this.editedCell}
    let appointEditedCell = {...this.appointEditedCell}
    for (let key in editedCellMerge) {
      if (appointEditedCell[key]) {
        let tempArr = appointEditedCell[key].filter((item: number) => {
          return !editedCellMerge[key].includes(item)
        })
        editedCellMerge[key] = [...editedCellMerge[key], ...tempArr]
        delete appointEditedCell[key]
      }
    }
    return {...editedCellMerge, ...appointEditedCell}
  }
  columnsDecorate(columns: any[], dataSource: any[], flatColumns: any[]): {columns: any[], flatColumns: any[]} { // columns装饰，自定义渲染，摊平层级columns
    columns.map((item: any) => {
      if (item.children) {
        let obj = this.columnsDecorate(item.children, dataSource, flatColumns)
        item.children = obj.columns
        flatColumns = obj.flatColumns
      } else {
        flatColumns.push(item)
        item.customRender = this.customRender.bind(this, {...item}, dataSource)
      }
    })
    return {columns, flatColumns}
  }
  customRender(col: any, dataSource: any[], value: string, row: any, index: number) {
    let obj: any = {...{
      children: this.tableCellComp(col, value, row, index),
      attrs: {
        rowSpan: 1
      }
    }, ...(col.isCustomRender ? col.customRender(value, row, index) : {})}
    let canSpan = false
    if (!col.editableDisabled) {
      canSpan = !this.editable && !col.editableDisabled
    } else {
      canSpan = true
    }
    if (canSpan && col.rowSpan) { // 自动跨行合并
      if (index > 0 && value === dataSource[index - 1][col.dataIndex]) { // 与前一行数据一致，隐藏当前单元格显示
        obj.attrs.rowSpan = 0
      } else { // 当前行与后续行数据一致时，自动跨行
        let end = false,
        span = 1
        while((index + span) < dataSource.length && !end) {
          if (value !== dataSource[index + span][col.dataIndex]) {
            end = true
          } else {
            span ++
          }
        }
        obj.attrs.rowSpan = span
      }
    }
    if (this.rowSpan[col.dataIndex]) {
      const spanOpts = this.rowSpan[col.dataIndex]
      spanOpts.map(item => {
        if (item.index === index) {
          obj.attrs.rowSpan = item.span
        } else if (index > 0) {
          spanOpts.map(childItem => {
            if (childItem.index < index && childItem.index + childItem.span - 1 >= index) {
              obj.attrs.rowSpan = 0
            }
          })
        }
      })
    }
    if (this.colSpan[index]) {
      const spanOpts = this.colSpan[index]
      spanOpts.map((item: any) => {
        if (item.startCol === col.dataIndex) {
          obj.attrs.colSpan = item.span
        } else if (this.colIndexs.indexOf(col.dataIndex) > this.colIndexs.indexOf(item.startCol) && this.colIndexs.indexOf(col.dataIndex) - (this.colIndexs.indexOf(item.startCol) + item.span) < 0) {
          obj.attrs.colSpan = 0
        }
      })
    }
    return obj
  }
  tableCellComp (col: any, value: string, row: any, index: number) {
    const editedCellMerge = this.editedCellMerge()
    let style: any = {}
    if (this.styleToRowIndex[index] && this.styleToRowIndex[index][col.dataIndex]) {
      let styleToRowIndex = JSON.parse(JSON.stringify(this.styleToRowIndex))
      style = {...styleToRowIndex[index], ...styleToRowIndex[index][col.dataIndex]}
      delete style[col.dataIndex]
    } else if (this.styleToRowIndex[index]) {
      style = {...this.styleToRowIndex[index]}
    }
    let cell = [this.$createElement(
      'p',
      {
        class: {
          'table_cell': true,
          'active': !this.activeDisabled && this.hoverCell[0] === col.dataIndex && this.hoverCell[1] === index,
          'dark_cell': this.striped && index % 2 !== 0 && !col.rowSpan,
          'edited': editedCellMerge[col.dataIndex.toString()] && editedCellMerge[col.dataIndex.toString()].includes(index)
        },
        domProps: {
          innerHTML: (value !== null && value !== undefined && value.toString()) ? value : ''
        },
        style: {
          justifyContent: this.getAlignForCol(col.align),
          ...style,
          ...(col.cellStyle || {})
        },
        on: {
          dblclick: this.cellDblclick.bind(this, col, index, value),
          mousedown: this.cellClick.bind(this, col, index)
        }
      }
    )]
    if (this.editable && !col.editableDisabled && (this.hoverCell[0] === col.dataIndex && this.hoverCell[1] === index)) { // 当前列可编辑且正在编辑的单元格是当前单元格
      cell.unshift(this.$createElement(
        Input,
        {
          key: 'hover',
          attrs: {
            value
          },
          directives: [
            {
              name: 'select'
            }
          ],
          on: {
            change: this.dataChange.bind(this, col, row, index),
            keydown: this.keydown.bind(this, 'hover')
          }
        }
      ))
    }
    if (this.editable && !col.editableDisabled && (this.curEditCell[0] === col.dataIndex && this.curEditCell[1] === index)) { // 当前列可编辑且正在编辑的单元格是当前单元格
      let directives = [
        {
          name: 'focus'
        }
      ]
      this.curEditCell[2] && directives.push({name: 'select'})
      cell.unshift(this.$createElement(
        Input,
        {
          key: 'edit',
          class: {
            edit: true
          },
          attrs: {
            value
          },
          directives,
          on: {
            blur: this.cancelEditCell.bind(this, col, row, index),
            change: this.dataChange.bind(this, col, row, index),
            keydown: this.keydown.bind(this, 'edit')
          }
        }
      ))
    }
    return this.$createElement(
      'div',
      {
        class: {
          'table_cell_wrap': true
        }
      },
      cell
    )
  }
  cellClick (col: any, index: number, e: any) {
    e.stopPropagation()
    this.hoverCell = [col.dataIndex, index]
  }
  cellDblclick (col: any, index: number, value: string) {
    if (this.editable && !col.editableDisabled && !this.disabledEditIndex.includes(index) && !(this.disabledEditDataIndex[col.dataIndex] && this.disabledEditDataIndex[col.dataIndex].includes(index)) && !this.disabledEditVal.includes(value)) {
      this.curEditCell = [col.dataIndex, index, true]
    }
  }
  dataChange (col: any, record: any, index: number, e: any) {
    if (this.disabledEditIndex.includes(index) || (this.disabledEditDataIndex[col.dataIndex] && this.disabledEditDataIndex[col.dataIndex].includes(index)) || this.disabledEditVal.includes(record[col.dataIndex])) return // 当前行或单元格禁止编辑
    if (this.hoverCell[0] !== '') { // 若存在选中单元格，则打开选中单元格的编辑
      this.curEditCell = this.hoverCell
    }
    // 单元格编辑状态显示
    if (this.editedCell[col.dataIndex.toString()]) {
      !this.editedCell[col.dataIndex.toString()].includes(index) && this.editedCell[col.dataIndex.toString()].push(index)
    } else {
      this.editedCell[col.dataIndex.toString()] = [index]
    }

    record[col.dataIndex] = e.target.value
  }
  cancelEditCell(col: any, row: any, index: number) {
    this.curEditCell = ['', 0]
    if (this.editedCell[col.dataIndex] && this.editedCell[col.dataIndex].includes(index)) { // 单元格被编辑过
      this.$emit('dataChange', {dataIndex: col.dataIndex, row})
    }
  }
  cancelHover () {
    this.hoverCell = ['', 0]
  }
  resetEdited() {
    this.editedCell = {}
  }
  keydown(target: string, e: any) {
    switch (e.key) {
      case 'Enter':
        this.hoverCell = [
          this.hoverCell[0],
          (this.hoverCell[1] < this.tableRowLength - 1) ? (this.hoverCell[1] + 1) : this.hoverCell[1]
        ]
        break;
      case 'ArrowDown':
        if (target === 'hover' && this.hoverCell[1] < this.tableRowLength - 1) {
          this.hoverCell = [this.hoverCell[0], this.hoverCell[1] + 1]
          this.curEditCell = ['', 0]
        }
        break;
      case 'ArrowUp':
        if (target === 'hover' && this.hoverCell[1] > 0) {
          this.hoverCell = [this.hoverCell[0], this.hoverCell[1] - 1]
          this.curEditCell = ['', 0]
        }
        break;
      case 'Tab':
        e.preventDefault()
        break;
      default:
        break;
    }
  }
  getAlignForCol(align: string) {
    switch (align) {
      case 'center':
        return 'center'
      case 'right':
        return 'flex-end'
      case 'left':
        return 'flex-start'
      default:
        return 'flex-start'
    }
  }
  onScroll(e: any) {
    if (!this.headerFixedTop) {
      this.headerFixedTop = true
      this.parScrollToCur.bind(this, (this.$refs.DTable as any).$el.offsetTop)()
    }
  }
  parScrollToCur(scrollTop: number) {
    const parentScrollEvt = this.headerShowAuto()
    parentScrollEvt.scrollTop = scrollTop
  }
  onParentScroll(e: any) {
    this.headerFixedTop = false
  }
}
</script>
<style lang="scss">
.DTable {
  position: relative;
  .ant-table-body,
  .ant-table-body-inner {
    margin: 0!important;
    table {
      tr {
        td {
          position: relative;
          padding: 0!important;
          height: 38px;
          background-color: #fff;
          // user-select: none;
          .table_cell {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            padding: 8px;
            background-color: #fff;
            word-break: break-word;
            &.dark_cell {
              background-color: rgb(250, 250, 250);
            }
            &.active {
              padding: 6px;
              border: 2px solid $themeColor!important;
            }
            &.edited::after {
              content: '';
              position: absolute;
              z-index: 2;
              top: 0;
              right: 0;
              display: inline-block;
              width: 10px;
              height: 10px;
              border: 5px solid;
              border-color: $themeColor $themeColor transparent transparent;
            }
          }
          .ant-input {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            padding: 6px;
            height: 100%;
            border: 2px solid $themeColor!important;
            // border: none;
            border-radius: 0;
            box-shadow: none;
            &::selection {
              color: #fff;
            }
            &.edit {
              z-index: 1;
            }
          }
        }
      }
    }
  }
}
</style>