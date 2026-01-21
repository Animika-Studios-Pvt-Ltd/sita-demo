import { Auth0Provider } from "@auth0/auth0-react";

export const Auth0Wrapper = ({ children }) => (
    <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
            redirect_uri: window.location.origin + "/auth",
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: "openid profile email phone",
        }}
        cacheLocation="localstorage"
        useRefreshTokens={true}
    >
        {children}
    </Auth0Provider>
);
