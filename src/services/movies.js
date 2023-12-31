import { BASE_URL, ACCESS_TOKEN } from '../utils/constants';

const getOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`
  }
};

export async function getTrendingMoviesPreview ({ page = 1 }) {
  const url = `${BASE_URL}/trending/movie/day?page=${page}&language=es`;

  try {
    const res = await fetch(url, getOptions);

    if (!res.ok) throw Error(res);

    const data = await res.json();
    if (page > data?.total_pages) return [];
    return data?.results;
  } catch (error) {
    console.error(error);
  }
}

export async function getCategoriesPreview () {
  const url = `${BASE_URL}/genre/movie/list?language=es`;

  try {
    const res = await fetch(url, getOptions);

    if (!res.ok) throw Error(res);

    const data = await res.json();
    return data?.genres;
  } catch (error) {
    console.error(error);
  }
}

export async function findById ({ id }) {
  const url = `${BASE_URL}/movie/${id}?language=es`;

  try {
    const res = await fetch(url, getOptions);

    if (!res.ok) throw Error(res);

    const data = await res.json();

    return data;
  } catch (error) {
    console.error({ error });
  }
}

export async function findAllByCategory ({ id, page = 1 }) {
  const url = `${BASE_URL}/discover/movie?with_genres=${id}&page=${page}`;

  try {
    const res = await fetch(url, getOptions);

    if (!res.ok) throw Error(res);

    const data = res.json();

    if (page > data?.total_pages) return [];
    return data?.results;
  } catch (error) {
    console.error({ error });
  }
}

export async function searchByMovieName ({ query, page = 1 }) {
  const url = `${BASE_URL}/search/movie?query=${query}&page=${page}`;

  try {
    const res = await fetch(url, getOptions);

    if (!res.ok) throw Error(res);

    const data = res.json();

    if (page > data?.total_pages) return [];
    return data?.results;
  } catch (error) {
    console.error({ error });
  }
}

export async function getRelatedMovies ({ movieId, page = 1 }) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/recommendations?page=${page}`);

    if (!res.ok) throw Error(res);

    const data = res.json();

    if (page > data?.total_pages) return [];

    return data?.results;
  } catch (error) {
    console.error(error);
  }
}
