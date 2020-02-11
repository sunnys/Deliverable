import { secretKey } from  './../config/dev';
import { AsyncStorage } from 'react-native';
import SimpleCrypto from "simple-crypto-js";

const BASE_URL = "http://192.168.0.102:3000/api/v1";

export const api = async (url, method, body= null , headers= {} ) => {
    try {
        const endPoint = BASE_URL.concat(url);
        const reqBody = body ? JSON.stringify(body) : null;

        const fetchParams = {method, headers}

        if(method === "POST" && method === "PUT" && !reqBody) {
            throw new Error('Request Body required');
        }

        if(reqBody) {
            fetchParams.headers["Content-type"] = 'application/json';
            fetchParams.body = reqBody;
        }

        const fetchPromise = fetch(endPoint, fetchParams);

        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject();
            }, 3000)
        })

        const response = await Promise.race([fetchPromise, timeoutPromise]);

        return response;
    } catch(e) {
        return(e);
    }
}

export const fetchApi = async (url, method, body, statusCode, token = null, loader = false) => {
    try {
        const headers = {}

        const result = {
            token: null,
            success: false,
            responseBody: null
        };

        if(token) {
            headers["x-auth"] = token;
        }

        // const tokenHash = await getToken();
        // headers = { ...headers, ...tokenHash };
        // console.log("Headers: ", headers);

        const response = await api(url, method, body, headers);

        if(response.status === statusCode) {
            const expiry = response.headers.get("expiry");
            const client = response.headers.get("client");
            const token = response.headers.get("access-token");
            const tokenType = response.headers.get("token-type");
            const uid = response.headers.get("uid");
            setToken(token, client, expiry, tokenType, uid);
            result.success = true;
            result.token = token;
            let responseBody;
            const responseText = await response.json();
            try {
                responseBody = responseText;
            } catch (e) {
                responseBody = responseText;
            }

            result.responseBody = responseBody;
            return result;

        }

        let errorBody;
        const errorText = await response;

        try {
            errorBody = JSON.parse(errorText);
        } catch (e) {
            errorBody = errorText;
        }

        result.responseBody = errorBody;

        return result;
    } catch (error) {
        return error;
    }
}

const setToken = (token, client = null, expiry = null, tokenType = "Bearer", uid) => {
    if (token) {
        // if (!this.token) {
        let token = token;
        let tokenHash = {
            "access-token": token,
            "token-type": "Bearer",
            expiry: expiry,
            client: client,
            uid: uid
        };
        const stringyfiedTokenHashEncoded = JSON.stringify(tokenHash);
        let simpleCrypto = new SimpleCrypto(secretKey);
        let encryptedValue = simpleCrypto.encrypt(stringyfiedTokenHashEncoded)
        AsyncStorage.setItem("tokenHash", encryptedValue);
    }
}

export const getToken = () => {
    let tokenValue = null;
    // if (this.token) {
    //     tokenValue = this.tokenHash;
    //     return Promise.resolve(tokenValue);
    // } else {
        return AsyncStorage
            .getItem("tokenHash")
            .then(stringyfiedTokenHashEncoded => {
                // tokenValue = JSON.parse(atob(stringyfiedTokenHashEncoded));
                let simpleCrypto = new SimpleCrypto(secretKey);
                let decryptedValue = simpleCrypto.decrypt(stringyfiedTokenHashEncoded)
                tokenValue = JSON.parse(decryptedValue);
                return tokenValue;
            })
            .catch(err => {
                return {};
            });
    // }
}