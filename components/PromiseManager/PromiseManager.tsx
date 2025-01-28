import React, { useState } from 'react';
import CreatePromise from '../CreatePromise/CreatePromise';
import ScanPromise from '../ScanPromise/ScanPromise';

const PromiseManager = () => {
  const [activeView, setActiveView] = useState<'create' | 'scan'>('create');

  const handleViewChange = (value: 'create' | 'scan') => {
    setActiveView(value);
  };

  return activeView === 'create' ? (
    <CreatePromise onViewChange={handleViewChange} />
  ) : (
    <ScanPromise onViewChange={handleViewChange} />
  );
};

export default PromiseManager;
