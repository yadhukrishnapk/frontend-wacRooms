import React, { useRef } from 'react';
import useSWRInfinite from 'swr/infinite';
import { get } from '../../apiServices/apiServices';
import AnimatedList from '../../../bits/AnimeList';
import LoadingSpinner from '../../Shimmers/LoadingSpinner';

const fetcher = async (url) => {
  const response = await get(url);
  if (!response.success) throw new Error('Failed to fetch events');
  return response;
};

const EventListHome = () => {
  const listRef = useRef(null);

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && previousPageData.events.length === 0) return null;
    return `/event/getAllEvents?limit=8&skip=${pageIndex * 8}`;
  };

  const { data, error, size, setSize, isLoading, isValidating } = useSWRInfinite(
    getKey,
    fetcher,
    { revalidateOnFocus: false, initialSize: 1 }
  );

  const events = data ? [].concat(...data.map(page => page.events)) : [];
  const total = data && data[0] ? data[0].total : 0;
  const isLoadingMore = isValidating && events.length < total;
  const hasMore = events.length < total;

  const handleScroll = () => {
    if (!listRef.current || isLoading || isLoadingMore || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setSize(size + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="w-full py-6 px-8 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Events History</h1>
          {events.length > 0 && (
            <p className="text-sm text-gray-600">
              Rendered {events.length} out of {total} events
            </p>
          )}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center w-full p-6 md:p-8">
        <div className="w-full max-w-4xl">
          {isLoading && !events.length ? (
            <div className="flex items-center justify-center h-[70vh]">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <p className="text-red-600 text-lg text-center">Error: {error.message}</p>
          ) : (
            <>
              <AnimatedList
                items={events}
                onItemSelect={(item, index) => console.log(item, index)}
                showGradients={true}
                enableArrowNavigation={true}
                displayScrollbar={true}
                className="w-full"
                itemClassName="hover:-translate-y-1 hover:bg-gray-100"
                listRef={listRef}
                onScroll={handleScroll}
              />
              {isLoadingMore && (
                <div className="mt-4 flex justify-center">
                  <LoadingSpinner />
                </div>
              )}
              {!hasMore && events.length > 0 && (
                <p className="text-gray-500 text-sm mt-4 text-center">All events are rendered</p>
              )}
            </>
          )}
        </div>
      </main>
      
      <footer className="w-full py-4 px-8 text-center text-gray-500 text-sm border-t border-gray-200 bg-white">
        <p>© 2025 Events of WACRooms</p>
      </footer>
    </div>
  );
};

export default EventListHome;