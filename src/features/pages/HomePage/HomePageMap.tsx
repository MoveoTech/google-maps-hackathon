import React, {useCallback, useEffect, useState} from "react";
import Map from "../../components/Map/Map";
import {HomepageContainer} from "./styles";
import {
    getDetails,
    getNearByPlaces,
    IPlace,
    PhotosBaseURL,
} from "../../../api/googleApi";
import {Cards} from "../../components/Card/Cards";
import {DraggableDrawer} from "../../components/DraggableDrawer";
import {LocationObject} from "expo-location";
import {LatLng} from "react-native-maps";
import {MapDirectionsResponse} from "react-native-maps-directions";
import {MarkerTypes} from "../../components/Map/components/CustomMarker";
import {DirectionsType} from "../../components/Map/components/Directions";
import {GoogleMapsPlaces} from "../../types";
import {GOOGLE_MAPS_APIKEY} from "@env";
import Snackbar from "../../components/Snackbar/Snackbar";
import TimelineComponent from "../../components/TimelineComponent/TimelineComponent";
import {useSnackbar} from "../../hooks/useSnackbar";
import {Dimensions, View} from "react-native";
import {StickyFooter} from "../../components/Card/StickyFooter";
import {Button} from "react-native-paper";
import {TripLocation} from "../../components/Card/TripLocation";
import {cleanText} from "../../utils";
import {InfoCardSkeleton} from "../../components/Card/InfoCardSkeleton";
import _ from "lodash";
import Svg, {Path, Rect} from "react-native-svg";
import {PRIMARY} from "../../globalStyle";

export interface IPlaceOnMap extends IPlace {
    marker: IMarker;
    direction: IDirections;
    isSelected: boolean;
    locationType: GoogleMapsPlaces;
    timeAtPlace: number;
}

export interface IMarker {
    id: string;
    coordinates: LatLng;
    type: MarkerTypes;
    tooltip?: string;
    bgImg?: string;
    bgIcon?: GoogleMapsPlaces;
}

export interface IDirections {
    id: string;
    origin: LatLng;
    destination: LatLng;
    type: DirectionsType;
    distance?: number;
    duration?: number;
}

const SEARCH_RADIUS = 500;

interface Props {
    location: Pick<LocationObject, "coords">;
}

export interface IStartLocation {
    id: string;
    name: string;
}


export const Refresh = () => (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <Path
            d="M1.94308 9.87393C2.20901 10.1398 2.64034 10.1398 2.90641 9.87393L4.62466 7.88331C4.89059 7.61741 4.80132 7.40165 4.42516 7.40165H3.31447C3.22051 6.15234 3.66573 4.91311 4.58192 3.99691C6.28451 2.29447 9.0545 2.29447 10.7569 3.99691C11.5816 4.82163 12.0358 5.918 12.0358 7.08435C12.0358 8.25067 11.5815 9.34706 10.7569 10.1718C9.57565 11.3531 7.858 11.7557 6.27264 11.2225C5.81336 11.0673 5.31503 11.315 5.16032 11.7747C5.00562 12.2344 5.25283 12.7323 5.71251 12.887C6.36118 13.1054 7.0255 13.2116 7.6828 13.2116C9.27607 13.2116 10.8261 12.5861 11.9985 11.4136C13.155 10.2572 13.7919 8.71975 13.7919 7.0842C13.7919 5.44863 13.155 3.9113 11.9985 2.75478C9.61123 0.367546 5.72701 0.367546 3.33991 2.75478C2.08621 4.00849 1.45936 5.69321 1.55229 7.4015H0.560596C0.184465 7.4015 0.0951917 7.61707 0.361123 7.88317L1.94308 9.87393Z"
            fill={PRIMARY}/>
    </Svg>
);

export const Coffee = () => (
    <Svg width="22" height="18" viewBox="0 0 22 18" fill="none">
        <Path
            d="M19.294 1.81614H16.5291V1.12491C16.5291 0.934045 16.3743 0.779297 16.1835 0.779297H2.35893C2.16806 0.779297 2.01331 0.934045 2.01331 1.12491V10.1109C2.01539 12.2817 3.2135 14.2748 5.12971 15.2951H0.976473C0.785608 15.2951 0.630859 15.4498 0.630859 15.6407V17.0231C0.630859 17.214 0.785608 17.3687 0.976473 17.3687H17.5659C17.7568 17.3687 17.9115 17.214 17.9115 17.0231V15.6407C17.9115 15.4498 17.7568 15.2951 17.5659 15.2951H13.4127C15.3289 14.2748 16.527 12.2817 16.5291 10.1109V8.03718H19.294C20.4388 8.03606 21.3666 7.1083 21.3677 5.9635V3.88982C21.3666 2.74502 20.4388 1.81726 19.294 1.81614ZM17.2203 15.9863V16.6775H1.32209V15.9863H17.2203ZM15.8379 10.1109C15.8346 12.9727 13.5155 15.2918 10.6537 15.2951H7.88874C5.02693 15.2918 2.70778 12.9727 2.70454 10.1109V1.47052H15.8379V10.1109ZM20.6764 5.9635C20.6764 6.727 20.0575 7.34596 19.294 7.34596H16.5291V2.50736H19.294C20.0575 2.50736 20.6764 3.12632 20.6764 3.88982V5.9635Z"
            fill="black"/>
    </Svg>
);

