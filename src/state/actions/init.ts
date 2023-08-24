import type {ApiLangCode} from 'api/types'
import * as firebase from 'lib/firebase'
import {createAction} from 'state/action'
import {LANGUAGES_CODE_ARRAY} from 'state/helpers/settings'
import {makeRequest} from 'utilities/makeRequest'

createAction('authInit', async (state) => {})
