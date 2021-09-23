import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { PlusIcon } from '../../svgs';
import { DangerStyles } from '../../styles/reuse';

// Props
type Props = {
  href: string;
  children: React.ReactNode;
};

// Component
export default function AddLink(props: Props) {
  const { href, children } = props;
  return (
    <Link href={href} passHref>
      <AddLink.LinkElement>
        <PlusIcon width={12} height={12} style={{ marginRight: '8px' }} />
        <span>{children}</span>
      </AddLink.LinkElement>
    </Link>
  );
}

// Styles
AddLink.LinkElement = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: 500;
  padding: 12px 32px;

  border-radius: 3px;

  ${DangerStyles};
`;
