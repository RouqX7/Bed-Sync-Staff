import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist'



const { persistAtom } = recoilPersist()


const selectedHospitalState = atom({
  key: 'selectedHospitalState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

const userState = atom({
  key: 'userState',
  default: null, 
  effects_UNSTABLE: [persistAtom],
});

export {  selectedHospitalState, userState };