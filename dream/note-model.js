
function pipeEventer(eventser, propser) {
  propser = propser.toProperty()
  // TODO destroy later
  eventser.onAny(e => propser._current && propser._current && propser._current.emitEvent && propser._current.emitEvent(e))
}

export default function NoteModel(props, events) {
  console.log('new note model', props, events)
  // send local `save` events up to the passed-in `save` emitter
  pipeEventer(events('save'), props('save'))
  // Props('save').combine(events('save'), (saver, evt) => saver.emitEvent(evt))
  // Props('save').onValue(saver => events('save').onAny(e => saver.emitEvent(e)))
  // events('save').onAny(e => Props('save').emitEvent(e))
  return {
    text: props('note').map(n => n.get('text')).merge(events('change')),
    isAwesome: props('note').map(n => n.get('isAwesome')).merge(events('awesome'))
  }
}

