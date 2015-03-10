

function node(tag, props, children) {
  return {tag: tag, props: props, children: children}
  // nothing for the moment?
}

function render(node, dom) {
  let root = treeToVtree(node)

  root.mounter.onNext(dom)
  // root.tree$.subscribe(tree => {
  // })
}

class Wid {
  constructor(node) {
    this.events = new Eventser()
    this.propser = makePropser(node.props)
    this.model = node.tag.model(this.propser, this.events.receive)
    this.view = node.tag.view(this.model, this.events.send)
    this.mounter = new Observable()
    this.node = node

    this.lastTree = h('div')

    this.div = vdom.createElement(this.lastTree)

    /// this.mounter.onNext(div)
    this.view.subscribe(tree => {
      let vtree = treeToVtree(tree)
      let diff = vdom.diff(lastTree, vtree)
      vdom.patch(this.div, diff)
    })
  }

  props(newProps) {
    this.propser.add(newProps)
  }
}

class Widget {
  constructor(node) {
    this.type = 'Widget'
    this.node = node
  }

  init() {
    // this.div = vdom.createElement(this.prevTree)
    this.wid = new Wid(this.node)
    return this.wid.div
  }

  update(previous, domNode) {
    this.wid = previous.wid
    this.wid.props(this.node.props)
    return 
  }

  destroy(domNode) {
    this.wid.remove()
  }
}

function treeToVtree(node) {
  if ('string' === typeof node.tag) {
    return h(node, node.props, node.children.map(treeToVtree))
  }

  return {
    type: 'Widget',

  }


  let events = new Eventser()
  let props = makePropser(node.props)
  let model = node.tag.model(props, events.receive)
  let view = node.tag.view(model, events.send)
  let mounter = new Observable()

  let lastVtree = h('div')
    , lastNode = null

  let vtree$ = view.scan(crawlThem, null)
  vtree$.combineLatest(mounter).subscribe((vtree, mountNode) => {
    if (mountNode !== lastNode || !lastVtree) {
      let node = vdom.createElement(vtree)
      // TODO can I just get vdom to render into here?
      mountNode.parentNode.replaceChild(mountNode, node)
      lastNode = mountNode
      lastVtree = vtree
      return
    }
    let diff = vdom.diff(lastVtree, vtree)
    // this returns a new root node?
    vdom.patch(mountNode, diff)
  })

  return {
    tag: node.tag,
    events,
    props,
    model,
    mounter,
    type: 'Widget',
    init() {
      let div = vdom.createElement(lastVtree)
      lastNode = div
      mounter.onValue(div)
      return div
    },
    destroy() {
      mounter.onComplete()
    },
  }
}

function crawlThem(newTree, oldTree) {
  if (!oldTree || newTree.tag !== oldTree.tag) {
    return treeToVtree(newTree)
  }
  if ('string' === typeof newTree.tag) {
    return h(newTree.tag, newTree.props, newTree.map((item, i) =>
      crawlThem(item, oldTree.children[i])
    ))
  }
  // add the new props to the propser observable streams
  oldTree.props.newValues(newTree.props)
  return oldTree
}

