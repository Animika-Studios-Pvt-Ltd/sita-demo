export const getSubdomain = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length === 1 || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
        return null;
    }
    if (parts[parts.length - 1] === 'localhost') {
        if (parts.length === 2) return parts[0];
        return null;
    }
    if (parts.length > 2) {
        return parts[0];
    }

    return null;
};

export const getRootDomain = () => {
    const hostname = window.location.hostname;

    if (hostname.includes('localhost')) {
        return 'localhost';
    }
    const parts = hostname.split('.');
    if (parts.length === 1 || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
        return hostname;
    }
    if (parts.length >= 2) {
        return `.${parts.slice(-2).join('.')}`;
    }

    return hostname;
};

export const getAppUrl = (targetSubdomain, path = '/') => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
    let rootDomain = hostname;
    const currentSub = getSubdomain();

    if (currentSub) {
        if (hostname.startsWith(`${currentSub}.`)) {
            rootDomain = hostname.substring(currentSub.length + 1);
        }
    }

    const newHost = targetSubdomain ? `${targetSubdomain}.${rootDomain}` : rootDomain;
    return `${protocol}//${newHost}${port}${path.startsWith('/') ? path : '/' + path}`;
};
