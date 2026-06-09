import "./NoticeSidebar.css";

interface NoticeCategory {
  noticeCategoryId: number;
  categoryName: string;
}

interface NoticeSidebarProps {
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

function NoticeSidebar({
  selectedCategoryId,
  onSelectCategory,
}: NoticeSidebarProps) {
  const categories: NoticeCategory[] = [
    { noticeCategoryId: 1, categoryName: "공지" },
    { noticeCategoryId: 2, categoryName: "중요" },
    { noticeCategoryId: 3, categoryName: "업데이트" },
    { noticeCategoryId: 4, categoryName: "안내" },
  ];

  return (
    <aside className="notice-sidebar">
      <div className="notice-sidebar-title">
        <h2>공지사항</h2>
      </div>

      <nav className="notice-sidebar-menu">
        <button
          type="button"
          className={
            selectedCategoryId === null
              ? "notice-sidebar-button active"
              : "notice-sidebar-button"
          }
          onClick={() => onSelectCategory(null)}
        >
          <span className="notice-sidebar-number">00</span>
          <span>전체공지</span>
        </button>

        {categories.map((category, index) => (
          <button
            key={category.noticeCategoryId}
            type="button"
            className={
              selectedCategoryId === category.noticeCategoryId
                ? "notice-sidebar-button active"
                : "notice-sidebar-button"
            }
            onClick={() => onSelectCategory(category.noticeCategoryId)}
          >
            <span className="notice-sidebar-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{category.categoryName}</span>
          </button>
        ))}
      </nav>

      <div className="notice-sidebar-divider" />

      <div className="notice-sidebar-info">
        <span className="notice-sidebar-info-icon">ⓘ</span>
        강의실의 주요 공지와
        <br />
        운영 안내를 확인할 수 있습니다.
      </div>

      <div className="notice-sidebar-bottom">
        <div className="notice-sidebar-illust">
          <div className="notice-sidebar-illust-card" />
          <div className="notice-sidebar-illust-star">☆</div>
        </div>

        <div className="notice-sidebar-bottom-text">NOTICE</div>
      </div>
    </aside>
  );
}

export default NoticeSidebar;