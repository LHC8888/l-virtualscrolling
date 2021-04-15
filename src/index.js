(function(window) {

  var LVirtaulScrolling = function(option) {
    this.container = option.container
    this.data = option.data
    this.surplus = option.surplus || 0
    this.el = document.querySelector(this.container)
    if(!this.el) {
      throw new Error(`cannot find element:${this.container}`)
    }
    if(!this.data) {
      throw new Error(`data required`)
    }

    this.el.addEventListener('scroll', this.handleScroll.bind(this))
  }

  LVirtaulScrolling.prototype.divide = function() {
    var data = this.data
    var rect = this.el.getBoundingClientRect()
    // 容器高度
    var height = rect.height 
    var children = Array.from(this.el.children)
    // 已渲染出的子元素高度和
    var childrenHeight = children.reduce((s, childNode) => {
      var height = childNode.getBoundingClientRect().height
      return s + height
    }, 0)



    return data
  }

  LVirtaulScrolling.prototype.handleScroll = function(ev) {
    
    // 偏移量
    var scrollTop = ev.target.scrollTop
    
    this.divide()
  }


  window.LVirtaulScrolling = LVirtaulScrolling

})(window)