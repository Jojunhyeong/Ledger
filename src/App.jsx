
import { useEffect } from 'react';
import './App.css'
import AppRoutes from './router'
import { useAuthStore } from './store/useAuthStore'

function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
   <AppRoutes/>
  )
}

export default App
