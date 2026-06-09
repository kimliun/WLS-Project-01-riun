import "../components/layout/MyPageSideBar";
import MyPageSideBar from "../components/layout/MyPageSideBar";
import "./MyPage.css";

function FavoritePage() {

    return(
        <div className="mypage-page">
            <MyPageSideBar /> 
             <main className="mypage-main">
                <section className="mypage-panel">
                <h1>즐겨찾기 페이지</h1>
                <span>테스트</span>
                </section>
             </main>
        </div>     
    );

}

export default FavoritePage;