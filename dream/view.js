/** @jsx Dominex.node */

class Eventser {
  constructor() {
    this.evmap = []
    this.send = this.send.bind(this)
    this.receive = this.receive.bind(this)
  }

  send(name, mapper, transformer) {
    // evmap is in an outer scope or sth
    if (!this.evmap[name]) {
      this.evmap[name] = new Observable()
    }
    let o = new Observable()
    let e = o
    if (mapper) e = e.map(mapper)
    if (transformer) e = transformer(e)
    // pipe the result to our event stream
    e.onAny(evt => evmap[name].emitEvent(evt))
    // but return the original (pre-transformation) observable
    return o
  }

  receive(name) {
    if (!this.evmap[name]) {
      this.evmap[name] = new Observable()
    }
    return this.evmap[name]
  }

}

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

export default NoteModel(Props, events) {
  return {
    text: props('note').map(n => n.get('text')).merge(events('change'))
    awesome: props('note').map(n => n.get('isAwesome')).merge(events('awesome'))
  }
}

export MakeComponent({model: NoteModel, view: NoteView})

