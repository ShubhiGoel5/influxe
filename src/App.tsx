import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import { MyListsPage } from "@/pages/MyListsPage";
import { CampaignsPage } from "@/pages/CampaignsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:username" element={<ProfileDetailPage />} />
        <Route path="/lists" element={<MyListsPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
