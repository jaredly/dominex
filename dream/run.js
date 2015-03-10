

function node(tag, props, children) {
  return {tag: tag, props: props, children: children}
  // nothing for the moment?
}

function render(node, dom) {
  let root = makeMeASandwich(node)

  root.mounter.onNext(dom)
  // root.tree$.subscribe(tree => {
  // })
}

function treeToVtree(node) {
  if ('string' === typeof node.tag) {
    return h(node.tag, node.props, node.children.map(makeMeASandwich))
  }
  return {
    type: 'Widget',
    init: node.init,
    destroy: node.destroy,
  }
}

function makeMeASandwich(node) {
  if ('string' === typeof node.tag) {
    return node
    // return h(node, node.props, node.children.map(makeMeASandwich))
  }
  let events = makeEventer()
  let props = makePropser(node.props)
  let model = node.tag.model(props, events.receive)
  let view = node.tag.view(model, events.send)
  let mounter = new Observable()

  let lastVtree = null
    , lastNode = null

  view.scan(crawlThem, null).combineLatest(mounter).subscribe((tree, mountNode) => {
    let vtree = treeToVtree(tree)
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
    init() {
      let div = document.createElement('div')
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
    return makeMeASandwich(newTree)
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

