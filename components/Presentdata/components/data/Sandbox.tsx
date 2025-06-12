import { Close } from '../../Icons';
import ToolTip from '../utility/ToolTip';
import { createPortal } from 'react-dom';
import { Editor, loader } from '@monaco-editor/react';
import { AnimatePresence, motion } from 'framer-motion';
import Copyright from '@/components/Elements/Copyright';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react'

interface CodeSandboxModalProps {
    open: boolean
    onClose: () => void
    code: string
    fileName: string
    title?: string
    language?: 'javascript' | 'typescript'
    maxHeight?: number
    theme?: 'light' | 'dark'
}

interface ExecutionResult {
    output: string
    error: boolean
    executionTime: number
    timestamp: number
}

interface MessageData {
    type: 'output' | 'error' | 'log'
    log?: string
    error?: string
    executionTime?: number
}

const EXECUTION_TIMEOUT = 5000
const MAX_OUTPUT_LENGTH = 10000

export const CodeSandboxModal = ({
    open,
    onClose,
    code,
    fileName,
    title = 'Interactive Code Sandbox',
    language = 'javascript',
    maxHeight = 400,
    theme = 'dark'
}: CodeSandboxModalProps) => {
    const [userCode, setUserCode] = useState(code)
    const [executionHistory, setExecutionHistory] = useState<ExecutionResult[]>([])
    const [isExecuting, setIsExecuting] = useState(false)
    const [executionId, setExecutionId] = useState(0)
    const TABS = [
        { key: 'result', label: 'Result' },
        { key: 'history', label: 'History' },
    ] satisfies { key: string; label: string }[];

    const [activeTab, setActiveTab] = useState(TABS[0].key);

    const iframeRef = useRef<HTMLIFrameElement>(null)
    const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const mountedRef = useRef(true)

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
            if (executionTimeoutRef.current) {
                clearTimeout(executionTimeoutRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (open) {
            setUserCode(code)
            setExecutionHistory([])
        }
    }, [code, open])

    const sanitizedCode = useMemo(() => {
        if (!userCode || typeof userCode !== 'string') return ''

        return userCode.length > 50000 ? userCode.substring(0, 50000) + '\n// Code truncated...' : userCode
    }, [userCode])

    const handleRun = useCallback(() => {
        if (!mountedRef.current || isExecuting) return

        const iframe = iframeRef.current
        if (!iframe) {
            console.error('CodeSandbox: iframe not available')
            return
        }

        if (!sanitizedCode.trim()) {
            const result: ExecutionResult = {
                output: 'No code to execute',
                error: false,
                executionTime: 0,
                timestamp: Date.now()
            }
            setExecutionHistory(prev => [result, ...prev.slice(0, 20)])
            return
        }

        setIsExecuting(true)
        const currentExecutionId = executionId + 1
        setExecutionId(currentExecutionId)
        const startTime = performance.now()

        if (executionTimeoutRef.current) {
            clearTimeout(executionTimeoutRef.current)
        }

        executionTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current && isExecuting) {
                setIsExecuting(false)
                const result: ExecutionResult = {
                    output: 'Execution timed out after 5 seconds',
                    error: true,
                    executionTime: EXECUTION_TIMEOUT,
                    timestamp: Date.now()
                }
                setExecutionHistory(prev => [result, ...prev.slice(0, 20)])
            }
        }, EXECUTION_TIMEOUT)

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: monospace; margin: 0; padding: 8px; }
    .error { color: #d32f2f; }
    .log { color: #1976d2; }
  </style>
</head>
<body>
<script>
(function() {
  'use strict';
  
  const executionId = ${currentExecutionId};
  const startTime = performance.now();
  const logs = [];
  const errors = [];
  
  // Enhanced logging
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  };
  
  const createLogger = (type, color) => (...args) => {
    const message = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
    
    logs.push({ type, message, timestamp: Date.now() });
    originalConsole[type](...args);
  };
  
  console.log = createLogger('log', '#1976d2');
  console.error = createLogger('error', '#d32f2f');
  console.warn = createLogger('warn', '#f57c00');
  console.info = createLogger('info', '#388e3c');
  
  // Send results to parent
  const sendResult = (output, isError = false) => {
    const executionTime = performance.now() - startTime;
    try {
      parent.postMessage({
        type: isError ? 'error' : 'output',
        log: output,
        executionTime: Math.round(executionTime * 100) / 100,
        executionId: executionId
      }, '*');
    } catch (e) {
      originalConsole.error('Failed to send message to parent:', e);
    }
  };
  
  // Global error handler
  window.onerror = function(message, source, lineno, colno, error) {
    const errorMsg = \`Runtime Error: \${message}\${lineno ? \` (line \${lineno})\` : ''}\`;
    sendResult(errorMsg, true);
    return true;
  };
  
  window.onunhandledrejection = function(event) {
    const errorMsg = \`Unhandled Promise Rejection: \${event.reason}\`;
    sendResult(errorMsg, true);
  };
  
  try {
    // Execute user code in a controlled environment
    const userCode = \`${sanitizedCode.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\$\\{')}\`;
    
    // Create a sandbox function
    const executeCode = new Function(\`
      "use strict";
      \${userCode}
    \`);
    
    const result = executeCode();
    
    // Prepare output
    let output = '';
    if (logs.length > 0) {
      output = logs.map(log => \`[\${log.type.toUpperCase()}] \${log.message}\`).join('\\n');
    }
    
    if (typeof result !== 'undefined') {
      const resultStr = typeof result === 'object' ? 
        JSON.stringify(result, null, 2) : String(result);
      output += (output ? '\\n' : '') + \`Return value: \${resultStr}\`;
    }
    
    if (!output) {
      output = 'Code executed successfully (no output)';
    }
    
    // Truncate if too long
    if (output.length > ${MAX_OUTPUT_LENGTH}) {
      output = output.substring(0, ${MAX_OUTPUT_LENGTH}) + '\\n... (output truncated)';
    }
    
    sendResult(output, false);
    
  } catch (error) {
    let errorMessage = 'Unknown error occurred';
    
    if (error instanceof Error) {
      errorMessage = \`\${error.name}: \${error.message}\`;
      if (error.stack) {
        const stackLines = error.stack.split('\\n').slice(0, 5);
        errorMessage += '\\n' + stackLines.join('\\n');
      }
    } else {
      errorMessage = String(error);
    }
    
    sendResult(errorMessage, true);
  }
})();
</script>
</body>
</html>`

        try {
            iframe.srcdoc = html
        } catch (error) {
            setIsExecuting(false)
            if (executionTimeoutRef.current) {
                clearTimeout(executionTimeoutRef.current)
            }

            const result: ExecutionResult = {
                output: `Failed to execute code: ${error instanceof Error ? error.message : String(error)}`,
                error: true,
                executionTime: 0,
                timestamp: Date.now()
            }
            setExecutionHistory(prev => [result, ...prev.slice(0, 20)])
        }
    }, [sanitizedCode, isExecuting, executionId])

    useEffect(() => {
        const handleMessage = (event: MessageEvent<MessageData>) => {
            if (!mountedRef.current) return

            const { data } = event
            if (!data || typeof data !== 'object') return

            if (executionTimeoutRef.current) {
                clearTimeout(executionTimeoutRef.current)
            }

            setIsExecuting(false)

            if (data.type === 'output' || data.type === 'error') {
                const result: ExecutionResult = {
                    output: data.log || 'No output',
                    error: data.type === 'error',
                    executionTime: data.executionTime || 0,
                    timestamp: Date.now()
                }

                setExecutionHistory(prev => [result, ...prev.slice(0, 20)])
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return

            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault()
                handleRun()
            }

            if (e.key === 'Escape') {
                e.preventDefault()
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, handleRun, onClose])

    const handleReset = useCallback(() => {
        setUserCode(code)
        setExecutionHistory([])
        setIsExecuting(false)
        if (executionTimeoutRef.current) {
            clearTimeout(executionTimeoutRef.current)
        }
    }, [code])

    useEffect(() => {
        loader.init().then((monaco) => {
            monaco.editor.defineTheme('transparent-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                    'editor.background': '#2a2b2c',
                },
            });
        });
    }, []);

    const formatExecutionTime = (time: number) => {
        return time < 1 ? '<1ms' : `${time}ms`
    }

    const latestResult = executionHistory[0]

    if (typeof window === 'undefined') {
        return null
    }

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[200] backdrop-blur-2xl flex items-center justify-center"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                    initial={{
                        backdropFilter: "blur(0px)",
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                    }}
                    animate={{
                        backdropFilter: "blur(20px)",
                        backgroundColor: 'rgba(30, 30, 30, 0.5)',
                    }}
                    exit={{
                        backdropFilter: "blur(0px)",
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    style={{ WebkitBackdropFilter: 'blur(0px)' }}
                >
                    <motion.div
                        className={`w-full p-6 py-4 space-y-4 relative h-full overflow-hidden flex flex-col`}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        {/* modal header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 w-62">
                                <h2 className="text-xl whitespace-nowrap font-semibold font-mono">{fileName}</h2>
                                <span className={`text-xs font-semibold px-3 py-1.5  rounded-full font-mono ${language === 'typescript' ? 'bg-blue-400 text-black' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {language.toUpperCase()}
                                </span>
                                <ToolTip content="Currently: JavaScript (more coming)" className='font-mono' >
                                    <span className='px-2.5 py-1.5 text-xs font-mono border bg-background-code text-foreground-accent border-border rounded-full cursor-pointer'>i</span>
                                </ToolTip>
                            </div>

                            <div className="flex items-center justify-center gap-2 font-mono max-w-62 w-full max-lg:hidden">
                                <div className='max-w-32 w-full flex justify-end'>
                                    <ToolTip content="SUBMIT [Ctrl]+[Enter]">
                                        <button
                                            onClick={handleRun}
                                            disabled={isExecuting}
                                            className="bg-background-tertiary hover:bg-background-code disabled:bg-zinc-400 text-green-500 px-4 py-2 border border-border/40 hover:border-border rounded-md text-sm font-medium transition-colors"
                                        >
                                            Run Code
                                        </button>
                                    </ToolTip>
                                </div>

                                <div className='max-w-32 w-full flex justify-start'>
                                    <button
                                        onClick={handleReset}
                                        disabled={isExecuting}
                                        className="bg-background-tertiary hover:bg-background-code disabled:bg-zinc-400 text-foreground px-4 py-2 border border-border/40 hover:border-border rounded-md text-sm font-medium transition-colors"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 w-62">
                                {isExecuting && (
                                    <div className="flex items-center gap-2 text-sm text-foreground-accent">
                                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        Executing...
                                    </div>
                                )}
                                <ToolTip content="Close" className='font-mono'>
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        aria-label="Close preview"
                                    >
                                        <Close className="text-foreground-accent cursor-pointer hover:text-foreground mix-blend-difference w-6 h-6 z-10 stroke-" />
                                    </button>
                                </ToolTip>
                            </div>
                        </div>

                        <div className="hidden max-lg:flex items-center justify-center gap-2 font-mono w-full">
                                <div className='flex '>
                                    <ToolTip content="SUBMIT [Ctrl]+[Enter]">
                                        <button
                                            onClick={handleRun}
                                            disabled={isExecuting}
                                            className="w-full bg-background-tertiary hover:bg-background-code disabled:bg-zinc-400 text-green-500 px-4 py-2 border border-border/40 hover:border-border rounded-md text-sm font-medium transition-colors"
                                        >
                                            Run Code
                                        </button>
                                    </ToolTip>
                                </div>

                                <div className='flex'>
                                    <button
                                        onClick={handleReset}
                                        disabled={isExecuting}
                                        className="w-full bg-background-tertiary hover:bg-background-code disabled:bg-zinc-400 text-foreground px-4 py-2 border border-border/40 hover:border-border rounded-md text-sm font-medium transition-colors"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                        {/* code editor panel */}
                        <div className="flex-1 min-h-0 grid grid-cols-2 max-lg:grid-cols-1 gap-4">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-2 h-8 font-mono">
                                    <label className="text-sm font-medium uppercase">Code Editor</label>
                                    <div className="text-xs text-foreground-accent">
                                        {sanitizedCode.length} chars
                                    </div>
                                </div>
                                <div className="relative flex-1 ">
                                    <Editor
                                        defaultLanguage="javascript"
                                        value={userCode}
                                        className={`flex-1 font-mono text-sm border-2 border-border rounded-2xl -mx-2 py-4 resize-none focus:outline-none focus:ring-0 focus:border-border-muted bg-background-code text-foreground placeholder:text-foreground-accent`}
                                        onChange={(value) => setUserCode(value || "")}
                                        theme="transparent-dark"
                                        options={{
                                            fontSize: 16,
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            wordWrap: 'on',
                                            tabSize: 2,
                                            scrollbar: {
                                                verticalScrollbarSize: 6,
                                                horizontalScrollbarSize: 6,
                                            },
                                            overviewRulerLanes: 0,
                                            renderLineHighlight: 'none',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* output panel */}
                            <div className="flex flex-col">
                                {/* tab header */}
                                <div className="flex items-center justify-between mb-2 h-8 font-mono">
                                    <div className="flex space-x-2">
                                        {TABS.map((tab) => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key)}
                                                className={`w-fit font-mono font-medium p-1.5 px-2 flex items-center justify-center text-xs border rounded-lg cursor-pointer ${activeTab === tab.key ? "bg-background-tertiary text-foreground border-border/70" : "hover:bg-background-tertiary text-foreground-accent border-transparent "}`}
                                            >
                                                {tab.label} {tab.key === "history" && (executionHistory.length - 1 > 0 ? (executionHistory.length - 1) : 0)}
                                            </button>
                                        ))}
                                    </div>

                                    {activeTab === 'result' && latestResult && (
                                        <div className="text-xs text-foreground-accent">
                                            {formatExecutionTime(latestResult.executionTime)}
                                            {latestResult.error && <span className="text-red-500 ml-2">Error</span>}
                                        </div>
                                    )}
                                </div>

                                {/* tab content */}
                                <div
                                    className={`flex-1 font-mono text-sm border-2 border-border rounded-2xl p-4 resize-none bg-background-code`}
                                    style={{ minHeight: `${Math.min(maxHeight, 300)}px` }}
                                >
                                    {activeTab === 'result' ? (
                                        latestResult ? (
                                            <div className={latestResult.error ? 'text-red-500 font-mono' : 'text-green-500'}>
                                                <pre className="whitespace-pre-wrap break-words">{latestResult.output}</pre>
                                            </div>
                                        ) : (
                                            <div className="text-foreground-accent italic">Click "Run Code" to see output here</div>
                                        )
                                    ) : executionHistory.length > 1 ? (
                                        <div className="space-y-2 max-h-[78vh] overflow-y-auto">
                                            {executionHistory.slice(1).map((result, index) => (
                                                <div key={result.timestamp} className="text-sm border-l-2 border-foreground-accent pl-2">
                                                    <div className="flex justify-between text-foreground-accent">
                                                        <span>Run #{executionHistory.length - index - 1}</span>
                                                        <span>{formatExecutionTime(result.executionTime)}</span>
                                                    </div>
                                                    <div className={`truncate ${result.error ? 'text-red-600' : 'text-foreground-muted'}`}>
                                                        {result.output}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-foreground-accent italic">No previous runs yet</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Copyright className='fixed bottom-2.5 right-6' />

                        {/* for code execution */}
                        <iframe ref={iframeRef} sandbox="allow-scripts" className="hidden" title="PresentDATA Code execution sandbox" />
                    </motion.div>
                </motion.div>
            )
            }
        </AnimatePresence >,
        document.body
    )
}