export const Beach = () => (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <Path
            d="M9.15154 8.63872C8.77432 8.63218 8.40019 8.56927 8.04156 8.45208C7.1379 8.16639 6.25785 7.56646 6.46121 6.92094C6.48684 6.83871 6.54379 6.76985 6.61975 6.72925C6.69571 6.68865 6.78459 6.67956 6.8672 6.70394C6.94981 6.72831 7.01952 6.78421 7.06127 6.85955C7.10302 6.93488 7.11346 7.02362 7.09034 7.10659C7.11461 7.22074 7.47575 7.58515 8.23837 7.82624C9.01477 8.07126 9.52449 7.97319 9.59633 7.89184L11.6628 1.3392C11.6907 1.25856 11.749 1.192 11.8253 1.15364C11.9015 1.11529 11.9897 1.10816 12.0711 1.13377C12.1526 1.15939 12.2208 1.21573 12.2613 1.29083C12.3019 1.36594 12.3115 1.45389 12.2883 1.53601L10.2146 8.10636C10.1592 8.28217 9.97026 8.58427 9.329 8.63118C9.2716 8.63675 9.21354 8.63872 9.15154 8.63872V8.63872Z"
            fill="black"/>
        <Path
            d="M12.2857 9.62698C11.9067 9.62007 11.5309 9.55695 11.1705 9.43969C10.2668 9.15432 9.38675 8.55406 9.59012 7.90854C9.61808 7.8279 9.67637 7.76133 9.75262 7.72298C9.82886 7.68462 9.91706 7.67749 9.99847 7.70311C10.0799 7.72873 10.1481 7.78507 10.1887 7.86017C10.2292 7.93527 10.2389 8.02322 10.2156 8.10534C10.2307 8.19456 10.5909 8.56784 11.3683 8.81319C12.1456 9.05854 12.6544 8.96014 12.7262 8.87879C12.7391 8.83825 12.7599 8.80068 12.7875 8.76829C12.8151 8.7359 12.8488 8.70934 12.8868 8.69015C12.9248 8.67097 12.9662 8.65956 13.0086 8.65658C13.0511 8.6536 13.0937 8.65911 13.1339 8.6728C13.2169 8.70122 13.2854 8.76115 13.3247 8.83963C13.3639 8.91812 13.3706 9.00888 13.3435 9.09232C13.2225 9.4761 12.7987 9.62698 12.2857 9.62698V9.62698Z"
            fill="black"/>
        <Path
            d="M15.4073 10.6141C15.0302 10.6076 14.6562 10.5448 14.2977 10.4278C13.879 10.3034 13.4868 10.1033 13.1404 9.83735C12.6428 9.42963 12.6619 9.07374 12.7173 8.89793C13.7879 5.50697 13.4038 2.23508 11.8776 1.75323C11.1803 1.53215 10.2756 1.94741 9.39719 2.88945C8.33179 4.11729 7.54391 5.56058 7.08735 7.12077C7.03159 7.29659 6.84266 7.59868 6.20173 7.64559C5.76529 7.66422 5.32912 7.60308 4.91462 7.46518C4.49592 7.34104 4.10365 7.14091 3.7574 6.87477C3.25981 6.46705 3.27851 6.11116 3.33427 5.93535C3.89298 4.12434 5.12989 2.59928 6.78657 1.67877C7.58316 1.23034 8.4632 0.949893 9.37237 0.854722C10.2815 0.759551 11.2006 0.851679 12.0728 1.12542H12.0774C12.9487 1.4022 13.7541 1.8547 14.4438 2.45497C15.1334 3.05524 15.6926 3.79054 16.0869 4.61544C16.915 6.31987 17.0525 8.27831 16.4707 10.0817C16.4153 10.2575 16.2263 10.5596 15.5851 10.6065C15.5274 10.6121 15.468 10.6141 15.4073 10.6141V10.6141ZM13.5108 2.55784C14.1783 4.0575 14.1632 6.49395 13.3422 9.09408C13.3572 9.18362 13.7177 9.55657 14.4948 9.80192C15.2718 10.0473 15.7809 9.94887 15.8524 9.86752C16.3761 8.22863 16.2489 6.45105 15.4972 4.90343C15.0443 3.96602 14.3608 3.15894 13.5108 2.55784ZM10.0758 1.47344C9.0351 1.47771 8.01247 1.74609 7.10375 2.25344C5.59484 3.09205 4.4683 4.48125 3.95946 6.13084C3.97422 6.22039 4.3347 6.59333 5.11175 6.83869C5.87405 7.07977 6.37918 6.98957 6.46545 6.90954C6.95227 5.26085 7.78903 3.73658 8.91863 2.44074C9.25792 2.06649 9.64735 1.74097 10.0758 1.47344V1.47344Z"
            fill="black"/>
        <Path
            d="M8.0253 14.2785C7.97379 14.2785 7.92301 14.2664 7.87707 14.2431C7.83112 14.2198 7.7913 14.1861 7.76083 14.1446C7.73036 14.103 7.7101 14.0549 7.70168 14.0041C7.69326 13.9533 7.69692 13.9012 7.71237 13.8521L9.49018 8.22181C9.51628 8.13882 9.57428 8.0696 9.65142 8.02937C9.72856 7.98914 9.81852 7.9812 9.90151 8.0073C9.9845 8.03339 10.0537 8.09139 10.094 8.16853C10.1342 8.24567 10.1421 8.33563 10.116 8.41862L8.33789 14.0492C8.31691 14.1157 8.27529 14.1738 8.21909 14.215C8.16288 14.2562 8.095 14.2785 8.0253 14.2785V14.2785Z"
            fill="black"/>
        <Path
            d="M19.5128 19.1751H17.5448C17.4858 19.1751 17.428 19.1592 17.3773 19.1292C17.3266 19.0991 17.285 19.0559 17.2568 19.0042L16.4554 17.5351H2.78435C2.71636 17.5351 2.65004 17.514 2.59457 17.4747C2.5391 17.4353 2.49722 17.3798 2.47471 17.3156L0.178646 10.7554C0.161296 10.706 0.156053 10.6531 0.163355 10.6012C0.170657 10.5493 0.190293 10.4999 0.220617 10.4571C0.25094 10.4143 0.291069 10.3795 0.33764 10.3554C0.384212 10.3314 0.43587 10.3188 0.488287 10.3188H2.45634C2.52428 10.3189 2.59052 10.34 2.64593 10.3793C2.70133 10.4186 2.74317 10.4742 2.76565 10.5383L4.29615 14.911H17.5448C17.6037 14.911 17.6615 14.9268 17.7122 14.9569C17.7629 14.987 17.8045 15.0301 17.8328 15.0819L19.8008 18.69C19.8281 18.7399 19.8419 18.7961 19.8408 18.853C19.8398 18.9099 19.824 18.9656 19.7949 19.0145C19.7659 19.0635 19.7246 19.104 19.6751 19.1322C19.6257 19.1603 19.5697 19.1751 19.5128 19.1751ZM17.7396 18.5191H18.9601L17.3499 15.567H4.06359C3.99565 15.567 3.92941 15.5458 3.874 15.5065C3.8186 15.4672 3.77676 15.4117 3.75427 15.3476L2.22346 10.9749H0.950452L3.01691 16.879H16.65C16.7089 16.879 16.7667 16.8949 16.8174 16.925C16.8681 16.955 16.9097 16.9982 16.9379 17.0499L17.7396 18.5191Z"
            fill="black"/>
        <Path
            d="M2.78504 19.175C2.69805 19.175 2.61462 19.1404 2.5531 19.0789C2.49159 19.0174 2.45703 18.934 2.45703 18.847V17.2069C2.45703 17.1199 2.49159 17.0365 2.5531 16.975C2.61462 16.9135 2.69805 16.8789 2.78504 16.8789C2.87203 16.8789 2.95546 16.9135 3.01698 16.975C3.07849 17.0365 3.11305 17.1199 3.11305 17.2069V18.847C3.11305 18.934 3.07849 19.0174 3.01698 19.0789C2.95546 19.1404 2.87203 19.175 2.78504 19.175Z"
            fill="black"/>
        <Path
            d="M15.2479 19.175C15.1609 19.175 15.0775 19.1404 15.016 19.0789C14.9545 19.0174 14.9199 18.934 14.9199 18.847V17.2069C14.9199 17.1199 14.9545 17.0365 15.016 16.975C15.0775 16.9135 15.1609 16.8789 15.2479 16.8789C15.3349 16.8789 15.4184 16.9135 15.4799 16.975C15.5414 17.0365 15.5759 17.1199 15.5759 17.2069V18.847C15.5759 18.934 15.5414 19.0174 15.4799 19.0789C15.4184 19.1404 15.3349 19.175 15.2479 19.175Z"
            fill="black"/>
    </Svg>
);

