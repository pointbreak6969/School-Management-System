"use client";

import { Editor } from '@tinymce/tinymce-react';
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface DocumentViewerProps {
  initialContent: string;
  documentId: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ initialContent, documentId }) => {
  const { data: session } = useSession();
  const [content, setContent] = useState<string>(initialContent);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set initial content when it becomes available
  useEffect(() => {
    if (initialContent && initialContent !== content) {
      setContent(initialContent);
    }
  }, [initialContent]);
  
  // Auto-save changes are not needed for read-only mode, but keeping it for reference
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // In read-only mode, we don't need to save changes
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [content, initialContent, documentId]);
  
  // Not needed for read-only mode, but keeping it for reference
  const saveDocument = async (documentContent: string): Promise<void> => {
    if (!session || isSaving) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      // Use absolute URL when in the browser
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.name || ''}` // Add proper authorization
        },
        body: JSON.stringify({ document: documentContent }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save document');
      }
      
      console.log('Document saved successfully');
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving document:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="p-4 min-h-[500px]">
      <Editor
        apiKey="bymsij3uljgasv6dt4zp6vo90nh1pdeo1pjpakx69osd1dh1"
        value={content}
        init={{
          height: 500,
          menubar: false, // Hide menu bar for read-only view
          plugins: [
            'anchor',".mytextarea", 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists',
            'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
            'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed',
            'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable',
            'advcode', 'editimage', 'advtemplate', 'mentions',
            'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography',
            'inlinecss', 'markdown', 'importword'
          ],
          toolbar: false, // Hide toolbar for read-only view
         
          content_style: `
            body { 
              margin: 0;
              padding: 16px;
              max-width: 100%;
              min-height: 100vh;
            }
            .tox-statusbar__branding {
              display: none !important;
            }
            .tox-statusbar__text-container {
              display: none !important;
            }
            .tox-statusbar__path-item {
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
          statusbar: false,
          branding: false,
          promotion: false,
          // In read-only mode, we don't need click handlers for images
          setup: (editor) => {
            // No click handlers needed for read-only mode
          },
          powerpaste_word_import: 'clean',
          powerpaste_html_import: 'clean',
        }}
        disabled={true} // Adds additional protection to make editor read-only
        onEditorChange={(newContent) => {
          // We shouldn't be able to change content in read-only mode
          // This is just a safeguard
          console.log("Editor content changed (should not happen in read-only mode)");
        }}
      />
      
      {/* No need for save status indicator in read-only mode */}
      <div className="mt-2 text-sm text-gray-500">
        Viewing document in read-only mode
      </div>
    </div>
  );
};

export default DocumentViewer;