import { Button } from 'react-bootstrap';

const AlertModal = ({ notification, onRemoveNotification }) => (
  <div
    className="modal fade show modal-background d-block z-index-10"
    role="dialog"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header bg-danger text-white">
          An Error has occured!
        </div>
        <div className="modal-body">
          {notification.displayMessage}
        </div>
        <div className="modal-footer">
          <Button
            className="btn btn-dark"
            onClick={() => onRemoveNotification(notification.id)}
            type="button"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default AlertModal;
