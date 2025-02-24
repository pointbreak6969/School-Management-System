import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import React from 'react';

const Test = ({setEditorContent}) => {
   
  const editorRef = useRef(null);
  const createImageField = () => {
    editorRef.current?.insertContent(`
      <div class="field-container" style="display: inline-block; margin: 10px 0;">
        <div class="image-field" contenteditable="false"
             style="width: 100px; height: 100px;
                    border: 2px dashed #ccc; margin-bottom: 5px;">
          <div class="upload-prompt"
               style="width: 100%; height: 100%; display: flex;
                      align-items: center; justify-content: center; color: #666;">
            Click to upload image
          </div>
        </div>
        <div class="signature-container" style="width: 150px; text-align: center;">
          <div class="signature-line"></div>
          <p class="signature-text" style="margin: 5px 0 0 0;">Sign here</p>
        </div>
      </div>
    `);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Editor
        apiKey='bymsij3uljgasv6dt4zp6vo90nh1pdeo1pjpakx69osd1dh1'
        onInit={(evt, editor) => {
          editorRef.current = editor;
          editor.on('click', (e) => {
            const clickedEl = e.target ;
            const container = clickedEl.closest('.image-field');
            if (container) {
              const existingImage = container.querySelector('img');
              if (!existingImage) {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (ev) => {
                  const file = (ev.target ).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const img = document.createElement('img');
                      img.src = reader.result;
                      img.alt = "Uploaded Image";
                      img.style.width = "100%";
                      img.style.height = "100%";
                      img.style.objectFit = "contain";
                      container.querySelector('.upload-prompt')?.replaceWith(img);
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
            'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
            'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed',
            'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable',
            'advcode', 'editimage', 'advtemplate', 'mentions',
            'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography',
            'inlinecss', 'markdown', 'importword'
          ],
          draggable_modal: true,
          toolbar: 'undo redo | insertfield | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
            'link image media table mergetags | addcomment showcomments | spellcheckdialog ' +
            'a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | ' +
            'emoticons charmap | removeformat | add_signature | help',
          // Add image upload handler
          images_upload_handler: (blobInfo) =>
            new Promise(resolve => {
              const reader = new FileReader();
              reader.readAsDataURL(blobInfo.blob());
              reader.onload = () => resolve(reader.result );
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
              margin: 10px;
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
              width: 150px;
              text-align: center;
            }
            .signature-line {
              width: 150px;
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