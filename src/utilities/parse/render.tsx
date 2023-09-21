import type {PreactNode} from 'types/ui'

import {replaceEmojis} from './replaceEmojis'
import {replaceMarkdown} from './replaceMarkdown'

export type TextRenderFilter = 'emoji' | 'emoji_html' | 'markdown' | 'links' | 'markdown_html'

export function renderText(
  text: PreactNode,
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
      }
      return text
    },
    [text] as PreactNode[]
  )
}
