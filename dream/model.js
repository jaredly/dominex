
// TODO just give a sub-item of `pending` so you don't need to `getIn`?
// There ought to be a way to have a different pending cache per source stream
// ...
function updater(id, data, isPending) {
  return (items, ids, pending) => {
    return {
      items: items.mergeIn([id], data), ids,
      pending: isPending ? pending.setIn(['updates', id], items.get(id)) : pending.deleteIn(['updates', id]),
    }
  }
}

function backUpdate(id) {
  return (items, ids, pending) => {
    return {
      items: items.set(id, pending.getIn(['updates', id])),
      pending: pending.deleteIn(['updates', id]),
    }
  }
}

function remover(id) {
  return (items, ids, pending) => {
    return {
      items: items.delete(id),
      ids: ids.remove(id),
      pending: pending.set(id, {value: items.get(id), ix: ids.indexOf(id)}),
    }
  }
}

function removeBack(id) {
  return (items, ids, pending) => {
    let pend = pending.get(id)
    return {
      items: items.set(id, pend.value),
      ids: ids.splice(pend.ix, 0, id)
    }
  }
}

function creator(data) {
  // id here?
  let id = newId()
  return (items, ids) => {
    return {items: items.set(id, data), ids: ids.push(id)}
  }
}

let api = {
  update(id, data) => {
    let o = new Observable()
    makeCall(id, data).then(value => {
      o.onValue(value)
      o.onComplete()
    }).catch(err => {
      o.onError(err)
      e.onComplete()
    })
  }
}

// TODO maybe instead of Do and Undo, have a `commit` // revoke type thing
// going on, similar to rx-flux. You'd still want to be able to indicate
// errors via the ui though. ... hmm what would be the way to do that?
function apiTryerThing(name, events, apiCall, do, undo) {
  return events(name).flatMapConcat(value => {
    let o = new Observable()
    o.onNext({value, pending: true})
    apiCall(value).then(value => {
      o.onNext({value, pending: false})
      o.onComplete()
    }).catch(error => {
      o.onError(value)
      o.onComplete()
    })
    return o
  }).map(do).errorsToValues(undo).map(fn => (items, ids, pending) => {
    // namespace the pending stuff
    let results = fn(items, ids, pending.get(name, Map()))
    if (results.pending) results.pending = pending.set(name, results.pending)
    return results
  })
}


// or something like that
// this returns a stream of modifyer functions
export default collectionMods(events, api) {
  return merge(
    apiTryerThing(events('update'), api.update, updater, backUpdate)
    apiTryerThing(events('remove'), api.remove, remover, backRemove),

    events('update').flatMapConcat((id, data) => {
      return api.update(id, data).mapErrors(() => id)
    }).map(updater).errorsToValues(backUpdate),

    events('create').map(creator),
  )
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

