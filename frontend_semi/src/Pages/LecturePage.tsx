import { useEffect, useState } from "react";
import axios from "axios";
import type { Lecture } from "../types/Lecture";
import { API_BASE_URL } from "../config/config";
import LectureSidebar from "../components/layout/LectureSidebar";
import LectureContent from "../components/LecturePage/LectureContent";
import { Button } from "react-bootstrap";
import "./LecturePage.css";
import customAxios from "../api/axiosInstance";

function LecturePage() {
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);

    useEffect(() => {
        const url = `${API_BASE_URL}/api/lecture/list`;
        customAxios.get(url)
            .then((response) => {
                setLectures(response.data);
                if (response.data.length > 0) {
                    setCurrentLecture(response.data[0]);
                }
            })
            .catch((err) => {
                console.error("데이터 통신 에러:", err);
            });
    }, []);

    // LectureContent에 프롭스로 보낼 강의 수정 및 강의 삭제 함수
    // User의 Role이 ADMIN일때 보이는 버튼 및 구동 함수
    // 나중에 프롭스로 user 넣어줘야 함
    // 원래는 파라미터로 현재 보이는 강의를 표현해서 그 파라미터인 id를 이용해서
    // Update나 Delete로 수정 및 삭제를 하는데 이 웹페이지는 파라미터로 보이는 것이 아니라서
    // LecturePage에서 Props로 받은 현재 선택된 강의를 뜻하는 currentLecture를 다시 프롭스로 줘야함
    const makeAdminButtons = (currentLecture: Lecture, navigate: any) => {
        // 지금 user가 없어서 일단 주석처리함
        /* if (user?.role !== 'ADMIN') return null; */

        return (
            <div className="d-flex gap-2">
                <Button // 수정을 위한 <Button>을 추가합니다.
                    className="btn btn-sm fw-bold px-3"
                    style={{ backgroundColor: "#2588f0", borderColor: "#2588f0", color: "white" }}
                    onClick={(event) => {
                        // 이 코드가 없으면 수정버튼을 포함하고 있는 더 큰 영역을 클릭했을때
                        // 그 큰 영역도 onClick으로 다른 일을 해야하는데 그 일과 이 코드가 동시에 시작해버려서
                        // 문제가 생길 수도 있음
                        event.stopPropagation(); // 이벤트 버블링 방지
                        navigate(`/api/lecture/update/${currentLecture?.id}`);
                    }}>
                    강의 수정
                </Button>

                {/* 한 칸 공백 넣기 */}
                &nbsp;

                <Button // 삭제를 위한 <Button>을 추가합니다. (confirm 함수 이용)(alert과는 다름)
                    className="btn btn-sm fw-bold px-3"
                    style={{ backgroundColor: "#2588f0", borderColor: "#2588f0", color: "white" }}
                    onClick={async (event) => { // 백엔드를 거치고 일처리를 해야해서 async 붙임
                        event.stopPropagation(); // 이벤트 버블링 방지

                        const isDelete = window.confirm(`${currentLecture?.name} 강의를 삭제하시겠습니까?`);

                        if (isDelete === false) {
                            /* sweet alert2 사이트에 이쁜거 많음 */
                            alert(`${currentLecture?.name} 강의 삭제를 취소하였습니다.`)
                            return;
                        }

                        try { // 전체 배열에서 일부 데이터만 필터할 수 있음
                            const url = `${API_BASE_URL}/api/lecture/delete/${currentLecture?.id}`;
                            await customAxios.delete(url); // 백엔드를 거치고 일처리를 해야해서 await 붙임
                            alert(`'${currentLecture?.name}' 상품이 삭제되었습니다.`)

                            // 상품을 갱신해주는 setter
                            // 이전(prev) : 기존 state (삭제 전)
                            // filter() : true인 것만 따로 모아서 새로운 배열을 생성
                            // p : prev에 있는 기존 상품들
                            // p.id !== currentLecture.id : 기존 상품의 id와 삭제된 상품의 id가 다르다 -> 삭제된 상품이 아니다.
                            // 삭제된 상품이 아닌 것들만 따로 모아서 다시 lectures에 저장
                            // 삭제 성공 후
                            setLectures(prev => {
                                const filtered = prev.filter(p => p.id !== currentLecture.id);
                                // 삭제 후 남은 강의 중 첫 번째로 currentLecture 변경
                                // LectureContent화면도 같이 갱신되게 변경
                                setCurrentLecture(filtered.length > 0 ? filtered[0] : null);
                                return filtered;
                            });

                            navigate('/api/lecture/list');

                        } catch (error) {
                            console.log(error);
                            if (axios.isAxiosError(error)) {
                                alert(`강의 삭제 실패 : ${error.response?.data || error.message}`);
                            } else {
                                console.log('알 수 없는 에러 : ' + error);
                            }
                        };
                    }}>
                    강의 삭제
                </Button>
            </div>
        );
    };

    return (
        // 1. 전체 영역을 flex로 설정하여 브라우저 높이(100vh)를 확보합니다.
        <div className="lecture-page">
            {/* 2. 메인 컨텐츠 영역에 flex: 1을 적용합니다. 
                상단바가 있다면 상단바를 제외한 '남은 공간 전체'를 알아서 채우게 됩니다. */}
            <LectureSidebar
                lectures={lectures}
                setCurrentLecture={setCurrentLecture}
                currentLecture_id={currentLecture?.id || null}
            />

            {/* 우측 강의 상세 내용 영역 */}
            <main className="lecture-main">
                <LectureContent currentLecture={currentLecture} makeAdminButtons={makeAdminButtons} />
            </main>
        </div>
    );
}

export default LecturePage;