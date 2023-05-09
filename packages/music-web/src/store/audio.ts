import { create } from 'zustand';

export interface IMusic {
  id: number;
  playUrl: string;
  lyricContent?: string;
  picUrl: string;
  artists: any[];
  name: string;
}

export enum MusicPageStatusEnum {
  DISCOVERY_RECOMENDATION = 'DISCOVERY_RECOMENDATION',
  DISCOVERY_LATEST_MUSIC = 'DISCOVERY_LATEST_MUSIC'
}

export enum SearhcSouceEnum {
  NET_EASE = 'NET_EASE',
  META = 'META'
}

export interface IAudioState {
  audioRef: HTMLAudioElement | null | undefined;
  paused: boolean;
  time: number;
}

interface IAudioStore {
  state: IAudioState;
  playList: IMusic[]; // 播放列表
  currentIndex: number; // 当前在播放列表第几首
  pageStatus: MusicPageStatusEnum;
  searchSource: SearhcSouceEnum;

  play: () => void;
  pause: () => void;
  toggle: () => void;
  updateState: () => void;
  setPlayList: (list: IMusic[]) => void;
  setCurrentIndex: (currentIndex: number) => void;
  setPageStatus: (pageStatus: MusicPageStatusEnum) => void;
  setSearchSource: (searchSource: SearhcSouceEnum) => void;
}

export const useAudioStore = create<IAudioStore>((set) => ({
  state: {
    audioRef: null,
    paused: true,
    time: 0
  },
  playList: [],
  currentIndex: -1,
  pageStatus: MusicPageStatusEnum.DISCOVERY_RECOMENDATION,
  searchSource: SearhcSouceEnum.NET_EASE,

  play: () => {
    set((state) => {
      state.state.audioRef?.play();
      return state;
    });
  },
  pause: () => {
    set((state) => {
      state.state.audioRef?.pause();
      return state;
    });
  },
  toggle: () => {
    set((state) => {
      state.state.paused
        ? state.state.audioRef?.play()
        : state.state.audioRef?.pause();
      return state;
    });
  },
  updateState: () => {
    set((state) => {
      return {
        ...state,
        state: {
          audioRef: state.state.audioRef,
          paused: state.state.audioRef?.paused ?? true,
          time: state.state.audioRef?.currentTime ?? 0
        }
      };
    });
  },

  setPlayList: (playList: IMusic[]) => set(() => ({ playList })),
  setCurrentIndex: (currentIndex: number) =>
    set((state) => {
      if (state.state.paused) {
        state.currentIndex = currentIndex;
      } else {
        state.pause();
        state.currentIndex = currentIndex;
        state.play();
      }
      return state;
    }),
  setPageStatus: (pageStatus: MusicPageStatusEnum) =>
    set(() => ({ pageStatus })),
  setSearchSource: (searchSource: SearhcSouceEnum) =>
    set(() => ({ searchSource }))
}));
