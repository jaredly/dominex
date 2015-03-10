
export default node
import vdom from 'virtual-dom'
import Eventser from './eventser'
import Propser from './propser'

class Hook {
  constructor(val) {
    this.val = val
    this._evt = this.val.emit.bind(this.val)
  }
  hook(node, propName, prev) {
    if (prev && prev.val === this.val) return
    node.addEventListener(propName.slice(2).toLowerCase(), this._evt)
  }
  unhook(node, propName, next) {
    if (next && next.val === this.val) return
    node.removeEventListener(propName.slice(2).toLowerCase(), this._evt)
  }
}

let hooks = {
  onChange: true,
  onClick: true,
}

function node(tag, props, ...children) {
  // TODO hook event listeners
  for (let name in props) {
    if (hooks[name]) {
      props[name] = new Hook(props[name])
    }
  }
  if ('string' === typeof tag) {
    return new vdom.VNode(tag, props, children)
  }
  return new Widget(tag, props, children)
}

class Widget {
  constructor(tag, props, children) {
    this.type = 'Widget'
    this.tag = tag
    this.props = props
    this.children = children
  }

  init() {
    // this.div = vdom.createElement(this.prevTree)
    this.wid = new Wid(this.tag, this.props, this.children)
    return this.wid.div
  }

  update(previous, domNode) {
    this.wid = previous.wid
    this.wid.props(this.props)
    return 
  }

  destroy(domNode) {
    this.wid.remove()
  }
}

class Wid {
  constructor(tag, props, children) {
    // TODO put children in the props
    this.events = new Eventser()
    this.propser = new Propser()
    console.log('new widget', props)
    this.model = tag.model(this.propser.get, this.events.receive)
    this.view = tag.view(this.model, this.events.send)
    this.propser.get('note').log()
    this.node = node

    let lastTree = vdom.h('div')

    this.div = vdom.create(lastTree)

    this.view.onValue(tree => {
      console.log('new tree', tree)
      let diff = vdom.diff(lastTree, tree)
      let newNode =vdom.patch(this.div, diff)
      if (this.div.parentNode) {
        this.div.parentNode.replaceChild(this.div, newNode)
      }
      this.div = newNode
      lastTree = tree
    })

    this.propser.update(props)
  }

  props(newProps) {
    this.propser.update(newProps)
  }
}

