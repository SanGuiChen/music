import RouterComponent from '@/router';
import { Layout } from 'antd';
const { Content } = Layout;

interface IProps {
  className?: string;
  style?: React.CSSProperties;
}

const Index: React.FC<IProps> = ({ className, style }) => (
  <Content className={className} style={style}>
    <RouterComponent />
  </Content>
);

export default Index;
