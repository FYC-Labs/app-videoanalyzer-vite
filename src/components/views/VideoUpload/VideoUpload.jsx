import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ProgressBar, Alert } from 'react-bootstrap';
import { apiClient } from '@src/utils/apiClient';

const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-matroska'];
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export default function VideoUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);

    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      setError('Invalid file type. Please select a video file (MP4, MOV, WebM, AVI, or MKV)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 100MB limit');
      return;
    }

    setSelectedFile(file);

    const videoUrl = URL.createObjectURL(file);
    setVideoPreview(videoUrl);

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const duration = Math.round(video.duration);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;

      setVideoMetadata({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        type: file.type
      });

      URL.revokeObjectURL(videoUrl);
    };
    video.src = videoUrl;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(10);

      const videoId = await apiClient.uploadVideo(selectedFile);

      setUploadProgress(70);

      await apiClient.processVideo(videoId);

      setUploadProgress(100);

      setTimeout(() => {
        navigate(`/processing/${videoId}`);
      }, 500);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload video. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setVideoPreview(null);
    setVideoMetadata(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Upload Video for Analysis</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {!selectedFile && !uploading && (
                <div className="text-center py-5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="video-file-input"
                  />
                  <label htmlFor="video-file-input">
                    <Button
                      as="span"
                      variant="primary"
                      size="lg"
                      className="px-5"
                    >
                      Select Video File
                    </Button>
                  </label>
                  <p className="text-muted mt-3">
                    Supported formats: MP4, MOV, WebM, AVI, MKV<br />
                    Maximum file size: 100MB
                  </p>
                </div>
              )}

              {selectedFile && !uploading && (
                <>
                  <Row className="mb-4">
                    <Col md={6}>
                      {videoPreview && (
                        <video
                          src={videoPreview}
                          controls
                          className="w-100 rounded"
                          style={{ maxHeight: '300px' }}
                        />
                      )}
                    </Col>
                    <Col md={6}>
                      <h5>Video Information</h5>
                      {videoMetadata && (
                        <dl className="row">
                          <dt className="col-sm-4">File Name:</dt>
                          <dd className="col-sm-8 text-truncate">{videoMetadata.name}</dd>

                          <dt className="col-sm-4">File Size:</dt>
                          <dd className="col-sm-8">{videoMetadata.size} MB</dd>

                          <dt className="col-sm-4">Duration:</dt>
                          <dd className="col-sm-8">{videoMetadata.duration}</dd>

                          <dt className="col-sm-4">Format:</dt>
                          <dd className="col-sm-8">{videoMetadata.type}</dd>
                        </dl>
                      )}
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      Upload & Analyze
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="lg"
                      onClick={handleReset}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}

              {uploading && (
                <div className="text-center py-5">
                  <h5 className="mb-3">Uploading Video...</h5>
                  <ProgressBar
                    now={uploadProgress}
                    label={`${uploadProgress}%`}
                    animated
                    className="mb-3"
                    style={{ height: '30px' }}
                  />
                  <p className="text-muted">
                    Please wait while we upload your video and start the analysis
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
