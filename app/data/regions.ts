// Region options for the prototype. Values are independent of display labels.
export const regions = [
  { name: "서울", cities: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"] },
  { name: "경기", cities: ["고양", "안양", "수원", "광명", "용인", "성남", "의정부", "가평", "과천", "구리", "군포", "김포", "남양주", "동두천", "부천", "시흥", "안산", "안성", "양주", "양평", "여주", "연천", "오산", "의왕", "이천", "파주", "평택", "포천", "하남", "화성"] },
  { name: "인천", cities: ["계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군"] },
  { name: "부산", cities: [] }, { name: "대구", cities: [] }, { name: "대전", cities: [] },
  { name: "광주", cities: [] }, { name: "울산", cities: [] }, { name: "세종", cities: [] },
  { name: "강원", cities: ["춘천", "원주", "강릉", "홍천"] },
  { name: "충북", cities: ["청주", "충주", "제천"] }, { name: "충남", cities: ["천안", "아산", "공주"] },
  { name: "전북", cities: ["전주", "군산", "익산"] }, { name: "전남", cities: ["목포", "여수", "순천"] },
  { name: "경북", cities: ["포항", "경주", "구미", "영주", "청도"] }, { name: "경남", cities: ["창원", "김해", "진주"] },
  { name: "제주", cities: ["제주시", "서귀포시"] },
];
export function normalizeRegion(value: string) {
  return value.replace(/경기도/g, "경기").replace(/강원도|강원특별자치도/g, "강원").replace(/ 전체/g, "").trim().replace(/(고양|안양|수원|광명|용인|성남|의정부)시/g, "$1");
}
export function regionLabel(value: string) {
  const normalized = normalizeRegion(value);
  if (!normalized) return "지역 전체";
  return regions.some(region => region.name === normalized) ? `${normalized} 전체` : normalized;
}
export function matchesRegion(location: string, selected: string) {
  if (!selected) return true;
  const actual = normalizeRegion(location);
  const target = normalizeRegion(selected);
  return actual === target || actual.startsWith(`${target} `) || (!target.includes(" ") && actual.split(" ").includes(target));
}
