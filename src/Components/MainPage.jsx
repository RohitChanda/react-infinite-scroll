import React, { useCallback, useEffect, useRef, useState } from "react";
import CardComponent from "./CardComponent";

const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loaderRef = useRef(null);
  const observerRef = useRef(null); // To keep reference of the observer


  const loadMoreItems = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(
      `https://dummyjson.com/products?limit=10&skip=${page * 10}`
    );
    const data = await response.json();
    // console.log("data.products", data.products);
    if (data.products.length == 0) {
      setHasMore(false);
    } else {
      setProducts((prev) => [...prev, ...data.products]);
      setPage((prev) => prev + 1);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate loading delay
  }, [page]);

  useEffect(() => {
    loadMoreItems()
  }, [])

  useEffect(() => {
    if(observerRef.current) {
        observerRef.current.disconnect(); // Clean up previous observer
    }

    observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
            loadMoreItems();
        }
    });

    if (loaderRef.current) {
        observerRef.current.observe(loaderRef.current);
    }

    return () => observerRef.current.disconnect();  

  }, [isLoading, loadMoreItems]);

  return (
    <div className="products-list">
      {products.map((product) => {
        return <CardComponent data={product} key={product.id} />;
      })}

    {
        hasMore && (
        <div ref={loaderRef}>
            {isLoading  ? 'Loading...' : ''}
        </div>
        )
    }
    </div>
  );
};

export default MainPage;
