import React from 'react';
import { useDisclosure } from 'boodoo/react';
import 'boodoo/css';

export function ModalExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="container py-5">
      <button type="button" className="btn btn-primary" onClick={onOpen}>
        <span>Open React Modal</span>
      </button>

      {isOpen && (
        <div className="modal d-block" role="dialog" aria-modal="true" aria-labelledby="rModalTitle">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="rModalTitle"><span>React Disclosure Dialog</span></h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                <p><span>Rendered using Boodoo headless React useDisclosure hook.</span></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}><span>Close</span></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}