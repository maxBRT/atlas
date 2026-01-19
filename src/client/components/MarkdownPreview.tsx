
import { useEffect, useState } from 'react';
import { marked } from 'marked';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const parsedHtml = marked.parse(content);
    // marked.parse returns a promise in some configurations, but here it should be synchronous
    if (typeof parsedHtml === 'string') {
      setHtml(parsedHtml);
    } else {
        parsedHtml.then(setHtml);
    }
  }, [content]);

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
