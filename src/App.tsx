import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Menu, X, Loader2 } from 'lucide-react';

interface ToolConfig {
  id: string;
  title: string;
  icon: string;
  url: string;
}

export default function App() {
  const [toolsConfig, setToolsConfig] = useState<ToolConfig[]>([]);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 动态加载 public/config.json，实现免编译更新菜单
    fetch('/config.json')
      .then(res => res.json())
      .then(data => {
        setToolsConfig(data);
        if (data.length > 0) {
          setActiveToolId(data[0].id);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('加载配置文件失败:', err);
        setIsLoading(false);
      });
  }, []);

  const activeTool = toolsConfig.find(t => t.id === activeToolId) || toolsConfig[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600 font-medium">加载配置中...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Icons.Baby className="w-6 h-6 text-indigo-600" />
            带娃百宝箱
          </h1>
          <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 4rem - 5rem)' }}>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
            工具列表
          </p>
          <nav className="space-y-1">
            {toolsConfig.map((tool) => {
              const Icon = (Icons as any)[tool.icon] as React.ElementType || Icons.Circle;
              const isActive = activeToolId === tool.id;
              
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveToolId(tool.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  {tool.title}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 flex items-start gap-2">
            <Icons.Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>修改 <code className="bg-gray-200 px-1 rounded text-gray-700">public/config.json</code> 即可添加新工具。</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {activeTool?.title}
            </h2>
          </div>
        </header>

        {/* Iframe Container */}
        <div className="flex-1 relative bg-white">
          {activeTool ? (
            <iframe
              key={activeTool.id}
              src={activeTool.url}
              className="absolute inset-0 w-full h-full border-none"
              title={activeTool.title}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              请选择一个工具
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
