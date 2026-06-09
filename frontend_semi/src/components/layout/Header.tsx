import { useNavigate } from "react-router-dom";
import logo from "../../icon/logo.svg";
import type { User } from "../../types/User";

type HeaderProps = {
  user: User | null;
  handleLogout: (event: React.MouseEvent<HTMLElement>) => void;
};

function Header({ user, handleLogout }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate("/")}>
        <img src={logo} alt="풀스택 강의실 로고" />
      </div>

      <div className="header-left">
        <div className="custom-dropdown">
          <button className="header-button">소개 ▾</button>

          <div className="custom-dropdown-menu">
            <div className="custom-dropdown-item" onClick={() => navigate("/introduce")}>사이트 소개</div>
            <div className="custom-dropdown-item" onClick={() => navigate("/introduce/howtouse")}>이용 방법</div>
          </div>
        </div>

        {user && (
          <>
            <button className="header-button" onClick={() => navigate("/api/lecture/list")}>▣ 강의실</button>
            <button className="header-button" onClick={() => navigate("/api/notices")}>▤ 공지사항</button>
          </>
        )}
      </div>


      <div className="header-right">
        {user ? (
          <><button className="header-button" onClick={() => navigate("/memberinfo/mypage/favorite")}> ★ 즐겨찾기</button>
            <button className="header-button" onClick={() => navigate("/api/members/mypage")}>♙ {user.name}</button>
            <button className="header-button" onClick={handleLogout}>
              ↪로그아웃
            </button>
          </>
        ) : (
          <>
            <button className="header-button" onClick={() => navigate("/api/members/login")}>
              LOGIN
            </button>
            <button
              className="header-button"
              onClick={() => navigate("/signup/terms")}
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;