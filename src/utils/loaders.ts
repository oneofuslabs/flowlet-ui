import { supabase } from "@/lib/supabase";

const apiUrl = import.meta.env.VITE_API_URL;
const keyValueToParamString = ({
  key,
  value,
}: {
  key: string;
  value: string;
}) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

const queryParamsToQueryString = (params: Record<string, string>) => {
  if (!params) return "";

  return Object.keys(params)
    .reduce<string[]>((result, key) => {
      const value = params[key];
      return !value
        ? result
        : [...result, keyValueToParamString({ key, value })];
    }, [])
    .join("&");
};

const buildUrl = (url: string, params: Record<string, string>) => {
  const queryString = queryParamsToQueryString(params);
  return queryString.length === 0 ? url : `${url}?${queryString}`;
};

const defaultContentTypeHeaders = {
  "content-type": "application/json",
};

const authorizationHeaders = async () => ({
  authorization: `Bearer ${
    (await supabase.auth.getSession()).data.session?.access_token
  }`,
});

const getHeaders = async (headers: Record<string, string> = {}) => ({
  ...(await authorizationHeaders()),
  ...defaultContentTypeHeaders,
  ...headers,
});

export type ErrorResponse = {
  url: string;
  error: string;
  status: number;
  statusText: string;
};

const handleResponse = async (res: Response) => {
  // const OK401 = [
  //   `${apiUrl}/api/v1/auth/login`,
  //   `${apiUrl}/api/v1/auth/register`,
  // ];

  if (res.ok) {
    return await res.json();
  } else {
    // Check for 401 Unauthorized
    // if (res.status === 401 && !OK401.includes(res.url)) {
    //   return logOut();
    // }
    // Continue with existing error handling
    return res.json().then((responseBody: Record<string, unknown>) =>
      Promise.reject({
        url: res.url,
        error: responseBody?.error || responseBody?.Message,
        status: res.status,
        statusText: res.statusText,
      })
    );
  }
};

export const postJSON = async (
  url: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
) =>
  fetch(`${apiUrl}${url}`, {
    method: "POST",
    headers: await getHeaders(headers),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const putJSON = async (
  url: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
) =>
  fetch(`${apiUrl}${url}`, {
    method: "PUT",
    headers: await getHeaders(headers),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const patchJSON = async (
  url: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
) =>
  fetch(`${apiUrl}${url}`, {
    method: "PATCH",
    headers: await getHeaders(headers),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const getJSON = async (
  url: string,
  queryParams: Record<string, string> = {},
  headers: Record<string, string> = {}
) => {
  const urlWithQueryParams = buildUrl(url, queryParams);
  return fetch(`${apiUrl}${urlWithQueryParams}`, {
    method: "GET",
    headers: await getHeaders(headers),
  }).then(handleResponse);
};

export const deleteJSON = async (
  url: string,
  queryParams: Record<string, string> = {},
  headers: Record<string, string> = {}
) => {
  const urlWithQueryParams = buildUrl(url, queryParams);
  return fetch(`${apiUrl}${urlWithQueryParams}`, {
    method: "DELETE",
    headers: await getHeaders(headers),
  }).then(handleResponse);
};
