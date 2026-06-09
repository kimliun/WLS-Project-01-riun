import { useEffect, useState } from "react";
import type { Lecture } from "../../types/Lecture";
import { useNavigate } from "react-router-dom";
import "./LectureSidebar.css";

interface LectureSidebarProps {
    lectures: Lecture[]; // 전체 강의 목록 배열
    setCurrentLecture: (lecture: Lecture) => void; // 강의 선택 시 부모 상태를 바꿀 함수
    currentLecture_id: number | null; // 현재 선택된 강의의 ID
}

function LectureSidebar({
    lectures,
    setCurrentLecture,
    currentLecture_id,
}: LectureSidebarProps) {
    const navigate = useNavigate();

    // lectures.reduce( (acc, lecture => {}, {} as Record<string, Lecture[]>) ) :
    // lectures 배열을 반복문으로 돌리는데
    // acc라는 객체{}에 lectures 배열에서 꺼낸 lecture를 value로 넣을 것이다.
    // acc라는 객체의 key 타입은 string이고 value 타입은 Lecture[] 이다.
    // ** 결과값 : 대주제(category)를 key로 value는 그에 해당하는 강의들이 들어있음 **
    const groupedLectures = lectures.reduce((acc, lecture) => {
        if (!acc[lecture.category]) {
            // 객체[key] : 객체의 key의 value를 가져옴
            // acc 객체의 key가 lecture.category인 value를 빈배열로 만들어놓기
            acc[lecture.category] = [];
        }

        // 위에서 만든 key가 lecture.category인 빈 배열( acc[lecture.category] )에 lecture 객체를 넣는데
        // 이 lecture 객체는 LecturePage.tsx에서 프롭스로 받은 Lecture[]인 lectures 배열에 있는 객체
        // 그래서 그 객체의 category가 같은 것들만 모아서 category를 기준으로(key로) lecture 객체를 value로 넣음
        acc[lecture.category].push(lecture);

        // 그렇게 모아서 만든 acc 객체를 groupedLectures 변수(객체)에 넣음
        return acc;

        // {}은 acc의 초기값 - 즉, 객체로 acc를 정의하겠다라는 뜻
        // as Record<string, Lecture[]> :
        // Record를 이용해서 타입 정의 : acc라는 객체는 key를 string으로 받고 value를 Lecture[]로 받음
    }, {} as Record<string, Lecture[]>);

    // 💡 정렬 로직
    // groupedLectures 객체의 value인 lecture객체들이 들어있는 배열의 순서를 id기준 오름차순으로 재정렬하기
    // 각 카테고리 내부의 강의들을 id 오름차순(옛날 순)으로 정렬
    // Object.keys() : 매개변수를 가져와서 key들만 뽑아서 배열로 만듬 (lecture.category들로 이루어진 배열 생성됨)
    // forEach : 반복문 (해당 배열의 요소(lecture.category)를 꺼내서 category라는 매개변수에 넣고 {}안의 함수를 반복해서 실행함)
    // groupedLectures 객체의 value는 배열이여서 JSX영역에서 map()함수를 사용할 수 있음
    Object.keys(groupedLectures).forEach((category) => {
        // groupedLectures[category] : groupedLectures객체의 현재 선택된 category가 key인 value(lecture들) 배열을 가져옴
        // sort() : 배열안의 요소의 순서를 정렬하는 함수
        // 결과값(a.id - b.id)이 음수: 앞에 있는 매개변수(a)를 앞으로 보냄 / 결과값이 0: 순서 바꾸지 않음
        // 결과값이 양수 : 뒤에 있는 매개변수(b)를 앞으로 보냄
        // 매개변수 a, b는 groupedLectures[category]인 사실상 category가 key인 value(lecture들) 배열의 임의의 값들이 나옴
        // 임의의 값(lecture)의 id를 비교해서 id가 더 낮은(예전) 것을 배열의 앞으로 배치함(오름차순)
        groupedLectures[category].sort((a, b) => a.id - b.id);
    });

    // 카테고리(대주제) 자체도 생성된 순서(가장 작은 id 기준)로 정렬
    // 대주제를 오름차순으로 정렬하고 sortedCategories 배열에 넣음 (배열에는 오름차순의 대주제들(string)이 들어있음)
    // 굳이 새로운 배열에 값을 넣는 이유 : JSX에서 사용할때 map()함수를 사용하려는데 map()함수는 배열에만 사용가능함
    const sortedCategories = Object.keys(groupedLectures).sort((a, b) => {
        // a, b는 임의의 lecture.category
        // groupedLectures 객체에서 key가 임의의 lecture.category인 것의
        // value를 반복문으로 돌려서 그중에서 가장 낮은 id를 찾아서 변수에 넣음
        // 결국 key가 임의의 lecture.category인 것 value중에서 가장 낮은 id를 서로 비교함
        // Math.min() 함수는 배열을 매개변수로 받지 못해서 전개 연산자 ...을 사용해서
        // groupedLectures[a].map(l => l.id)인 value 배열의 id들의 배열을 풀고 그 배열의 값을 하나하나 숫자로 넣어줌
        const minIdA = Math.min(...groupedLectures[a].map((l) => l.id));
        const minIdB = Math.min(...groupedLectures[b].map((l) => l.id));

        return minIdA - minIdB;
    });

    // 2. 카테고리 토글 상태 관리
    // key : 카테고리 이름(string) / value : 열림(true) or 닫힘(false)
    // useState<Record<string, boolean>>({}) : key타입이 string이고 value 타입이 boolean인 것들만
    // state 변수에 넣을 것고 이 변수의 초기값은 {} - 객체이다.
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

    // 강의 목록이 처음 로드될 때 첫 번째 카테고리를 자동으로 열어놓기
    useEffect(() => {
        // 카테고리 토글 열린 상태 초기 설정 (첫번째 대주제 토글이 열린 상태)
        if (lectures.length > 0) {
            // 백엔드가 보내온 강의 목록이 1개라도 있으면
            setOpenCategories({
                // lectures배열의 0번째 객체의 category를 가져옴
                // [key] : value를 설정하는 문법이라서
                // key가 lectures[0].category이고 value가 true인 openCategories 객체의 요소가 생성됨
                [lectures[0].category]: true,
            });
        }
    }, [lectures]);

    // openCategories state변수를 업데이트하는 함수
    // prev[category]가 true면 false로, false(또는 없으면)면 true로 변경
    // prev[category] : prev객체의 key가 category인 것의 value값을 표현 (value가 boolean타입)
    // ** 매개변수 category와 같은 이름의 key값인 category의 value를 반전시키는 함수 **
    // 탑다운 토글을 움직이기 위해서 만드는 함수
    // 만약 prev[category]가 없으면, 즉 매개변수에 들어온 category 자체가 key로 존재하지 않으면 false여서
    // 그것의 !(반대)는 true가 됨
    const toggleCategory = (category: string) => {
        setOpenCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    return (
        // 사이드바 전체 영역 : LectureSidebar.css의 .lecture-sidebar 클래스 적용
        <aside className="lecture-sidebar">
            {/* 상단 영역 : 학습 목차 제목 + 강의 수 표시 */}
            {/* border-bottom border-light border-opacity-25 : 흰색 반투명 하단 구분선 */}
            <div className="sidebar-dom sidebar-dom1 border-bottom border-light border-opacity-25">
                <h2 className="fs-4 fw-bold text-white">📚 학습 목차</h2>

                {/* 전체 강의 수 표시 */}
                <p className="lecture-sidebar-title-mini">
                    · 총 {lectures.length}개의 강의
                </p>
            </div>

            {/* 중간 영역 : 카테고리 목록 (overflow-auto : 내용 많으면 스크롤) */}
            <div className="sidebar-dom sidebar-dom2 overflow-auto">
                {/* 정렬된 카테고리 배열을 map으로 순서대로 렌더링 */}
                {sortedCategories.map((category) => (
                    <div key={category} className="mb-3">
                        {/* 대주제 토글 버튼 : 클릭하면 toggleCategory 실행 */}
                        {/* rgba(255,255,255,0.15) : 반투명 흰색 배경 */}
                        <div
                            onClick={() => toggleCategory(category)}
                            className="d-flex justify-content-between align-items-center p-3 rounded fw-bold text-white"
                            style={{
                                background: "rgba(255,255,255,0.15)",
                                cursor: "pointer",
                            }}
                        >
                            <span>📁 {category}</span>

                            {/* 열림/닫힘 상태에 따라 화살표 방향 변경 */}
                            <span>{openCategories[category] ? "▲" : "▼"}</span>
                        </div>

                        {/* 소주제 : openCategories[category]가 true일 때만 렌더링 */}
                        {openCategories[category] && (
                            <div className="mt-2 ms-3">
                                {groupedLectures[category].map((lecture) => {
                                    // 현재 선택된 강의인지 확인
                                    const selected = lecture.id === currentLecture_id;

                                    return (
                                        <div
                                            key={lecture.id}
                                            // 클릭하면 부모(LecturePage)의 setCurrentLecture 실행
                                            // -> currentLecture state가 이 lecture로 변경됨
                                            onClick={() => setCurrentLecture(lecture)}
                                            // 선택된 강의 : 흰 배경 + 파란 글씨 + 굵게
                                            // 선택 안된 강의 : 투명 배경 + 흰 글씨
                                            className={`p-2 mb-1 rounded ${
                                                selected
                                                    ? "bg-white text-primary fw-bold"
                                                    : "text-white"
                                            }`}
                                            style={{ cursor: "pointer" }}
                                        >
                                            • {lecture.name}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}

                {/* 준비중 문구 : 카테고리 목록 맨 아래에 표시 */}
                {/* rgba(255,255,255,0.08) : 매우 연한 반투명 흰색 배경으로 은은하게 표시 */}
                <div
                    className="mt-3 p-3 rounded text-center text-white"
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        fontSize: "13px",
                        opacity: 0.75,
                    }}
                >
                    💡 다음 강의는 준비중입니다.
                </div>
            </div>

            {/* 하단 영역 : 새 글 작성 버튼 */}
            {/* border-top : 위쪽 구분선 / pt-3 : 위 패딩 */}
            <div className="sidebar-dom sidebar-dom3 border-top border-light border-opacity-25 pt-3">
                {/* btn-outline-light : 흰색 테두리 버튼 / w-100 : 버튼 너비 사이드바 전체 */}
                <button
                    onClick={() => navigate("/api/lecture/insert")}
                    className="btn btn-outline-light w-100 fw-bold py-2"
                >
                    + 새 글 작성
                </button>
            </div>
        </aside>
    );
}

export default LectureSidebar;