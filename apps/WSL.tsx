import React, { useState, useEffect, useRef } from 'react';
import { FileSystemService, FsNode } from './FileSystem';

type HistoryLine =
  | { type: 'output'; content: string | React.ReactNode }
  | { type: 'prompt'; path: string; command: string };

const Prompt = ({ path, command }: { path: string; command?: string }) => (
  <div className="flex-shrink-0">
    <span className="text-green-400">用户@WebApp-PC</span>
    <span className="text-gray-400">:</span>
    <span className="text-blue-400">{path.replace('/home/user', '~')}</span>
    <span className="text-gray-400">$ </span>
    {command !== undefined && <span>{command}</span>}
  </div>
);

const Output = ({ content }: { content: string | React.ReactNode }) => (
  <div className="whitespace-pre-wrap">{content}</div>
);

const TerminalBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(128,128,128,0.1)" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)"/>
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(128,128,128,0.15)" strokeWidth="1"/>
                </pattern>
                 <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{stopColor:'rgba(123, 31, 162, 0.2)', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'rgba(48, 10, 36, 0)', stopOpacity:1}} />
                </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#grad1)" />
        </svg>
    </div>
);

const manPages: Record<string, string> = {
    'ls': 'ls [选项]... [文件]...\n列出关于[文件]的信息 (默认为当前目录)。\n\n  -a, --all\n      不忽略以 . 开头的条目\n  -l\n      使用长列表格式',
    'cd': 'cd [目录]\n切换Shell的工作目录。\n\n将当前目录切换为[目录]。默认[目录]是HOME环境变量的值。',
    'pwd': 'pwd\n打印当前工作目录的名称。',
    'echo': 'echo [字符串]...\n显示一行文本。\n\n支持基本输出重定向 `>`。\n例如: `echo "你好" > newfile.txt`',
    'cat': 'cat [文件]...\n连接[文件]并打印到标准输出。',
    'mkdir': 'mkdir [目录]...\n创建[目录]，如果它们不存在的话。',
    'touch': 'touch [文件]...\n更改文件时间戳。如果文件不存在，则会创建一个空文件。',
    'rm': 'rm [文件]...\n删除文件或目录。',
    'clear': 'clear\n清空终端屏幕。',
    'sudo': 'sudo <命令>\n以超级用户身份执行命令。',
    'help': 'help\n显示可用命令的列表。',
    'history': 'history\n显示命令历史记录。',
    'man': 'man <命令>\n显示命令的手册页。',
    'grep': 'grep [模式] [文件]\n在[文件]中搜索[模式]。',
    'date': 'date\n显示当前的日期和时间。',
    'webfetch': 'webfetch\n显示一个很酷的系统信息概览。',
};

