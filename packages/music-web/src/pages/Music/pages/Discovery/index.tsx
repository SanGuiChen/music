import LatestMusic from './LatestMusic';
import Recommendation from './Recommendation';
import { MusicPageStatusEnum, useAudioStore } from '@/store';

interface IProps {}

const Discovery: React.FC<IProps> = () => {
  const pageStatus = useAudioStore((state) => state.pageStatus);

  return (
    <div className="overflow-auto w-5/6 flex justify-center">
      {(() => {
        switch (pageStatus) {
          case MusicPageStatusEnum.DISCOVERY_RECOMENDATION:
            return <Recommendation />;
          case MusicPageStatusEnum.DISCOVERY_LATEST_MUSIC:
            return <LatestMusic />;
          default:
            return <Recommendation />;
        }
      })()}
    </div>
  );
};

export default Discovery;
