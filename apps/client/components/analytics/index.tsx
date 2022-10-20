import Umami from './Umami';

const isProduction = process.env.NODE_ENV === 'production';

interface Props {
  id: string;
}

const Analytics: React.VFC<Props> = ({ id }) => {
  return <>{isProduction && id && <Umami id={id} />}</>;
};

export default Analytics;
