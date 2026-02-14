import React, { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjsBlocksBasic from 'grapesjs-blocks-basic';
import grapesjsPluginForms from 'grapesjs-plugin-forms';
import grapesjsPresetWebpage from 'grapesjs-preset-webpage';
import { api } from '../../../../utils/api';

const VisualPageBuilder = React.forwardRef(({
  pageId,
  initialHtml = '',
  initialCss = '',
  initialComponents = null,
}, ref) => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!editorRef.current) return;
    const gjs = grapesjs.init({
      container: editorRef.current,
      height: '100vh',
      width: 'auto',
      storageManager: false,
      plugins: [
        grapesjsBlocksBasic,
        grapesjsPluginForms,
        grapesjsPresetWebpage
      ],
      pluginsOpts: {
        'grapesjs-blocks-basic': {},
        'grapesjs-plugin-forms': {},
        'grapesjs-preset-webpage': {
          modalImportTitle: 'Import Template',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
          modalImportContent: function (editor) {
            return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
          },
        }
      },
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
        ],
        scripts: [],
      },
      // ✅ FIXED: Added canvasCss to ensure proper body scrolling
      canvasCss: `
        body { 
          margin: 0; 
          height: auto !important;
          min-height: 100vh;
        }
      `,
      assetManager: {
        upload: false,
        uploadName: 'image',
        multiUpload: true,
        embedAsBase64: false,
        autoAdd: true,
      },
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '',
          },
          {
            name: 'Tablet',
            width: '768px',
            widthMedia: '992px',
          },
          {
            name: 'Mobile',
            width: '320px',
            widthMedia: '480px',
          }
        ]
      },
      blockManager: {
        blocks: [
          {
            id: 'hero-section',
            label: 'Hero Section',
            category: 'Healthcare',
            content: `
              <section class="hero relative h-96 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white">
                <div class="container mx-auto px-4 text-center">
                  <h1 class="text-5xl font-bold mb-4">Welcome to Our Healthcare</h1>
                  <p class="text-xl mb-8">Professional medical care you can trust</p>
                  <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Book Appointment</button>
                </div>
              </section>
            `,
          },
          {
            id: 'doctor-card',
            label: 'Doctor Card',
            category: 'Healthcare',
            content: `
              <div class="doctor-card bg-white rounded-lg shadow-lg p-6 text-center max-w-sm mx-auto">
                <img src="https://via.placeholder.com/150" alt="Doctor" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                <h3 class="text-2xl font-bold mb-2">Dr. John Doe</h3>
                <p class="text-gray-600 mb-2">Cardiologist</p>
                <p class="text-sm text-gray-500 mb-4">15 years of experience</p>
                <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Book Appointment</button>
              </div>
            `,
          },
          {
            id: 'plain-section',
            label: 'Plain Section',
            category: 'Layout',
            content: `
              <section class="py-16 bg-gray-50">
                <div class="container mx-auto px-4">
                  <h2 class="text-4xl font-bold text-center mb-12">Section Title</h2>
                  <div class="text-center text-gray-600">
                    <p>Add your content here</p>
                  </div>
                </div>
              </section>
            `,
          },
          {
            id: 'blank-section',
            label: 'Blank Section',
            category: 'Layout',
            content: `
              <section class="py-16 min-h-[300px] bg-white">
                <div class="container mx-auto px-4">
                  <!-- Drag and drop your content here -->
                </div>
              </section>
            `,
          },
          {
            id: 'services-grid',
            label: 'Services Grid',
            category: 'Healthcare',
            content: `
              <section class="services-section py-16 bg-gray-50">
                <div class="container mx-auto px-4">
                  <h2 class="text-4xl font-bold text-center mb-12">Our Services</h2>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="service-card bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition min-h-[250px] border-2 border-dashed border-gray-300">
                      <div class="text-gray-400 text-sm mb-2">Service 1</div>
                      <div class="text-gray-300">Add content here</div>
                    </div>
                    <div class="service-card bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition min-h-[250px] border-2 border-dashed border-gray-300">
                      <div class="text-gray-400 text-sm mb-2">Service 2</div>
                      <div class="text-gray-300">Add content here</div>
                    </div>
                    <div class="service-card bg-white p-8 rounded-lg shadow-md text-center hover:shadow-xl transition min-h-[250px] border-2 border-dashed border-gray-300">
                      <div class="text-gray-400 text-sm mb-2">Service 3</div>
                      <div class="text-gray-300">Add content here</div>
                    </div>
                  </div>
                </div>
              </section>
            `,
          },
          {
            id: 'testimonial',
            label: 'Testimonial',
            category: 'Healthcare',
            content: `
              <div class="testimonial bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                <div class="flex items-center mb-4">
                  <img src="https://via.placeholder.com/60" alt="Patient" class="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <h4 class="font-bold text-lg">Jane Smith</h4>
                    <div class="text-yellow-500">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p class="text-gray-700 italic">"Excellent service and very professional staff. Highly recommend!"</p>
              </div>
            `,
          },
          {
            id: 'contact-form',
            label: 'Contact Form',
            category: 'Healthcare',
            content: `
              <section class="contact-section py-16">
                <div class="container mx-auto px-4 max-w-2xl">
                  <h2 class="text-4xl font-bold text-center mb-8">Contact Us</h2>
                  <form class="bg-white shadow-lg rounded-lg p-8">
                    <div class="mb-4">
                      <label class="block text-gray-700 font-semibold mb-2">Name</label>
                      <input type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Your name" />
                    </div>
                    <div class="mb-4">
                      <label class="block text-gray-700 font-semibold mb-2">Email</label>
                      <input type="email" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="your@email.com" />
                    </div>
                    <div class="mb-4">
                      <label class="block text-gray-700 font-semibold mb-2">Message</label>
                      <textarea class="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:outline-none focus:border-blue-500" placeholder="Your message"></textarea>
                    </div>
                    <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">Send Message</button>
                  </form>
                </div>
              </section>
            `,
          },
          {
            id: 'image-text-row',
            label: 'Image + Text',
            category: 'Layout',
            content: `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8">
                <div>
                  <img src="https://via.placeholder.com/600x400" alt="Medical" class="rounded-lg shadow-lg w-full" />
                </div>
                <div>
                  <h2 class="text-3xl font-bold mb-4">About Our Practice</h2>
                  <p class="text-gray-700 mb-4">We provide comprehensive healthcare services with a patient-first approach. Our experienced team is dedicated to your wellbeing.</p>
                  <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Learn More</button>
                </div>
              </div>
            `,
          },
          {
            id: '2-columns',
            label: '2 Columns',
            category: 'Layout',
            content: `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div class="bg-white border-2 border-dashed border-gray-300 p-8 rounded-lg min-h-[200px] flex items-center justify-center text-gray-400">
                  Column 1 - Drop content here
                </div>
                <div class="bg-white border-2 border-dashed border-gray-300 p-8 rounded-lg min-h-[200px] flex items-center justify-center text-gray-400">
                  Column 2 - Drop content here
                </div>
              </div>
            `,
          },
          {
            id: '3-columns',
            label: '3 Columns',
            category: 'Layout',
            content: `
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                <div class="bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg min-h-[150px] flex items-center justify-center text-gray-400 text-sm">
                  Column 1
                </div>
                <div class="bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg min-h-[150px] flex items-center justify-center text-gray-400 text-sm">
                  Column 2
                </div>
                <div class="bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg min-h-[150px] flex items-center justify-center text-gray-400 text-sm">
                  Column 3
                </div>
              </div>
            `,
          }
        ]
      },
      styleManager: {
        sectors: [
          {
            name: 'General',
            properties: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom']
          },
          {
            name: 'Dimension',
            open: false,
            properties: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
          },
          {
            name: 'Typography',
            open: false,
            properties: [
              'font-family', 'font-size', 'font-weight', 'letter-spacing',
              'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'
            ],
          },
          {
            name: 'Decorations',
            open: false,
            properties: ['opacity', 'border-radius', 'border', 'box-shadow', 'background'],
          },
        ],
      },
    });
    // Load initial content
    if (initialHtml || initialCss) {
      gjs.setComponents(initialHtml);
      gjs.setStyle(initialCss);
    }
    // Load saved components structure
    if (initialComponents) {
      try {
        const components = typeof initialComponents === 'string'
          ? JSON.parse(initialComponents)
          : initialComponents;
        gjs.setComponents(components);
      } catch (err) {
        console.warn('⚠️ Failed to load components:', err);
      }
    }
    // Add upload button to toolbar
    const panelManager = gjs.Panels;
    panelManager.addButton('options', {
      id: 'upload-image-btn',
      className: 'fa fa-upload',
      command: 'open-image-upload',
      attributes: { title: 'Upload Image' }
    });
    // Upload command
    gjs.Commands.add('open-image-upload', {
      run(editor) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = async (e) => {
          const files = e.target.files;
          for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('image', files[i]);
            try {
              console.log('📤 Uploading:', files[i].name);
              const response = await api.post('/api/cms/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
              if (response.url) {
                console.log('✅ Uploaded:', response.url);
                gjs.AssetManager.add({
                  src: response.url,
                  name: files[i].name,
                  type: 'image',
                  height: response.height || 'auto',
                  width: response.width || 'auto'
                });
              }
            } catch (error) {
              console.error('❌ Upload failed:', error);
              alert(`Upload failed for ${files[i].name}: ${error.message}`);
            }
          }
          gjs.AssetManager.open();
        };
        input.click();
      }
    });
    setEditor(gjs);
    return () => {
      if (gjs) {
        gjs.destroy();
      }
    };
  }, [initialHtml, initialCss, initialComponents]);
  // EXPOSE METHODS TO PARENT via useImperativeHandle
  React.useImperativeHandle(ref, () => ({
    getEditor: () => editor,
    getHtml: () => editor?.getHtml() || '',
    getCss: () => editor?.getCss() || '',
    getComponents: () => editor?.getComponents() || null,
  }));
  return (
    <div
      ref={editorRef}
      className="h-full w-full"
      style={{ minHeight: '100vh' }}
    />
  );
});
VisualPageBuilder.displayName = 'VisualPageBuilder';
export default VisualPageBuilder;