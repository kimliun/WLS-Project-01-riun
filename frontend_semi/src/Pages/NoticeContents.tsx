import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/config";
import NoticeSidebar from "../components/layout/NoticeSidebar";
import "./NoticeContents.css";
import customAxios from "../api/axiosInstance";

interface Notice {
  noticeId: number;
  noticeCategoryId: number;
  noticeCategoryName: string;
  memberId: number;
  title: string;
  contents: string;
  attachmentUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

interface NoticeFormData {
  noticeCategoryId: number;
  title: string;
  contents: string;
  attachmentUrl: string;
}

function NoticeContents() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);

  // none: 목록만 표시
  // create: 오른쪽에 작성 폼 표시
  // edit: 오른쪽에 수정 폼 표시
  const [formMode, setFormMode] = useState<"none" | "create" | "edit">("none");
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  const [formData, setFormData] = useState<NoticeFormData>({
    noticeCategoryId: 1,
    title: "",
    contents: "",
    attachmentUrl: "",
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const url = `${API_BASE_URL}/api/notices`;
      const response = await axios.get(url);

      setNotices(response.data);

    } catch (error) {
      console.error(error);
      alert("공지사항을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  // 프론트에서 가져온 공지를 정렬
  const filteredNotices =
  selectedCategoryId === null
    ? notices
    : notices.filter(
        (notice) => notice.noticeCategoryId === selectedCategoryId
      );

  // CreateClick, 글 등록 버튼을 클릭할때 FormMode를 create 설정
  const handleCreateClick = () => {
    setFormMode("create");
    setEditingNotice(null);

    setFormData({
      noticeCategoryId: 1,
      title: "",
      contents: "",
      attachmentUrl: "",
    });
  };

  // 수정하기 버튼을 클릭했을때 FormMode를 Edit로 설정.
  const handleEditClick = (notice: Notice) => {
    setFormMode("edit");
    setEditingNotice(notice);

    setFormData({
      noticeCategoryId: notice.noticeCategoryId,
      title: notice.title,
      contents: notice.contents,
      attachmentUrl: notice.attachmentUrl || "",
    });
  };

  // 취소 버튼을 클릭하였을때 Formmode를 none으로 설정
  const handleCancelForm = () => {
    setFormMode("none");
    setEditingNotice(null);

    setFormData({
      noticeCategoryId: 1,
      title: "",
      contents: "",
      attachmentUrl: "",
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: name === "noticeCategoryId" ? Number(value) : value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      alert("제목을 입력해 주세요.");
      return;
    }

    if (!formData.contents.trim()) {
      alert("내용을 입력해 주세요.");
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const requestBody = {
      noticeCategoryId: formData.noticeCategoryId,
      title: formData.title,
      contents: formData.contents,
      attachmentUrl: formData.attachmentUrl.trim() === "" ? null : formData.attachmentUrl,
    };

    try {
      if (formMode === "create") {
        await customAxios.post(`${API_BASE_URL}/api/notices`, requestBody, config);
        setFormMode("none");
        setEditingNotice(null);
        await fetchNotices();
        alert("공지사항이 등록되었습니다.");
      }

      if (formMode === "edit"  && editingNotice) {
        await customAxios.put(
          `${API_BASE_URL}/api/notices/${editingNotice.noticeId}`,
          requestBody,
          config
        );
        alert("공지사항이 수정되었습니다.");
        setFormMode("none");
        setEditingNotice(null);
        await fetchNotices();  
      }
    } catch (error) {
      console.error(error);
      alert("공지사항 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteClick = async (noticeId: number) => {
    const confirmDelete = window.confirm("공지사항을 삭제하시겠습니까?");

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await customAxios.delete(`${API_BASE_URL}/api/notices/${noticeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("공지사항이 삭제되었습니다.");

      if (editingNotice?.noticeId === noticeId) {
        handleCancelForm();
      }

      await fetchNotices();
    } catch (error) {
      console.error(error);
      alert("공지사항 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="notice-page">
      <NoticeSidebar
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <section className="notice-content-area">
        <div className="notice-content-header">
          <div>
            <p className="notice-content-badge">NOTICE</p>
            <h1>공지사항</h1>
            <p>풀스택 강의실의 주요 안내사항을 확인하세요.</p>
          </div>

          <button
            type="button"
            className="notice-write-button"
            onClick={handleCreateClick}
          >
            공지 작성
          </button>
        </div>

        <div
          className={
            formMode === "none"
              ? "notice-main-layout"
              : "notice-main-layout split"
          }
        >
          <div className="notice-list-panel">
            {loading ? (
              <div className="notice-empty">공지사항을 불러오는 중입니다.</div>
            ) : notices.length === 0 ? (
              <div className="notice-empty">등록된 공지사항이 없습니다.</div>
            ) : (
              filteredNotices.map((notice) => (
  <article key={notice.noticeId} className="notice-list-item">
    <div className="notice-item-top">
      <div className="notice-item-title-box">
        <span className="notice-item-category">
          {notice.noticeCategoryName}
        </span>

        <h3>{notice.title}</h3>
      </div>

      <div className="notice-item-buttons">
        <button
          type="button"
          className="notice-small-button edit"
          onClick={() => handleEditClick(notice)}
        >
          수정
        </button>

        <button
          type="button"
          className="notice-small-button delete"
          onClick={() => handleDeleteClick(notice.noticeId)}
        >
          삭제
        </button>
      </div>
    </div>

    <div className="notice-item-meta">
      <span>글번호 #{notice.noticeId}</span>
      <span>{notice.createdAt?.replace("T", " ")}</span>
      {notice.updatedAt && (
        <span>수정됨 {notice.updatedAt.replace("T", " ")}</span>
      )}
    </div>

    <div className="notice-item-content-box">
      {notice.contents}
    </div>

    {notice.attachmentUrl && (
      <a
        className="notice-item-attachment"
        href={notice.attachmentUrl}
        target="_blank"
        rel="noreferrer"
      >
        첨부파일 열기
      </a>
    )}
  </article>
              ))
            )}
          </div>

          {formMode !== "none" && (
            <div className="notice-form-panel">
              <div className="notice-form-title">
                <h2>{formMode === "create" ? "공지 작성" : "공지 수정"}</h2>
                <p>
                  {formMode === "create"
                    ? "관리자 권한으로 공지사항을 등록합니다."
                    : "선택한 공지사항의 내용을 수정합니다."}
                </p>
              </div>

              <form className="notice-form" onSubmit={handleSubmit}>
                <label>
                  카테고리
                  <select
                    name="noticeCategoryId"
                    value={formData.noticeCategoryId}
                    onChange={handleChange}
                  >
                    <option value={1}>공지</option>
                    <option value={2}>중요</option>
                    <option value={3}>업데이트</option>
                    <option value={4}>안내</option>
                  </select>
                </label>

                <label>
                  제목
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="공지 제목을 입력하세요."
                  />
                </label>

                <label>
                  내용
                  <textarea
                    name="contents"
                    value={formData.contents}
                    onChange={handleChange}
                    placeholder="공지 내용을 입력하세요."
                  />
                </label>

                <label>
                  첨부파일 URL
                  <input
                    type="text"
                    name="attachmentUrl"
                    value={formData.attachmentUrl}
                    onChange={handleChange}
                    placeholder="첨부파일 URL을 입력하세요."
                  />
                </label>

                <div className="notice-form-button-row">
                  <button
                    type="button"
                    className="notice-cancel-button"
                    onClick={handleCancelForm}
                  >
                    취소
                  </button>

                  <button type="submit" className="notice-submit-button">
                    {formMode === "create" ? "등록하기" : "수정하기"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default NoticeContents;