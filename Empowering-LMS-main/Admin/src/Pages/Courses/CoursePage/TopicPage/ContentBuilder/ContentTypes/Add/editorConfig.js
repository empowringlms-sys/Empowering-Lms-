  const handleImageUpload = (blobInfo) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.readAsDataURL(blobInfo.blob());
  });

  const editorConfig = (isDarkMode, disabled, placeholder, height) => {
      return {
          skin: isDarkMode ? 'oxide-dark' : 'oxide',
          content_css: isDarkMode ? 'dark' : 'default',
          menubar: true,
          readonly: disabled,
          placeholder,
          plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'codesample', 'help', 'wordcount',
              'emoticons', 'quickbars', 'pagebreak', 'importcss', 'directionality',
              'template', 'autoresize', 'nonbreaking'
          ],
          toolbar: [
              'undo redo | blocks | fontfamily fontsize | bold italic underline strikethrough',
              'forecolor backcolor | alignleft aligncenter alignright alignjustify',
              'bullist numlist outdent indent | link image media table emoticons',
              'codesample code | removeformat help'
          ].join(' | '),
          toolbar_mode: 'sliding',
          contextmenu: 'link image table',
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
          quickbars_insert_toolbar: 'quicktable quickimage quickcodesample',
          branding: false,
          promotion: false,
          height,
          image_advtab: true,
          image_caption: true,
          images_upload_handler: handleImageUpload,
          automatic_uploads: true,
          paste_data_images: true,
          file_picker_types: 'image media',
          media_live_embeds: true,
          content_style: `
        body {
          color: ${isDarkMode ? '#e2e8f0' : '#1a202c'};
          background-color: ${isDarkMode ? '#1e293b' : '#ffffff'};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.5;
          margin: 1rem;
        }
        h1, h2, h3, h4, h5, h6 {
          color: ${isDarkMode ? '#f8fafc' : '#1a202c'};
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        table td, table th {
          border: 1px solid ${isDarkMode ? '#4a5568' : '#e2e8f0'};
          padding: 0.75rem;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        .mce-content-body:not([dir=rtl])[data-mce-placeholder]:not(.mce-visualblocks)::before {
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
        }
      `,
          font_family_formats: `
        Inter=Inter, sans-serif;
        Arial=Arial, Helvetica, sans-serif;
        Georgia=Georgia, serif;
        Courier New=Courier New, Courier, monospace;
        Times New Roman=Times New Roman, Times, serif
      `,
          font_size_formats: '8px 10px 12px 14px 16px 18px 20px 24px 28px 32px 36px 48px',
          templates: [
              {
                  title: 'Two Column Layout',
                  description: 'Two column content layout',
                  content: `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div><p>Left column content</p></div>
              <div><p>Right column content</p></div>
            </div>
          `
              },
              {
                  title: 'Simple Table',
                  description: 'Basic 2x2 table',
                  content: `
            <table style="width:100%">
              <tr><th>Header 1</th><th>Header 2</th></tr>
              <tr><td>Cell 1</td><td>Cell 2</td></tr>
            </table>
          `
              }
          ],
          codesample_languages: [
              { text: 'HTML/XML', value: 'markup' },
              { text: 'JavaScript', value: 'javascript' },
              { text: 'CSS', value: 'css' },
              { text: 'PHP', value: 'php' },
              { text: 'Python', value: 'python' },
              { text: 'Java', value: 'java' },
              { text: 'C++', value: 'cpp' },
              { text: 'Bash', value: 'bash' },
              { text: 'SQL', value: 'sql' }
          ],
          a11y_advanced_options: true,
          nonbreaking_force_tab: true,
          autoresize_bottom_margin: 20,
          image_class_list: [
              { title: 'None', value: '' },
              { title: 'Rounded', value: 'rounded-lg' },
              { title: 'Bordered', value: 'border border-gray-300' }
          ],
          table_class_list: [
              { title: 'None', value: '' },
              { title: 'Striped', value: 'table-striped' },
              { title: 'Bordered', value: 'table-bordered' }
          ],
          setup: (editor) => {
              editor.on('keydown', (e) => {
                  // Prevent TinyMCE from removing empty paragraphs
                  if (e.key === 'Enter' && editor.selection.getContent() === '') {
                      editor.execCommand('InsertParagraph', false, 'p');
                      e.preventDefault();
                  }
              });
          }
      };
  }



  export default editorConfig 