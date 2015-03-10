/** @jsx Dominex.node */

export default function NotesView(Model, events) {
  return Model.notes.map(notes => 
  <div>
    {model.notes.map(note =>
      <Note
        note={note}
        onChange={events('change')}
        onRemove={events('remove')}/>)}
  </div>)
  .startWith(<div>Loading...</div>)
  .errorsToValues(error => <div>Error loading notes!</div>)
}

export default Note(Model, events) {
  return combineLatest(Model.text, Model.isAwesome).map((text, isAwesome) => <div>
    <textarea
      value={text}
      onChange={events('change', e => e.target.value)}
      placeholder="Awesome Sauces"
      />
    <input
      type="checkbox"
      checked={isAwesome}
      onChange={events('awesome', e => e.target.checked)}/>
    <button onClick={events('save')}>Save</button>
    <button onClick={events('remove')}>Remove</button>
  </div>)
}

function pipeEventer(propser, eventser) {
  propser = propser.toProperty()
  // TODO destroy later
  eventser.onAny(e => propser._current && propser._current.emitEvent(e))
}

export default NoteModel(Props, events) {
  // send local `save` events up to the passed-in `save` emitter
  pipeEventer(events('save'), Props('save'))
  // Props('save').combine(events('save'), (saver, evt) => saver.emitEvent(evt))
  // Props('save').onValue(saver => events('save').onAny(e => saver.emitEvent(e)))
  // events('save').onAny(e => Props('save').emitEvent(e))
  return {
    text: props('note').map(n => n.get('text')).merge(events('change'))
    awesome: props('note').map(n => n.get('isAwesome')).merge(events('awesome'))
  }
}

export MakeComponent({model: NoteModel, view: NoteView})

