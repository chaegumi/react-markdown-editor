// @flow
import React, { Component } from 'react'
import Octicon, { getIconByName } from '@githubprimer/octicons-react';
import { insertSymbol, wrapSelectedRangeWithSymbols } from './helpers'
import styles from './Toolbar.module.css'

// get SVG icons https://zurb.com/playground/foundation-icon-fonts-3
import bold from './icons/fi-bold.svg'
import italics from './icons/fi-italic.svg'
import type { MarkdownAction, Range } from './types'

type ToolbarProps = {
  setSelectionRange: Range => void,
  getSelectedRange: () => Range,
  setCaretPosition: (number) => void,
  onChange: any,
  value: string,
}

class Toolbar extends Component<ToolbarProps> {
  insertSymbols = (action: MarkdownAction) => {
    const {
      value,
      onChange,
      setCaretPosition,
      getSelectedRange,
      setSelectionRange,
    } = this.props

    const range = getSelectedRange()
    const { start, end } = range

    if (start === end) {
      const caretPosition = start
      const { text: newValue, added } = insertSymbol(value, caretPosition, action)
      onChange({ target: { value: newValue } })
      setTimeout(() => {
        const newPosition =
          added ? caretPosition + action.prefix.length : caretPosition - action.prefix.length
        setCaretPosition(newPosition)
      })
    } else {
      const { text: newValue, added } = wrapSelectedRangeWithSymbols(value, range, action)
      onChange({ target: { value: newValue } })
      setTimeout(() => {
        const newStart = added ? start + action.prefix.length : start - action.prefix.length
        const newEnd = added ? end + action.prefix.length : end - action.prefix.length
        setSelectionRange({ start: newStart, end: newEnd })
      })
    }
  }

  insertBold = () => {
    this.insertSymbols({ prefix: '**', suffix: '**' })
  }

  insertItalics = () => {
    this.insertSymbols({ prefix: '_', suffix: '_' })
  }

  onClickCommand = (command) => {
    switch(command){
      case 'heading':
        this.insertSymbols({ prefix: '#' })
        break;
      case 'bold':
        this.insertBold()
        break;
      case 'italic':
        this.insertSymbols()
        break;
      case 'quote':

        break;
    }
  }

  render() {
    const commands = [
        {
            command: 'heading',
            icon: 'text-size',
            label: 'Add Header Text',
        },
        {
            command: 'bold',
            icon: 'bold',
            label: 'Bold',
        },
        {
            command: 'italic',
            icon: 'italic',
            label: 'Italic',
        },
        {
            command: 'quote',
            icon: 'quote',
            label: 'Quote',
        },
        {
            command: 'CODE',
            icon: 'code',
            label: 'Monospace',
        },
        {
            command: 'link',
            icon: 'link',
            label: 'Link',
        },
        {
            command: 'ul',
            icon: 'list-unordered',
            label: 'List',
        },
        {
            command: 'ol',
            icon: 'list-ordered',
            label: 'Numbered',
        },
        {
            command: 'tasklist',
            icon: 'tasklist',
            label: '任务',
        },
        {
            command: 'mention',
            icon: 'mention',
            label: '提及',
        },
        {
            command: 'bookmark',
            icon: 'bookmark',
            label: '关联issue或PR',
        },
        {
            command: 'reply',
            icon: 'reply',
            label: '关联回复',
        },
    ];
    return (
      <div>
        {commands.map((itm, idx) => {
            return (
                <div
                    key={itm.command}
                    onClick={this.onClickCommand(itm.command)}
                    className={idx % 3 === 0 ? styles.buttongroup : styles.button}
                >
                    <Octicon title={itm.label} icon={getIconByName(itm.icon)} />
                </div>
            );
        })}
      </div>
    )
  }
}

export default Toolbar
