import './css/index.scss'
import { Application } from 'modules/App'
import { render } from 'preact'

render(<Application />, document.getElementById('app') as HTMLElement)
