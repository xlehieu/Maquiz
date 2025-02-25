const configEditor = {
    askBeforePasteHTML: false,
    defaultActionOnPaste: 'insert_only_text',
    buttons: ['bold', 'italic', 'fontsize', 'font', 'brush'],
    events: {
        mousewheel: (event) => event.preventDefault(), // Chặn event cuộn
    },
};
export default configEditor;
