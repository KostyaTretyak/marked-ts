/**
 * @license
 * 
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 * 
 * Copyright (c) 2018, Костя Третяк. (MIT Licensed)
 * https://github.com/KostyaTretyak/marked-ts
 */

import { MarkedOptions, Align } from './interfaces';
import { escape, unescape } from './helpers';

export class Renderer
{
  private options: MarkedOptions;

  constructor(options: MarkedOptions = <any>{})
  {
    this.options = options;
  }

  code(code: string, lang?: string, escaped?: boolean): string
  {
    if(this.options.highlight)
    {
      const out = this.options.highlight(code, lang);

      if(out != null && out !== code)
      {
        escaped = true;
        code = out;
      }
    }

    if(!lang)
    {
      return '<pre><code>' + (escaped ? code : escape(code, true)) + '\n</code></pre>';
    }

    return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>\n';
  }

  blockquote(quote: string): string
  {
    return '<blockquote>\n' + quote + '</blockquote>\n';
  }

  html(html: string): string
  {
    return html;
  }

  heading(text: string, level: number, raw: string): string
  {
    const id: string = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');

    return `<h id="${id}">${text}</h${level}>\n`;
  }

  hr(): string
  {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
  }

  list(body: string, ordered?: boolean): string
  {
    const type = ordered ? 'ol' : 'ul';

    return `<${type}>\n${body}</${type}>\n'`;
  }

  listitem(text: string): string
  {
    return '<li>' + text + '</li>\n';
  }

  paragraph(text: string): string
  {
    return '<p>' + text + '</p>\n';
  }

  table(header: string, body: string): string
  {
    return `
<table>
  <thead>
    ${header}
  </thead>
  <tbody>
    ${body}
  </tbody>
</table>
`;
  }

  tablerow(content: string): string
  {
    return '<tr>\n' + content + '</tr>\n';
  }

  tablecell(content: string, flags: {header?: boolean, align?: Align}): string
  {
    const type = flags.header ? 'th' : 'td';
    const tag = flags.align
      ? '<' + type + ' style="text-align:' + flags.align + '">'
      : '<' + type + '>';
    return tag + content + '</' + type + '>\n';
  }

  //*** Span level renderer. ***

  strong(text: string): string
  {
    return '<strong>' + text + '</strong>';
  }

  em(text: string): string
  {
    return '<em>' + text + '</em>';
  }

  codespan(text: string): string
  {
    return '<code>' + text + '</code>';
  }

  br(): string
  {
    return this.options.xhtml ? '<br/>' : '<br>';
  }

  del(text: string): string
  {
    return '<del>' + text + '</del>';
  }

  link(href: string, title: string, text: string): string
  {
    if(this.options.sanitize)
    {
      let prot: string;

      try
      {
        prot = decodeURIComponent(unescape(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase();
      }
      catch (e)
      {
        return '';
      }

      if
      (
        prot.indexOf('javascript:') === 0
        || prot.indexOf('vbscript:') === 0
        || prot.indexOf('data:') === 0
      )
      {
        return '';
      }
    }

    let out = '<a href="' + href + '"';

    if(title)
    {
      out += ' title="' + title + '"';
    }

    out += '>' + text + '</a>';

    return out;
  }

  image(href: string, title: string, text: string): string
  {
    let out = '<img src="' + href + '" alt="' + text + '"';

    if(title)
    {
      out += ' title="' + title + '"';
    }

    out += this.options.xhtml ? '/>' : '>';

    return out;
  }

  text(text: string): string
  {
    return text;
  }
}
