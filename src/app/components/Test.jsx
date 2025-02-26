import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import React from 'react';

const Test = ({setEditorContent, value = ""}) => {
   
  const editorRef = useRef(null);
  const createImageField = () => {
  editorRef.current?.insertContent(`
    <div class="field-container" contenteditable="false" style="
       display: inline-block; 
       width: 150px;
       margin: 10px 4px;
       vertical-align: top;
       resize: both;
       border: 1px dashed #ccc;
       position: relative;
       cursor: move;
       min-height: 150px;
       min-width: 100px;
       max-width: 100%;">
    <div class="image-field" 
       style="width: 100%; height: 100px;
          border: 2px dashed #ccc; margin-bottom: 5px;">
      <div class="upload-prompt"
         style="width: 100%; height: 100%; display: flex;
            align-items: center; justify-content: center; color: #666;">
      Click to upload image
      </div>
    </div>
    <div class="signature-container" style="width: 100%; text-align: center;">
      <div class="signature-line" style="width: 100%; height: 2px; background-color: black; margin: 0 auto;"></div>
      <p class="signature-text" style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Sign here</p>
    </div>
    <div class="resize-handle" style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; cursor: nwse-resize;"></div>
    </div>
  `);
  };

  return (
  <div className="min-h-screen flex flex-col">
    <Editor
    apiKey='bymsij3uljgasv6dt4zp6vo90nh1pdeo1pjpakx69osd1dh1'
    value={value}
    onInit={(evt, editor) => {
      editorRef.current = editor;
      editor.on('click', (e) => {
      const clickedEl = e.target;
      // Look for either the image field or any of its parents up to field-container
      const container = clickedEl.closest('.field-container');
      if (container) {
        const imageField = container.querySelector('.image-field');
        const existingImage = imageField.querySelector('img');
        if (!existingImage) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (ev) => {
          const file = ev.target.files?.[0];
          if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const img = document.createElement('img');
            img.src = reader.result;
            img.alt = "Uploaded Image";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";
            imageField.querySelector('.upload-prompt')?.replaceWith(img);
          };
          reader.readAsDataURL(file);
          }
        };
        input.click();
        }
      }
      });
    }}
    init={{
      height: "100vh",
      width: "100%",
      plugins: [
      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists',
      'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography',
      'inlinecss', 'markdown', 'importword'
      ],
      noneditable_noneditable_class: 'field-container',
      extended_valid_elements: 'div[*]',
      draggable_modal: true,
      toolbar: 'undo redo | insertfield | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
      'link image media table mergetags | addcomment showcomments | spellcheckdialog ' +
      'a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | ' +
      'emoticons charmap | removeformat | help',
      // Add image upload handler
      images_upload_handler: (blobInfo) =>
      new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(blobInfo.blob());
        reader.onload = () => resolve(reader.result);
      }),
      content_css: false,
      content_style: `
      body { 
        margin: 0;
        padding: 16px;
        max-width: 100%;
        min-height: 100vh;
      }
      .tox-statusbar__branding {
        display: none;
      }
      img { 
        display: inline-block !important; 
        max-width: 100%; 
        height: auto;
        vertical-align: middle;
        margin: 2px;
      }
      .field-container {
        display: inline-block;
        vertical-align: top;
        margin: 10px 4px;
        user-select: all;
        -webkit-user-select: all;
        resize: both;
        border: 1px dashed #ccc;
      }
      /* Highlight when selected */
      .field-container:hover {
        border: 1px dashed #0088cc !important;
      }
      .image-field { 
        vertical-align: text-top;
        margin-bottom: 5px;
      }
      figure.image { 
        display: inline-block !important;
        margin: 2px !important;
      }
      .signature-container {
        width: 100%;
        text-align: center;
      }
      .signature-line {
        width: 100%;
        height: 2px;
        background-color: black;
        margin: 0 auto;
      }
      .signature-text {
        font-size: 14px;
        color: #666;
        margin: 5px 0 0 0;
      }
      `,
      setup: (editor) => {
      editor.ui.registry.addButton('insertfield', {
        text: 'Insert Field',
        onAction: createImageField,
      });
      },
      powerpaste_word_import: 'clean',
      powerpaste_html_import: 'clean',
    }}
    onEditorChange={(content) => setEditorContent(content)}
    initialValue=""
    />
  </div>
  );
};

export default Test;