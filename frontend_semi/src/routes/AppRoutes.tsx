import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import SignupPage from "../pages/SignupPage.tsx";
import SignupTermsPage from "../pages/SignupTermsPage.tsx";
import SignupCompletePage from "../pages/SignupCompletePage.tsx";
import MyPage from "../pages/MyPage.tsx";
import LearningPage from "../pages/LearningPage.tsx";
import FavoritePage from "../pages/FavoritePage.tsx";
import LecturePage from "../pages/LecturePage.tsx"
import LectureInsertForm from "../pages/LectureInsertForm.tsx"
import LectureUpdateForm from "../pages/LectureUpdateForm.tsx"
import PublicLayout from "../components/layout/PublicLayout.tsx";
import Introduce from "../pages/Introduce.tsx";
import NoticeContents from "../pages/NoticeContents.tsx";
import type { User } from "../types/User.ts";
import HowToUse from "../pages/HowToUse.tsx";

interface AppProps { // App.tsx에서 온 프롭스 - LoginPage.tsx에 전달만 함
    user: User | null; // 로그인하면 App.tsx의 setUser로 의미있는 데이터가 되어 프롭스로 받아짐 (로그인안하면 null)
    handleLoginSuccess: (userData: User) => void;
    handleLogout: (event: React.MouseEvent<HTMLElement>) => void;
}

function AppRoutes({ user, handleLoginSuccess, handleLogout }: AppProps) {

    return (
        <Routes>
            {/* Header 있는 그룹 */}
            <Route element={<PublicLayout user={user} handleLogout={handleLogout} />}>

                {/* members */}
                <Route path="/api/members/mypage" element={<MyPage />} />
                <Route path="/api/members/login" element={<LoginPage handleLoginSuccess={handleLoginSuccess} />} />
                <Route path="/api/members/signup" element={<SignupPage />} />

                {/* lecture */}
                <Route path="/api/lecture/list" element={<LecturePage />} />
                <Route path="/api/lecture/insert" element={<LectureInsertForm user={user} />} />
                <Route path="/api/lecture/update/:id" element={<LectureUpdateForm user={user} />} />

                {/* notices */}
                <Route path="/api/notices" element={<NoticeContents />} />

                {/* 백엔드와 소통하지 않는 페이지들 */}
                <Route path="/" element={<Home />} />

                <Route path="/api/members/mypage/favorite" element={<FavoritePage />} />
                <Route path="/api/members/mypage/learning" element={<LearningPage />} />

                <Route path="/signup/terms" element={<SignupTermsPage />} />
                <Route path="/signup/complete" element={<SignupCompletePage />} />

                <Route path="/introduce/" element={<Introduce />} />
                <Route path="/introduce/howtouse" element={<HowToUse />} />

            </Route>

        </Routes>
    );
}

export default AppRoutes;