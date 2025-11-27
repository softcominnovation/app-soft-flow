import CardTitle from '@/components/CardTitle';
import IAgendaDevAssistant from '@/types/assistant/IAgendaDevAssistant';
import Link from 'next/link';
import { Card, Col, Row, Table } from 'react-bootstrap';

type Props = {
  projects: IAgendaDevAssistant[];
};

const PrioritizedProducts = ({ projects }: Props) => {
  const totals = projects.reduce(
    (acc, p) => {
      const toNum = (v: string | null | undefined) => parseInt(String(v ?? '0'), 10) || 0;
      const abertos = toNum(p.abertos);
      const corrigidos = toNum(p.corrigidos);
      const retornos = toNum(p.retornos);
      const resolvidos = toNum(p.resolvidos);
      acc.resolvidos += resolvidos;
      acc.total += abertos + corrigidos + retornos + resolvidos;
      return acc;
    },
    { resolvidos: 0, total: 0 }
  );

  return (
    <Card style={{ height: 360, overflowY: 'auto' }}>
      <Card.Body>
        <CardTitle
          containerClass="d-flex align-items-center justify-content-between mb-2"
          title="Projetos"
          menuItems={[]}
        />

        <Card.Header className="bg-light-lighten border-top border-bottom border-light py-1 text-center pb-2">
          <p className="m-0">
            <b>{totals.resolvidos}</b> Casos resolvidos de {totals.total}
          </p>
        </Card.Header>

        {/* Desktop (lg+) - tabela */}
        <div className="d-none d-lg-block">
          <Table responsive hover className="table-centered mb-0">
            <tbody>
              {projects.map((project, index) => (
                <tr key={index}>
                  <td>
                    <h5 className="font-14 my-1">
                      <Link href="" className="text-body">
                        {project.produto} - {project.versao}
                      </Link>
                    </h5>
                  </td>
                  <td className="text-center">
                    <span className="text-muted font-13">Abertos</span> <br />
                    <span className="badge badge-warning-lighten">{project.abertos}</span>
                  </td>
                  <td className="text-center">
                    <span className="text-muted font-13">Corrigidos</span> <br />
                    <span className="badge badge-info-lighten">{project.corrigidos}</span>
                  </td>
                  <td className="text-center">
                    <span className="text-muted font-13">Resolvidos</span> <br />
                    <span className="badge badge-success-lighten">{project.resolvidos}</span>
                  </td>
                  <td className="text-center">
                    <span className="text-muted font-13">Retornos</span> <br />
                    <span className="badge badge-danger-lighten">{project.retornos}</span>
                  </td>
                  <td className="table-action" style={{ width: '90px' }}>
                    <Link href="" className="action-icon">
                      <i className="mdi mdi-pencil"></i>
                    </Link>
                    <Link href="" className="action-icon">
                      <i className="mdi mdi-delete"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Mobile (< lg) - cards compactos, distintos da listagem de casos */}
        <div className="d-lg-none">
          {projects.map((project, index) => (
            <div key={index} className="border rounded-3 p-3 mb-2 shadow-sm bg-body-tertiary w-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <div className="fw-semibold">{project.produto}</div>
                  <div className="text-muted small">Versão {project.versao}</div>
                </div>
                <div className="badge bg-light text-muted">ID {project.id_produto}</div>
              </div>
              <Row className="text-center g-2">
                <Col xs={6}>
                  <div className="text-muted small">Abertos</div>
                  <div><span className="badge badge-warning-lighten">{project.abertos}</span></div>
                </Col>
                <Col xs={6}>
                  <div className="text-muted small">Corrigidos</div>
                  <div><span className="badge badge-info-lighten">{project.corrigidos}</span></div>
                </Col>
                <Col xs={6}>
                  <div className="text-muted small">Resolvidos</div>
                  <div><span className="badge badge-success-lighten">{project.resolvidos}</span></div>
                </Col>
                <Col xs={6}>
                  <div className="text-muted small">Retornos</div>
                  <div><span className="badge badge-danger-lighten">{project.retornos}</span></div>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default PrioritizedProducts;