export const Park = () => (
    <Svg width="22" height="18" viewBox="0 0 22 18" fill="none">
        <Path
            d="M21.7389 11.5307C21.7373 11.4931 21.7298 11.4559 21.7167 11.4206C21.7134 11.4125 21.7116 11.4043 21.7081 11.3968C21.7045 11.3893 21.7059 11.3879 21.7038 11.3837L20.9877 9.95159C20.9271 9.83009 20.8029 9.75352 20.6673 9.75352H19.7364L18.1655 4.74115H19.9512C20.1489 4.74115 20.3093 4.58084 20.3093 4.38312V2.95101C20.3093 2.94857 20.3093 2.94664 20.3093 2.9442C20.3082 2.90276 20.3 2.86186 20.285 2.82322C20.2806 2.81326 20.2759 2.80329 20.2706 2.79385C20.2647 2.77969 20.258 2.76571 20.2505 2.75225L18.8184 0.604087C18.7518 0.504091 18.6394 0.444303 18.5191 0.444828H3.482C3.36225 0.444828 3.25055 0.504615 3.18412 0.604087L1.75201 2.75225C1.74449 2.76571 1.73785 2.77969 1.7319 2.79385C1.72666 2.80329 1.72194 2.81326 1.71757 2.82322C1.70201 2.86168 1.69327 2.90259 1.69187 2.9442V2.95101V4.38312C1.69187 4.58084 1.85218 4.74115 2.0499 4.74115H3.83566L2.26475 9.75352H1.33385C1.19819 9.75352 1.07407 9.83009 1.0134 9.95159L0.297351 11.3837C0.295254 11.3879 0.294904 11.3926 0.292631 11.3968C0.290534 11.4012 0.287736 11.4125 0.284415 11.4206C0.271304 11.4559 0.263786 11.4931 0.262213 11.5307C0.262213 11.5351 0.259766 11.5389 0.259766 11.5437V12.9758C0.259766 13.1735 0.420073 13.3338 0.617792 13.3338H1.28979L0.379341 16.7319C0.328119 16.9228 0.441226 17.1191 0.632127 17.1703L2.01773 17.5427C2.04815 17.5507 2.07927 17.5548 2.11073 17.5549C2.27279 17.5549 2.41457 17.4462 2.4567 17.2896L3.51784 13.3338H18.4833L19.5434 17.2896C19.5853 17.4462 19.7273 17.5549 19.8893 17.5549C19.9206 17.5548 19.9519 17.5507 19.9823 17.5427L21.3679 17.1703C21.5588 17.1191 21.672 16.9228 21.6207 16.7319L20.7113 13.3338H21.3833C21.5811 13.3338 21.7414 13.1735 21.7414 12.9758V11.5437C21.7414 11.5389 21.7389 11.5354 21.7389 11.5307ZM18.9875 9.75352H18.256L16.6832 4.74115H17.415L18.9875 9.75352ZM15.9323 4.74115L17.5052 9.75352H4.49595L6.06878 4.74115H15.9323ZM3.6736 1.16088H18.3275L19.2824 2.59299H2.71875L3.6736 1.16088ZM2.40792 3.30904H19.5932V4.02509H2.40792V3.30904ZM4.58615 4.74115H5.31794L3.74511 9.75352H3.01367L4.58615 4.74115ZM1.55516 10.4696H20.446L20.804 11.1856H1.19714L1.55516 10.4696ZM1.8576 16.7579L1.1634 16.5718L2.03084 13.3338H2.77557L1.8576 16.7579ZM20.8377 16.5718L20.1435 16.7579L19.2256 13.3338H19.9703L20.8377 16.5718ZM21.0253 12.6177H0.975819V11.9017H21.0253V12.6177Z"
            fill="black"/>
    </Svg>

);

