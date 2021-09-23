import Skeleton from '@material-ui/lab/Skeleton';
import { rem } from 'polished';

import Div from '../../../components/styled/Div';

export default function SkeletonLoader() {
  const elem = [...Array(16)];
  return (
    <Div $marginTop={48}>
      {elem.map((_, index) => {
        return (
          <Skeleton
            key={`elem-${index}`}
            animation="wave"
            style={{ marginBottom: rem(24) }}
            variant="rect"
            width="100%"
            height={16}
          />
        );
      })}
    </Div>
  );
}
