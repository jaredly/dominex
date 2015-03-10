
import vdom from 'virtual-dom'

export default function render(tree, dom) {
  let el = vdom.create(tree)
  dom.appendChild(el)
}

