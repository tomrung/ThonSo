import React from 'react';
import { Video, ExternalLink, AlertCircle, CheckCircle2, Info, FileText } from 'lucide-react';

export const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface RichContentRendererProps {
  content: string;
}

// Helper to extract YouTube video ID from various URL formats
export const extractYoutubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split content by YouTube tags or blocks
  // Syntax: [youtube:URL|Caption]
  const youtubeRegex = /\[youtube:([^|\]]+)(?:\|([^\]]+))?\]/g;

  // Render paragraphs, headings, blockquotes, tables and formatting
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = (keyIndex: number) => {
      if (tableRows.length > 0) {
        const header = tableRows[0];
        const bodyRows = tableRows.slice(1).filter((r) => !r.every((c) => c.trim().startsWith('---') || c.trim() === ''));

        elements.push(
          <div key={`table-${keyIndex}`} className="my-4 overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold">
                <tr>
                  {header.map((col, cIdx) => (
                    <th key={cIdx} className="px-3.5 py-2.5">{col.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2.5 text-slate-700">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Check Table Row: | a | b | c |
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        const cells = trimmed.split('|').slice(1, -1);
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable(idx);
      }

      // Check Headings
      if (trimmed.startsWith('# ')) {
        elements.push(
          <h2 key={idx} className="text-lg sm:text-xl font-extrabold text-slate-900 mt-5 mb-2.5 pb-1 border-b border-slate-200">
            {trimmed.replace('# ', '')}
          </h2>
        );
        return;
      }
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-800 mt-4 mb-2">
            {trimmed.replace('## ', '')}
          </h3>
        );
        return;
      }
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4 key={idx} className="text-sm sm:text-base font-bold text-slate-800 mt-3 mb-1.5">
            {trimmed.replace('### ', '')}
          </h4>
        );
        return;
      }

      // Check Blockquote / Callout Box
      if (trimmed.startsWith('> ')) {
        const quoteContent = trimmed.replace('> ', '');
        let isAlert = false;
        let alertBg = 'bg-slate-50 border-slate-300 text-slate-700';

        if (quoteContent.includes('LƯU Ý') || quoteContent.includes('ℹ️')) {
          isAlert = true;
          alertBg = 'bg-blue-50/80 border-blue-300 text-blue-900';
        } else if (quoteContent.includes('CẢNH BÁO') || quoteContent.includes('⚠️')) {
          isAlert = true;
          alertBg = 'bg-amber-50/80 border-amber-300 text-amber-900';
        } else if (quoteContent.includes('CHÍNH SÁCH') || quoteContent.includes('✅')) {
          isAlert = true;
          alertBg = 'bg-emerald-50/80 border-emerald-300 text-emerald-900';
        }

        elements.push(
          <div key={idx} className={`p-3.5 my-2.5 rounded-2xl border-l-4 text-xs font-medium leading-relaxed ${alertBg}`}>
            {parseInlineMarkup(quoteContent)}
          </div>
        );
        return;
      }

      // Check Bullet Lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <li key={idx} className="ml-5 list-disc text-xs sm:text-sm text-slate-700 my-1 leading-relaxed">
            {parseInlineMarkup(trimmed.substring(2))}
          </li>
        );
        return;
      }

      // Check Numbered Lists
      if (/^\d+\.\s/.test(trimmed)) {
        const listText = trimmed.replace(/^\d+\.\s/, '');
        elements.push(
          <li key={idx} className="ml-5 list-decimal text-xs sm:text-sm text-slate-700 my-1 leading-relaxed">
            {parseInlineMarkup(listText)}
          </li>
        );
        return;
      }

      // Check Image Markdown: ![caption](url)
      const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imgMatch) {
        const alt = imgMatch[1];
        const src = imgMatch[2];
        elements.push(
          <div key={idx} className="my-4 space-y-1.5">
            <img 
              src={src} 
              alt={alt} 
              className="w-full max-h-96 object-cover rounded-2xl border border-slate-200 shadow-md" 
            />
            {alt && (
              <p className="text-[11px] text-center text-slate-500 italic font-medium">
                Ảnh: {alt}
              </p>
            )}
          </div>
        );
        return;
      }

      // Normal paragraph
      if (trimmed) {
        elements.push(
          <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-2">
            {parseInlineMarkup(trimmed)}
          </p>
        );
      } else {
        elements.push(<div key={idx} className="h-2" />);
      }
    });

    if (inTable) flushTable(lines.length);

    return elements;
  };

  // Inline markup parser (Bold, Italic, Link, Highlight)
  const parseInlineMarkup = (text: string): React.ReactNode => {
    // Bold: **text**
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Replace Markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    const tokens: Array<{ type: 'text' | 'link'; content: string; url?: string }> = [];

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ type: 'text', content: text.substring(lastIndex, match.index) });
      }
      tokens.push({ type: 'link', content: match[1], url: match[2] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      tokens.push({ type: 'text', content: text.substring(lastIndex) });
    }

    return tokens.map((token, tIdx) => {
      if (token.type === 'link') {
        return (
          <a
            key={tIdx}
            href={token.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-800 underline font-semibold inline-flex items-center gap-0.5"
          >
            <span>{token.content}</span>
            <ExternalLink className="w-3 h-3 inline" />
          </a>
        );
      }

      // Parse bold & italic in text
      const boldParts = token.content.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bp, bpIdx) => {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          return <strong key={bpIdx} className="font-extrabold text-slate-900">{bp.slice(2, -2)}</strong>;
        }
        const italicParts = bp.split(/(\*[^*]+\*)/g);
        return italicParts.map((ip, ipIdx) => {
          if (ip.startsWith('*') && ip.endsWith('*')) {
            return <em key={ipIdx} className="italic text-slate-800">{ip.slice(1, -1)}</em>;
          }
          return ip;
        });
      });
    });
  };

  // Main Split by YouTube Tags
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  let ytMatch: RegExpExecArray | null;

  while ((ytMatch = youtubeRegex.exec(content)) !== null) {
    // Text before YouTube video
    if (ytMatch.index > lastIndex) {
      const textBlock = content.substring(lastIndex, ytMatch.index);
      segments.push(<div key={`text-${lastIndex}`}>{renderFormattedText(textBlock)}</div>);
    }

    const videoUrl = ytMatch[1];
    const caption = ytMatch[2];
    const videoId = extractYoutubeVideoId(videoUrl);

    if (videoId) {
      segments.push(
        <div key={`yt-${ytMatch.index}`} className="my-5 rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 shadow-lg space-y-2">
          {/* Responsive 16:9 aspect ratio container */}
          <div className="relative w-full pb-[56.25%] h-0">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={caption || "Video YouTube bản tin"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {caption && (
            <div className="p-3 bg-slate-900 text-slate-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <YoutubeIcon className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-semibold text-slate-200">{caption}</span>
              </div>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Xem trên YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      );
    }

    lastIndex = ytMatch.index + ytMatch[0].length;
  }

  if (lastIndex < content.length) {
    const textBlock = content.substring(lastIndex);
    segments.push(<div key={`text-end`}>{renderFormattedText(textBlock)}</div>);
  }

  return <div className="space-y-2 font-sans antialiased text-slate-800">{segments}</div>;
};
