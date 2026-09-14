import { AppProvider } from "./AppContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "./Login";
import { MainWorkspace } from "./MainWorkspace";

export function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <MainWorkspace />
              </ProtectedRoute>
            }
          />
          {/* Legacy route redirects into the ONE workspace */}
          <Route path="/dashboard" element={<Navigate to="/workspace" replace />} />
          <Route path="/projects" element={<Navigate to="/workspace" replace />} />
          <Route path="/data-input" element={<Navigate to="/workspace" replace />} />
          <Route path="/extraction" element={<Navigate to="/workspace" replace />} />
          <Route path="/activity-matching" element={<Navigate to="/workspace" replace />} />
          <Route path="/validation" element={<Navigate to="/workspace" replace />} />
          <Route path="/progress" element={<Navigate to="/workspace" replace />} />
          <Route path="/risks" element={<Navigate to="/workspace" replace />} />
          <Route path="/recommendations" element={<Navigate to="/workspace" replace />} />
          <Route path="/feedback" element={<Navigate to="/workspace" replace />} />
          <Route path="/learning" element={<Navigate to="/workspace" replace />} />
          <Route path="/analytics" element={<Navigate to="/workspace" replace />} />
          <Route path="/reports" element={<Navigate to="/workspace" replace />} />
          <Route path="/forecast" element={<Navigate to="/workspace" replace />} />
          <Route path="/admin" element={<Navigate to="/workspace" replace />} />
          <Route path="/citizen" element={<Navigate to="/workspace" replace />} />
          
          {/* Default fallback */}
          <Route path="*" element={<Navigate to="/workspace" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
