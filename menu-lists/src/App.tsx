import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Preview";
import MenuCard from "./pages/menucard";
import Preview from "./pages/Preview";
import ItemMapping from "./pages/ItemMapping";
import UploadImages from "./pages/UploadImages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/menu" element={<MenuCard />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/item-mapping" element={<ItemMapping />} />
      <Route path="/upload-images" element={<UploadImages />} />
    </Routes>
  );
}

export default App;
