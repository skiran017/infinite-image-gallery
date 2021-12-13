import React, { useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

export default function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const getPhotos = useCallback(() => {
    let apiURL = `https://api.unsplash.com/photos/?`;
    if (query)
      apiURL = `https://api.unsplash.com/search/photos/?query=${query}`;

    apiURL += `&page=${page}`;
    apiURL += `&client_id=${accessKey}`;
    fetch(apiURL)
      .then((res) => res.json())
      .then((data) => {
        const imagesFromApi = data.results ?? data; //data.results does not exist
        //if page is 1 , we need a whole new array of images
        if (page === 1) setImages(imagesFromApi);

        //if page > 1 , we add infinite scroll
        setImages((images) => [...images, ...imagesFromApi]); // to add more images at bottom(nextPage)
      });
  }, [page, query]); // function is not going to change memoisation

  useEffect(() => {
    getPhotos();
  }, [page, getPhotos, query]); //getPhotos is run when the page changes

  function searchPhotos(e) {
    e.preventDefault();
    setPage(1);
    getPhotos();
    // fetch(
    //   `https://api.unsplash.com/search/photos/?client_id=${accessKey}&page=${page}&query=${query}`
    // )
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setImages(data.results);
    //     // setImages((images) => [...images, ...data.results]); // to add more images at bottom(nextPage)
    //   })
    //   .catch(alert);
  }

  //return error if no accssKey
  if (!accessKey) {
    return (
      <a href="https://unsplash.com/developers" className="error">
        Required: Get your UnSplash API first
      </a>
    );
  }

  return (
    <div className="app">
      <h1>Unsplash Image Gallery!</h1>

      <form onSubmit={searchPhotos}>
        <input
          type="text"
          placeholder="Search Unsplash..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>Search</button>
      </form>

      <InfiniteScroll
        dataLength={images.length} //This is important field to render the next data
        next={() => setPage((page) => page + 1)}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <div className="image-grid">
          {images.map((image, index) => (
            <a
              className="image"
              key={index}
              href={image.links.html}
              target="_blank" //to open in new tab
              rel="noopener noreferrer" // geos with target to avoid security risk
            >
              <img src={image.urls.regular} alt={image.alt_description} />
            </a>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
