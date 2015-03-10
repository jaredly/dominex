
import vdom from 'virtual-dom'

export default function render(tree, dom) {
  let el = vdom.create(tree)
  dom.appendChild(el)
}

/*
function node(tag, props, children) {
  return {tag: tag, props: props, children: children}
  // nothing for the moment?
}
*/

/*
function treeToVtree(node) {
  if ('string' === typeof node.tag) {
    return h(node, node.props, node.children.map(treeToVtree))
  }

  return new Widget(node)
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
*/

