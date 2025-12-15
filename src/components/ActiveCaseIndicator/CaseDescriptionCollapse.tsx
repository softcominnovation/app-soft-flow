'use client';

import { Collapse } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { ICase } from '@/types/cases/ICase';

interface CaseDescriptionCollapseProps {
	caseData: ICase | null;
	isExpanded: boolean;
}

export default function CaseDescriptionCollapse({ caseData, isExpanded }: CaseDescriptionCollapseProps) {
	return (
		<Collapse in={isExpanded}>
			<div>
				{caseData && (
					<div className="mt-3 pt-3 border-top border-white-25">
						{caseData.caso.textos.descricao_resumo && (
							<div className="mb-3">
								<strong className="small text-uppercase text-white-50 d-block mb-2">
									<IconifyIcon icon="lucide:file-text" className="me-1" />
									Resumo do Caso
								</strong>
								<p className="text-white-75 small mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
									{caseData.caso.textos.descricao_resumo}
								</p>
							</div>
						)}
						{caseData.caso.textos.descricao_completa && (
							<div>
								<strong className="small text-uppercase text-white-50 d-block mb-2">
									<IconifyIcon icon="lucide:file-text" className="me-1" />
									Descrição Completa
								</strong>
								<p className="text-white-75 small mb-0" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '200px', overflowY: 'auto' }}>
									{caseData.caso.textos.descricao_completa}
								</p>
							</div>
						)}
						{!caseData.caso.textos.descricao_resumo && !caseData.caso.textos.descricao_completa && (
							<p className="text-white-50 small mb-0">Nenhuma descrição disponível</p>
						)}
					</div>
				)}
			</div>
		</Collapse>
	);
}










