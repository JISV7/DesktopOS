import React, { useState, useRef, useEffect } from 'react';
import { WindowInstance } from '../types/os';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
}

const Terminal: React.FC<{ window: WindowInstance }> = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to DesktopOS Terminal v1.0.0' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [cwd, setCwd] = useState('');

  useEffect(() => {
    async function init() {
      const home = await window.electron.fs.getHomeDir();
      setCwd(home);
    }
    init();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setLines(prev => [...prev, { type: 'input', content: `${cwd} $ ${trimmedCmd}` }]);
    setHistory(prev => [trimmedCmd, ...prev]);
    setHistoryIndex(-1);
    setInput('');

    if (trimmedCmd.toLowerCase() === 'clear') {
      setLines([]);
      return;
    }

    if (trimmedCmd.toLowerCase().startsWith('cd ')) {
      const newPath = trimmedCmd.slice(3).trim();
      // Simple path resolution (could be more robust)
      let resolvedPath = newPath;
      if (newPath === '~') resolvedPath = await window.electron.fs.getHomeDir();
      
      try {
        // Test if directory exists by listing it
        await window.electron.fs.listDir(resolvedPath);
        setCwd(resolvedPath);
      } catch (err) {
        setLines(prev => [...prev, { type: 'error', content: `cd: no such directory: ${newPath}` }]);
      }
      return;
    }

    try {
      const result = await window.electron.shell.execute(trimmedCmd, cwd);
      if (result.stdout) {
        setLines(prev => [...prev, { type: 'output', content: result.stdout }]);
      }
      if (result.stderr) {
        setLines(prev => [...prev, { type: 'error', content: result.stderr }]);
      }
    } catch (err: any) {
      setLines(prev => [...prev, { type: 'error', content: err.message }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className="h-full bg-black/90 text-green-500 font-mono text-sm p-4 overflow-hidden flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-auto mb-2 custom-scrollbar" ref={scrollRef}>
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={line.type === 'error' ? 'text-red-400' : line.type === 'input' ? 'text-white' : ''}
          >
            {line.content}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-blue-400 whitespace-nowrap">{cwd} $</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none text-white"
          autoFocus
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default Terminal;
