import { Card, Col, Placeholder, Row, Table } from 'react-bootstrap';

export default function ProjectsSectionSkelleton() {
  return (
    <Row className="gy-2 gy-lg-3">
      <Col lg={4}>
        <Card style={{ height: 360, overflow: 'hidden' }}>
          <Card.Body>
            <Placeholder as="div" animation="glow" className="mb-2">
              <Placeholder xs={6} style={{ height: 20 }} />
            </Placeholder>
            <div className="d-flex justify-content-center my-2">
              <Placeholder as="div" animation="glow">
                <div style={{ width: 'clamp(110px, 35vw, 150px)', height: 'clamp(110px, 35vw, 150px)', borderRadius: '50%' }} className="bg-body-secondary" />
              </Placeholder>
            </div>
            <Row className="text-center mt-1 py-1 g-2">
              {[...Array(4)].map((_, i) => (
                <Col xs={6} sm={3} key={`metric-skel-${i}`}>
                  <Placeholder as="div" animation="glow" className="mb-1">
                    <Placeholder xs={8} style={{ height: 10 }} />
                  </Placeholder>
                  <Placeholder as="div" animation="glow">
                    <Placeholder xs={10} style={{ height: 14 }} />
                  </Placeholder>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={8}>
        <Card style={{ height: 360, overflow: 'hidden' }}>
          <Card.Body className="h-100 p-3">
            <div style={{ height: '100%', overflowY: 'auto' }}>
            <Placeholder as="div" animation="glow" className="mb-2">
              <Placeholder xs={4} style={{ height: 20 }} />
            </Placeholder>
            {/* Desktop skeleton (tabela) */}
            <div className="d-none d-lg-block">
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
            {/* Mobile skeleton (cards) */}
            <div className="d-lg-none">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={`proj-card-skel-${idx}`} className="border rounded-3 p-3 mb-2 shadow-sm bg-body-tertiary w-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <Placeholder as="div" animation="glow" className="mb-1">
                        <Placeholder xs={8} style={{ height: 14 }} />
                      </Placeholder>
                      <Placeholder as="div" animation="glow">
                        <Placeholder xs={5} style={{ height: 12 }} />
                      </Placeholder>
                    </div>
                    <div className="badge bg-light text-muted">
                      <Placeholder as="span" animation="glow">
                        <Placeholder xs={3} style={{ height: 12 }} />
                      </Placeholder>
                    </div>
                  </div>
                  <Row className="text-center g-2">
                    {[...Array(4)].map((__, j) => (
                      <Col xs={6} key={`proj-card-skel-metric-${idx}-${j}`}>
                        <Placeholder as="div" animation="glow" className="mb-1">
                          <Placeholder xs={6} style={{ height: 10 }} />
                        </Placeholder>
                        <div className="d-flex justify-content-center">
                          <div style={{ width: 42, height: 18 }} className="bg-body-secondary rounded-pill" />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
