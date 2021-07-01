// todo 
// 1. 列表项高度不固定
// 2. 横向虚拟滚动

const list = document.querySelector('#list')
const listRect = list.getBoundingClientRect()
let count = 0 // 数据起始位置
let length = 20 // 数据每页长度
let data = [] // 页面总的列表数据
const itemHeight = 40 // 列表中子元素的高度

// 虚拟列表的配置项
let virtualData = [] // 实际显示的列表数据
let virtualStart = 0 // 虚拟列表显示的第一个节点在原列表data中的索引，随着列表滚动会发生变化， virtualStart = scrollTop % itemHeight
let virtualCount = listRect.height / itemHeight// 虚拟列表显示出来的项目个数 = 列表容器高度 / 子元素高度， 
let virtualEnd = virtualStart + virtualCount - 1 // 虚拟列表显示的最后一个节点在愿列表data中的索引，随着列表滚动会发生变化，
const more = 4 // 为了防止出现白屏，保证滚动流畅，多渲染 more 个
const singleMore = more / 2 // 在可视的区域之外上下各增多两个列表项

// list 作为外部的容器 保持高度不变，并且可滚动
// 新建一个中间容器存放列表项节点，用来撑开list，让外部容器的滚动条尺寸保持正确
const middle = document.createElement('div')
middle.className = 'middle'
Array.from(list.children).forEach(node => {
  middle.appendChild(node)
})
list.appendChild(middle)

loadMore()

// 模拟请求数据
function getData() {
  const delay = 500
  return new Promise(resolve => {

    const res = []
    for (let i = count; i < length + count; i++) {
      res.push({ index: i, color: randomColor() })
    }
    count += 20

    setTimeout(() => {
      resolve(res)
    }, delay)
  })
}

// 加载更多
function loadMore() {
  getData().then(list => {
    data = data.concat(list)
    renderVirtualData()
    initPadding()

    console.log('列表共:', data.length);
    console.log('虚拟列表:', virtualData.length);
    logInitInfo()
  })
}

// 根据 virtualStart virtualCount 获得 virtualData
// 上面和下面各多两个
function getVirtualData() {
  let start = virtualStart - singleMore < 0 ? 0 : virtualStart - singleMore
  let end = start + virtualCount + more > data.length ? data.length : start + virtualCount + more

  virtualData = data.slice(start, end)
  // console.log('getVirtualData => ', `start=${start}`, `virtualStart=${virtualStart}`, `singleMore=${singleMore}`, `end=${end}`, `virtualData.length=${virtualData.length}`);
}

// 初始化列表的paddingBottom、保证容器的滚动条显示正确
function initPadding() {
  middle.style.paddingBottom = (data.length - virtualData.length) * itemHeight + 'px'
}

function renderVirtualData() {
  getVirtualData()
  middle.innerHTML = ''
  const df = document.createDocumentFragment()
  // console.log('render virtualData.length = ', virtualData.length);
  virtualData.forEach(i => {
    const item = document.createElement('div')
    item.className = 'item'
    item.textContent = `${i.index}`
    item.style = `background: ${i.color};`
    df.appendChild(item)
  })
  middle.appendChild(df)
}

