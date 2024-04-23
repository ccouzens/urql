import React, { Suspense } from 'react';
import { gql, useQuery, useFragment } from 'urql';

const SecondVerseFragment = gql`
  fragment secondVerseFields on Song {
    secondVerse
  }
`;

const SONGS_QUERY = gql`
  query App_Query {
    song {
      firstVerse
      ...secondVerseFields @defer
    }
    alphabet @stream(initialCount: 3) {
      char
    }
  }

  ${SecondVerseFragment}
`;

const Song = React.memo(function Song({ song }) {
  return (
    <section>
      <p>{song.firstVerse}</p>
      <Suspense fallback={'Loading song 2...'}>
        <DeferredSong data={song} />
      </Suspense>
      <p>{song.secondVerse}</p>
    </section>
  );
});

const DeferredSong = ({ data }) => {
  const result = useFragment({
    query: SecondVerseFragment,
    data,
  });
  return <p>{result.secondVerse}</p>;
};

const LocationsList = () => {
  const [result] = useQuery({
    query: SONGS_QUERY,
  });

  const { data } = result;

  return (
    <div>
      {data && (
        <>
          <Song song={data.song} />
          {data.alphabet.map(i => (
            <div key={i.char}>{i.char}</div>
          ))}
        </>
      )}
    </div>
  );
};

export default LocationsList;
