import RouterComponent from '@/router';
import { Layout } from 'antd';
const { Content } = Layout;

const Index: React.FC = () => (
  <Layout>
    <Content>
      <RouterComponent />
    </Content>
  </Layout>
);

export default Index;
