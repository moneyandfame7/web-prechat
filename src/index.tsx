import { render } from 'preact'

import { Application } from 'modules/App'

import './css/index.scss'

render(<Application />, document.getElementById('app') as HTMLElement)
