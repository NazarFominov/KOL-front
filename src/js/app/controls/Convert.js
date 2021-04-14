export const convertQueryStringToObject = (string = '') => {
    let search = string;
    search = search.replace('?', '')

    search = search.split('&');
    search = search.map((s) => s.split('='));

    const parseSearch = {};
    search.forEach(s => {
        if (parseSearch.hasOwnProperty(s[0])) {
            parseSearch[s[0]] = Array.isArray(parseSearch[s[0]]) ? [...parseSearch[s[0]], s[1]] : [parseSearch[s[0]], s[1]]
        } else if (['true', 'false'].includes(s[1])) {
            parseSearch[s[0]] = s[1] !== 'false'
        } else parseSearch[s[0]] = s[1]
    })

    return parseSearch;
};

export const convertObjectToQueryString = (object) => {
    let queryString = '?';
    Object.keys(object).forEach((k) => {
        if (object[k] !== null) {
            if (Array.isArray(object[k])) {
                queryString += object[k].map((o) => `${k}=${o}&`).join('');
            } else if (typeof object[k] !== 'string' || object[k].length > 0) {
                queryString += `${k}=${object[k]}&`;
            }
        }
    });

    queryString = queryString.substring(0, queryString.length - 1);

    return queryString;
};

export const convertSecondsToString = (seconds) => {
    let minutes = ~~(seconds / 60);
    if (minutes < 10) minutes = "0" + minutes;
    seconds = seconds % 60;
    if (seconds < 10) seconds = "0" + seconds;

    return `${minutes}:${seconds}`
}