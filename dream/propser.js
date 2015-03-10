
import Kefir from 'kefir'

export default class Propser {
  constructor() {
    this.map = []
    this.props = []
    this.get = this.get.bind(this)
  }

  add(name) {
    this.map[name] = Kefir.emitter()
    this.props[name] = this.map[name].toProperty()
  }

  update(map) {
    for (let name in map) {
      if (!this.map[name]) this.add(name)
      this.map[name].emit(map[name])
    }
  }

  get(name) {
    if (!this.props[name]) this.add(name)
    return this.props[name]
  }

}


