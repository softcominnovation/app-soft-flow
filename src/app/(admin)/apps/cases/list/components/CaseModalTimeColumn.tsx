import { ICase } from '@/types/cases/ICase';
import CaseTimeTracker from './CaseTimeTracker';
import TimetrackerSkelleton from '../skelletons/timetrackerSkelleton';

interface CaseModalTimeColumnProps {
	caseData: ICase | null;
	onCaseUpdated: (updatedCase: ICase) => void;
}

export default function CaseModalTimeColumn({ caseData, onCaseUpdated }: CaseModalTimeColumnProps) {
	return (
		<>
			{/* Separador vertical sutil */}
			<div className="border-start border-secondary" style={{ width: '1px', margin: '12px 0', opacity: 0.3 }} />

			{/* Coluna direita - Tempo (sempre visível) */}
			<div className="d-flex flex-column" style={{ width: '480px', minWidth: '480px', maxWidth: '480px' }}>
				<div className="custom-scrollbar px-4 py-4" style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden' }}>
					{!caseData ? (
						<TimetrackerSkelleton />
					) : (
						<CaseTimeTracker key={caseData.caso.id} caseData={caseData} onCaseUpdated={onCaseUpdated} />
					)}
				</div>
			</div>
		</>
	);
}

