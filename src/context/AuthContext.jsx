import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { setGithubToken, getRateLimit } from '../services/githubService';

const AuthContext = createContext({
    token: null,
    user: null,
    isConnected: false,
    rateLimit: null,
    isVerifying: false,
    tokenError: null,
    connectToken: async () => {},
    disconnectToken: () => {},
    refreshRateLimit: async () => {},
});

export const AuthProvider = ({ children }) => {
    const [token, setTokenState] = useState(() => storageService.getToken());
    const [user, setUser] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [rateLimit, setRateLimit] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [tokenError, setTokenError] = useState(null);

    const refreshRateLimit = useCallback(async () => {
        try {
            const data = await getRateLimit();
            if (data) {
                setRateLimit(data);
            }
        } catch {
            // Non-blocking rate limit fetch failure fallback
        }
    }, []);

    // Verify token with GitHub API GET /user
    const verifyToken = useCallback(async (tokenToVerify) => {
        if (!tokenToVerify) {
            setUser(null);
            setIsConnected(false);
            setGithubToken('');
            return { success: false, error: 'No token provided' };
        }

        setIsVerifying(true);
        setTokenError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        try {
            const cleanedToken = tokenToVerify.trim();
            const authPrefix = cleanedToken.startsWith('token ') || cleanedToken.startsWith('Bearer ') ? '' : 'Bearer ';

            const response = await fetch('https://api.github.com/user', {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                    Authorization: `${authPrefix}${cleanedToken}`,
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setIsConnected(true);
                setTokenState(cleanedToken);
                storageService.saveToken(cleanedToken);
                setGithubToken(cleanedToken);
                await refreshRateLimit();
                return { success: true, user: userData };
            } else {
                let errorMsg = 'Invalid or Expired Token';
                if (response.status === 401) {
                    errorMsg = 'Invalid or Expired Token. Please check your Personal Access Token credentials.';
                } else if (response.status === 403) {
                    errorMsg = 'API Rate Limit Reached or Forbidden Token Scopes. Check token permissions.';
                }

                setUser(null);
                setIsConnected(false);
                setTokenError(errorMsg);
                return { success: false, error: errorMsg };
            }
        } catch (err) {
            clearTimeout(timeoutId);
            let errorMsg = 'Failed to connect to GitHub API. Please check your internet connection.';
            if (err.name === 'AbortError') {
                errorMsg = 'Verification timed out. GitHub API did not respond in time.';
            }

            setUser(null);
            setIsConnected(false);
            setTokenError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsVerifying(false);
        }
    }, [refreshRateLimit]);

    // On mount, auto-verify token if present in localStorage
    useEffect(() => {
        const storedToken = storageService.getToken();
        if (storedToken) {
            setGithubToken(storedToken);
            verifyToken(storedToken);
        } else {
            refreshRateLimit();
        }
    }, [verifyToken, refreshRateLimit]);

    const connectToken = async (newTokenStr) => {
        const result = await verifyToken(newTokenStr);
        return result;
    };

    const disconnectToken = useCallback(() => {
        storageService.saveToken(null);
        setGithubToken('');
        setTokenState(null);
        setUser(null);
        setIsConnected(false);
        setTokenError(null);
        refreshRateLimit();
    }, [refreshRateLimit]);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isConnected,
                rateLimit,
                isVerifying,
                tokenError,
                connectToken,
                disconnectToken,
                refreshRateLimit,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
