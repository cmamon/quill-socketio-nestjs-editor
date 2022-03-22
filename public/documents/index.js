const TOOLBAR_OPTIONS = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean'],
];

const socket = io('http://localhost:3000/documents');

var isDocumentSaved;

/***** functions ****/

const userTextChangeHandler = (delta, oldDelta, source) => {
  if (source !== 'user') {
    return;
  }
  socket.emit('text-change', delta);
  isDocumentSaved = false;
};

const broadcastTextChangeHandler = (delta) => {
  quill.updateContents(delta);
};

/********/

var quill = new Quill('#editor', {
  modules: {
    toolbar: TOOLBAR_OPTIONS,
  },
  theme: 'snow',
});

const documentInfosDiv = document.getElementById('document-infos');
const documentId = documentInfosDiv.getAttribute('data');

quill.disable();
quill.setText('Loading ...');

socket.once('load-document', (document) => {
  quill.setContents(document);
  quill.enable();
});
socket.emit('get-document', documentId);

document.getElementById('editor').addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault();
    socket.emit('save-document', quill.getContents());
    isDocumentSaved = true;
    alert('Document saved.');
    return false;
  }
});

quill.on('text-change', userTextChangeHandler);
socket.on('text-change', broadcastTextChangeHandler);

// quill.off('text-change', textChangeHandler);
