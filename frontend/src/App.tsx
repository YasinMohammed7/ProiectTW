import { Routes } from "react-router";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import { LoginScreen } from "./screens/LoginScreen";
import { DirectionsScreen } from "./screens/DirectionsScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<LoginScreen />} />
        <Route index element={<DirectionsScreen />} />
      </Route>
    </Routes>
  );
}

export default App;
