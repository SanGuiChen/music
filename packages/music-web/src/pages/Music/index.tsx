import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';
import SideBar from './components/SideBar';

const Music: React.FC = () => {
  return (
    <div className="w-full h-full rounded-md bg-white">
      <Header />
      <div className="w-full flex h-[calc(100%_-_140px)]">
        <SideBar className="w-1/6 bg-gray-100" />
        <Content />
      </div>
      <Footer />
    </div>
  );
};

export default Music;
