import type {PreactNode} from 'types/ui'

import {replaceEmojis} from './replaceEmojis'
import {replaceMarkdown} from './replaceMarkdown'
import {replaceBreakes} from './replaceSpaces'

export type TextRenderFilter =
  | 'emoji'
  | 'emoji_html'
  | 'markdown'
  | 'links'
  | 'markdown_html'
  | 'breakes_html'
  | 'breakes'

export function renderText(
  node: PreactNode,
  filters: TextRenderFilter[] = ['emoji']
): PreactNode[] {
  return filters.reduce(
    (text, filter) => {
      switch (filter) {
        case 'emoji':
          return replaceEmojis(text, 'jsx')
        case 'emoji_html':
          return replaceEmojis(text, 'html')
        case 'markdown':
          return replaceMarkdown(text, 'jsx')
        case 'markdown_html':
          return replaceMarkdown(text, 'html')
        case 'breakes':
          return replaceBreakes(text, 'jsx')
        case 'breakes_html':
          return replaceBreakes(text, 'html')
      }
      return text
    },
    [node] as PreactNode[]
  )
}
