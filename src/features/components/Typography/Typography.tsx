import React, {FC} from "react";
import {Text, TextStyle} from "react-native";
import {ColorValue} from "react-native";

import {PRIMARY} from "../../globalStyle";

export type TFontSize = "s" | "m" | "l"; // 12px, 14px, 16px

const getFontSize: { [size in TFontSize]: number } = {
    s: 12,
    m: 14,
    l: 16,
};

export interface ITypographyProps {
    color?: ColorValue;
    fontSize?: TFontSize;
    weight?:
        | "normal"
        | "bold"
        | "100"
        | "200"
        | "300"
        | "400"
        | "500"
        | "600"
        | "700"
        | "800"
        | "900";
    children: string | string[];
    fontFamily?:
        string
    style?: TextStyle;
}

const Typography: FC<ITypographyProps> = ({
                                              color = PRIMARY,
                                              fontSize = "m",
                                              weight = "400",
                                              fontFamily = "Avenir",
                                              style,
                                              children,
                                          }) => {
    
    return (
        <Text
            style={{
                fontFamily,
                color,
                fontSize: getFontSize[fontSize],
                fontWeight: weight,
                ...style,
            }}
        >
            {children}
        </Text>
    );
};

export default Typography;