const WSL = () => {
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: 'output', content: '欢迎来到 Ubuntu 22.04.3 LTS (网页模拟版)' },
    { type: 'output', content: '输入 "help" 查看可用命令列表。' },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [isAwaitingSudoPassword, setIsAwaitingSudoPassword] = useState(false);
  const [sudoCommand, setSudoCommand] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formatDate = (date: Date) => {
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const time = date.toTimeString().slice(0, 5);
    return `${month} ${day.toString().padStart(2, ' ')} ${time}`;
  }

  const formatLsLong = (name: string, node: FsNode): string => {
    const type = node.type === 'dir' ? 'd' : '-';
    const perms = node.permissions;
    const owner = node.owner.padEnd(8);
    const size = node.type === 'file' ? node.content.length.toString().padStart(5) : ''.padStart(5);
    const date = formatDate(node.modifiedAt);
    const coloredName = node.type === 'dir' ? `\x1b[1;34m${name}\x1b[0m` : name; // ANSI color for dir
    return `${type}${perms}  1 ${owner} ${owner} ${size} ${date} ${coloredName}`;
  };

  const executeCommand = (fullCmd: string): string | React.ReactNode | null => {
    let outputTarget: string | null = null;
    let commandToExecute = fullCmd;

    if (fullCmd.includes('>')) {
        const parts = fullCmd.split('>');
        commandToExecute = parts[0].trim();
        outputTarget = parts.slice(1).join('>').trim();
        if(!outputTarget) return `bash: 语法错误, 在 \"newline\" 附近有未预期的符号`;
    }

    const [command, ...args] = commandToExecute.split(/\s+/).filter(Boolean);
    
    const executeAndRedirect = (output: string | null): string | null => {
        if (outputTarget && output !== null && typeof output === 'string') {
            const error = FileSystemService.updateFileContent(currentPath, outputTarget, output + '\n');
            return error;
        }
        return output;
    };
    
    switch (command) {
      case 'help':
        return executeAndRedirect('可用命令:\n  ls, cd, pwd, echo, cat, mkdir, touch, rm, clear, sudo, history, man, grep, date, webfetch, help');
      case 'ls': {
        const showAll = args.includes('-a');
        const longFormat = args.includes('-l');
        const pathArg = args.find(a => !a.startsWith('-')) || '.';
        const targetPath = FileSystemService.resolvePath(currentPath, pathArg);
        const node = FileSystemService.getPathNode(targetPath);

        if (!node || node.type !== 'dir') return `ls: 无法访问 '${pathArg}': 没有那个文件或目录`;
        
        let content = [...node.content];
        if (showAll) content.unshift('.', '..');

        if (longFormat) {
          const detailedList = content.map(item => {
            const itemPath = FileSystemService.resolvePath(targetPath, item);
            const itemNode = FileSystemService.getPathNode(itemPath);
            return itemNode ? formatLsLong(item, itemNode) : null;
          }).filter(Boolean);
          // Simple ANSI to HTML conversion for colored output
          const coloredOutput = detailedList.join('\n').replace(/\x1b\[1;34m(.*?)\x1b\[0m/g, '<span class="text-blue-400">$1</span>');
          return <pre dangerouslySetInnerHTML={{ __html: coloredOutput }} />;
        }
        
        return (
            <div className="flex flex-wrap gap-x-4">
                {content.map(name => {
                    const itemPath = FileSystemService.resolvePath(targetPath, name);
                    const itemNode = FileSystemService.getPathNode(itemPath);
                    const isDir = itemNode?.type === 'dir';
                    return <span key={name} className={isDir ? 'text-blue-400' : 'text-white'}>{name}</span>
                })}
            </div>
        )
      }
      case 'cd':
        const targetPath = args[0] || '/home/user';
        const newPath = FileSystemService.resolvePath(currentPath, targetPath);
        const targetNode = FileSystemService.getPathNode(newPath);
        if (targetNode && targetNode.type === 'dir') {
          setCurrentPath(newPath);
          return null;
        }
        return `bash: cd: ${targetPath}: 没有那个文件或目录`;
      case 'pwd':
        return executeAndRedirect(currentPath);
      case 'echo':
        const echoOutput = args.join(' ');
        return executeAndRedirect(echoOutput);
      case 'cat': {
        if (!args[0]) return '';
        const filePath = FileSystemService.resolvePath(currentPath, args[0]);
        const fileNode = FileSystemService.getPathNode(filePath);
        if(fileNode && fileNode.type === 'file') return executeAndRedirect(fileNode.content);
        if(fileNode && fileNode.type === 'dir') return `cat: ${args[0]}: 是一个目录`;
        return `cat: ${args[0]}: 没有那个文件或目录`;
      }
      case 'mkdir':
        if (!args[0]) return 'mkdir: 缺少操作数';
        return FileSystemService.createDirectory(currentPath, args[0]);
      case 'touch':
        if (!args[0]) return 'touch: 缺少操作数';
        return FileSystemService.createFile(currentPath, args[0]);
      case 'rm':
        if (!args[0]) return 'rm: 缺少操作数';
        return FileSystemService.remove(currentPath, args[0]);
      case 'clear':
        setHistory([]);
        return null;
      case 'history':
        return executeAndRedirect(commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`).join('\n'));
      case 'man':
        if (!args[0]) return '您想要哪个命令的手册？';
        return executeAndRedirect(manPages[args[0]] || `没有 ${args[0]} 的手册条目`);
      case 'grep': {
          if (args.length < 2) return '用法: grep <模式> <文件>';
          const [pattern, fileName] = args;
          const filePath = FileSystemService.resolvePath(currentPath, fileName);
          const fileNode = FileSystemService.getPathNode(filePath);

          if (!fileNode) return `grep: ${fileName}: 没有那个文件或目录`;
          if (fileNode.type === 'dir') return `grep: ${fileName}: 是一个目录`;

          const matchingLines = fileNode.content.split('\n').filter(line => line.includes(pattern));
          return executeAndRedirect(matchingLines.join('\n'));
      }
      case 'date':
        return executeAndRedirect(new Date().toLocaleString('zh-CN'));
      case 'webfetch': {
        const art = `
        WW      WW  EEEEEE  BBBBBB  
        WW      WW  EE      BB   BB 
        WW   W  WW  EEEE    BBBBBB  
        WW  WWW WW  EE      BB   BB 
         WWWWWWWW   EEEEEE  BBBBBB  
        `;
        const info = `
          \x1b[1;32m用户\x1b[0m@\x1b[1;32mWebApp-PC\x1b[0m
          --------------------
          \x1b[1;34m操作系统\x1b[0m: WebTools12 (WSL Sim)
          \x1b[1;34m内核\x1b[0m:     Browser DOM v11
          \x1b[1;34m运行时间\x1b[0m: ${Math.floor(performance.now() / 1000)}s
          \x1b[1;34mShell\x1b[0m:    bash 5.1.16 (sim)
          \x1b[1;34m主题\x1b[0m:     Sci-Fi [Web]
        `;
         const coloredOutput = (art + info).replace(/\x1b\[1;32m(.*?)\x1b\[0m/g, '<span class="text-green-400">$1</span>')
                                           .replace(/\x1b\[1;34m(.*?)\x1b\[0m/g, '<span class="text-blue-400">$1</span>');
        return <pre className="text-purple-400" dangerouslySetInnerHTML={{ __html: coloredOutput }} />;
      }
      case 'whoami':
        return executeAndRedirect('用户');
      case 'apt':
      case 'ping':
      case 'curl':
      case 'wget':
        return '网络不可达。';
      case undefined: // User just pressed enter
        return null;
      default:
        return `bash: 未找到命令: ${command}`;
    }
  };
  
  const handleTabCompletion = () => {
    const parts = currentInput.split(' ');
    const lastPart = parts[parts.length - 1];
    
    const node = FileSystemService.getPathNode(currentPath);
    if (node && node.type === 'dir') {
        const potentialMatches = node.content.filter(item => item.startsWith(lastPart));
        if (potentialMatches.length === 1) {
            const newParts = [...parts.slice(0, -1), potentialMatches[0]];
            setCurrentInput(newParts.join(' ') + ' ');
        } else if (potentialMatches.length > 1) {
            const commonPrefix = potentialMatches.reduce((prefix, current) => {
                while(current.substring(0, prefix.length) !== prefix) {
                    prefix = prefix.substring(0, prefix.length - 1);
                }
                return prefix;
            });

            if (commonPrefix.length > lastPart.length) {
                const newParts = [...parts.slice(0, -1), commonPrefix];
                setCurrentInput(newParts.join(' '));
            } else {
                 setHistory(h => [...h, 
                    { type: 'prompt', path: currentPath, command: currentInput },
                    { type: 'output', content: <div className="flex flex-wrap gap-x-4">{potentialMatches.map(name => <span key={name}>{name}</span>)}</div> }
                ]);
            }
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedInput = currentInput.trim();
      
      if (isAwaitingSudoPassword) {
        setIsAwaitingSudoPassword(false);
        const output = sudoCommand ? executeCommand(sudoCommand) : null;
        setSudoCommand(null);

        let newHistory: HistoryLine[] = [...history, { type: 'prompt', path: currentPath, command: '[sudo] 用户 的密码: ' }];
        if (output) {
          newHistory.push({ type: 'output', content: output });
        }
        setHistory(newHistory);
      } else {
        if (trimmedInput) {
            setCommandHistory(h => [...h, trimmedInput]);
        }
        setCommandHistoryIndex(commandHistory.length + 1);

        if (!trimmedInput) {
          setHistory(h => [...h, { type: 'prompt', path: currentPath, command: '' }]);
        } else {
          const [cmd, ...rest] = trimmedInput.split(/\s+/);
          if (cmd === 'sudo') {
            if (rest.length === 0) {
                setHistory([...history, { type: 'prompt', path: currentPath, command: 'sudo' }, { type: 'output', content: '用法: sudo <命令>' }]);
            } else {
                setHistory(h => [...h, { type: 'prompt', path: currentPath, command: trimmedInput }]);
                setIsAwaitingSudoPassword(true);
                setSudoCommand(rest.join(' '));
            }
          } else {
            const output = executeCommand(trimmedInput);
            let newHistory: HistoryLine[] = [...history, { type: 'prompt', path: currentPath, command: trimmedInput }];
            if (output) {
              newHistory.push({ type: 'output', content: output });
            }
            setHistory(newHistory);
          }
        }
      }
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex = Math.max(0, commandHistoryIndex - 1);
        if (newIndex >= 0 && newIndex < commandHistory.length) {
            setCommandHistoryIndex(newIndex);
            setCurrentInput(commandHistory[newIndex]);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIndex = commandHistoryIndex + 1;
        setCommandHistoryIndex(newIndex);
        if (newIndex >= commandHistory.length) {
             setCurrentInput('');
        } else {
            setCurrentInput(commandHistory[newIndex]);
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        handleTabCompletion();
    }
  };

  return (
    <div 
      className="w-full h-full bg-[#300a24] text-white font-mono text-sm p-2 overflow-y-auto relative"
      onClick={() => inputRef.current?.focus()}
      aria-live="polite"
      aria-atomic="false"
    >
      <TerminalBackground />
      <div className="relative z-10" ref={scrollRef}>
        {history.map((line, index) => (
          line.type === 'prompt' 
            ? <Prompt key={index} path={line.path} command={line.command} />
            : <Output key={index} content={line.content} />
        ))}
        <div className="flex">
          {isAwaitingSudoPassword ? (
            <span className="text-gray-400">[sudo] 用户 的密码:&nbsp;</span>
          ) : (
            <Prompt path={currentPath} />
          )}
          <input
            ref={inputRef}
            type={isAwaitingSudoPassword ? 'password' : 'text'}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-white flex-grow"
            autoFocus
            autoCapitalize="off"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default WSL;
