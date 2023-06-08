import { render } from 'preact'

import { Application } from './App.tsx'
import './css/index.scss'

render(<Application />, document.getElementById('app') as HTMLElement)
