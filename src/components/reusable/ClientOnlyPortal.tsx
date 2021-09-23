import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

// Props
type Props = {
  selector: string;
  children: React.ReactNode;
};

// Component
export default function ClientOnlyPortal(props: Props) {
  const { selector, children } = props;
  const ref = useRef<any>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector);
    setMounted(true);
  }, [selector]);

  return mounted ? (
    ReactDOM.createPortal(children, ref.current)
  ) : (
    <h1>Hello</h1>
  );
}
