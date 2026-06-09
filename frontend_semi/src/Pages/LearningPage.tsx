import "../components/layout/MyPageSideBar";
import MyPageSideBar from "../components/layout/MyPageSideBar";
import "./MyPage.css";

function MyPage() {

    return(
        <div className="mypage-page">
            <MyPageSideBar /> 
             <main className="mypage-main">
                <section className="mypage-panel">
                <h1>학습정보 페이지</h1>
                <span>테스트</span>
                </section>
             </main>
        </div>     
    );

}

export default MyPage;