import './index.css';

function ConfirmationPopup({ message, onConfirm, onCancel }) {
  return (
    <div className="confirmation-popup">
      <div className="confirmation-popup-content">
        <h3>Are you sure?</h3>
        <hr className="line-cus"></hr>
        <p className="message-cus">{message}</p>
        <hr className="line-cus"></hr>
        <div className="button-container">
          <button
            className="button button-cancel"
            onClick={() => {
              onCancel();
            }}
          >
            Cancel
          </button>
          <button
            className="button button-confirm"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPopup;