// 需要根据数据量来给middle设置内边距，保持滚动条尺寸
function setPadding(scrollTop) {

  // paddingTop 使用scrollTop来计算即可
  scrollTop = scrollTop || 0

  if (isDown) {
    // 向下滚动时
    if (virtualStart < singleMore) {
      middle.style.paddingTop = 0
      middle.style.paddingBottom = '240px'
    } else if (virtualStart + virtualCount >= data.length - singleMore) {
      middle.style.paddingTop = '240px'
      middle.style.paddingBottom = 0
    } else {
      middle.style.paddingTop = `${scrollTop - singleMore * itemHeight}px`
      middle.style.paddingBottom = (data.length - virtualData.length) * itemHeight - (scrollTop - singleMore * itemHeight) + 'px'
    }
  } else {
    // 向上滚动是一个相反的操作
    // console.log('up 最上', scrollTop <= singleMore * itemHeight);
    // if (virtualStart + virtualCount >= data.length - singleMore) {
    //   console.log('up 最下');
    //   middle.style.paddingTop = '240px'
    //   middle.style.paddingBottom = 0
    // } else if (scrollTop <= singleMore * itemHeight) {
    //   console.log('up 最上');
    //   middle.style.paddingTop = 0
    //   middle.style.paddingBottom = '240px'
    // } else {
    //   console.log('up 中间');
    //   middle.style.paddingTop = `${scrollTop - singleMore * itemHeight}px`
    //   middle.style.paddingBottom = (data.length - virtualData.length) * itemHeight - (scrollTop - singleMore * itemHeight) + 'px'
    // }
    if (virtualStart <= singleMore) {
      middle.style.paddingTop = 0
      middle.style.paddingBottom = '240px'
    } else if (virtualStart + virtualCount >= data.length - singleMore) {
      middle.style.paddingTop = '240px'
      middle.style.paddingBottom = 0
    } else {
      middle.style.paddingTop = `${scrollTop - singleMore * itemHeight}px`
      middle.style.paddingBottom = (data.length - virtualData.length) * itemHeight - (scrollTop - singleMore * itemHeight) + 'px'
    }
  }
}

// 动态计算索引 virtualStart
function calcVirtualStartIndex(scrollTop, isDown) {
  return isDown ? parseInt(scrollTop / itemHeight) : Math.ceil(scrollTop / itemHeight)
  // console.log('virtual Start ', virtualStart);
}

// 给div染色
function randomColor() {
  var col = "#";
  for (var i = 0; i < 6; i++) col += parseInt(Math.random() * 16).toString(16);
  return col;
}

function logInitInfo() {
  console.log('当前列表的总高度（数据长度*列表项高度）=', data.length * itemHeight)
  console.log('当前虚拟列表总高度+初始化的paddingBottom = ', virtualData.length * itemHeight + parseInt(middle.style.paddingBottom));
}

function logScrollingInfo() {
  const paddingTop = parseInt(window.getComputedStyle(middle, null).paddingTop)
  const paddingBottom = parseInt(window.getComputedStyle(middle, null).paddingBottom)
  const virtualHeight = parseInt(window.getComputedStyle(middle, null).height)

  console.log('=============================');
  console.log('当前paddingTop：', paddingTop);
  console.log('当前paddingBottom：', paddingBottom);
  console.log('当前virtualHeight：', virtualHeight);
  console.log('当前paddingTop + 虚拟列表总高度 + paddingBottom：', paddingTop + paddingBottom + virtualHeight)
  console.log('=============================');
}

let padd = 200
let lastScrollTop = 0
var isDown = false
list.addEventListener('scroll', e => {
  const target = e.target
  const { scrollTop, scrollHeight, clientHeight } = target
  // 不能再使用这个来判断滚动到底部了，因为有paddingBottom
  // if (scrollTop + listRect.height >= scrollHeight) {

  // 如果滚动到距离大于底部超过可视范围的子元素个数*子元素高度即滚到底部
  // console.log(scrollTop, listRect.height, data.length, itemHeight);

  isDown = scrollTop > lastScrollTop
  lastScrollTop = scrollTop

  // newVirtualStart 不跟 virtualStart一样
  let newVirtualStart = calcVirtualStartIndex(scrollTop, isDown)
  // console.log('new ', newVirtualStart, virtualStart, virtualCount);
  if (newVirtualStart !== virtualStart) {
    virtualStart = newVirtualStart
    virtualEnd = virtualStart + virtualCount - 1
    // console.log('up virtualStart ', virtualStart);
    // 这里如果真实列表项的最后一个渲染出来了，那就不需要再去渲染了，否则会出现闪烁
    if (virtualStart + virtualCount <= data.length - 2) {
      renderVirtualData()
    }
    setPadding(scrollTop)
  }
  // logScrollingInfo()

})
