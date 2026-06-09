import AppRoutes from "./routes/AppRoutes";
import "./components/layout/Header.css";
import { useEffect, useState } from "react";
import type { User } from "./types/User";
import { useNavigate } from "react-router-dom";

function App() {
  // 로그인 안한 상태 : User는 null
  // 로그인 한 상태 : User는 값이 있음
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => { // 사이트가 처음 켜지거나 새로고침 했을때 setUser 관리
    // 로컬스토리지에 보관된 'user'정보를 가져옴
    const loginUser = localStorage.getItem('user');
    if (typeof loginUser === 'string') {
      // 로컬스토리지에 담긴 문자열인 'user'인 loginUser를 자바스크립트 객체{ } 형태로 형식으로 바꿈
      // key: value 형태
      const parsed = JSON.parse(loginUser);
      setUser(parsed);
    }
  }, []);

  const handleLoginSuccess = (userData: User) => { // LoginPage를 통해 로그인했을때 setUser 관리
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('로그인 성공');
  }

  const navigate = useNavigate();

  // 로그인한 사용자가 '로그 아웃' 버튼을 클릭했습니다.
  const handleLogout = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    console.log('로그 아웃 성공');
    // 로그아웃시 이동할 페이지 설정
    navigate(`/api/members/login`);
  };


  return (
    <>
      <AppRoutes user={user}
        handleLoginSuccess={handleLoginSuccess}
        handleLogout={handleLogout} />
    </>
  );
}

export default App;

{/*
  페이지별 변동주기
    <aside className="sidebar">
      <div className="sidebar-dom sidebar-dom1">{dom1}</div>
      <div className="sidebar-dom sidebar-dom2">{dom2}</div>
      <div className="sidebar-dom sidebar-dom3">{dom3}</div>
    </aside>
*/}