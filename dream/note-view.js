/** @jsx h */

import h from './vdom'

export default function Note(Model, events) {
  Model.text.log()
  Model.isAwesome.log()
  return Model.text.combine(Model.isAwesome, (text, isAwesome) => <div>
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
  //.throttle(10)
}


