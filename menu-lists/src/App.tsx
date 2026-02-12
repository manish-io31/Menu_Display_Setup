import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import MenuCard from "./components/MenuCard/MenuCard";
import Preview from "./pages/Preview/Preview";
import ItemMapping from "./pages/ItemMapping/ItemMapping";
import UploadImages from "./pages/UploadImages/UploadImages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Preview />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/menu" element={<MenuCard />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/item-mapping" element={<ItemMapping />} />
      <Route path="/upload-images" element={<UploadImages />} />
    </Routes>
  );
}

export default App;