export const TouristIcon = () => (
    <Svg width="18" height="22" viewBox="0 0 18 22" fill="none">
        <Path
            d="M16.8579 21.2502H1.14124C1.09441 21.2503 1.04806 21.2408 1.00506 21.2222C0.962069 21.2037 0.923349 21.1765 0.891309 21.1423C0.859269 21.1082 0.834593 21.0678 0.818812 21.0237C0.803031 20.9796 0.796482 20.9327 0.799573 20.886L1.82457 5.51101C1.8303 5.42436 1.86882 5.34314 1.93228 5.28387C1.99574 5.22459 2.0794 5.19171 2.16624 5.1919H4.89957C4.99019 5.1919 5.07709 5.22789 5.14117 5.29197C5.20524 5.35604 5.24124 5.44295 5.24124 5.53356V7.92523H7.29124V5.53356C7.29124 5.44295 7.32724 5.35604 7.39131 5.29197C7.45539 5.22789 7.54229 5.1919 7.63291 5.1919H10.3662C10.4569 5.1919 10.5438 5.22789 10.6078 5.29197C10.6719 5.35604 10.7079 5.44295 10.7079 5.53356V8.2669H12.7579V5.53356C12.7579 5.44295 12.7939 5.35604 12.858 5.29197C12.9221 5.22789 13.009 5.1919 13.0996 5.1919H15.8329C15.9197 5.19171 16.0034 5.22459 16.0669 5.28387C16.1303 5.34314 16.1688 5.42436 16.1746 5.51101L17.1996 20.886C17.2027 20.9327 17.1961 20.9796 17.1803 21.0237C17.1646 21.0678 17.1399 21.1082 17.1078 21.1423C17.0758 21.1765 17.0371 21.2037 16.9941 21.2222C16.9511 21.2408 16.9047 21.2503 16.8579 21.2502ZM1.50648 20.5669H16.4927L15.5131 5.87523H13.4412V8.60856C13.4412 8.69918 13.4052 8.78608 13.3412 8.85016C13.2771 8.91423 13.1902 8.95023 13.0996 8.95023H10.3662C10.2756 8.95023 10.1887 8.91423 10.1246 8.85016C10.0606 8.78608 10.0246 8.69918 10.0246 8.60856V5.87523H7.97457V8.2669C7.97457 8.35751 7.93858 8.44442 7.8745 8.50849C7.81043 8.57257 7.72352 8.60856 7.63291 8.60856H4.89957C4.80896 8.60856 4.72205 8.57257 4.65798 8.50849C4.5939 8.44442 4.55791 8.35751 4.55791 8.2669V5.87523H2.48604L1.50648 20.5669Z"
            fill="black"/>
        <Path
            d="M12.0737 21.2502H5.9237C5.83308 21.2502 5.74618 21.2142 5.6821 21.1501C5.61803 21.086 5.58203 20.9991 5.58203 20.9085V16.1252C5.58203 15.219 5.942 14.35 6.58275 13.7092C7.2235 13.0685 8.09254 12.7085 8.9987 12.7085C9.90485 12.7085 10.7739 13.0685 11.4146 13.7092C12.0554 14.35 12.4154 15.219 12.4154 16.1252V20.9085C12.4154 20.9991 12.3794 21.086 12.3153 21.1501C12.2512 21.2142 12.1643 21.2502 12.0737 21.2502ZM6.26536 20.5668H11.732V16.1252C11.732 15.4002 11.4441 14.705 10.9315 14.1924C10.4189 13.6798 9.72362 13.3918 8.9987 13.3918C8.27377 13.3918 7.57854 13.6798 7.06594 14.1924C6.55334 14.705 6.26536 15.4002 6.26536 16.1252V20.5668Z"
            fill="black"/>
        <Path
            d="M8.99987 5.87493C8.90925 5.87493 8.82235 5.83894 8.75827 5.77486C8.6942 5.71079 8.6582 5.62388 8.6582 5.53327V3.48327C8.6582 3.39265 8.6942 3.30575 8.75827 3.24167C8.82235 3.1776 8.90925 3.1416 8.99987 3.1416C9.09049 3.1416 9.17739 3.1776 9.24146 3.24167C9.30554 3.30575 9.34154 3.39265 9.34154 3.48327V5.53327C9.34154 5.62388 9.30554 5.71079 9.24146 5.77486C9.17739 5.83894 9.09049 5.87493 8.99987 5.87493Z"
            fill="black"/>
        <Path
            d="M13.7832 3.825H8.99987C8.90925 3.825 8.82235 3.789 8.75827 3.72493C8.6942 3.66085 8.6582 3.57395 8.6582 3.48333V1.09167C8.6582 1.00105 8.6942 0.914147 8.75827 0.850072C8.82235 0.785997 8.90925 0.75 8.99987 0.75H13.7832C13.8738 0.75 13.9607 0.785997 14.0248 0.850072C14.0889 0.914147 14.1249 1.00105 14.1249 1.09167V3.48333C14.1249 3.57395 14.0889 3.66085 14.0248 3.72493C13.9607 3.789 13.8738 3.825 13.7832 3.825ZM9.34154 3.14167H13.4415V1.43333H9.34154V3.14167Z"
            fill="black"/>
    </Svg>


);

