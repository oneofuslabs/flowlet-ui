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

const authorizationHeaders = () => ({
  authorization: `Bearer 123`,
});

const getHeaders = (headers: Record<string, string> = {}) => ({
  ...authorizationHeaders(),
  ...defaultContentTypeHeaders,
  ...headers,
});

const handleResponse = (res: Response) =>
  res.ok
    ? res.json()
    : res.json().then((responseBody: Record<string, unknown>) =>
        Promise.reject({
          url: res.url,
          error: responseBody?.error || responseBody?.Message,
          status: res.status,
          statusText: res.statusText,
        })
      );

export const postJSON = (
  url: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
) =>
  fetch(url, {
    method: "POST",
    headers: getHeaders(headers),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const putJSON = (
  url: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
) =>
  fetch(`${url}`, {
    method: "PUT",
    headers: getHeaders(headers),
    body: JSON.stringify(body),
  }).then(handleResponse);

export const getJSON = (
  url: string,
  queryParams: Record<string, string> = {},
  headers: Record<string, string> = {}
) => {
  const urlWithQueryParams = buildUrl(url, queryParams);
  return fetch(`${urlWithQueryParams}`, {
    method: "GET",
    headers: getHeaders(headers),
  }).then(handleResponse);
};

export const deleteJSON = (
  url: string,
  queryParams: Record<string, string> = {},
  headers: Record<string, string> = {}
) => {
  const urlWithQueryParams = buildUrl(url, queryParams);
  return fetch(`${urlWithQueryParams}`, {
    method: "DELETE",
    headers: getHeaders(headers),
  }).then(handleResponse);
};
