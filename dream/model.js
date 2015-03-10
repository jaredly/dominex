
import collectionMods from './collection'

let notesApi = {
  update() {
    return new Promise((res, rej) => {
      setTimeout(function () {
        res(null)
      }, 500)
    })
  },
  remove() {
    return new Promise((res, rej) => {
      setTimeout(function () {
        res(null)
      }, 500)
    })
  }
}

export default NotesModel(Props, events, source) {
  return {
    notes: source.notes.map(value => {
      pending: Map(),
      items: value,
      ids: getIds(value)
    }).merge(collectionMods(events, notesApi)).scan(function (data, modFn) {
      let res = modFn(data)
      return {
        items: res.items || data.items,
        pending: res.pending || data.pending,
        ids: res.ids || data.ids
      }
    })
  }
}