export const Restaurant = () => (
    <Svg width="11" height="22" viewBox="0 0 11 22" fill="none">
        <Path
            d="M3.19785 0.53418H1.80349C0.841386 0.535313 0.0616798 1.31502 0.0605469 2.27712V5.67621C0.0616798 6.47474 0.247565 7.26216 0.603648 7.9769C0.931539 8.6339 1.09224 9.36167 1.07145 10.0956L0.792584 19.6982C0.759598 20.641 1.49708 21.432 2.43988 21.465C3.38264 21.498 4.17368 20.7605 4.20666 19.8177C4.20806 19.7778 4.20806 19.738 4.20666 19.6982L3.92779 10.0966C3.90709 9.36297 4.06779 8.6356 4.3956 7.97895C4.75268 7.26386 4.93931 6.47579 4.94079 5.67652V2.27712C4.93966 1.31502 4.15999 0.535356 3.19785 0.53418ZM4.24361 5.67656C4.24274 6.36694 4.08204 7.04774 3.77406 7.66561C3.39475 8.42523 3.20883 9.26676 3.2327 10.1155L3.51158 19.7156C3.51959 19.9884 3.41611 20.2528 3.22504 20.4477C2.82285 20.8413 2.17988 20.8413 1.77769 20.4477C1.58636 20.2534 1.4824 19.9896 1.48976 19.717L1.76863 10.1158C1.79268 9.26703 1.60684 8.4254 1.22762 7.66561C0.919513 7.04765 0.758683 6.36672 0.757725 5.67621V2.27712C0.759555 1.83555 1.03856 1.44269 1.4549 1.2955V5.41442H2.15208V1.23136H2.84926V5.41442H3.54643V1.2955C3.96278 1.44269 4.24178 1.83555 4.24361 2.27712V5.67656Z"
            fill="black"/>
        <Path
            d="M10.1698 10.9849V0.882783C10.1698 0.690275 10.0137 0.534194 9.82116 0.534194C8.62472 0.530403 7.54793 1.25939 7.10705 2.37161C6.14499 4.77717 6.0954 7.45141 6.96762 9.89101L7.38035 11.0462L7.08195 19.6954C7.04906 20.6315 7.78122 21.4169 8.71723 21.4498C9.65328 21.4827 10.4387 20.7506 10.4716 19.8145C10.473 19.7749 10.473 19.7351 10.4716 19.6955L10.1698 10.9849ZM7.75438 2.63061C8.04354 1.90105 8.69718 1.379 9.47258 1.25821V10.6433H7.97364L7.62122 9.65676C6.80696 7.3769 6.85428 4.878 7.75438 2.63061ZM9.49349 20.4477C9.09536 20.8405 8.45544 20.8405 8.05731 20.4477C7.86872 20.2531 7.76798 19.9899 7.77843 19.7191L8.06637 11.3404H9.48443L9.77341 19.7191C9.7836 19.99 9.68247 20.2533 9.49349 20.4477Z"
            fill="black"/>
    </Svg>

);

