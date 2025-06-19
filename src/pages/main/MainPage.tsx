import styles from './MainPage.module.css';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import goBackIcon from '@/assets/icons/icon_arrow-left.svg';
import defaultBannerImg from '@/assets/images/img_rectangle2.png';
import Search from '@/components/search/Search';
import Dropdown from '@/components/dropdown/Dropdown';
import Pagination from '@/components/pagination/Pagination';
import Banner from './components/banner/Banner';
import ActivityCategory from './components/category/ActivityCategory';
import ExperiencesCardList from './components/experience-card-list/ExperiencesCardList';
import HorizontalCardList from './components/horizontal-card-list/HorizontalCardList';
import useViewPortSize from '@/hooks/useViewPortSize';
import { CATEGORY_LIST } from './components/category/CategoryList';
import type { Category } from '@/types/api/sharedType';
import type { GetActivitiesParams } from '@/types/api/activitiesType';
import { useGetActivitiesQuery, usePopularActivitiesInfiniteQuery } from '@/hooks/useActivities';

type SortOption = NonNullable<GetActivitiesParams['sort']>;
const DROPDOWN_OPTIONS = ['가격 낮은순', '가격 높은순'];
const DEFAULT_OPTION = '최신순';
const sortMap: Record<string, SortOption> = {
  최신순: 'latest',
  '가격 낮은순': 'price_asc',
  '가격 높은순': 'price_desc',
};

const MainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { viewportSize } = useViewPortSize();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortOption>('latest');
  const [isSelectedCategory, setIsSelectedCategory] = useState<Category | null>(null);
  const [keyword, setKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [showSearchResult, setShowSearchResult] = useState(false);

  const currentPage = Number(searchParams.get('page')) || 1;
  const itemsPerPage = viewportSize === 'mobile' ? 6 : viewportSize === 'tablet' ? 4 : 8;
  const currentTitle =
    CATEGORY_LIST.find(item => item.key === isSelectedCategory)?.title ?? '🛼 모든 체험';

  const currentSortLabel = Object.keys(sortMap).find(label => sortMap[label] === sort);
  const dropDownLabels = [DEFAULT_OPTION, ...DROPDOWN_OPTIONS];

  const { data: activitiesData } = useGetActivitiesQuery({
    page: currentPage,
    size: itemsPerPage,
    sort,
    category: isSelectedCategory ?? undefined,
    keyword: submittedKeyword || undefined,
  });
  const pagedCardData = (activitiesData?.activities ?? []).map(activity => ({
    ...activity,
    onClick: () => {
      navigate(`/detail/${activity.id}`);
      window.scrollTo(0, 0);
    },
    priceUnit: '/ 인',
    currencySymbol: '₩',
  }));
  const totalItem = activitiesData?.totalCount ?? 0;

  const {
    data: popularActivitiesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePopularActivitiesInfiniteQuery({
    sort: 'most_reviewed',
    size: 12,
  });
  const popularCardList =
    popularActivitiesData?.pages.flatMap(page =>
      page.activities.map(activity => ({
        ...activity,
        onClick: () => navigate(`/detail/${activity.id}`),
        priceUnit: '/ 인',
        currencySymbol: '₩',
      }))
    ) ?? [];

  useEffect(() => {
    const keywordParam = searchParams.get('keyword') ?? '';
    setKeyword(keywordParam);
    setSubmittedKeyword(keywordParam);
    setShowSearchResult(!!keywordParam);
  }, [location, searchParams]);

  const handleDropdownSelect = (label: string) => {
    const sortValue = sortMap[label];
    if (!sortValue) return;
    setSort(sortValue);
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev);
      updated.set('page', '1');
      return updated;
    });
  };

  const handleSelectedCategory = (category: Category | null) => {
    setIsSelectedCategory(category);
    setSort('latest');
    setSearchParams({ page: '1' });
  };

  const handleSearch = (query: string) => {
    setKeyword(query);
    setSubmittedKeyword(query);
    setIsSelectedCategory(null);
    setSort('latest');
    setSearchParams({ page: '1', keyword: query });
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.container}>
        <div className={styles.bannerWrapper}>
          <Banner
            bannerImg={defaultBannerImg}
            bannerTitle="함께 배우면 즐거운 스트릿 댄스"
            bannerDescription="6월의 인기 체험 BSET 🔥"
          />
        </div>

        <div className={styles.searchContainer}>
          <Search value={keyword} onChange={setKeyword} onSearch={handleSearch} />
        </div>

        {!showSearchResult && (
          <div className={styles.horizontalCardListContainer}>
            <div className={styles.title}>🔥 인기 체험</div>
            <HorizontalCardList
              cardList={popularCardList}
              onLoadMore={fetchNextPage}
              hasNext={hasNextPage}
              isLoading={isFetchingNextPage}
            />
          </div>
        )}

        <div className={styles.experiencesCardListContainer}>
          {!showSearchResult ? (
            <div className={styles.activities}>
              <div className={styles.titleAndFilter}>
                <div className={styles.title}>{currentTitle}</div>
                <div className={styles.dropdownWrapper}>
                  <Dropdown
                    label="최신순"
                    options={dropDownLabels}
                    selected={currentSortLabel}
                    onSelect={handleDropdownSelect}
                  />
                </div>
              </div>
              <ActivityCategory
                selectedCategory={isSelectedCategory}
                onSelectCategory={handleSelectedCategory}
              />
            </div>
          ) : (
            <div className={styles.SearchResultTitleWrapper}>
              <div className={styles.SearchResultTitle}>
                <img
                  src={goBackIcon}
                  alt="뒤로가기"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSearchParams({});
                  }}
                  width={24}
                  height={24}
                />
                <span className={styles.SearchItem}>{submittedKeyword}</span>(으)로 검색 결과
                입니다.
              </div>
              <div className={styles.ResultTotalCount}>총 {totalItem}의 결과</div>
            </div>
          )}

          <ExperiencesCardList cardList={pagedCardData} />
          <div className={styles.paginationWrapper}>
            <Pagination totalItems={totalItem} itemsPerPage={itemsPerPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
