import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, ListGroup, Alert } from 'react-bootstrap';
import { apiClient } from '@src/utils/apiClient';

export default function VideoResults() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResults();
  }, [videoId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getResults(videoId);
      setResults(data);
    } catch (err) {
      console.error('Failed to load results:', err);
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'success';
    if (score >= 5) return 'warning';
    return 'danger';
  };

  const getScoreVariant = (score) => {
    if (score >= 8) return 'success';
    if (score >= 5) return 'warning';
    return 'danger';
  };

  const downloadReport = () => {
    const reportData = JSON.stringify(results, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `video-analysis-${videoId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h5>Error Loading Results</h5>
          <p>{error}</p>
          <Button variant="primary" onClick={() => navigate('/my-videos')}>
            View My Videos
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!results) return null;

  const { scores, issues, metadata, filename } = results;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Analysis Results</h2>
              <p className="text-muted mb-0">{filename}</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={() => navigate('/upload')}>
                Analyze Another Video
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/my-videos')}>
                View All Videos
              </Button>
              <Button variant="primary" onClick={downloadReport}>
                Download Report
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={4}>
          <Card className="shadow-sm text-center p-4">
            <h3 className="text-muted mb-2">Overall Quality Score</h3>
            <div
              className={`display-1 fw-bold text-${getScoreColor(scores.final)}`}
              style={{ fontSize: '5rem' }}
            >
              {scores.final}
            </div>
            <div className="mt-2">
              <Badge bg={getScoreVariant(scores.final)} className="fs-5 px-3 py-2">
                {scores.final >= 8 ? 'Excellent' : scores.final >= 5 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
          </Card>
        </Col>

        <Col lg={8}>
          <Row className="g-3">
            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <h5 className="mb-3">Lighting</h5>
                  <h2 className={`text-${getScoreColor(scores.lighting)}`}>{scores.lighting}</h2>
                  <ProgressBar
                    now={(scores.lighting / 10) * 100}
                    variant={getScoreVariant(scores.lighting)}
                    className="mt-2"
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <h5 className="mb-3">Sharpness</h5>
                  <h2 className={`text-${getScoreColor(scores.sharpness)}`}>{scores.sharpness}</h2>
                  <ProgressBar
                    now={(scores.sharpness / 10) * 100}
                    variant={getScoreVariant(scores.sharpness)}
                    className="mt-2"
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <h5 className="mb-3">Framing</h5>
                  <h2 className={`text-${getScoreColor(scores.framing)}`}>{scores.framing}</h2>
                  <ProgressBar
                    now={(scores.framing / 10) * 100}
                    variant={getScoreVariant(scores.framing)}
                    className="mt-2"
                  />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <h5 className="mb-3">Audio</h5>
                  {scores.audio !== null ? (
                    <>
                      <h2 className={`text-${getScoreColor(scores.audio)}`}>{scores.audio}</h2>
                      <ProgressBar
                        now={(scores.audio / 10) * 100}
                        variant={getScoreVariant(scores.audio)}
                        className="mt-2"
                      />
                    </>
                  ) : (
                    <p className="text-muted">No audio detected</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {issues && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header>
                <h4 className="mb-0">Identified Issues</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  {issues.lighting && issues.lighting.length > 0 && (
                    <Col md={6} className="mb-3">
                      <h5>Lighting Issues</h5>
                      <ListGroup>
                        {issues.lighting.map((issue, idx) => (
                          <ListGroup.Item key={idx} variant="warning">
                            {issue}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                  )}

                  {issues.framing && issues.framing.length > 0 && (
                    <Col md={6} className="mb-3">
                      <h5>Framing Issues</h5>
                      <ListGroup>
                        {issues.framing.map((issue, idx) => (
                          <ListGroup.Item key={idx} variant="info">
                            {issue}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                  )}

                  {issues.technical && issues.technical.length > 0 && (
                    <Col md={6} className="mb-3">
                      <h5>Technical Issues</h5>
                      <ListGroup>
                        {issues.technical.map((issue, idx) => (
                          <ListGroup.Item key={idx} variant="danger">
                            {issue}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                  )}

                  {issues.audio && issues.audio.length > 0 && (
                    <Col md={6} className="mb-3">
                      <h5>Audio Issues</h5>
                      <ListGroup>
                        {issues.audio.map((issue, idx) => (
                          <ListGroup.Item key={idx} variant="secondary">
                            {issue}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                  )}

                  {(!issues.lighting || issues.lighting.length === 0) &&
                   (!issues.framing || issues.framing.length === 0) &&
                   (!issues.technical || issues.technical.length === 0) &&
                   (!issues.audio || issues.audio.length === 0) && (
                    <Col>
                      <Alert variant="success">
                        No significant issues detected!
                      </Alert>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {metadata && (
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Header>
                <h4 className="mb-0">Video Metadata</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <strong>Frames Analyzed:</strong>
                    <p>{metadata.frame_count}</p>
                  </Col>
                  <Col md={3}>
                    <strong>Duration:</strong>
                    <p>{metadata.duration ? `${metadata.duration.toFixed(1)}s` : 'N/A'}</p>
                  </Col>
                  <Col md={3}>
                    <strong>Processing Time:</strong>
                    <p>{metadata.processing_time ? `${metadata.processing_time}s` : 'N/A'}</p>
                  </Col>
                  <Col md={3}>
                    <strong>Analyzed:</strong>
                    <p>{new Date(results.created_at).toLocaleDateString()}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
