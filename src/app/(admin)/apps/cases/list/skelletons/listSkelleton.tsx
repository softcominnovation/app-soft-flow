import { Placeholder } from 'react-bootstrap';

type Props = {
	rows: number
}

export default function ListSkelleton({rows}:Props) {
	return (
		Array.from({ length: rows }).map((_, i) => (
			<tr key={`skeleton-${i}`}>
				<td>
					<Placeholder as="span" animation="glow">
						<Placeholder xs={3} />
					</Placeholder>
				</td>

				<td>
					<Placeholder as="span" animation="glow">
						<Placeholder xs={8} />
					</Placeholder>
				</td>

				<td>
					<div className="d-flex align-items-center">
						<Placeholder as="span" animation="glow" className="flex-grow-1">
							<Placeholder xs={12} />
						</Placeholder>
					</div>
				</td>

				<td>
					<Placeholder as="span" animation="glow">
						<Placeholder xs={5} />
					</Placeholder>
				</td>

				<td>
					<Placeholder as="span" animation="glow">
						<Placeholder xs={4} />
					</Placeholder>
				</td>

				<td>
					<Placeholder as="span" animation="glow">
						<Placeholder xs={10} />
					</Placeholder>
				</td>

				<td>
					<Placeholder as="span" animation="glow">
						<Placeholder xs={6} />
					</Placeholder>
				</td>

				<td>
					<div className="d-flex gap-2">
						<Placeholder as="span" animation="glow">
							<Placeholder xs={3} />
						</Placeholder>
						<Placeholder as="span" animation="glow">
							<Placeholder xs={3} />
						</Placeholder>
					</div>
				</td>
			</tr>
		))
	)
}