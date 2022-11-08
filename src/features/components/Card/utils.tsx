import React from "react";
import Svg, { Path } from "react-native-svg";

export const pricing = (price_level: number) => {
  if (price_level > 3) return "$";
  if (price_level === 2) return "$$";
  return "$$$";
};

export const StarIcon = () => (
  <Svg width="9" height="9" viewBox="0 0 9 9" fill="none">
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M4.9682 0.869263L6.0497 3.06026L8.4682 3.41376L6.7182 5.11826L7.1312 7.52626L4.9682 6.38876L2.8052 7.52626L3.2182 5.11826L1.4682 3.41376L3.8867 3.06026L4.9682 0.869263Z"
      fill="#E8753D"
      stroke="#E8753D"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);
export const WalkIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path
      d="M5.85169 14.4761C5.63641 14.8434 5.64814 15.2964 6.01701 15.5689C6.33265 15.8015 6.89452 15.7713 7.11026 15.4038C7.55628 14.6431 8.36508 14.0702 8.36508 14.0702C8.36508 14.0702 8.06726 13.4141 7.92633 12.1846C7.92609 12.1848 6.35915 13.6101 5.85169 14.4761Z"
      fill="#707173"
    />
    <Path
      d="M12.2139 7.85844C11.2987 7.04378 10.3168 6.31284 9.24233 5.72494C9.12672 5.63747 8.99446 5.569 8.85493 5.52327C8.7616 5.48552 8.66991 5.46722 8.58174 5.46464C8.43424 5.44776 8.2865 5.45526 8.15119 5.49161C7.79405 5.58729 7.55298 5.80585 7.41579 6.08396C6.75379 6.85712 6.20084 7.69734 5.70463 8.58516C5.21194 9.46595 6.56221 10.2541 7.05443 9.37403C7.20826 9.09849 7.36678 8.82694 7.53234 8.56054C7.67515 9.52294 7.81773 10.4853 7.96007 11.4475C7.98892 11.6426 8.08178 11.8105 8.21146 11.947C8.41876 13.3169 8.79936 14.6684 9.39945 15.9117C9.83726 16.8192 11.1849 16.0259 10.7492 15.1226C10.3009 14.1937 10.0012 13.1655 9.81663 12.1283C10.2223 11.8457 10.3693 11.3368 10.2934 10.8223C10.1522 9.87211 10.0117 8.92144 9.87056 7.971C10.2978 8.27937 10.7101 8.61002 11.1076 8.96388C11.8596 9.63104 12.969 8.52959 12.2139 7.85844Z"
      fill="#707173"
    />
    <Path
      d="M8.46428 5.119C9.21649 5.119 9.82627 4.50921 9.82627 3.75701C9.82627 3.0048 9.21649 2.39502 8.46428 2.39502C7.71208 2.39502 7.10229 3.0048 7.10229 3.75701C7.10229 4.50921 7.71208 5.119 8.46428 5.119Z"
      fill="#707173"
    />
  </Svg>
);

export const PhotosBaseURL =
  "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400";
