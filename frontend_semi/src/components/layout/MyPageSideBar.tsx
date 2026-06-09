import "./MyPageSideBar.css";
import { useLocation, useNavigate } from "react-router-dom";

function MyPageSideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMember = location.pathname === "/api/members/mypage";
  const isLearning = location.pathname === "/api/members/mypage/learning";
  const isFavorite = location.pathname === "/api/members/mypage/favorite";
//===========================================================================
// 아래의 변수는 각 페이지의 위치일때 페이지 아이콘의 이미지를 바꾸기 위한 변수입니다. 삼항연산자를 활용하여
// 멤버일때 이것, 학습일때 이것, 즐겨찾기일떄 이것, 식으로 작동하고 디폴트는 멤버일때입니다.
  const bottomImage = isMember 
               ?  "/mypage-profile.svg" 
               : isLearning 
               ? "/mypage-learning.svg" 
               : isFavorite 
               ? "/mypage-favorite.svg"
               : "/mypage-profile.svg" ;

  const bottomTitle = isMember 
                ? "PROFILE" 
                : isLearning 
                ? "LEARNING-INFO" 
                : isFavorite 
                ? "FAVORITE"
                : "PROFILE"; 
//===========================================================================

  return (
    <aside className="mypage-sidebar">
      <h2 className="mypage-sidebar-title">마이페이지</h2>
      <div>
      <button
        className={isLearning ? "mypage-menu active" : "mypage-menu"}
        onClick={()=> navigate("/api/members/mypage/learning")}
      >
        <span >01</span>
            학습정보
     </button>
      </div>

      <div>
      <button
        className={isMember ? "mypage-menu active" : "mypage-menu"}
        onClick={()=>navigate("/api/members/mypage")} 
      >
        <span >02</span>
             회원정보
      </button>
      </div>

      <div>
      <button
        className={isFavorite ? "mypage-menu active" : "mypage-menu"}
        onClick={()=>navigate("/api/members/mypage/favorite")}
      >
        <span>03</span>
            즐겨찾기
      </button>
      </div>
        <div className="mypage-sidebar-guide">
        <p>ⓘ 내 학습과 계정 정보를</p>
        <p>한 곳에서 관리할 수 있습니다.</p>
      </div>

        <div className="mypage-sidebar-bottom">
        <img src={bottomImage} alt={bottomTitle} />
        </div>

    </aside>
  );
}

export default MyPageSideBar;