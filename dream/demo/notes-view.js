/** @jsx h */

import h from '../vdom'
import Note from './note'

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


