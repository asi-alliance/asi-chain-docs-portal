import type { ThemeRegistration } from 'shiki'

/**
 * Code colors for both site themes. The base text and the block background match
 * --ds-code-bg and --vp-code-block-color in style.css, and each color keeps
 * at least 5.5:1 against that background.
 */

interface Palette {
  fg: string
  bg: string
  comment: string
  string: string
  keyword: string
  number: string
  fn: string
  type: string
  invalid: string
}

function build(name: string, type: 'light' | 'dark', p: Palette): ThemeRegistration {
  return {
    name,
    type,
    colors: {
      'editor.foreground': p.fg,
      'editor.background': p.bg,
    },
    fg: p.fg,
    bg: p.bg,
    tokenColors: [
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: p.comment } },
      {
        scope: ['string', 'punctuation.definition.string', 'string.regexp', 'markup.inline.raw'],
        settings: { foreground: p.string },
      },
      {
        scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new'],
        settings: { foreground: p.keyword },
      },
      {
        scope: ['constant.numeric', 'constant.language', 'constant.character', 'constant.other'],
        settings: { foreground: p.number },
      },
      {
        scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name.function'],
        settings: { foreground: p.fn },
      },
      {
        scope: [
          'entity.name.type',
          'entity.name.class',
          'support.type',
          'support.class',
          'entity.other.attribute-name',
          'variable.other.property',
          'meta.object-literal.key',
          'support.type.property-name',
        ],
        settings: { foreground: p.type },
      },
      {
        scope: ['variable', 'variable.other', 'punctuation', 'meta.brace', 'keyword.operator'],
        settings: { foreground: p.fg },
      },
      { scope: ['invalid', 'invalid.illegal'], settings: { foreground: p.invalid } },
      { scope: ['markup.heading', 'entity.name.section'], settings: { foreground: p.keyword, fontStyle: 'bold' } },
    ],
  }
}

export const deepSpaceLight = build('deep-space-light', 'light', {
  fg: '#1b2326',
  bg: '#f4f7f8',
  comment: '#5a666b',
  string: '#2e6f1f',
  keyword: '#6b3fd0',
  number: '#0a6479',
  fn: '#0b5cad',
  type: '#0a6479',
  invalid: '#b42326',
})

export const deepSpaceDark = build('deep-space-dark', 'dark', {
  fg: '#e6ecee',
  bg: '#14181a',
  comment: '#8c979c',
  string: '#93e27c',
  keyword: '#c4a7ff',
  number: '#ffb84d',
  fn: '#33e4ff',
  type: '#33e4ff',
  invalid: '#ff7a7c',
})
