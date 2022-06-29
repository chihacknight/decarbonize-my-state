import React from "react"
import { Button, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "react-bootstrap"

/**
 * A modal that we use to show a two-dimensional array of data. Used so that
 * screen reader users can access the data behind our graphs.
 *
 * Props:
 *
 * @param {Array<Array<number|string>>} chartData
 *   The data to render
 * @param {boolean} show
 *   Whether we shoud be showing the modal
 * @param {function} handleClose
 *   A callback function to close the modal
 */
export default function DataModal({ chartData, show, handleClose }) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

