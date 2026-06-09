import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-text">
          <h1>배움이 쉬워지는 온라인 학습 공간</h1>
          <p>
            강의 수강부터 학습자료 확인, 문제풀이까지
            <br />
            모든 학습 활동을 한 곳에서 시작하세요.
          </p>

          <div className="home-hero-buttons">
            <button
              className="home-primary-button"
              onClick={() => navigate("/api/lecture/list")}
            >
              ▶ 학습 시작
            </button>

            <button
              className="home-outline-button"
              onClick={() => navigate("/api/lecture/list")}
            >
              📖 강의 둘러보기
            </button>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="hero-chart-card">
            <div className="chart-circle" />
            <div className="chart-bars">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="hero-student">
            <div className="student-head" />
            <div className="student-body" />
            <div className="student-laptop" />
          </div>

          <div className="hero-book-stack">
            <div>HTML</div>
            <div>JavaScript</div>
            <div>Python</div>
          </div>

          <div className="hero-bubble bubble-one">🎓</div>
          <div className="hero-bubble bubble-two">💡</div>
        </div>
      </section>

      <section className="home-dashboard">
        <div className="home-card recommended-card">
          <div className="home-card-header">
            <h2>☆ 추천 강의</h2>
            <button onClick={() => navigate("/api/lecture/list")}>더보기 ›</button>
          </div>

          <div className="course-list">
            <div className="course-card">
              <div className="course-image course-html">{"</>"}</div>
              <div className="course-info">
                <h3>HTML/CSS 기초</h3>
                <p>웹 개발의 기초를 탄탄하게!</p>

                <div className="course-progress-row">
                  <div className="course-progress">
                    <span style={{ width: "65%" }} />
                  </div>
                  <strong>65%</strong>
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-image course-js">JS</div>
              <div className="course-info">
                <h3>JavaScript 입문</h3>
                <p>자바스크립트 핵심 개념 이해하기</p>

                <div className="course-progress-row">
                  <div className="course-progress">
                    <span style={{ width: "42%" }} />
                  </div>
                  <strong>42%</strong>
                </div>
              </div>
            </div>

            <div className="course-card">
              <div className="course-image course-python">PY</div>
              <div className="course-info">
                <h3>Python 시작하기</h3>
                <p>파이썬으로 프로그래밍 입문!</p>

                <div className="course-progress-row">
                  <div className="course-progress">
                    <span style={{ width: "30%" }} />
                  </div>
                  <strong>30%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="home-card notice-card">
          <div className="home-card-header">
            <h2>🔔 공지사항</h2>
            <button onClick={() => navigate("/api/notices")}>더보기 ›</button>
          </div>

          <div className="notice-list">
            <div className="notice-item">
              <div>
                <strong>5월 강의 업데이트 안내</strong>
                <p>신규 강의가 업데이트 되었습니다.</p>
              </div>
              <span>05.20</span>
            </div>

            <div className="notice-item">
              <div>
                <strong>서버 점검 안내</strong>
                <p>안정적인 서비스 제공을 위한 점검입니다.</p>
              </div>
              <span>05.18</span>
            </div>

            <div className="notice-item">
              <div>
                <strong>학습 챌린지 이벤트 안내</strong>
                <p>매일 학습하고 선물을 받아가세요!</p>
              </div>
              <span>05.15</span>
            </div>
          </div>
        </div>

        <div className="home-card status-card">
          <div className="home-card-header">
            <h2>📊 나의 학습 현황</h2>
          </div>

          <div className="status-list">
            <div className="status-item">
              <div className="status-icon blue">▶</div>

              <div className="status-content">
                <p>완료한 강의</p>
                <strong>12강 <span>/ 30강</span></strong>
              </div>

              <div className="status-progress">
                <span style={{ width: "40%" }} />
              </div>

              <em>40%</em>
            </div>

            <div className="status-item">
              <div className="status-icon green">◷</div>

              <div className="status-content">
                <p>오늘의 학습 시간</p>
                <strong>1시간 25분</strong>
              </div>

              <div className="status-progress">
                <span style={{ width: "70%" }} />
              </div>

              <em>목표 2시간</em>
            </div>

            <div className="status-item">
              <div className="status-icon purple">◎</div>

              <div className="status-content">
                <p>문제풀이 정답률</p>
                <strong>78%</strong>
              </div>

              <div className="status-progress">
                <span style={{ width: "78%" }} />
              </div>

              <em>목표 80%</em>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;