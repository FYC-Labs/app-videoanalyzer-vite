import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import { apiClient } from '@src/utils/apiClient';

export default function VideoProcessing() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const result = await apiClient.getResults(videoId);

        if (result.status === 'completed') {
          clearInterval(pollInterval);
          navigate(`/results/${videoId}`);
        } else if (result.status === 'failed') {
          clearInterval(pollInterval);
          setError(result.error_message || 'Processing failed');
          setStatus('failed');
        } else if (result.status === 'processing') {
          setProgress(result.progress || 0);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(timeInterval);
    };
  }, [videoId, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusPhase = () => {
    if (progress < 20) return 'Extracting frames...';
    if (progress < 50) return 'Analyzing video quality...';
    if (progress < 80) return 'Analyzing audio...';
    return 'Finalizing results...';
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Processing Video</h3>
            </Card.Header>
            <Card.Body className="p-5">
              {status === 'failed' && error && (
                <Alert variant="danger">
                  <h5>Processing Failed</h5>
                  <p>{error}</p>
                  <Button variant="primary" onClick={() => navigate('/upload')}>
                    Upload Another Video
                  </Button>
                </Alert>
              )}

              {status === 'processing' && (
                <div className="text-center">
                  <Spinner
                    animation="border"
                    variant="primary"
                    style={{ width: '80px', height: '80px' }}
                    className="mb-4"
                  />

                  <h4 className="mb-3">{getStatusPhase()}</h4>

                  <ProgressBar
                    now={progress}
                    label={progress > 0 ? `${progress}%` : ''}
                    animated
                    className="mb-4"
                    style={{ height: '30px' }}
                  />

                  <div className="text-muted mb-3">
                    <p className="mb-2">
                      <strong>Elapsed Time:</strong> {formatTime(elapsedTime)}
                    </p>
                    <p className="mb-0">
                      This may take a few minutes depending on video length.
                      <br />
                      You can safely navigate away - processing will continue.
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-light rounded">
                    <small className="text-muted">
                      <strong>What's happening:</strong><br />
                      We're analyzing your video frame-by-frame using AI to evaluate
                      lighting, sharpness, framing, and audio quality to provide
                      comprehensive quality insights.
                    </small>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
