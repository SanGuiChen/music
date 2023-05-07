import { Outlet } from 'react-router-dom';

interface IProps {}

const Content: React.FC<IProps> = () => {
  return <Outlet />;
};

export default Content;
