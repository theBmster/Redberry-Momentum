import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import '/src/index.css';

import NotFound404 from '/src/pages/Notfound404';
import TasksPage from '/src/pages/TasksPage.jsx';
import TaskPage from '/src/pages/TaskPage';
import TaskInnerPage from '/src/pages/TaskInnerPage';


import { APIProvider } from './contexts/APIProvider';
import FilterProvider from './contexts/FilterProvider';
import { ModalProvider } from './contexts/ModalProvider';

const App = () => (
  <StrictMode>
    <Router>
      <APIProvider>
        <FilterProvider>
          <ModalProvider>
            <Routes>
              <Route path="/" element={<TasksPage />} />
              <Route path="/create" element={<TaskPage />} />
              <Route path="/task/:id" element={<TaskInnerPage />} />
              <Route path="*" element={<NotFound404 />} />
            </Routes>
          </ModalProvider>
        </FilterProvider>
      </APIProvider>
    </Router>
  </StrictMode>
);

createRoot(document.getElementById('root')).render(<App />);
