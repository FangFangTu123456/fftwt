// Simple in-memory file system for the WSL simulation.
// Data is shared across all instances but is reset on page refresh.

interface FileNode {
  type: 'file';
  content: string;
  owner: string;
  permissions: string; // e.g., 'rw-r--r--'
  modifiedAt: Date;
}

interface DirNode {
  type: 'dir';
  content: string[];
  owner: string;
  permissions: string; // e.g., 'rwxr-xr-x'
  modifiedAt: Date;
}

export type FsNode = FileNode | DirNode;

const fileSystem: Record<string, FsNode> = {
  '/': { type: 'dir', content: ['home', 'etc', 'var', 'root'], owner: 'root', permissions: 'rwxr-xr-x', modifiedAt: new Date() },
  '/home': { type: 'dir', content: ['user'], owner: 'root', permissions: 'rwxr-xr-x', modifiedAt: new Date() },
  '/home/user': { type: 'dir', content: ['welcome.txt'], owner: 'user', permissions: 'rwxr-xr-x', modifiedAt: new Date() },
  '/home/user/welcome.txt': { type: 'file', content: '欢迎来到 WebTools12 中的 WSL 模拟环境!\n输入 `help` 来查看所有可用的命令。', owner: 'user', permissions: 'rw-r--r--', modifiedAt: new Date() },
  '/etc': { type: 'dir', content: [], owner: 'root', permissions: 'rwxr-xr-x', modifiedAt: new Date() },
  '/var': { type: 'dir', content: [], owner: 'root', permissions: 'rwxr-xr-x', modifiedAt: new Date() },
  '/root': { type: 'dir', content: [], owner: 'root', permissions: 'rwxr-xr-x', modifiedAt: new Date() },
};

const resolvePath = (currentPath: string, targetPath: string): string => {
    if (!targetPath) return currentPath;

    let pathStack: string[];
    if (targetPath.startsWith('/')) {
        pathStack = []; // Absolute path
    } else {
        pathStack = currentPath === '/' ? [] : currentPath.split('/').filter(p => p);
    }
    
    const targetParts = targetPath.split('/').filter(p => p);

    for (const part of targetParts) {
        if (part === '..') {
            if (pathStack.length > 0) pathStack.pop();
        } else if (part !== '.') {
            pathStack.push(part);
        }
    }
    
    const resolved = '/' + pathStack.join('/');
    return resolved;
}

const getPathNode = (path: string): FsNode | undefined => fileSystem[path];

const createFile = (path: string, name: string): string | null => {
  const fullPath = resolvePath(path, name);
  const parentPath = resolvePath(fullPath, '..');
  const filename = name.split('/').pop();
  
  const parentNode = getPathNode(parentPath)
  if (!parentNode || parentNode.type !== 'dir' || !filename) {
    return `touch: 无法创建 '${name}': 没有那个文件或目录`;
  }
  
  const existingNode = getPathNode(fullPath);
  if (existingNode) {
    if(existingNode.type === 'dir') return `touch: 无法创建 '${name}': 是一个目录`;
    existingNode.modifiedAt = new Date();
    return null;
  }

  fileSystem[fullPath] = { type: 'file', content: '', owner: 'user', permissions: 'rw-r--r--', modifiedAt: new Date() };
  parentNode.content.push(filename);
  parentNode.content.sort();
  return null;
};

const updateFileContent = (currentPath: string, targetFile: string, content: string): string | null => {
    const fullPath = resolvePath(currentPath, targetFile);
    const parentPath = resolvePath(fullPath, '..');
    const filename = targetFile.split('/').pop();
    
    const parentNode = getPathNode(parentPath)
    if (!parentNode || parentNode.type !== 'dir' || !filename) {
        return `bash: ${targetFile}: 没有那个文件或目录`;
    }
    
    const existingNode = getPathNode(fullPath);
    if (existingNode && existingNode.type === 'dir') {
        return `bash: ${targetFile}: 是一个目录`;
    }

    if (existingNode) {
        (existingNode as FileNode).content = content;
        existingNode.modifiedAt = new Date();
    } else {
        fileSystem[fullPath] = { type: 'file', content, owner: 'user', permissions: 'rw-r--r--', modifiedAt: new Date() };
        parentNode.content.push(filename);
        parentNode.content.sort();
    }
    
    return null;
};

const createDirectory = (path: string, name: string): string | null => {
  const fullPath = resolvePath(path, name);
  const parentPath = resolvePath(fullPath, '..');
  const dirname = name.split('/').pop();

  const parentNode = getPathNode(parentPath);
  if (!parentNode || parentNode.type !== 'dir' || !dirname) {
    return `mkdir: 无法创建目录 '${name}': 没有那个文件或目录`;
  }
  if (getPathNode(fullPath)) {
      return `mkdir: 无法创建目录 '${name}': 文件已存在`;
  }
  
  fileSystem[fullPath] = { type: 'dir', content: [], owner: 'user', permissions: 'rwxr-xr-x', modifiedAt: new Date() };
  parentNode.content.push(dirname);
  parentNode.content.sort();
  return null;
};

const remove = (path: string, name: string): string | null => {
    const fullPath = resolvePath(path, name);
    const parentPath = resolvePath(fullPath, '..');
    const node = getPathNode(fullPath);
    const parentNode = getPathNode(parentPath);
    const nodeName = name.split('/').pop();
    
    if (!node || !nodeName) {
        return `rm: 无法删除 '${name}': 没有那个文件或目录`;
    }

    if (node.type === 'dir' && node.content.length > 0) {
        return `rm: 无法删除 '${name}': 目录非空`;
    }

    delete fileSystem[fullPath];
    
    if (parentNode && parentNode.type === 'dir') {
      parentNode.content = parentNode.content.filter(item => item !== nodeName);
    }

    return null;
};

export const FileSystemService = {
  resolvePath,
  getPathNode,
  createFile,
  updateFileContent,
  createDirectory,
  remove,
};