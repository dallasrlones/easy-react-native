import { useEffect, useContext } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { AppContext } from "./State";

const doNothing = () => {};
const shitHitFan = err => alert(err);

const unlockScreenOrientation = () => {
  ScreenOrientation.unlockAsync().then(doNothing).catch(shitHitFan);
};

const orientationToString = orientation => {
  return orientation === 1 || orientation === 2 ? 'VERTICAL': 'HORIZONTAL';
};

function OrientationListeners() {
  const { setOrientation } = useContext(AppContext);
  // orientation can be 'VERTICAL' or 'HORIZONTAL'
  useEffect(() => {
    unlockScreenOrientation();
    // get and set the initial orientation
    ScreenOrientation.getOrientationAsync().then((info) => {
      const orientation = orientationToString(info.orientation);
      setOrientation(orientation);
    }).catch(shitHitFan);
    
    
    // listen for orientation changes
    ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
      setOrientation(orientationToString(orientationInfo.orientation));
    });
  }, []);
  return null;
}

export default OrientationListeners