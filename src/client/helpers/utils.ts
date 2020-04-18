export function keepHerokuAppAlive() {
    const isHeroku = window.location.hostname.indexOf("herokuapp.com") !== -1;
    if (!isHeroku)
        return;

    const pingEveryMinutes = 1;
    setInterval(() => {
        fetch("/");
    }, pingEveryMinutes * 60 * 1000);
}