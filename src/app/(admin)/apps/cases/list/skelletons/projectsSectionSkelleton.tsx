import { Card, Col, Placeholder, Row, Table } from 'react-bootstrap';

export default function ProjectsSectionSkelleton() {
  return (
    <Row className="gy-3">
      <Col lg={4}>
        <Card style={{height: 360}}>
          <Card.Body>
            <Placeholder as="div" animation="glow" className="mb-2">
              <Placeholder xs={6} style={{ height: 20 }} />
            </Placeholder>
            <div className="d-flex justify-content-center my-3">
              <Placeholder as="div" animation="glow">
                <div style={{ width: 150, height: 150, borderRadius: '50%' }} className="bg-body-secondary" />
              </Placeholder>
            </div>
            <Row className="text-center mt-1 py-1">
              {[...Array(4)].map((_, i) => (
                <Col sm={3} key={`metric-skel-${i}`}>
                  <Placeholder as="div" animation="glow" className="mb-1">
                    <Placeholder xs={6} style={{ height: 12 }} />
                  </Placeholder>
                  <Placeholder as="div" animation="glow">
                    <Placeholder xs={8} style={{ height: 16 }} />
                  </Placeholder>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={8}>
        <Card style={{ height: 360, overflowY: 'auto' }}>
          <Card.Body>
            <Placeholder as="div" animation="glow" className="mb-2">
              <Placeholder xs={4} style={{ height: 20 }} />
            </Placeholder>
            <Card.Header className="bg-light-lighten border-top border-bottom border-light py-1 text-center pb-2">
              <Placeholder as="div" animation="glow" className="m-0 d-flex justify-content-center">
                <Placeholder xs={5} style={{ height: 16 }} />
              </Placeholder>
            </Card.Header>
            <div>
              <Table responsive hover className="table-centered mb-0">
                <tbody>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={`proj-row-skel-${idx}`}>
                      <td>
                        <Placeholder as="div" animation="glow">
                          <Placeholder xs={10} style={{ height: 16 }} />
                        </Placeholder>
                      </td>
                      {[...Array(4)].map((__, j) => (
                        <td className="text-center" key={`proj-cell-skel-${idx}-${j}`}>
                          <Placeholder as="div" animation="glow" className="mb-1">
                            <Placeholder xs={6} style={{ height: 10 }} />
                          </Placeholder>
                          <div className="d-flex justify-content-center">
                            <div style={{ width: 42, height: 18 }} className="bg-body-secondary rounded-pill" />
                          </div>
                        </td>
                      ))}
                      <td className="table-action" style={{ width: '90px' }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <div style={{ width: 24, height: 24 }} className="bg-body-secondary rounded-circle" />
                          <div style={{ width: 24, height: 24 }} className="bg-body-secondary rounded-circle" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

