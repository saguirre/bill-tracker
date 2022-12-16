import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const useGetRequest = (path: string) => {
  if (!path) {
    throw new Error('Path is required');
  }

  const url = baseUrl + path;

  const { data, error } = useSWR(url, fetcher);

  return { data, loading: !data && !error, error };
};

export const useGetRequestPaginated = (path: string) => {
  if (!path) {
    throw new Error('Path is required');
  }

  const url = baseUrl + path;
  const PAGE_LIMIT = 5;

  const { data, error, size, setSize } = useSWRInfinite(
    (index) => `${url}?_page=${index + 1}&_limit=${PAGE_LIMIT}`,
    fetcher
  );

  const finalData = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_LIMIT);

  return { finalData, error, isLoadingMore, size, setSize, isReachingEnd };
};
