/* eslint-disable no-unreachable */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@src/scss/style.scss';
import UiKit from '@src/components/views/UiKit';
import NotFound from '@src/components/views/NotFound';
import Home from '@src/components/views/Home';
import PublicRoutes from '@src/components/global/PublicRoutes';
import PrivateRoutes from '@src/components/global/PrivateRoutes';
import AppWrapper from './components/global/AppWrapper';
import Alert from './components/global/Alert';
import VideoUpload from '@src/components/views/VideoUpload';
import VideoProcessing from '@src/components/views/VideoProcessing';
import VideoResults from '@src/components/views/VideoResults';
import MyVideos from '@src/components/views/MyVideos';

function App() {
  return (
    <>
      <Alert />
      <Router>
        <Routes>
          <Route element={<AppWrapper />}>
            <Route path="/" element={<Home />} />
            <Route path="/ui-kit" element={<UiKit />} />
            <Route path="*" element={<NotFound />} />
            <Route element={<PublicRoutes />}>
              {/* NOTE: public routes go here */}
              <Route path="/public" element={<h1>Public Route</h1>} />
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/upload" element={<VideoUpload />} />
              <Route path="/processing/:videoId" element={<VideoProcessing />} />
              <Route path="/results/:videoId" element={<VideoResults />} />
              <Route path="/my-videos" element={<MyVideos />} />
              <Route path="/private" element={<h1>Private Route</h1>} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
