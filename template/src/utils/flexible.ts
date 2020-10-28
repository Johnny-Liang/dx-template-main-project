interface Params {
  onResize: Function;
  setHtml?: boolean;
}
class Flexible {
  setHtml: boolean
  timeout: any
  constructor({ onResize, setHtml = true }: Params) {
    this.setHtml = setHtml
    const size = this.getSize()
    this.setHtmlFontSize(size.fontSize)
    onResize(size) // 初始化
    this.resize(onResize)

  }
  getSize () {
    const baseRatio = 9 / 16 // 基准比例
    // 当前屏幕情况
    const screenWidth = document.body.offsetWidth,
    screenHeight = document.body.offsetHeight,
    ratio = screenHeight / screenWidth

    let outerWidth = screenWidth,
    outerHeight = screenHeight
    if (ratio > baseRatio) {
      outerHeight = screenWidth * baseRatio
    } else if (ratio < baseRatio) {
      outerWidth = screenHeight / baseRatio
    }
    const fontSize = outerWidth / 10 // 根结点字体大小
    return {
      outerWidth,
      outerHeight,
      fontSize
    }
  }
  setHtmlFontSize (fontSize: number) {
    if (!this.setHtml) return
    document.documentElement.style.fontSize = fontSize + 'px'
  }
  resize (callback: Function) {
    window.onresize = () => {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        const size = this.getSize()
        this.setHtmlFontSize(size.fontSize)
        callback(size)
      }, 10)
    }
  }
}
export default Flexible