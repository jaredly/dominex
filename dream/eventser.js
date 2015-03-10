
import Kefir from 'kefir'

export default class Eventser {
  constructor() {
    this.evmap = []
    this.send = this.send.bind(this)
    this.receive = this.receive.bind(this)
  }

  send(name, mapper, transformer) {
    // evmap is in an outer scope or sth
    if (!this.evmap[name]) {
      this.evmap[name] = Kefir.emitter()
    }
    let o = Kefir.emitter()
    let e = o
    if (mapper) e = e.map(mapper)
    if (transformer) e = transformer(e)

    // debugging
    e.log('send event: ' + name)

    // pipe the result to our event stream
    e.onAny(evt => this.evmap[name].emitEvent(evt))
    // but return the original (pre-transformation) observable
    return o
  }

  receive(name) {
    if (!this.evmap[name]) {
      this.evmap[name] = Kefir.emitter()
    }
    return this.evmap[name]
  }

}

