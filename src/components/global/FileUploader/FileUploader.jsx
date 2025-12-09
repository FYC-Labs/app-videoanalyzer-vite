import { Button, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { $form } from '@src/signals';
import { handleBrowse, handleDrop, handleFileSelection, handleRemoveFile } from './_helpers/fileUploader.events';

const FileRow = ({ file, onRemove }) => (
  <div className="d-flex justify-content-between align-items-center">
    <p className="small text-dark-400 text-truncate mb-0 me-8">{file.name}</p>
    <Button
      variant="none"
      className="p-0"
      onClick={() => onRemove(file)}
    >
      <FontAwesomeIcon icon={faXmark} />
    </Button>
  </div>
);

const FileUploader = ({
  name = 'files',
  acceptedTypes,
  signal = $form,
  hideNoFiles,
}) => (
  <Container
    fluid
    onDragOver={e => e.preventDefault()}
    onDrop={e => handleDrop(e, signal, name)}
    className="file-uploader "
  >
    <Row className="p-0 m-0">
      <input
        type="file"
        id="file-input"
        className="d-none"
        onChange={e => handleFileSelection(e, signal, name)}
        multiple
        accept={acceptedTypes}
      />
      <Col className="p-0 m-0 d-flex align-items-center">
        <Button
          variant="grey-400"
          className={`
            ${signal.value?.[name]?.length ? 'mb-16' : ''}
            ${hideNoFiles ? '' : 'me-64'}
            rounded-1 border border-grey-600 text-dark px-16 py-8
          `}
          onClick={handleBrowse}
        >
          Choose File
        </Button>

        {!hideNoFiles && !signal.value?.[name]?.length && (
          <small className="text-dark-300">
            No Files Selected
          </small>
        )}
      </Col>
    </Row>
    {signal.value?.[name]?.map((file, idx) => (
      <FileRow
        file={file}
        idx={idx}
        key={idx}
        onRemove={() => handleRemoveFile(file, signal, name)}
      />
    ))}
  </Container>
);

export default FileUploader;
