import {useEffect, useState} from "react";
import {ANDROID_CLIENT_ID, EXPO_CLIENT_ID, IOS_CLIENT_ID} from "@env";
import * as Google from "expo-auth-session/providers/google";

interface UserInfo {
    name: string;
    email: string;
    picture: string;
}

export const useAuthentication = () => {
    const [accessToken, setAccessToken] = useState<string>();
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: EXPO_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
    });

    const getUserData = async () => {
        let userInfoResponse = await fetch(
            "https://www.googleapis.com/userinfo/v2/me",
            {
                headers: {Authorization: `Bearer ${accessToken}`},
            }
        );
        userInfoResponse.json().then((data: any) => {
            setUserInfo(data);
        });
    };

    useEffect(() => {
        if (response?.type === "success") {
            setAccessToken(response.authentication.accessToken);
            accessToken && getUserData();
        }
    }, [response, accessToken]);

    return {promptAsync, request, getUserData, accessToken, userInfo};
};
