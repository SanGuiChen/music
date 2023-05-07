import { getBanner } from '@/apis/music';
import { useRequest } from 'ahooks';
import { Carousel, Tag } from 'antd';
import CentralLoading from '@/components/CentralLoading';
import NewSong from './NewSong';

const Recommendation = () => {
  const { data: bannerList, loading } = useRequest(async () => {
    const { banners } = await getBanner();
    return banners;
  });
  return (
    <div className="w-4/5 h-full">
      {/* banner图 */}
      <div style={{ width: '100%', height: 250, marginTop: 10 }}>
        {loading ? (
          <CentralLoading />
        ) : (
          <Carousel autoplay>
            {bannerList?.map(({ imageUrl, typeTitle }, index) => (
              <div key={index} className="w-full h-full">
                <img
                  src={imageUrl}
                  loading="lazy"
                  style={{ width: '100%', height: 250 }}
                  className="rounded"
                />
                <Tag
                  color="#f50"
                  style={{
                    position: 'relative',
                    left: '100%',
                    top: -23,
                    transform: 'translateX(-100%)'
                  }}
                >
                  {typeTitle}
                </Tag>
              </div>
            ))}
          </Carousel>
        )}
      </div>
      <div className="mt-5">
        <NewSong />
      </div>
    </div>
  );
};

export default Recommendation;
