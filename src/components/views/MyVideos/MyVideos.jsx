import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Table, Modal } from 'react-bootstrap';
import { apiClient } from '@src/utils/apiClient';

export default function MyVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, videoId: null, filename: null });
  const navigate = useNavigate();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getVideoHistory({ limit: 50 });
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.deleteVideo(deleteModal.videoId);
      setVideos(videos.filter(v => v.id !== deleteModal.videoId));
      setDeleteModal({ show: false, videoId: null, filename: null });
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete video');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      processing: 'primary',
      failed: 'danger',
      pending_upload: 'secondary',
      timeout: 'warning'
    };
    return variants[status] || 'secondary';
  };

  const getScoreBadge = (score) => {
    if (!score) return null;
    const variant = score >= 8 ? 'success' : score >= 5 ? 'warning' : 'danger';
    return <Badge bg={variant}>{score}</Badge>;
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

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>My Videos</h2>
            <Button variant="primary" onClick={() => navigate('/upload')}>
              Upload New Video
            </Button>
          </div>
        </Col>
      </Row>

      {videos.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h4 className="text-muted mb-3">No videos yet</h4>
            <p className="text-muted mb-4">
              Upload your first video to get started with quality analysis
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate('/upload')}>
              Upload Video
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Filename</th>
                <th>Status</th>
                <th>Score</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video.id}>
                  <td className="align-middle">
                    <div className="text-truncate" style={{ maxWidth: '300px' }}>
                      {video.original_filename}
                    </div>
                  </td>
                  <td className="align-middle">
                    <Badge bg={getStatusBadge(video.status)}>
                      {video.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="align-middle">
                    {video.video_analysis && video.video_analysis.length > 0
                      ? getScoreBadge(video.video_analysis[0].final_score)
                      : <span className="text-muted">-</span>
                    }
                  </td>
                  <td className="align-middle">
                    {new Date(video.created_at).toLocaleDateString()}
                  </td>
                  <td className="align-middle">
                    <div className="d-flex gap-2">
                      {video.status === 'completed' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/results/${video.id}`)}
                        >
                          View Results
                        </Button>
                      )}
                      {video.status === 'processing' && (
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => navigate(`/processing/${video.id}`)}
                        >
                          View Progress
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => setDeleteModal({
                          show: true,
                          videoId: video.id,
                          filename: video.original_filename
                        })}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      <Modal
        show={deleteModal.show}
        onHide={() => setDeleteModal({ show: false, videoId: null, filename: null })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{deleteModal.filename}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ show: false, videoId: null, filename: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
