export const handleBrowse = () => {
  const fileInput = document.getElementById('file-input');
  fileInput.click();
};

export const handleDrop = (e, signal, signalName) => {
  e.preventDefault();
  const tempArray = signal.value?.[signalName] || [];
  const droppedFiles = Array.from(e.dataTransfer.files);
  const filesToUpload = signal.value?.[`${signalName}ToUpload`] || [];
  signal.update({
    [signalName]: tempArray.concat(...droppedFiles),
    [`${signalName}ToUpload`]: filesToUpload.concat(...droppedFiles),
  });
};

export const handleFileSelection = (e, signal, signalName) => {
  const tempArray = signal.value?.[signalName] || [];
  const fileList = Array.from(e.target.files);
  const filesToUpload = signal.value?.[`${signalName}ToUpload`] || [];
  signal.update({
    [signalName]: [...tempArray, ...fileList],
    [`${signalName}ToUpload`]: [...filesToUpload, ...fileList],
  });
};

export const handleRemoveFile = (file, signal, signalName) => {
  const tempDeleteArray = signal.value?.[`${signalName}ToDelete`] || [];
  const tempArray = signal.value?.[signalName] || [];
  const filesToUpload = signal.value?.[`${signalName}ToUpload`] || [];
  const index = tempArray.indexOf(file);
  if (index !== -1) {
    tempArray.splice(index, 1);
  }
  const uploadIndex = filesToUpload.indexOf(file);
  if (uploadIndex !== -1) {
    filesToUpload.splice(uploadIndex, 1);
  }
  if (index !== -1 && file.id) {
    tempDeleteArray.push(file);
  }
  signal.update({
    [signalName]: tempArray,
    [`${signalName}ToUpload`]: filesToUpload,
    [`${signalName}ToDelete`]: tempDeleteArray,
  });
};

export const handleDownloadFile = async (file) => {
  window.open(file.url);
};
