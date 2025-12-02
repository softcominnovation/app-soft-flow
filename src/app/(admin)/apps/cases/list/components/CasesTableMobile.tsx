'use client';
import { ICase } from '@/types/cases/ICase';
import MobileCaseCard from './caseListComponents/MobileCaseCard';
import MobileCaseSkeleton from './caseListComponents/MobileCaseSkeleton';

interface CasesTableMobileProps {
	cases: ICase[];
	loading: boolean;
	loadingMore: boolean;
	onViewCase: (id: string) => void;
	onFinalizeCase: () => void;
}

/**
 * Componente da lista de casos para mobile
 */
export default function CasesTableMobile({
	cases,
	loading,
	loadingMore,
	onViewCase,
	onFinalizeCase,
}: CasesTableMobileProps) {
	return (
		<div className="d-md-none">
			{loading ? (
				<MobileCaseSkeleton rows={5} />
			) : cases.length ? (
				<>
					{cases.map((caseData, index) => (
						<MobileCaseCard
							key={`mobile-case-${caseData.caso.id}-${index}`}
							item={caseData}
							onView={onViewCase}
							onFinalize={onFinalizeCase}
						/>
					))}
					{loadingMore && <MobileCaseSkeleton rows={15} />}
				</>
			) : (
				<p className="text-center text-muted py-4">Nenhum caso encontrado.</p>
			)}
		</div>
	);
}

