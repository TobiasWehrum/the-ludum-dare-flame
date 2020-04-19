import * as React from "react";

export function TimeDisplay(props: { ms: number }) {
    let s = Math.floor(props.ms / 1000);
    let m = Math.floor(s / 60);
    s %= 60;
    let h = Math.floor(m / 60);
    m %= 60;
    let d = Math.floor(h / 24);
    h %= 24;

    let result = "";

    if (d > 0) {
        result += d + " days, ";
    }

    if ((result.length > 0) || (h > 0)) {
        result += h + " hours, ";
    }

    if ((result.length > 0) || (m > 0)) {
        result += m + " minutes and ";
    }

    result += s + " seconds";

    return <span>{result}</span>;
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