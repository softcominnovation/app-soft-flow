'use client';
import CardTitle from '@/components/CardTitle';
import IAgendaDevAssistant from '@/types/assistant/IAgendaDevAssistant';
import Link from 'next/link';
import { Card, Col, Row, Table, Button } from 'react-bootstrap';
import { useCasesContext } from '@/contexts/casesContext';
import ICaseFilter from '@/types/cases/ICaseFilter';
import Cookies from 'js-cookie';
import { useCallback, useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ProductsDrawer from './ProductsDrawer';

type Props = {
  projects: IAgendaDevAssistant[];
  onOpenDrawer?: () => void;
  showDrawer?: boolean;
  onCloseDrawer?: () => void;
};

type StatusType = 'abertos' | 'corrigidos' | 'resolvidos' | 'retornos';

const mapStatusToId = (status: StatusType): number | number[] | undefined => {
  const statusMap: Record<StatusType, number | number[] | undefined> = {
    abertos: [1, 2],
    corrigidos: 3,
    resolvidos: 9,
    retornos: 4,
  };
  return statusMap[status];
};

const PrioritizedProducts = ({ 
  projects, 
  onOpenDrawer, 
  showDrawer: externalShowDrawer, 
  onCloseDrawer 
}: Props) => {
  const { fetchCases, loading } = useCasesContext();
  const [internalShowDrawer, setInternalShowDrawer] = useState(false);
  
  // Usa controle externo se fornecido, senão usa interno
  const showDrawer = externalShowDrawer !== undefined ? externalShowDrawer : internalShowDrawer;
  const setShowDrawer = externalShowDrawer !== undefined 
    ? (onCloseDrawer || (() => {}))
    : setInternalShowDrawer;

  const handleStatusClick = useCallback(
    (project: IAgendaDevAssistant, status: StatusType) => {
      const statusId = mapStatusToId(status);
      const userId = Cookies.get('user_id');
      const currentUserId = Cookies.get('user_id');

      const filters: ICaseFilter = {
        produto_id: project.id_produto,
        versao_produto: project.versao,
        usuario_dev_id: userId,
        sort_by: 'prioridade',
        ...(statusId && { status_id: statusId }),
      };

    
      try {
        const userChangedManually = sessionStorage.getItem('userFilterChangedManually');
        if (!userChangedManually && userId === currentUserId) {
          const savedData = {
            produto_id: project.id_produto,
            versao_produto: project.versao,
            status_id: statusId,
            usuario_dev_id: userId,
          };
          localStorage.setItem('lastSelectedProduct', JSON.stringify(savedData));
        }
      } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
      }

      fetchCases(filters);
    },
    [fetchCases]
  );
  return (
    <>
      <Card style={{ height: 411, overflowY: 'auto', maxHeight: 411 }} className="d-none d-lg-block">
        <Card.Body>
          <CardTitle
            containerClass="d-flex align-items-center justify-content-between mb-2"
            title="Produtos"
          />

        {/* Desktop (lg+) - tabela */}
        <div className="d-none d-lg-block">
          <Table responsive hover className="table-centered mb-0">
            <thead>
              <tr>
                <th>Produto</th>
                <th className="text-center">Abertos</th>
                <th className="text-center">Corrigidos</th>
                <th className="text-center">Resolvidos</th>
                <th className="text-center">Retornos</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index}>
                  <td>
                    <h5 className="font-14 my-1">
                      <button
                        type="button"
                        className="text-body border-0 bg-transparent p-0 text-start"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleStatusClick(project, 'abertos')}
                        disabled={loading}
                        title="Filtrar casos abertos deste projeto"
                      >
                        {project.produto} - {project.versao}
                      </button>
                    </h5>
                  </td>
                  <td className="text-center py-1">
                    <button
                      type="button"
                      className="badge badge-warning-lighten border-0 px-2 py-1 fs-5 fw-bold"
                      style={{ cursor: loading || !project.abertos || project.abertos === '0' ? 'not-allowed' : 'pointer', minWidth: '45px' }}
                      onClick={() => handleStatusClick(project, 'abertos')}
                      disabled={loading || !project.abertos || project.abertos === '0'}
                      title="Filtrar casos abertos deste projeto"
                    >
                      {project.abertos}
                    </button>
                  </td>
                  <td className="text-center py-1">
                    <button
                      type="button"
                      className="badge badge-info-lighten border-0 px-2 py-1 fs-5 fw-bold"
                      style={{ cursor: loading || !project.corrigidos || project.corrigidos === '0' ? 'not-allowed' : 'pointer', minWidth: '45px' }}
                      onClick={() => handleStatusClick(project, 'corrigidos')}
                      disabled={loading || !project.corrigidos || project.corrigidos === '0'}
                      title="Filtrar casos corrigidos deste projeto"
                    >
                      {project.corrigidos}
                    </button>
                  </td>
                  <td className="text-center py-1">
                    <button
                      type="button"
                      className="badge badge-success-lighten border-0 px-2 py-1 fs-5 fw-bold"
                      style={{ cursor: loading || !project.resolvidos || project.resolvidos === '0' ? 'not-allowed' : 'pointer', minWidth: '45px' }}
                      onClick={() => handleStatusClick(project, 'resolvidos')}
                      disabled={loading || !project.resolvidos || project.resolvidos === '0'}
                      title="Filtrar casos resolvidos deste projeto"
                    >
                      {project.resolvidos}
                    </button>
                  </td>
                  <td className="text-center py-1">
                    <button
                      type="button"
                      className="badge badge-danger-lighten border-0 px-2 py-1 fs-5 fw-bold"
                      style={{ cursor: loading || !project.retornos || project.retornos === '0' ? 'not-allowed' : 'pointer', minWidth: '45px' }}
                      onClick={() => handleStatusClick(project, 'retornos')}
                      disabled={loading || !project.retornos || project.retornos === '0'}
                      title="Filtrar retornos deste projeto"
                    >
                      {project.retornos}
                    </button>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        </Card.Body>
      </Card>
      
      {/* Drawer para mobile */}
      <ProductsDrawer
        show={showDrawer}
        onHide={() => {
          if (externalShowDrawer !== undefined && onCloseDrawer) {
            onCloseDrawer();
          } else {
            setInternalShowDrawer(false);
          }
        }}
        projects={projects}
      />
    </>
  );
};

export default PrioritizedProducts;
