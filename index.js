import plugin from 'tailwindcss/plugin'
import createUtilityPlugin from 'tailwindcss/lib/util/createUtilityPlugin'
import escapeClassName from 'tailwindcss/lib/util/escapeClassName'
import parseAnimationValue from 'tailwindcss/lib/util/parseAnimationValue'
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import withAlphaVariable from 'tailwindcss/lib/util/withAlphaVariable'
import toColorValue from 'tailwindcss/lib/util/toColorValue'
import isPlainObject from 'tailwindcss/lib/util/isPlainObject'
import transformThemeValue from 'tailwindcss/lib/util/transformThemeValue'
import { formatBoxShadowValue, parseBoxShadowValue } from 'tailwindcss/lib/util/parseBoxShadowValue'

const plugins = {
  visibility: ({ addUtilities }) => {
    addUtilities({
      '.visibility-visible': { visibility: 'visible' },
      '.visibility-hidden': { visibility: 'hidden' },
      '.visibility-collapse': { visibility: 'collapse' },
    })
  },

  position: ({ addUtilities }) => {
    addUtilities({
      '.position-static': { position: 'static' },
      '.position-fixed': { position: 'fixed' },
      '.position-absolute': { position: 'absolute' },
      '.position-relative': { position: 'relative' },
      '.position-sticky': { position: 'sticky' },
    })
  },

  isolation: ({ addUtilities }) => {
    addUtilities({
      '.isolation-isolate': { isolation: 'isolate' },
      '.isolation-auto': { isolation: 'auto' },
    })
  },

  zIndex: createUtilityPlugin('zIndex', [['z-index', ['zIndex']]], {
    supportsNegativeValues: true,
  }),
  gridColumn: createUtilityPlugin('gridColumn', [['grid-column', ['gridColumn']]]),
  gridColumnStart: createUtilityPlugin('gridColumnStart', [
    ['grid-column-start', ['gridColumnStart']],
  ]),
  gridColumnEnd: createUtilityPlugin('gridColumnEnd', [['grid-column-end', ['gridColumnEnd']]]),
  gridRow: createUtilityPlugin('gridRow', [['grid-row', ['gridRow']]]),
  gridRowStart: createUtilityPlugin('gridRowStart', [['grid-row-start', ['gridRowStart']]]),
  gridRowEnd: createUtilityPlugin('gridRowEnd', [['grid-row-end', ['gridRowEnd']]]),

  margin: createUtilityPlugin(
    'margin',
    [
      ['margin', ['margin']],
      [
        ['margin-x', ['margin-left', 'margin-right']],
        ['margin-y', ['margin-top', 'margin-bottom']],
      ],
      [
        ['margin-inline-start', ['margin-inline-start']],
        ['margin-inline-end', ['margin-inline-end']],
        ['margin-top', ['margin-top']],
        ['margin-right', ['margin-right']],
        ['margin-bottom', ['margin-bottom']],
        ['margin-left', ['margin-left']],
      ],
    ],
    { supportsNegativeValues: true }
  ),

  boxSizing: ({ addUtilities }) => {
    addUtilities({
      '.box-sizing-border-box': { 'box-sizing': 'border-box' },
      '.box-sizing-content-box': { 'box-sizing': 'content-box' },
    })
  },

  display: ({ addUtilities }) => {
    addUtilities({
      '.display-block': { display: 'block' },
      '.display-inline-block': { display: 'inline-block' },
      '.display-inline': { display: 'inline' },
      '.display-flex': { display: 'flex' },
      '.display-inline-flex': { display: 'inline-flex' },
      '.display-table': { display: 'table' },
      '.display-inline-table': { display: 'inline-table' },
      '.display-table-caption': { display: 'table-caption' },
      '.display-table-cell': { display: 'table-cell' },
      '.display-table-column': { display: 'table-column' },
      '.display-table-column-group': { display: 'table-column-group' },
      '.display-table-footer-group': { display: 'table-footer-group' },
      '.display-table-header-group': { display: 'table-header-group' },
      '.display-table-row-group': { display: 'table-row-group' },
      '.display-table-row': { display: 'table-row' },
      '.display-flow-root': { display: 'flow-root' },
      '.display-grid': { display: 'grid' },
      '.display-inline-grid': { display: 'inline-grid' },
      '.display-contents': { display: 'contents' },
      '.display-list-item': { display: 'list-item' },
      '.display-none': { display: 'none' },
    })
  },

  aspectRatio: createUtilityPlugin('aspectRatio', [['aspect-ratio', ['aspect-ratio']]]),

  height: createUtilityPlugin('height', [['height', ['height']]]),
  maxHeight: createUtilityPlugin('maxHeight', [['max-height', ['maxHeight']]]),
  minHeight: createUtilityPlugin('minHeight', [['min-height', ['minHeight']]]),

  width: createUtilityPlugin('width', [['width', ['width']]]),
  minWidth: createUtilityPlugin('minWidth', [['min-width', ['minWidth']]]),
  maxWidth: createUtilityPlugin('maxWidth', [['max-width', ['maxWidth']]]),

  flexShrink: createUtilityPlugin('flexShrink', [['flex-shrink', ['flex-shrink']]]),
  flexGrow: createUtilityPlugin('flexGrow', [['flex-grow', ['flex-grow']]]),
  flexBasis: createUtilityPlugin('flexBasis', [['flex-basis', ['flex-basis']]]),

  tableLayout: ({ addUtilities }) => {
    addUtilities({
      '.table-layout-auto': { 'table-layout': 'auto' },
      '.table-layout-fixed': { 'table-layout': 'fixed' },
    })
  },

  captionSide: ({ addUtilities }) => {
    addUtilities({
      '.caption-side-top': { 'caption-side': 'top' },
      '.caption-side-bottom': { 'caption-side': 'bottom' },
    })
  },

  borderCollapse: ({ addUtilities }) => {
    addUtilities({
      '.border-collapse-collapse': { 'border-collapse': 'collapse' },
      '.border-collapse-separate': { 'border-collapse': 'separate' },
    })
  },

  transformOrigin: createUtilityPlugin('transformOrigin', [
    ['transform-origin', ['transformOrigin']],
  ]),

  animation: ({ matchUtilities, theme, config }) => {
    let prefixName = (name) => escapeClassName(config('prefix') + name)
    let keyframes = Object.fromEntries(
      Object.entries(theme('keyframes') ?? {}).map(([key, value]) => {
        return [key, { [`@keyframes ${prefixName(key)}`]: value }]
      })
    )

    matchUtilities(
      {
        animation: (value) => {
          let animations = parseAnimationValue(value)

          return [
            ...animations.flatMap((animation) => keyframes[animation.name]),
            {
              animation: animations
                .map(({ name, value }) => {
                  if (name === undefined || keyframes[name] === undefined) {
                    return value
                  }
                  return value.replace(name, prefixName(name))
                })
                .join(', '),
            },
          ]
        },
      },
      { values: theme('animation') }
    )
  },

  touchAction: ({ addDefaults, addUtilities }) => {
    addDefaults('touch-action', {
      '--tw-pan-x': ' ',
      '--tw-pan-y': ' ',
      '--tw-pinch-zoom': ' ',
    })

    let cssTouchActionValue = 'var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)'

    addUtilities({
      '.touch-action-auto': { 'touch-action': 'auto' },
      '.touch-action-none': { 'touch-action': 'none' },
      '.touch-action-pan-x': {
        '@defaults touch-action': {},
        '--tw-pan-x': 'pan-x',
        'touch-action': cssTouchActionValue,
      },
      '.touch-action-pan-left': {
        '@defaults touch-action': {},
        '--tw-pan-x': 'pan-left',
        'touch-action': cssTouchActionValue,
      },
      '.touch-action-pan-right': {
        '@defaults touch-action': {},
        '--tw-pan-x': 'pan-right',
        'touch-action': cssTouchActionValue,
      },
      '.touch-action-pan-y': {
        '@defaults touch-action': {},
        '--tw-pan-y': 'pan-y',
        'touch-action': cssTouchActionValue,
      },
      '.touch-action-pan-up': {
        '@defaults touch-action': {},
        '--tw-pan-y': 'pan-up',
        'touch-action': cssTouchActionValue,
      },
      '.touch-action-pan-down': {
        '@defaults touch-action': {},
        '--tw-pan-y': 'pan-down',
        'touch-action': cssTouchActionValue,
      },
      '.touch-action-pinch-zoom': {
        '@defaults touch-action': {},
        '--tw-pinch-zoom': 'pinch-zoom',
        'touch-action': cssTouchActionValue,
      },
      '.touch-action-manipulation': { 'touch-action': 'manipulation' },
    })
  },

  userSelect: ({ addUtilities }) => {
    addUtilities({
      '.user-select-none': { 'user-select': 'none' },
      '.user-select-text': { 'user-select': 'text' },
      '.user-select-all': { 'user-select': 'all' },
      '.user-select-auto': { 'user-select': 'auto' },
    })
  },

  resize: ({ addUtilities }) => {
    addUtilities({
      '.resize-none': { resize: 'none' },
      '.resize-vertical': { resize: 'vertical' },
      '.resize-horizontal': { resize: 'horizontal' },
      '.resize-both': { resize: 'both' },
    })
  },

  scrollSnapType: ({ addDefaults, addUtilities }) => {
    addDefaults('scroll-snap-type', {
      '--tw-scroll-snap-strictness': 'proximity',
    })

    addUtilities({
      '.scroll-snap-type-none': { 'scroll-snap-type': 'none' },
      '.scroll-snap-type-x': {
        '@defaults scroll-snap-type': {},
        'scroll-snap-type': 'x var(--tw-scroll-snap-strictness)',
      },
      '.scroll-snap-type-y': {
        '@defaults scroll-snap-type': {},
        'scroll-snap-type': 'y var(--tw-scroll-snap-strictness)',
      },
      '.scroll-snap-type-both': {
        '@defaults scroll-snap-type': {},
        'scroll-snap-type': 'both var(--tw-scroll-snap-strictness)',
      },
      '.scroll-snap-type-mandatory': { '--tw-scroll-snap-strictness': 'mandatory' },
      '.scroll-snap-type-proximity': { '--tw-scroll-snap-strictness': 'proximity' },
    })
  },

  scrollSnapAlign: ({ addUtilities }) => {
    addUtilities({
      '.scroll-snap-align-start': { 'scroll-snap-align': 'start' },
      '.scroll-snap-align-end': { 'scroll-snap-align': 'end' },
      '.scroll-snap-align-center': { 'scroll-snap-align': 'center' },
      '.scroll-snap-align-none': { 'scroll-snap-align': 'none' },
    })
  },

  scrollSnapStop: ({ addUtilities }) => {
    addUtilities({
      '.scroll-snap-stop-normal': { 'scroll-snap-stop': 'normal' },
      '.scroll-snap-stop-always': { 'scroll-snap-stop': 'always' },
    })
  },

  scrollMargin: createUtilityPlugin(
    'scrollMargin',
    [
      ['scroll-margin', ['scroll-margin']],
      [
        ['scroll-margin-x', ['scroll-margin-left', 'scroll-margin-right']],
        ['scroll-margin-y', ['scroll-margin-top', 'scroll-margin-bottom']],
      ],
      [
        ['scroll-margin-inline-start', ['scroll-margin-inline-start']],
        ['scroll-margin-inline-end', ['scroll-margin-inline-end']],
        ['scroll-margin-top', ['scroll-margin-top']],
        ['scroll-margin-right', ['scroll-margin-right']],
        ['scroll-margin-bottom', ['scroll-margin-bottom']],
        ['scroll-margin-left', ['scroll-margin-left']],
      ],
    ],
    { supportsNegativeValues: true }
  ),

  scrollPadding: createUtilityPlugin('scrollPadding', [
    ['scroll-padding', ['scroll-padding']],
    [
      ['scroll-padding-x', ['scroll-padding-left', 'scroll-padding-right']],
      ['scroll-padding-y', ['scroll-padding-top', 'scroll-padding-bottom']],
    ],
    [
      ['scroll-padding-inline-start', ['scroll-padding-inline-start']],
      ['scroll-padding-inline-end', ['scroll-padding-inline-end']],
      ['scroll-padding-top', ['scroll-padding-top']],
      ['scroll-padding-right', ['scroll-padding-right']],
      ['scroll-padding-bottom', ['scroll-padding-bottom']],
      ['scroll-padding-left', ['scroll-padding-left']],
    ],
  ]),

  listStylePosition: ({ addUtilities }) => {
    addUtilities({
      '.list-style-position-inside': { 'list-style-position': 'inside' },
      '.list-style-position-outside': { 'list-style-position': 'outside' },
    })
  },
  listStyleType: createUtilityPlugin('listStyleType', [['list-style-type', ['listStyleType']]]),
  listStyleImage: createUtilityPlugin('listStyleImage', [['list-style-image', ['listStyleImage']]]),

  gridAutoColumns: createUtilityPlugin('gridAutoColumns', [
    ['grid-auto-columns', ['gridAutoColumns']],
  ]),

  gridAutoFlow: ({ addUtilities }) => {
    addUtilities({
      '.grid-auto-flow-row': { gridAutoFlow: 'row' },
      '.grid-auto-flow-column': { gridAutoFlow: 'column' },
      '.grid-auto-flow-dense': { gridAutoFlow: 'dense' },
      '.grid-auto-flow-row-dense': { gridAutoFlow: 'row dense' },
      '.grid-auto-flow-column-dense': { gridAutoFlow: 'column dense' },
    })
  },

  gridAutoRows: createUtilityPlugin('gridAutoRows', [['grid-auto-rows', ['gridAutoRows']]]),
  gridTemplateColumns: createUtilityPlugin('gridTemplateColumns', [
    ['grid-template-columns', ['gridTemplateColumns']],
  ]),
  gridTemplateRows: createUtilityPlugin('gridTemplateRows', [
    ['grid-template-rows', ['gridTemplateRows']],
  ]),

  flexDirection: ({ addUtilities }) => {
    addUtilities({
      '.flex-direction-row': { 'flex-direction': 'row' },
      '.flex-direction-row-reverse': { 'flex-direction': 'row-reverse' },
      '.flex-direction-column': { 'flex-direction': 'column' },
      '.flex-direction-column-reverse': { 'flex-direction': 'column-reverse' },
    })
  },

  flexWrap: ({ addUtilities }) => {
    addUtilities({
      '.flex-wrap-wrap': { 'flex-wrap': 'wrap' },
      '.flex-wrap-wrap-reverse': { 'flex-wrap': 'wrap-reverse' },
      '.flex-wrap-nowrap': { 'flex-wrap': 'nowrap' },
    })
  },

  placeContent: ({ addUtilities }) => {
    addUtilities({
      '.place-content-center': { 'place-content': 'center' },
      '.place-content-start': { 'place-content': 'start' },
      '.place-content-end': { 'place-content': 'end' },
      '.place-content-space-between': { 'place-content': 'space-between' },
      '.place-content-space-around': { 'place-content': 'space-around' },
      '.place-content-space-evenly': { 'place-content': 'space-evenly' },
      '.place-content-baseline': { 'place-content': 'baseline' },
      '.place-content-stretch': { 'place-content': 'stretch' },
    })
  },

  alignContent: ({ addUtilities }) => {
    addUtilities({
      '.align-content-normal': { 'align-content': 'normal' },
      '.align-content-center': { 'align-content': 'center' },
      '.align-content-start': { 'align-content': 'start' },
      '.align-content-end': { 'align-content': 'end' },
      '.align-content-space-between': { 'align-content': 'space-between' },
      '.align-content-space-around': { 'align-content': 'space-around' },
      '.align-content-space-evenly': { 'align-content': 'space-evenly' },
      '.align-content-baseline': { 'align-content': 'baseline' },
      '.align-content-stretch': { 'align-content': 'stretch' },
    })
  },

  alignItems: ({ addUtilities }) => {
    addUtilities({
      '.align-items-flex-start': { 'align-items': 'flex-start' },
      '.align-items-flex-end': { 'align-items': 'flex-end' },
      '.align-items-center': { 'align-items': 'center' },
      '.align-items-baseline': { 'align-items': 'baseline' },
      '.align-items-stretch': { 'align-items': 'stretch' },
    })
  },

  justifyContent: ({ addUtilities }) => {
    addUtilities({
      '.justify-content-normal': { 'justify-content': 'normal' },
      '.justify-content-flex-start': { 'justify-content': 'flex-start' },
      '.justify-content-flex-end': { 'justify-content': 'flex-end' },
      '.justify-content-center': { 'justify-content': 'center' },
      '.justify-content-space-between': { 'justify-content': 'space-between' },
      '.justify-content-space-around': { 'justify-content': 'space-around' },
      '.justify-content-space-evenly': { 'justify-content': 'space-evenly' },
      '.justify-content-stretch': { 'justify-content': 'stretch' },
    })
  },

  justifyItems: ({ addUtilities }) => {
    addUtilities({
      '.justify-items-start': { 'justify-items': 'start' },
      '.justify-items-end': { 'justify-items': 'end' },
      '.justify-items-center': { 'justify-items': 'center' },
      '.justify-items-stretch': { 'justify-items': 'stretch' },
    })
  },

  gap: createUtilityPlugin('gap', [
    ['gap', ['gap']],
    [
      ['column-gap', ['columnGap']],
      ['row-gap', ['rowGap']],
    ],
  ]),

  alignSelf: ({ addUtilities }) => {
    addUtilities({
      '.align-self-auto': { 'align-self': 'auto' },
      '.align-self-flex-start': { 'align-self': 'flex-start' },
      '.align-self-flex-end': { 'align-self': 'flex-end' },
      '.align-self-center': { 'align-self': 'center' },
      '.align-self-stretch': { 'align-self': 'stretch' },
      '.align-self-baseline': { 'align-self': 'baseline' },
    })
  },

  overscrollBehavior: ({ addUtilities }) => {
    addUtilities({
      '.overscroll-behavior-auto': { 'overscroll-behavior': 'auto' },
      '.overscroll-behavior-contain': { 'overscroll-behavior': 'contain' },
      '.overscroll-behavior-none': { 'overscroll-behavior': 'none' },
      '.overscroll-behavior-y-auto': { 'overscroll-behavior-y': 'auto' },
      '.overscroll-behavior-y-contain': { 'overscroll-behavior-y': 'contain' },
      '.overscroll-behavior-y-none': { 'overscroll-behavior-y': 'none' },
      '.overscroll-behavior-x-auto': { 'overscroll-behavior-x': 'auto' },
      '.overscroll-behavior-x-contain': { 'overscroll-behavior-x': 'contain' },
      '.overscroll-behavior-x-none': { 'overscroll-behavior-x': 'none' },
    })
  },

  scrollBehavior: ({ addUtilities }) => {
    addUtilities({
      '.scroll-behavior-auto': { 'scroll-behavior': 'auto' },
      '.scroll-behavior-smooth': { 'scroll-behavior': 'smooth' },
    })
  },

  textOverflow: ({ addUtilities }) => {
    addUtilities({
      '.truncate': { overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' },
      '.text-overflow-ellipsis': { 'text-overflow': 'ellipsis' },
      '.text-overflow-clip': { 'text-overflow': 'clip' },
    })
  },

  whitespace: ({ addUtilities }) => {
    addUtilities({
      '.white-space-normal': { 'white-space': 'normal' },
      '.white-space-nowrap': { 'white-space': 'nowrap' },
      '.white-space-pre': { 'white-space': 'pre' },
      '.white-space-pre-line': { 'white-space': 'pre-line' },
      '.white-space-pre-wrap': { 'white-space': 'pre-wrap' },
      '.white-space-break-spaces': { 'white-space': 'break-spaces' },
    })
  },

  textWrap: ({ addUtilities }) => {
    addUtilities({
      '.text-wrap-wrap': { 'text-wrap': 'wrap' },
      '.text-wrap-nowrap': { 'text-wrap': 'nowrap' },
      '.text-wrap-balance': { 'text-wrap': 'balance' },
      '.text-wrap-pretty': { 'text-wrap': 'pretty' },
    })
  },

  wordBreak: ({ addUtilities }) => {
    addUtilities({
      '.break-normal': { 'overflow-wrap': 'normal', 'word-break': 'normal' },
      '.overflow-wrap-normal': { 'overflow-wrap': 'normal' },
      '.overflow-wrap-break-word': { 'overflow-wrap': 'break-word' },
      '.word-break-normal': { 'word-break': 'normal' },
      '.work-break-break-all': { 'word-break': 'break-all' },
      '.work-break-keep-all': { 'word-break': 'keep-all' },
    })
  },

  borderRadius: createUtilityPlugin('borderRadius', [
    ['border-radius', ['border-radius']],
    [
      ['border-start-radius', ['border-start-start-radius', 'border-end-start-radius']],
      ['border-end-radius', ['border-start-end-radius', 'border-end-end-radius']],
      ['border-top-radius', ['border-top-left-radius', 'border-top-right-radius']],
      ['border-right-radius', ['border-top-right-radius', 'border-bottom-right-radius']],
      ['border-bottom-radius', ['border-bottom-right-radius', 'border-bottom-left-radius']],
      ['border-left-radius', ['border-top-left-radius', 'border-bottom-left-radius']],
    ],
    [
      ['border-start-start-radius', ['border-start-start-radius']],
      ['border-start-end-radius', ['border-start-end-radius']],
      ['border-end-end-radius', ['border-end-end-radius']],
      ['border-end-start-radius', ['border-end-start-radius']],
      ['border-top-left-radius', ['border-top-left-radius']],
      ['border-top-right-radius', ['border-top-right-radius']],
      ['border-bottom-right-radius', ['border-bottom-right-radius']],
      ['border-bottom-left-radius', ['border-bottom-left-radius']],
    ],
  ]),

  borderWidth: createUtilityPlugin(
    'borderWidth',
    [
      ['border-width', [['@defaults border-width', {}], 'border-width']],
      [
        [
          'border-x-width',
          [['@defaults border-width', {}], 'border-left-width', 'border-right-width'],
        ],
        [
          'border-y-width',
          [['@defaults border-width', {}], 'border-top-width', 'border-bottom-width'],
        ],
      ],
      [
        [
          'border-inline-start-width',
          [['@defaults border-width', {}], 'border-inline-start-width'],
        ],
        ['border-inline-end-width', [['@defaults border-width', {}], 'border-inline-end-width']],
        ['border-top-width', [['@defaults border-width', {}], 'border-top-width']],
        ['border-right-width', [['@defaults border-width', {}], 'border-right-width']],
        ['border-bottom-width', [['@defaults border-width', {}], 'border-bottom-width']],
        ['border-left-width', [['@defaults border-width', {}], 'border-left-width']],
      ],
    ],
    { type: ['line-width', 'length'] }
  ),

  borderStyle: ({ addUtilities }) => {
    addUtilities({
      '.border-style-solid': { 'border-style': 'solid' },
      '.border-style-dashed': { 'border-style': 'dashed' },
      '.border-style-dotted': { 'border-style': 'dotted' },
      '.border-style-double': { 'border-style': 'double' },
      '.border-style-hidden': { 'border-style': 'hidden' },
      '.border-style-none': { 'border-style': 'none' },
    })
  },

  borderColor: ({ matchUtilities, theme, corePlugins }) => {
    matchUtilities(
      {
        'border-color': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-color': toColorValue(value),
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'border-color',
            variable: '--tw-border-opacity',
          })
        },
      },
      {
        values: (({ DEFAULT: _, ...colors }) => colors)(flattenColorPalette(theme('borderColor'))),
        type: ['color', 'any'],
      }
    )

    matchUtilities(
      {
        'border-x-color': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-left-color': toColorValue(value),
              'border-right-color': toColorValue(value),
            }
          }

          return withAlphaVariable({
            color: value,
            property: ['border-left-color', 'border-right-color'],
            variable: '--tw-border-opacity',
          })
        },
        'border-y-color': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-top-color': toColorValue(value),
              'border-bottom-color': toColorValue(value),
            }
          }

          return withAlphaVariable({
            color: value,
            property: ['border-top-color', 'border-bottom-color'],
            variable: '--tw-border-opacity',
          })
        },
      },
      {
        values: (({ DEFAULT: _, ...colors }) => colors)(flattenColorPalette(theme('borderColor'))),
        type: ['color', 'any'],
      }
    )

    matchUtilities(
      {
        'border-inline-start-color': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-inline-start-color': toColorValue(value),
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'border-inline-start-color',
            variable: '--tw-border-opacity',
          })
        },
        'border-inline-end-color': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-inline-end-color': toColorValue(value),
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'border-inline-end-color',
            variable: '--tw-border-opacity',
          })
        },
        'border-top-color': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-top-color': toColorValue(value),
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'border-top-color',
            variable: '--tw-border-opacity',
          })
        },
        'border-right-color': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-right-color': toColorValue(value),
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'border-right-color',
            variable: '--tw-border-opacity',
          })
        },
        'border-bottom-color': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-bottom-color': toColorValue(value),
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'border-bottom-color',
            variable: '--tw-border-opacity',
          })
        },
        'border-left-color': (value) => {
          if (!corePlugins('borderOpacity')) {
            return {
              'border-left-color': toColorValue(value),
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'border-left-color',
            variable: '--tw-border-opacity',
          })
        },
      },
      {
        values: (({ DEFAULT: _, ...colors }) => colors)(flattenColorPalette(theme('borderColor'))),
        type: ['color', 'any'],
      }
    )
  },

  backgroundColor: ({ matchUtilities, theme, corePlugins }) => {
    matchUtilities(
      {
        'background-color': (value) => {
          if (!corePlugins('backgroundOpacity')) {
            return {
              'background-color': toColorValue(value),
            }
          }

          return withAlphaVariable({
            color: value,
            property: 'background-color',
            variable: '--tw-bg-opacity',
          })
        },
      },
      { values: flattenColorPalette(theme('backgroundColor')), type: ['color', 'any'] }
    )
  },

  backgroundImage: createUtilityPlugin(
    'backgroundImage',
    [['background-image', ['background-image']]],
    {
      type: ['lookup', 'image', 'url'],
    }
  ),

  boxDecorationBreak: ({ addUtilities }) => {
    addUtilities({
      '.box-decoration-slice': { 'box-decoration-break': 'slice' },
      '.box-decoration-clone': { 'box-decoration-break': 'clone' },
    })
  },

  backgroundSize: createUtilityPlugin(
    'backgroundSize',
    [['background-size', ['background-size']]],
    {
      type: ['lookup', 'length', 'percentage', 'size'],
    }
  ),

  backgroundAttachment: ({ addUtilities }) => {
    addUtilities({
      '.background-attachment-fixed': { 'background-attachment': 'fixed' },
      '.background-attachment-local': { 'background-attachment': 'local' },
      '.background-attachment-scroll': { 'background-attachment': 'scroll' },
    })
  },

  backgroundClip: ({ addUtilities }) => {
    addUtilities({
      '.background-clip-border-box': { 'background-clip': 'border-box' },
      '.background-clip-padding-box': { 'background-clip': 'padding-box' },
      '.background-clip-content-box': { 'background-clip': 'content-box' },
      '.background-clip-text': { 'background-clip': 'text' },
    })
  },

  backgroundPosition: createUtilityPlugin(
    'backgroundPosition',
    [['background-position', ['background-position']]],
    {
      type: ['lookup', ['position', { preferOnConflict: true }]],
    }
  ),

  backgroundRepeat: ({ addUtilities }) => {
    addUtilities({
      '.background-repeat-repeat': { 'background-repeat': 'repeat' },
      '.background-repeat-no-repeat': { 'background-repeat': 'no-repeat' },
      '.background-repeat-repeat-x': { 'background-repeat': 'repeat-x' },
      '.background-repeat-repeat-y': { 'background-repeat': 'repeat-y' },
      '.background-repeat-round': { 'background-repeat': 'round' },
      '.background-repeat-space': { 'background-repeat': 'space' },
    })
  },

  backgroundOrigin: ({ addUtilities }) => {
    addUtilities({
      '.background-origin-border-box': { 'background-origin': 'border-box' },
      '.background-origin-padding-box': { 'background-origin': 'padding-box' },
      '.background-origin-content-box': { 'background-origin': 'content-box' },
    })
  },

  strokeWidth: createUtilityPlugin('strokeWidth', [['stroke-width', ['stroke-width']]], {
    type: ['length', 'number', 'percentage'],
  }),

  objectFit: ({ addUtilities }) => {
    addUtilities({
      '.object-fit-contain': { 'object-fit': 'contain' },
      '.object-fit-cover': { 'object-fit': 'cover' },
      '.object-fit-fill': { 'object-fit': 'fill' },
      '.object-fit-none': { 'object-fit': 'none' },
      '.object-fit-scale-down': { 'object-fit': 'scale-down' },
    })
  },
  objectPosition: createUtilityPlugin('objectPosition', [['object', ['object-position']]]),

  padding: createUtilityPlugin('padding', [
    ['padding', ['padding']],
    [
      ['padding-x', ['padding-left', 'padding-right']],
      ['padding-y', ['padding-top', 'padding-bottom']],
    ],
    [
      ['padding-inline-start', ['padding-inline-start']],
      ['padding-inline-end', ['padding-inline-end']],
      ['padding-top', ['padding-top']],
      ['padding-right', ['padding-right']],
      ['padding-bottom', ['padding-bottom']],
      ['padding-left', ['padding-left']],
    ],
  ]),

  textAlign: ({ addUtilities }) => {
    addUtilities({
      '.text-align-left': { 'text-align': 'left' },
      '.text-align-center': { 'text-align': 'center' },
      '.text-align-right': { 'text-align': 'right' },
      '.text-align-justify': { 'text-align': 'justify' },
      '.text-align-start': { 'text-align': 'start' },
      '.text-align-end': { 'text-align': 'end' },
    })
  },

  textIndent: createUtilityPlugin('textIndent', [['text-indent', ['text-indent']]], {
    supportsNegativeValues: true,
  }),

  verticalAlign: ({ addUtilities, matchUtilities }) => {
    addUtilities({
      '.vertical-align-baseline': { 'vertical-align': 'baseline' },
      '.vertical-align-top': { 'vertical-align': 'top' },
      '.vertical-align-middle': { 'vertical-align': 'middle' },
      '.vertical-align-bottom': { 'vertical-align': 'bottom' },
      '.vertical-align-text-top': { 'vertical-align': 'text-top' },
      '.vertical-align-text-bottom': { 'vertical-align': 'text-bottom' },
      '.vertical-align-sub': { 'vertical-align': 'sub' },
      '.vertical-align-super': { 'vertical-align': 'super' },
    })

    matchUtilities({ align: (value) => ({ 'vertical-align': value }) })
  },

  fontFamily: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        'font-family': (value) => {
          let [families, options = {}] =
            Array.isArray(value) && isPlainObject(value[1]) ? value : [value]
          let { fontFeatureSettings, fontVariationSettings } = options

          return {
            'font-family': Array.isArray(families) ? families.join(', ') : families,
            ...(fontFeatureSettings === undefined
              ? {}
              : { 'font-feature-settings': fontFeatureSettings }),
            ...(fontVariationSettings === undefined
              ? {}
              : { 'font-variation-settings': fontVariationSettings }),
          }
        },
      },
      {
        values: theme('fontFamily'),
        type: ['lookup', 'generic-name', 'family-name'],
      }
    )
  },

  fontSize: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        'font-size': (value, { modifier }) => {
          let [fontSize, options] = Array.isArray(value) ? value : [value]

          if (modifier) {
            return {
              'font-size': fontSize,
              'line-height': modifier,
            }
          }

          let { lineHeight, letterSpacing, fontWeight } = isPlainObject(options)
            ? options
            : { lineHeight: options }

          return {
            'font-size': fontSize,
            ...(lineHeight === undefined ? {} : { 'line-height': lineHeight }),
            ...(letterSpacing === undefined ? {} : { 'letter-spacing': letterSpacing }),
            ...(fontWeight === undefined ? {} : { 'font-weight': fontWeight }),
          }
        },
      },
      {
        values: theme('fontSize'),
        modifiers: theme('lineHeight'),
        type: ['absolute-size', 'relative-size', 'length', 'percentage'],
      }
    )
  },

  fontWeight: createUtilityPlugin('fontWeight', [['font-weight', ['fontWeight']]], {
    type: ['lookup', 'number', 'any'],
  }),

  textTransform: ({ addUtilities }) => {
    addUtilities({
      '.text-transform-uppercase': { 'text-transform': 'uppercase' },
      '.text-transform-lowercase': { 'text-transform': 'lowercase' },
      '.text-transform-capitalize': { 'text-transform': 'capitalize' },
      '.text-transform-none': { 'text-transform': 'none' },
    })
  },

  fontStyle: ({ addUtilities }) => {
    addUtilities({
      '.font-style-italic': { 'font-style': 'italic' },
      '.font-style-normal': { 'font-style': 'normal' },
    })
  },

  fontVariantNumeric: ({ addDefaults, addUtilities }) => {
    let cssFontVariantNumericValue =
      'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)'

    addDefaults('font-variant-numeric', {
      '--tw-ordinal': ' ',
      '--tw-slashed-zero': ' ',
      '--tw-numeric-figure': ' ',
      '--tw-numeric-spacing': ' ',
      '--tw-numeric-fraction': ' ',
    })

    addUtilities({
      '.font-variant-numeric-normal': { 'font-variant-numeric': 'normal' },
      '.font-variant-numeric-ordinal': {
        '@defaults font-variant-numeric': {},
        '--tw-ordinal': 'ordinal',
        'font-variant-numeric': cssFontVariantNumericValue,
      },
      '.font-variant-numeric-slashed-zero': {
        '@defaults font-variant-numeric': {},
        '--tw-slashed-zero': 'slashed-zero',
        'font-variant-numeric': cssFontVariantNumericValue,
      },
      '.font-variant-numeric-lining-nums': {
        '@defaults font-variant-numeric': {},
        '--tw-numeric-figure': 'lining-nums',
        'font-variant-numeric': cssFontVariantNumericValue,
      },
      '.font-variant-numeric-oldstyle-nums': {
        '@defaults font-variant-numeric': {},
        '--tw-numeric-figure': 'oldstyle-nums',
        'font-variant-numeric': cssFontVariantNumericValue,
      },
      '.font-variant-numeric-proportional-nums': {
        '@defaults font-variant-numeric': {},
        '--tw-numeric-spacing': 'proportional-nums',
        'font-variant-numeric': cssFontVariantNumericValue,
      },
      '.font-variant-numeric-tabular-nums': {
        '@defaults font-variant-numeric': {},
        '--tw-numeric-spacing': 'tabular-nums',
        'font-variant-numeric': cssFontVariantNumericValue,
      },
      '.font-variant-numeric-diagonal-fractions': {
        '@defaults font-variant-numeric': {},
        '--tw-numeric-fraction': 'diagonal-fractions',
        'font-variant-numeric': cssFontVariantNumericValue,
      },
      '.font-variant-numeric-stacked-fractions': {
        '@defaults font-variant-numeric': {},
        '--tw-numeric-fraction': 'stacked-fractions',
        'font-variant-numeric': cssFontVariantNumericValue,
      },
    })
  },

  lineHeight: createUtilityPlugin('lineHeight', [['line-height', ['lineHeight']]]),
  letterSpacing: createUtilityPlugin('letterSpacing', [['letter-spacing', ['letterSpacing']]], {
    supportsNegativeValues: true,
  }),

  textColor: ({ matchUtilities, theme, corePlugins }) => {
    matchUtilities(
      {
        color: (value) => {
          if (!corePlugins('textOpacity')) {
            return { color: toColorValue(value) }
          }

          return withAlphaVariable({
            color: value,
            property: 'color',
            variable: '--tw-text-opacity',
          })
        },
      },
      { values: flattenColorPalette(theme('textColor')), type: ['color', 'any'] }
    )
  },

  textDecoration: ({ addUtilities }) => {
    addUtilities({
      '.text-decoration-line-underline': { 'text-decoration-line': 'underline' },
      '.text-decoration-line-overline': { 'text-decoration-line': 'overline' },
      '.text-decoration-line-line-through': { 'text-decoration-line': 'line-through' },
      '.text-decoration-line-none': { 'text-decoration-line': 'none' },
    })
  },

  textDecorationColor: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        'text-decoration-color': (value) => {
          return { 'text-decoration-color': toColorValue(value) }
        },
      },
      { values: flattenColorPalette(theme('textDecorationColor')), type: ['color', 'any'] }
    )
  },

  textDecorationStyle: ({ addUtilities }) => {
    addUtilities({
      '.text-decoration-solid': { 'text-decoration-style': 'solid' },
      '.text-decoration-double': { 'text-decoration-style': 'double' },
      '.text-decoration-dotted': { 'text-decoration-style': 'dotted' },
      '.text-decoration-dashed': { 'text-decoration-style': 'dashed' },
      '.text-decoration-wavy': { 'text-decoration-style': 'wavy' },
    })
  },

  textDecorationThickness: createUtilityPlugin(
    'textDecorationThickness',
    [['text-decoration-thickness', ['text-decoration-thickness']]],
    { type: ['length', 'percentage'] }
  ),

  textUnderlineOffset: createUtilityPlugin(
    'textUnderlineOffset',
    [['text-underline-offset', ['text-underline-offset']]],
    { type: ['length', 'percentage', 'any'] }
  ),

  fontSmoothing: ({ addUtilities }) => {
    addUtilities({
      '.font-smoothing-antialiased': {
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',
      },
      '.font-smoothing-auto': {
        '-webkit-font-smoothing': 'auto',
        '-moz-osx-font-smoothing': 'auto',
      },
    })
  },

  caretColor: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        'caret-color': (value) => {
          return { 'caret-color': toColorValue(value) }
        },
      },
      { values: flattenColorPalette(theme('caretColor')), type: ['color', 'any'] }
    )
  },

  accentColor: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        'accent-color': (value) => {
          return { 'accent-color': toColorValue(value) }
        },
      },
      { values: flattenColorPalette(theme('accentColor')), type: ['color', 'any'] }
    )
  },

  backgroundBlendMode: ({ addUtilities }) => {
    addUtilities({
      '.background-blend-mode-normal': { 'background-blend-mode': 'normal' },
      '.background-blend-mode-multiply': { 'background-blend-mode': 'multiply' },
      '.background-blend-mode-screen': { 'background-blend-mode': 'screen' },
      '.background-blend-mode-overlay': { 'background-blend-mode': 'overlay' },
      '.background-blend-mode-darken': { 'background-blend-mode': 'darken' },
      '.background-blend-mode-lighten': { 'background-blend-mode': 'lighten' },
      '.background-blend-mode-color-dodge': { 'background-blend-mode': 'color-dodge' },
      '.background-blend-mode-color-burn': { 'background-blend-mode': 'color-burn' },
      '.background-blend-mode-hard-light': { 'background-blend-mode': 'hard-light' },
      '.background-blend-mode-soft-light': { 'background-blend-mode': 'soft-light' },
      '.background-blend-mode-difference': { 'background-blend-mode': 'difference' },
      '.background-blend-mode-exclusion': { 'background-blend-mode': 'exclusion' },
      '.background-blend-mode-hue': { 'background-blend-mode': 'hue' },
      '.background-blend-mode-saturation': { 'background-blend-mode': 'saturation' },
      '.background-blend-mode-color': { 'background-blend-mode': 'color' },
      '.background-blend-mode-luminosity': { 'background-blend-mode': 'luminosity' },
    })
  },

  mixBlendMode: ({ addUtilities }) => {
    addUtilities({
      '.mix-blend-mode-normal': { 'mix-blend-mode': 'normal' },
      '.mix-blend-mode-multiply': { 'mix-blend-mode': 'multiply' },
      '.mix-blend-mode-screen': { 'mix-blend-mode': 'screen' },
      '.mix-blend-mode-overlay': { 'mix-blend-mode': 'overlay' },
      '.mix-blend-mode-darken': { 'mix-blend-mode': 'darken' },
      '.mix-blend-mode-lighten': { 'mix-blend-mode': 'lighten' },
      '.mix-blend-mode-color-dodge': { 'mix-blend-mode': 'color-dodge' },
      '.mix-blend-mode-color-burn': { 'mix-blend-mode': 'color-burn' },
      '.mix-blend-mode-hard-light': { 'mix-blend-mode': 'hard-light' },
      '.mix-blend-mode-soft-light': { 'mix-blend-mode': 'soft-light' },
      '.mix-blend-mode-difference': { 'mix-blend-mode': 'difference' },
      '.mix-blend-mode-exclusion': { 'mix-blend-mode': 'exclusion' },
      '.mix-blend-mode-hue': { 'mix-blend-mode': 'hue' },
      '.mix-blend-mode-saturation': { 'mix-blend-mode': 'saturation' },
      '.mix-blend-mode-color': { 'mix-blend-mode': 'color' },
      '.mix-blend-mode-luminosity': { 'mix-blend-mode': 'luminosity' },
      '.mix-blend-mode-plus-lighter': { 'mix-blend-mode': 'plus-lighter' },
    })
  },

  boxShadow: (() => {
    let transformValue = transformThemeValue('boxShadow')
    let defaultBoxShadow = [
      `var(--tw-ring-offset-shadow, 0 0 #0000)`,
      `var(--tw-ring-shadow, 0 0 #0000)`,
      `var(--tw-shadow)`,
    ].join(', ')

    return function ({ matchUtilities, addDefaults, theme }) {
      addDefaults(' box-shadow', {
        '--tw-ring-offset-shadow': '0 0 #0000',
        '--tw-ring-shadow': '0 0 #0000',
        '--tw-shadow': '0 0 #0000',
        '--tw-shadow-colored': '0 0 #0000',
      })

      matchUtilities(
        {
          'box-shadow': (value) => {
            value = transformValue(value)

            let ast = parseBoxShadowValue(value)
            for (let shadow of ast) {
              // Don't override color if the whole shadow is a variable
              if (!shadow.valid) {
                continue
              }

              shadow.color = 'var(--tw-shadow-color)'
            }

            return {
              '@defaults box-shadow': {},
              '--tw-shadow': value === 'none' ? '0 0 #0000' : value,
              '--tw-shadow-colored': value === 'none' ? '0 0 #0000' : formatBoxShadowValue(ast),
              'box-shadow': defaultBoxShadow,
            }
          },
        },
        { values: theme('boxShadow'), type: ['shadow'] }
      )
    }
  })(),

  boxShadowColor: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        'box-shadow': (value) => {
          return {
            '--tw-shadow-color': toColorValue(value),
            '--tw-shadow': 'var(--tw-shadow-colored)',
          }
        },
      },
      { values: flattenColorPalette(theme('boxShadowColor')), type: ['color', 'any'] }
    )
  },

  outlineStyle: ({ addUtilities }) => {
    addUtilities({
      '.outline-none': {
        outline: '2px solid transparent',
        'outline-offset': '2px',
      },
      '.outline-style-solid': { 'outline-style': 'solid' },
      '.outline-style-dashed': { 'outline-style': 'dashed' },
      '.outline-style-dotted': { 'outline-style': 'dotted' },
      '.outline-style-double': { 'outline-style': 'double' },
    })
  },

  outlineWidth: createUtilityPlugin('outlineWidth', [['outline-width', ['outline-width']]], {
    type: ['length', 'number', 'percentage'],
  }),

  outlineColor: ({ matchUtilities, theme }) => {
    matchUtilities(
      {
        'outline-color': (value) => {
          return { 'outline-color': toColorValue(value) }
        },
      },
      { values: flattenColorPalette(theme('outlineColor')), type: ['color', 'any'] }
    )
  },

  transitionDelay: createUtilityPlugin('transitionDelay', [
    ['transition-delay', ['transitionDelay']],
  ]),
  transitionDuration: createUtilityPlugin(
    'transitionDuration',
    [['transition-duration', ['transitionDuration']]],
    { filterDefault: true }
  ),
  transitionTimingFunction: createUtilityPlugin(
    'transitionTimingFunction',
    [['transition-timing-function', ['transitionTimingFunction']]],
    { filterDefault: true }
  ),
}

module.exports = plugin.withOptions(
  () => {
    return (handler) => {
      Object.keys(plugins).forEach((key) => {
        plugins[key](handler)
      })
    }
  },
  ({ disableCorePlugins } = { disableCorePlugins: true }) => {
    if (disableCorePlugins) {
      return {
        corePlugins: Object.entries(plugins).reduce((acc, [key]) => {
          acc[key] = false
          return acc
        }, {}),
      }
    }
  }
)
