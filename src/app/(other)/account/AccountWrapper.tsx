import { ReactNode } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';

import BGCircles from '@/components/BGCircles';

// images
import Logo from '@/assets/images/logo.png';

type AccountWrapperProps = {
	children?: ReactNode;
	bottomLinks?: ReactNode;
};

export default function AccountWrapper({ bottomLinks, children }: AccountWrapperProps) {
	return (
		<>
			<BGCircles />
			<div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
				<Container>
					<Row className="justify-content-center">
						<Col md={8} lg={6} xl={5} xxl={4}>
							<Card>
								<Card.Header className="pt-4 pb-4 text-center">
									<Link href="/">
										<span>
											<Image src={Logo} alt="" height="60" />
										</span>
									</Link>
								</Card.Header>
								<Card.Body className="p-4">{children}</Card.Body>
							</Card>
							{bottomLinks}
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
}
