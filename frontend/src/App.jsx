import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import ErrorExplainer from './pages/ErrorExplainer';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Analyzer from './pages/Analyzer';
import About from './pages/About';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explain" element={<ErrorExplainer />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/library" element={<Library />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