export const BarIcon = () => (
    <Svg width="22" height="18" viewBox="0 0 22 18" fill="none">
        <Path
            d="M13.2114 12.7426C13.1212 12.7426 13.0347 12.7068 12.9709 12.643L5.48633 5.15837C5.43876 5.11079 5.40637 5.05018 5.39325 4.9842C5.38013 4.91821 5.38687 4.84982 5.41261 4.78766C5.43836 4.72551 5.48195 4.67238 5.53788 4.635C5.59382 4.59761 5.65958 4.57765 5.72685 4.57764H20.696C20.7633 4.57765 20.8291 4.59761 20.885 4.635C20.9409 4.67238 20.9845 4.72551 21.0103 4.78766C21.036 4.84982 21.0427 4.91821 21.0296 4.9842C21.0165 5.05018 20.9841 5.11079 20.9365 5.15837L13.452 12.643C13.3882 12.7068 13.3017 12.7426 13.2114 12.7426ZM6.54812 5.25805L13.2114 11.9214L19.8747 5.25805H6.54812Z"
            fill="black"/>
        <Path
            d="M13.2133 17.8456C13.123 17.8456 13.0365 17.8097 12.9727 17.7459C12.9089 17.6821 12.873 17.5956 12.873 17.5053V12.4022C12.873 12.312 12.9089 12.2255 12.9727 12.1617C13.0365 12.0979 13.123 12.062 13.2133 12.062C13.3035 12.062 13.39 12.0979 13.4538 12.1617C13.5176 12.2255 13.5535 12.312 13.5535 12.4022V17.5053C13.5535 17.5956 13.5176 17.6821 13.4538 17.7459C13.39 17.8097 13.3035 17.8456 13.2133 17.8456Z"
            fill="black"/>
        <Path
            d="M15.2528 17.8455H11.1703C11.0801 17.8455 10.9935 17.8096 10.9297 17.7458C10.8659 17.682 10.8301 17.5955 10.8301 17.5052C10.8301 17.415 10.8659 17.3285 10.9297 17.2647C10.9935 17.2009 11.0801 17.165 11.1703 17.165H15.2528C15.343 17.165 15.4295 17.2009 15.4933 17.2647C15.5571 17.3285 15.593 17.415 15.593 17.5052C15.593 17.5955 15.5571 17.682 15.4933 17.7458C15.4295 17.8096 15.343 17.8455 15.2528 17.8455Z"
            fill="black"/>
        <Path
            d="M5.72776 9.68062C4.78574 9.68062 3.86488 9.40128 3.08163 8.87792C2.29837 8.35456 1.68789 7.6107 1.3274 6.74039C0.966907 5.87008 0.872586 4.91242 1.05636 3.9885C1.24014 3.06459 1.69377 2.21592 2.35987 1.54981C3.02598 0.883707 3.87465 0.430083 4.79856 0.246305C5.72248 0.0625273 6.68014 0.156849 7.55045 0.517343C8.42076 0.877836 9.16462 1.48831 9.68798 2.27157C10.2113 3.05483 10.4907 3.97569 10.4907 4.9177C10.4907 5.00793 10.4548 5.09446 10.391 5.15826C10.3272 5.22207 10.2407 5.25791 10.1505 5.25791H6.54902L9.09582 7.80369C9.1596 7.86749 9.19543 7.954 9.19543 8.04421C9.19543 8.13443 9.1596 8.22094 9.09582 8.28474C8.65464 8.7286 8.12978 9.08052 7.55164 9.32013C6.97351 9.55973 6.35358 9.68226 5.72776 9.68062ZM5.72776 0.835204C5.07069 0.834991 4.42329 0.993378 3.84053 1.29691C3.25778 1.60044 2.75689 2.04015 2.38044 2.57868C2.00398 3.11721 1.76307 3.73864 1.67817 4.3902C1.59327 5.04176 1.66689 5.70418 1.89278 6.3212C2.11867 6.93821 2.49015 7.49159 2.97566 7.93432C3.46118 8.37705 4.04638 8.69605 4.68156 8.86422C5.31674 9.03239 5.98313 9.04476 6.62411 8.90028C7.2651 8.75581 7.86174 8.45875 8.36335 8.03435L5.48723 5.15823C5.43967 5.11065 5.40728 5.05004 5.39416 4.98405C5.38104 4.91807 5.38777 4.84968 5.41352 4.78752C5.43926 4.72536 5.48285 4.67224 5.53879 4.63485C5.59472 4.59747 5.66048 4.57751 5.72776 4.57749H9.79631C9.70969 3.55765 9.24369 2.6074 8.49038 1.9145C7.73708 1.22161 6.75127 0.836472 5.72776 0.835204Z"
            fill="black"/>
        <Path
            d="M18.316 7.6394H8.10974C8.01951 7.6394 7.93298 7.60356 7.86918 7.53976C7.80537 7.47595 7.76953 7.38942 7.76953 7.29919C7.76953 7.20896 7.80537 7.12243 7.86918 7.05863C7.93298 6.99483 8.01951 6.95898 8.10974 6.95898H18.316C18.4062 6.95898 18.4927 6.99483 18.5565 7.05863C18.6203 7.12243 18.6562 7.20896 18.6562 7.29919C18.6562 7.38942 18.6203 7.47595 18.5565 7.53976C18.4927 7.60356 18.4062 7.6394 18.316 7.6394Z"
            fill="black"/>
    </Svg>

);


const getIconByPlaceType = (type: GoogleMapsPlaces) => {
    switch (type) {
        case ('restaurant'):
            return <Restaurant/>
        case ('cafe'):
            return <Coffee/>
        case ('bar'):
            return <BarIcon/>
        case ('tourist_attraction'):
            return <TouristIcon/>
        case ('park'):
            return <Park/>
        case ('beach'):
            return <Beach/>
        default:
            return <TouristIcon/>

    }
}

