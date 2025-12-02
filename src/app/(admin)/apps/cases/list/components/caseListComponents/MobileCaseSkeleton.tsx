"use client";

import { Placeholder } from "react-bootstrap";

type Props = {
	rows: number;
};

export default function MobileCaseSkeleton({ rows }: Props) {
	return (
		<>
			{Array.from({ length: rows }).map((_, index) => (
				<div key={`case-mobile-skeleton-${index}`} className="border rounded-3 mb-3 shadow-sm bg-body overflow-hidden">
					{/* Header Skeleton */}
					<div className="bg-body-tertiary border-bottom p-3">
						<div className="d-flex align-items-center gap-2 mb-2">
							<div className="flex-grow-1">
								<Placeholder as="div" animation="glow" className="mb-1" style={{ width: '100px', height: '16px' }} />
								<Placeholder as="div" animation="glow" style={{ width: '120px', height: '12px' }} />
							</div>
						</div>
						<div className="d-flex gap-2">
							<Placeholder as="div" animation="glow" style={{ width: '80px', height: '24px', borderRadius: '4px' }} />
							<Placeholder as="div" animation="glow" style={{ width: '100px', height: '24px', borderRadius: '4px' }} />
						</div>
					</div>
					{/* Content Skeleton */}
					<div className="p-3">
						<div className="mb-3">
							<Placeholder as="div" animation="glow" className="mb-2" style={{ width: '60px', height: '12px' }} />
							<Placeholder as="div" animation="glow" className="mb-1" style={{ width: '150px', height: '16px' }} />
							<Placeholder as="div" animation="glow" style={{ width: '100px', height: '14px' }} />
						</div>
						<div className="mb-3 p-2 bg-body-tertiary rounded">
							<Placeholder as="div" animation="glow" className="mb-2" style={{ width: '50px', height: '12px' }} />
							<div className="d-flex gap-4">
								<div>
									<Placeholder as="div" animation="glow" className="mb-1" style={{ width: '60px', height: '10px' }} />
									<Placeholder as="div" animation="glow" style={{ width: '50px', height: '16px' }} />
								</div>
								<div>
									<Placeholder as="div" animation="glow" className="mb-1" style={{ width: '60px', height: '10px' }} />
									<Placeholder as="div" animation="glow" style={{ width: '50px', height: '16px' }} />
								</div>
							</div>
						</div>
						<div className="mb-3">
							<Placeholder as="div" animation="glow" className="mb-2" style={{ width: '60px', height: '12px' }} />
							<Placeholder as="div" animation="glow" className="mb-1" style={{ width: '100%', height: '14px' }} />
							<Placeholder as="div" animation="glow" className="mb-1" style={{ width: '90%', height: '14px' }} />
							<Placeholder as="div" animation="glow" style={{ width: '80%', height: '14px' }} />
						</div>
						<div className="d-flex gap-2 mt-3 pt-3 border-top">
							<Placeholder as="div" animation="glow" className="flex-grow-1" style={{ height: '36px', borderRadius: '4px' }} />
							<Placeholder as="div" animation="glow" className="flex-grow-1" style={{ height: '36px', borderRadius: '4px' }} />
						</div>
					</div>
				</div>
			))}
		</>
	);
}
