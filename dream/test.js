/** @jsx h */

import h from './vdom'
import render from './render'
import Note from './note'
import {Map, List} from 'immutable'

render(<Note note={Map({text: 'Hello world!', isAwesome: true})}/>, document.body)