export const HomePageMap = ({location}: Props) => {
    const [topFourPlaces, setTopFourPlaces] = useState<IPlaceOnMap[]>([]);
    const [allPlaces, setAllPlaces] = useState<IPlace[]>([]);
    const [allPlacesIndex, setAllPlacesIndex] = useState(0);
    const [activeStep, setActiveStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [onBoarding, setOnBoarding] = useState(true);
    const [topTitle, setTopTitle] = useState("Choose an amazing breakfast");
    const [tripPlaces, setTripPlaces] = useState<IPlaceOnMap[]>([]);
    const {openSnackbar, hideSnackbar, snackbar} = useSnackbar();
    const [showTimeline, setShowTimeline] = useState(false);
    const [startingLocationAddress, setStartingLocationAddress] =
        useState<IStartLocation>();
    const [startingLocation, setStartingLocation] = useState<LatLng>({
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
    });

    const [locationType, setLocationType] = useState<GoogleMapsPlaces>("cafe");
    const [region, setRegion] = useState<LatLng>({
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
    });

    const [snapIndex, setSnapIndex] = useState<0 | 1 | 2>(2);

    const handleSheetChanges = useCallback((index: 0 | 1 | 2) => {
        setSnapIndex(index);
    }, []);

    const onPredictionClicked = useCallback(async (place_id: string) => {
        const details = await getDetails(place_id);
        if (details) {
            const latitude = details?.data.result.geometry.location.lat;
            const longitude = details?.data.result.geometry.location.lng;
            setRegion((prevRegion) => ({
                ...prevRegion,
                latitude,
                longitude,
            }));
            setStartingLocation({
                latitude,
                longitude,
            });
            const startingLocation = {
                name: details?.data?.result?.formatted_address,
                id: details?.data?.result?.place_id,
            };
            setStartingLocationAddress(startingLocation);
        }
    }, []);

    const changeRegion = ({lat, lng}: { lat: number; lng: number }) => {
        setRegion({
            latitude: lat,
            longitude: lng,
        });
    };
    const maxSteps = 4;

    const onSelectPlace = (place_id: string) => {
        let lat: number, lng: number;
        topFourPlaces.forEach((place) => {
            if (place.place_id === place_id) {
                place.isSelected = true;
                place.direction.type = "dashed";
                [lat, lng] = [place.geometry.location.lat, place.geometry.location.lng];
                const newRegion = {
                    lat: (lat + region.latitude) / 2,
                    lng: (lng + region.longitude) / 2,
                };
                newRegion.lat = newRegion.lat - 0.008;
                changeRegion(newRegion);
            } else {
                place.isSelected = false;
                place.direction.type = "transparent";
            }
        });
        setTopFourPlaces([...topFourPlaces]);
    };

    const getNewLocationType = (): GoogleMapsPlaces => {
        if (activeStep === 2) return "restaurant";

        const locationTypes: GoogleMapsPlaces[] = [
            "tourist_attraction",
            "bar",
            "park",
        ];
        return locationTypes[Math.round(Math.random() * 2)];
    };

    const addStep = () => {
        const selectedPlace = topFourPlaces.find((place) => place.isSelected);
        if (selectedPlace) {
            setTripPlaces((prev) => [...(prev || []), selectedPlace]);
            const newStartingLocation: LatLng = {
                latitude: selectedPlace.geometry.location.lat,
                longitude: selectedPlace.geometry.location.lng,
            };
            setStartingLocation(newStartingLocation);
            return newStartingLocation;
        }
    };
    const createNextPlace = (
        isLastStep: boolean,
        newStartingLocation: LatLng = startingLocation
    ) => {
        const newLocationType = getNewLocationType();
        setLocationType(newLocationType);
        setAllPlacesIndex(0);
        setActiveStep((activeStep) => activeStep + 1);
        if (isLastStep) {
            setTopFourPlaces([]);
            setShowTimeline(true);
            setTopTitle("Trip summary");
            return;
        }
        calculateStep(newStartingLocation, newLocationType);
        setTopTitle(`Choose a ${cleanText(newLocationType)}`);
    };

    const onNextStep = (isLastStep: boolean) => {
        const newStartingLocation = addStep();
        createNextPlace(isLastStep, newStartingLocation);
        openSnackbar({
            title: `You've added it to your trip`,
            isCheckIcon: true,
        });
    };

    const replaceTopFour = () => {
        createTopPlaces();
    };

    const createMarker = (
        place: IPlaceOnMap,
        newLocationType?: GoogleMapsPlaces
    ): IMarker => {
        const photoReference =
            (place?.photos as any[])?.length > 0
                ? place?.photos[0]?.photo_reference
                : null;
        return {
            id: place.place_id,
            coordinates: {
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
            },
            type: "pin",
            bgImg: `${PhotosBaseURL}&photoreference=${photoReference}&sensor=false&key=${GOOGLE_MAPS_APIKEY}`,
            bgIcon: newLocationType || locationType,
        };
    };

    const createDirection = (
        place: IPlace,
        baseLocation: LatLng
    ): IDirections => ({
        id: place.place_id,
        origin: baseLocation,
        destination: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
        },
        type: "transparent",
    });

    const createTopPlaces = (
        places?: IPlace[],
        newStartingLocation?: LatLng,
        newLocationType?: GoogleMapsPlaces
    ) => {
        const topFourPlaces =
            places || allPlaces.slice(allPlacesIndex * 4, allPlacesIndex * 4 + 4);
        if (topFourPlaces.length === 0) {
            openSnackbar({
                title: `No more new ${cleanText(locationType)}'s left`,
                isCheckIcon: false,
            });
            return;
        }
        const location = newStartingLocation || startingLocation;
        (topFourPlaces as IPlaceOnMap[]).forEach((place) => {
            place.marker = createMarker(place, newLocationType);
            place.direction = createDirection(place, location);
            place.isSelected = false;
            place.locationType = newLocationType || locationType;
            place.timeAtPlace = 2;
        });
        setTopFourPlaces(topFourPlaces as IPlaceOnMap[]);
        setAllPlacesIndex((prev) => prev + 1);
    };

    const continueCallback = () => {
        setOnBoarding(false);
        calculateStep(region, locationType);
    };

    const calculateStep = async (
        newStartingLocation?: LatLng,
        newLocationType?: GoogleMapsPlaces
    ) => {
        const baseLocation = newStartingLocation || startingLocation;
        try {
            setIsLoading(true);
            const nearbyPlacesResponse = await getNearByPlaces(
                baseLocation,
                SEARCH_RADIUS,
                newLocationType || locationType
            );
            setIsLoading(false);

            const filteredResults = nearbyPlacesResponse.data.results?.filter(
                (place) => {
                    const isPlaceAlreadyInTrip = tripPlaces
                        .map((place) => place.place_id)
                        .includes(place.place_id);
                    return !isPlaceAlreadyInTrip;
                }
            );
            setAllPlaces(filteredResults);
            createTopPlaces(
                filteredResults.slice(0, 4),
                baseLocation,
                newLocationType
            );
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    useEffect(() => {
        calculateStep();
    }, []);

    const onDirectionsReady: (
        place_id: string,
        ...args: MapDirectionsResponse[]
    ) => void = (place_id, args) => {
        const placesIndex = topFourPlaces.findIndex(
            (place) => place.place_id === place_id
        );
        topFourPlaces[placesIndex].direction.distance = args.distance;
        topFourPlaces[placesIndex].direction.duration = args.duration;
        setTopFourPlaces([...topFourPlaces]);
    };

    const initialWizard = () => {
        setTopFourPlaces([]);
        setAllPlaces([]);
        setAllPlacesIndex(0);
        setActiveStep(1);
        setTopTitle("Choose an amazing breakfast");
        setTripPlaces([]);
        setShowTimeline(false);
        calculateStep();
    };

    return (
        <>
            <HomepageContainer>
                <Map
                    location={region}
                    topFourPlaces={onBoarding ? [] : topFourPlaces}
                    tripPlaces={onBoarding ? [] : tripPlaces}
                    onDirectionsReady={onBoarding ? () => {
                    } : onDirectionsReady}
                    getIconByPlaceType={getIconByPlaceType}
                />
            </HomepageContainer>
            <DraggableDrawer
                handleSheetChanges={handleSheetChanges as (index: number) => void}
                snapIndex={snapIndex}
                onBoarding={onBoarding}
                topTitle={topTitle}
                subTitle={
                    activeStep > maxSteps
                        ? "10:00 AM - 18:00 PM"
                        : `Step ${activeStep.toString()} out of ${maxSteps.toString()}`
                }
            >
                {onBoarding && !showTimeline ? (
                    <TripLocation
                        handleSheetChanges={handleSheetChanges}
                        onPredictionClicked={onPredictionClicked}
                        currentLocationLat={location.coords.latitude}
                        currentLocationLng={location.coords.longitude}
                        setStartingLocationAddress={setStartingLocationAddress}
                    />
                ) : isLoading ? (
                    _.times(4).map((_, index) => <InfoCardSkeleton key={index}/>)
                ) : (
                    <Cards topFourPlaces={topFourPlaces} onCardSelect={onSelectPlace}/>
                )}
                {showTimeline && (
                    <TimelineComponent
                        tripPlaces={tripPlaces}
                        startingLocationAddress={startingLocationAddress}
                        initialWizard={initialWizard}
                    />
                )}
                {!onBoarding && !showTimeline && (
                    <Button
                        mode="outlined"
                        onPress={replaceTopFour}
                        icon={Refresh}
                        style={{
                            margin: 8,
                            marginBottom: "50%",
                            marginTop: 20,
                            borderRadius: 10,
                        }}
                        labelStyle={{color: "black"}}
                    >
                        Please offer me something else
                    </Button>
                )}
            </DraggableDrawer>
            <Snackbar
                label={snackbar.title}
                isCheckIcon={snackbar.isCheckIcon}
                visible={snackbar.isVisible}
                hide={hideSnackbar}
            />
            <View style={{width: Dimensions.get("window").width, height: 100}}>
                <StickyFooter
                    tripPlaces={tripPlaces}
                    showTimeline={showTimeline}
                    startingLocation={startingLocationAddress}
                    onBoarding={onBoarding}
                    next={onNextStep}
                    isNextDisabled={
                        !Boolean(topFourPlaces?.find((place) => place.isSelected === true))
                    }
                    skip={createNextPlace}
                    isLast={activeStep === maxSteps}
                    continueCallback={continueCallback}
                />
            </View>
        </>
    );
};
