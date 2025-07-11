import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoComplete } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { prospectApi } from '../services/api';
import type { ProspectSearchResult } from '../types';

const ProspectSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: ['prospect-search', searchValue],
    queryFn: () => prospectApi.search(searchValue),
    enabled: searchValue.length > 0,
    staleTime: 30000, // Cache for 30 seconds
  });

  const options = searchResults.map((result: ProspectSearchResult) => ({
    value: result.key,
    label: (
      <div className="py-2">
        <div style={{ fontWeight: 500, color: '#3e2723' }}>{result.key}</div>
        <div style={{ fontSize: 12, color: '#8d5a49' }}>{result.customerName}</div>
      </div>
    ),
  }));

  const handleSelect = (value: string) => {
    navigate(`/prospect/${value}`);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className="w-full max-w-md">
      <AutoComplete
        value={searchValue}
        options={options}
        onSelect={handleSelect}
        onSearch={handleSearch}
        onChange={handleChange}
        placeholder="Search prospects by key (e.g., LIM)"
        allowClear
        size="large"
        notFoundContent={isFetching ? 'Searching...' : 'No prospects found'}
        classNames={{ popup: { root: 'prospect-search-dropdown' } }}
        filterOption={false}
        style={{
          width: '100%',
        }}
        className="prospect-search-autocomplete"
      />
    </div>
  );
};

export default ProspectSearch; 