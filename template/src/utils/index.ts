export const throttle = (func: Function, delay: number) => {
  let prev = Date.now()
  return function() {
    let args = arguments
    let now = Date.now()
    if (now - prev >= delay) {
      func()
      prev = Date.now()
    }
  }
}

export const getElementByAttr = (tag: string, dataAttr: string, val: any) => {
  let aElements = document.getElementsByTagName(tag);
  let aEle = [];
  for(let i = 0; i < aElements.length; i++) {
    let ele = aElements[i].getAttribute(dataAttr);
    if(ele == val) {
        aEle.push(aElements[i]);
    }
  }
  return aEle;
}

// 获取枚举name
export const getEnumerateName = (data: any, id: any) => {
  let label = '-'
  data.forEach((item: any) => {
    if(item.id == id) {
      label = item.name
    }
  })
  return label
}
