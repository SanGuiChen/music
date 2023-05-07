import { IRoute } from '@/types/router';
import ReactLazilyComponent from 'react-lazily-component';

const MusicRoutes: IRoute[] = [
  {
    pathname: '/music',
    component: ReactLazilyComponent(() => import('@/pages/Music')),
    name: 'Music',
    title: '音乐畅听',
    redirect: {
      fromPath: '/music',
      toPath: '/music/discovery'
    },
    children: [
      {
        pathname: 'discovery',
        component: ReactLazilyComponent(
          () => import('@/pages/Music/pages/Discovery')
        ),
        name: 'Music - Discovery',
        title: '音乐畅听 - 发现'
      },
      {
        pathname: 'love',
        component: ReactLazilyComponent(
          () => import('@/pages/Music/pages/Love')
        ),
        name: 'Music - Love',
        title: '音乐畅听 - 我的喜欢'
      },
      {
        pathname: 'search',
        component: ReactLazilyComponent(
          () => import('@/pages/Music/pages/Search')
        ),
        name: 'Music - Search',
        title: '音乐畅听 - 搜索'
      }
    ]
  }
];

export default MusicRoutes;
