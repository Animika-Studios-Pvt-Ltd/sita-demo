// frontend/src/components/Dashboard/admin/pages/forms/nodes/ImageNode.jsx

import { DecoratorNode } from 'lexical';

export class ImageNode extends DecoratorNode {
  __src;
  __altText;
  __width;
  __height;

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__key
    );
  }

  constructor(src, altText, width, height, key) {
    super(key);
    this.__src = src;
    this.__altText = altText || '';
    this.__width = width || 'auto';
    this.__height = height || 'auto';
  }

  createDOM() {
    const div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.margin = '12px 0';
    div.style.maxWidth = '100%';
    return div;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px',
          display: 'block',
        }}
      />
    );
  }

  // ✅ CRITICAL FIX: Don't set fixed width/height
  exportDOM() {
    const img = document.createElement('img');
    img.setAttribute('src', this.__src);
    img.setAttribute('alt', this.__altText);
    
    // ✅ Only set responsive styles, no fixed dimensions
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.margin = '1rem 0';
    img.style.borderRadius = '8px';
    
    img.className = 'lexical-image';
    
    // ✅ Don't apply width/height - let CSS handle it
    
    return { element: img };
  }

  exportJSON() {
    return {
      type: 'image',
      src: this.__src,
      altText: this.__altText,
      width: 'auto',
      height: 'auto',
      version: 1,
    };
  }

  static importJSON(serializedNode) {
    const { src, altText } = serializedNode;
    return $createImageNode({ 
      src, 
      altText, 
      width: 'auto', 
      height: 'auto' 
    });
  }

  static importDOM() {
    return {
      img: () => ({
        conversion: (element) => {
          const src = element.getAttribute('src');
          const alt = element.getAttribute('alt');
          
          if (src) {
            return {
              node: $createImageNode({ 
                src, 
                altText: alt, 
                width: 'auto', 
                height: 'auto' 
              }),
            };
          }
          return null;
        },
        priority: 0,
      }),
    };
  }
}

export function $createImageNode({ src, altText, width, height }) {
  return new ImageNode(src, altText, 'auto', 'auto');
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
