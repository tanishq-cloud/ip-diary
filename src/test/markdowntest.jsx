import React, { useState } from 'react';
import { unified } from 'unified';
import parse from 'remark-parse';

const MarkdownDebugTest = () => {
  const [markdown, setMarkdown] = useState(`# Heading 1
## Heading 2
### Heading 3

This is a **bold text** and this is *italic text*.

Here's a paragraph with **bold** and *italic* mixed together.

- Unordered list item 1
- Unordered list item 2
- Unordered list item 3

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

> This is a blockquote

\`inline code\`

\`\`\`
Block code here
Multiple lines
\`\`\`

Normal paragraph at the end.`);

  const [parsedTree, setParsedTree] = useState(null);

  const parseAndDebug = () => {
    try {
      const tree = unified().use(parse).parse(markdown);
      setParsedTree(tree);
    } catch (error) {
      console.error('Parsing error:', error);
      setParsedTree({ error: error.message });
    }
  };

  const renderTreeNode = (node, depth = 0) => {
    const indent = '  '.repeat(depth);
    
    if (!node) return null;
    
    const nodeInfo = {
      type: node.type,
      ...(node.value && { value: node.value }),
      ...(node.depth && { depth: node.depth }),
      ...(node.ordered !== undefined && { ordered: node.ordered }),
      ...(node.children && { childrenCount: node.children.length })
    };

    return (
      <div key={`${depth}-${node.type}-${Math.random()}`} style={{ fontFamily: 'monospace', fontSize: '12px' }}>
        <div style={{ color: '#0066cc' }}>
          {indent}• {node.type} {JSON.stringify(nodeInfo, null, 0)}
        </div>
        {node.children && node.children.map((child, index) => 
          renderTreeNode(child, depth + 1)
        )}
      </div>
    );
  };

  React.useEffect(() => {
    parseAndDebug();
  }, [markdown]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Markdown Parser Debug Tool</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Input Markdown:</h2>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-96 p-3 border border-gray-300 rounded font-mono text-sm"
            placeholder="Enter your markdown here..."
          />
          <button
            onClick={parseAndDebug}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Re-parse Markdown
          </button>
        </div>

        {/* Parsed Tree Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Parsed AST Tree:</h2>
          <div className="h-96 overflow-auto border border-gray-300 rounded p-3 bg-gray-50">
            {parsedTree && parsedTree.error ? (
              <div className="text-red-600">Error: {parsedTree.error}</div>
            ) : parsedTree ? (
              <div>
                <div className="mb-2 text-sm text-gray-600">
                  Root: {parsedTree.type} (children: {parsedTree.children?.length || 0})
                </div>
                {parsedTree.children?.map((child, index) => 
                  renderTreeNode(child, 0)
                )}
              </div>
            ) : (
              <div className="text-gray-500">Parsing...</div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Quick Analysis:</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-medium mb-2">What to look for:</h3>
          <ul className="text-sm space-y-1">
            <li>• <strong>Bold text</strong> should show as <code>strong</code> nodes</li>
            <li>• <strong>Italic text</strong> should show as <code>emphasis</code> nodes</li>
            <li>• <strong>Lists</strong> should show as <code>list</code> nodes with <code>ordered: true/false</code></li>
            <li>• <strong>Headings</strong> should show as <code>heading</code> nodes with <code>depth</code></li>
            <li>• <strong>Code</strong> should show as <code>code</code> or <code>inlineCode</code> nodes</li>
          </ul>
        </div>
      </div>

      {/* Test Results */}
      <div className="mt-4">
        <h3 className="font-medium mb-2">Test Results:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white border rounded p-2">
            <div className="font-medium">Bold Detection:</div>
            <div className={parsedTree?.children?.some(child => 
              JSON.stringify(child).includes('"type":"strong"')
            ) ? 'text-green-600' : 'text-red-600'}>
              {parsedTree?.children?.some(child => 
                JSON.stringify(child).includes('"type":"strong"')
              ) ? '✓ Working' : '✗ Not Working'}
            </div>
          </div>
          
          <div className="bg-white border rounded p-2">
            <div className="font-medium">Italic Detection:</div>
            <div className={parsedTree?.children?.some(child => 
              JSON.stringify(child).includes('"type":"emphasis"')
            ) ? 'text-green-600' : 'text-red-600'}>
              {parsedTree?.children?.some(child => 
                JSON.stringify(child).includes('"type":"emphasis"')
              ) ? '✓ Working' : '✗ Not Working'}
            </div>
          </div>
          
          <div className="bg-white border rounded p-2">
            <div className="font-medium">Lists Detection:</div>
            <div className={parsedTree?.children?.some(child => 
              child.type === 'list'
            ) ? 'text-green-600' : 'text-red-600'}>
              {parsedTree?.children?.some(child => 
                child.type === 'list'
              ) ? '✓ Working' : '✗ Not Working'}
            </div>
          </div>
          
          <div className="bg-white border rounded p-2">
            <div className="font-medium">Headings Detection:</div>
            <div className={parsedTree?.children?.some(child => 
              child.type === 'heading'
            ) ? 'text-green-600' : 'text-red-600'}>
              {parsedTree?.children?.some(child => 
                child.type === 'heading'
              ) ? '✓ Working' : '✗ Not Working'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownDebugTest;