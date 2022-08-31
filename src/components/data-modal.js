import React from "react"
import { Button, Table, Modal } from "react-bootstrap"

/**
 * A modal that we use to show a two-dimensional array of data. Used so that
 * screen reader users can access the data behind our graphs.
 *
 * Props:
 *
 * @param {Array<{ [key: string]: number|string}>} chartData
 *   The data to render
 * @param {Array<{ key: string; title: string }>} headers
 *   The headers to show for the data (e.g. ['Year', 'Emissions'])
 * @param {boolean} show
 *   Whether we shoud be showing the modal
 * @param {string} title
 *   The modal title/the title of the data set
 * @param {function} handleClose
 *   A callback function to close the modal
 */
export default function DataModal({
  chartData,
  headers,
  show,
  title = "Emissions",
  // Output function
  handleClose,
}) {
  return (
    <>
      <Modal show={show} onHide={handleClose} scrollable centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        {/* Make modal body tabbable so keyboard users can scroll it */}
        <Modal.Body
          className="data-modal-body"
          tabIndex="0"
          aria-label="Data Table Section"
        >
          <Table striped bordered>
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <td key={index}>{header.title}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, index) => (
                <tr key={index}>
                  {headers.map((header, index) => (
                    // Show — if no data
                    <td key={index}>{row[header.key] || "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
