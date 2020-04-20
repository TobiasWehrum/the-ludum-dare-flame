import * as React from "react";
import { msToTimeString } from "../../../shared/utils/utils";

export function TimeDisplay(props: { ms: number }) {
    return <span>{msToTimeString(props.ms)}</span>;
}

/*
function padTo2(number: number) {
    let str = number.toString();
    if (str.length < 2) {
        str = "0" + str;
    }
    return str;
}
*/