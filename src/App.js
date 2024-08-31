import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import collegesData from './collegesData.json';
import './styles.css';

const UserReview = ({ rating, numberOfReviews, tag, tags }) => {
  const [selectedTag, setSelectedTag] = useState(tag);

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  return (
    <div className="user-review">
      <span className="rating">{rating}</span>
      <span className="number-of-reviews">Based on {numberOfReviews} User Reviews</span>
      <select className="tag-dropdown" value={selectedTag} onChange={handleTagChange}>
        <option value="">Select a tag</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            ✓ {tag}
          </option>
        ))}
      </select>
    </div>
  );
};

const CollegeTable = ({ colleges, handleSort, sortBy, sortOrder }) => {
  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => handleSort('rank')} className="sortable-header">
            CD Rank {sortBy === 'rank' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th>Colleges</th>
          <th onClick={() => handleSort('fees')} className="sortable-header">
            Course Fees {sortBy === 'fees' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th onClick={() => handleSort('placement')} className="sortable-header">
            Placement {sortBy === 'placement' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th onClick={() => handleSort('userReviews')} className="sortable-header">
            User Reviews {sortBy === 'userReviews' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
          <th onClick={() => handleSort('ranking')} className="sortable-header">
            Ranking {sortBy === 'ranking' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </th>
        </tr>
      </thead>
      <tbody>
        {colleges.map((college) => (
          <tr key={college.id} className={college.featured ? 'featured' : ''}>
            <td>{college.rank}</td>
            <td>
              {college.featured && <button className="featured-button">Featured</button>}
              <div className="college-name">{college.collegeName}</div>
              <div>{college.location}</div>
              <div>{college.course}</div>
              <div className="action-links">
                <span> Apply Now | </span>
                <span> Download Brochure </span>
              </div>
            </td>
            <td>{college.fees}</td>
            <td>{college.placement}</td>
            <td>
              <UserReview
                rating={college.userReviews}
                numberOfReviews={289}
                tags={[
                  "Best in Social Life",
                  "Best in Academics",
                  "Best in Placements",
                  "Best in Infrastructure"
                ]}
              />
            </td>
            <td>{college.ranking}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const App = () => {
  const [colleges, setColleges] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const batchSize = 10;

  useEffect(() => {
    // Initial load of 10 items
    const initialData = collegesData.slice(0, batchSize);
    setColleges(initialData);
  }, []);

  const fetchMoreData = () => {
    if (colleges.length >= collegesData.length) {
      setHasMore(false);
      return;
    }
    const newData = collegesData.slice(colleges.length, colleges.length + batchSize);
    setColleges((prevColleges) => [...prevColleges, ...newData]);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleSort = (field) => {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(order);

    const sortedData = [...colleges].sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];

      // Handle numeric sorting
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.replace(/[^\d]/g, ''); // Remove non-numeric characters
        valueB = valueB.replace(/[^\d]/g, ''); // Remove non-numeric characters
      }

      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setColleges(sortedData);
  };

  const filteredColleges = colleges.filter((college) =>
    college.collegeName.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="App">
      <h1>College List</h1>
      <input
        type="text"
        placeholder="Search by college name"
        onChange={handleSearch}
        style={{ marginBottom: '20px', padding: '10px', width: '300px' }}
      />
      <InfiniteScroll
        dataLength={colleges.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more data</p>}
      >
        <CollegeTable colleges={filteredColleges} handleSort={handleSort} sortBy={sortBy} sortOrder={sortOrder} />
      </InfiniteScroll>
    </div>
  );
};

export default App;