import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import remarkBreaks from 'remark-breaks'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material'
import { useMemo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark, atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FaCopy } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you

export default function Markdown(props: {
    children: string
    hiddenCodeCopyButton?: boolean
    className?: string
}) {
    const { children, hiddenCodeCopyButton, className } = props
    return useMemo(() => (
        <ReactMarkdown
            remarkPlugins={
                [remarkGfm, remarkMath, remarkBreaks]
            }
            rehypePlugins={[rehypeKatex]}
            className={`break-words ${className || ''}`}
            components={{
                code: (props: any) => CodeBlock({ ...props, hiddenCodeCopyButton }),
                a: ({ node, ...props }) => (
                    <a
                        {...props}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    />
                ),
            }}
        >
            { children }
        </ReactMarkdown>
    ), [children, className, hiddenCodeCopyButton])
}

export function CodeBlock(props: any) {
    const { t } = useTranslation()
    const theme = useTheme()
    return useMemo(() => {
        const { children, className, node, hiddenCodeCopyButton, ...rest } = props
        const match = /language-(\w+)/.exec(className || '')
        const language = match?.[1] || 'text'
        if (!String(children).includes('\n')) {
            return (
                <code
                    {...rest}
                    className={className}
                    style={{
                        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f1f1f1',
                        padding: '2px 4px',
                        margin: '0 4px',
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? '#444' : '#ddd',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {children}
                </code>
            )
        }
        return (
            <div className="w-full overflow-hidden">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        backgroundColor: 'rgb(50, 50, 50)',
                        fontFamily:
                            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        borderTopLeftRadius: '0.3rem',
                        borderTopRightRadius: '0.3rem',
                        borderBottomLeftRadius: '0',
                        borderBottomRightRadius: '0',
                    }}
                >
                    <span
                        style={{
                            textDecoration: 'none',
                            color: 'gray',
                            padding: '2px',
                            margin: '2px 10px 0 10px',
                        }}
                    >
                        {'<' + language.toUpperCase() + '>'}
                    </span>
                    {
                        !hiddenCodeCopyButton && (
                            <FaCopy
                                style={{
                                    textDecoration: 'none',
                                    color: 'white',
                                    padding: '1px',
                                    margin: '2px 10px 0 10px',
                                    cursor: 'pointer',
                                    opacity: 0.5,
                                }}
                                onClick={() => {
                                    navigator.clipboard.writeText(String(children))
                                    toast.success(t('复制成功'), {
                                        duration: 2000,
                                        position: 'top-center',
                                    })
                                }}
                            />
                        )
                    }
                </div>
                <div className="overflow-x-auto">
                    <SyntaxHighlighter
                        style={theme.palette.mode === 'dark' ? atomDark : a11yDark}
                        language={language}
                        PreTag="div"
                        customStyle={{
                            marginTop: '0',
                            margin: '0',
                            borderTopLeftRadius: '0',
                            borderTopRightRadius: '0',
                            borderBottomLeftRadius: '0.3rem',
                            borderBottomRightRadius: '0.3rem',
                            border: 'none',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                            maxWidth: '100%',
                        }}
                        wrapLines={true}
                        wrapLongLines={true}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            </div>
        )
    }, [props, t, theme.palette.mode])
}
