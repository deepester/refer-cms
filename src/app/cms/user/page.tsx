'use client';

import { useState, useCallback } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/organisms/DataTable';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { toast } from 'sonner';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import type { Member } from '@/types/member';
import { MEMBER_STATUS_OPTIONS, MEMBER_TYPE_OPTIONS, JOIN_TYPE_OPTIONS } from '@/types/member';

/* ─── 더미 데이터 (백엔드 연동 전) ─── */
const MOCK_MEMBERS: Member[] = [
  {
    MEMBER_ID: 'abc1246',
    MEMBER_NO: 'M031245',
    MEMBER_NM: '홍길동',
    MEMBER_TYPE: 'KMD',
    BIRTH_DATE: '1983년 08월 16일',
    DOCTOR_LICENSE_NO: '34562',
    SCHOOL: '가톨릭대학교',
    DEPARTMENT: '내과',
    IS_DIRECTOR: 'Y',
    SPECIALTY: '일반혈액질환, 림프구계혈액암(림프종, 다발골수종)',
    EMAIL: 'revehit@naver.com',
    MOBILE_NO: '010-9288-4290',
    EMAIL_AGREE: 'Y',
    SMS_AGREE: 'Y',
    REPLY_AGREE: 'Y',
    HOSPITAL_NM: 'A 병원',
    HOSPITAL_NO: '0651251254',
    HOSPITAL_TEL: '02-940-2000',
    HOSPITAL_ADDR: '서울특별시 성북구 동소문로 47길 8 (길음동)',
    HOSPITAL_ADDR_DETAIL: '404호',
    HOSPITAL_URL: 'https://www.seoulchuk.com/main.do',
    STATUS: 'WITHDRAWN',
    JOIN_TYPE: 'NORMAL',
    INFO_UPDATE_DTTM: '2025-08-27 13:10:25',
    JOIN_DTTM: '2025-08-27 13:10:25',
    WITHDRAW_DTTM: '-',
    LAST_LOGIN_DTTM: '2025-08-27 13:10:25',
    LAST_LOGIN_IP: '211.108.122.180, 211.108.123.181',
    DORMANT_DTTM: '-',
    INSERT_DTTM: '2024-01-15 09:30:00',
    UPDATE_DTTM: '2025-06-20 14:22:00',
  },
  {
    MEMBER_ID: 'kim002',
    MEMBER_NO: 'M031246',
    MEMBER_NM: '김철수',
    MEMBER_TYPE: 'DENTIST',
    BIRTH_DATE: '1990-07-22',
    DOCTOR_LICENSE_NO: '23456',
    SCHOOL: '서울대학교',
    DEPARTMENT: '외과',
    IS_DIRECTOR: 'N',
    EMAIL: 'kim@example.com',
    MOBILE_NO: '010-9876-5432',
    EMAIL_AGREE: 'Y',
    SMS_AGREE: 'N',
    REPLY_AGREE: 'Y',
    HOSPITAL_NM: 'B 병원',
    HOSPITAL_NO: '0651251255',
    HOSPITAL_TEL: '02-123-4567',
    STATUS: 'ACTIVE',
    JOIN_TYPE: 'NORMAL',
    JOIN_DTTM: '2024-03-10 11:00:00',
    INFO_UPDATE_DTTM: '2025-05-18 10:15:00',
    DORMANT_DTTM: '-',
    INSERT_DTTM: '2024-03-10 11:00:00',
    UPDATE_DTTM: '2025-05-18 10:15:00',
  },
  {
    MEMBER_ID: 'lee003',
    MEMBER_NO: 'M031247',
    MEMBER_NM: '이영희',
    MEMBER_TYPE: 'DOCTOR',
    BIRTH_DATE: '1988-11-03',
    DOCTOR_LICENSE_NO: '34567',
    SCHOOL: '연세대학교',
    DEPARTMENT: '소아과',
    IS_DIRECTOR: 'N',
    EMAIL: 'lee@example.com',
    MOBILE_NO: '010-5555-1234',
    EMAIL_AGREE: 'N',
    SMS_AGREE: 'Y',
    REPLY_AGREE: 'N',
    HOSPITAL_NM: 'C 의원',
    HOSPITAL_NO: '0651251256',
    HOSPITAL_TEL: '02-555-6789',
    STATUS: 'ACTIVE',
    JOIN_TYPE: 'SMS',
    JOIN_DTTM: '2024-05-20 08:45:00',
    INFO_UPDATE_DTTM: '2025-04-12 16:30:00',
    DORMANT_DTTM: '-',
    INSERT_DTTM: '2024-05-20 08:45:00',
    UPDATE_DTTM: '2025-04-12 16:30:00',
  },
  {
    MEMBER_ID: 'park004',
    MEMBER_NO: 'M031248',
    MEMBER_NM: '박민수',
    MEMBER_TYPE: 'DOCTOR',
    BIRTH_DATE: '1975-01-30',
    DOCTOR_LICENSE_NO: '45678',
    SCHOOL: '고려대학교',
    DEPARTMENT: '정형외과',
    IS_DIRECTOR: 'Y',
    EMAIL: 'park@example.com',
    MOBILE_NO: '010-3333-7777',
    EMAIL_AGREE: 'Y',
    SMS_AGREE: 'Y',
    REPLY_AGREE: 'Y',
    HOSPITAL_NM: 'D 병원',
    HOSPITAL_NO: '0651251257',
    HOSPITAL_TEL: '02-777-8888',
    STATUS: 'WITHDRAWN',
    JOIN_TYPE: 'NORMAL',
    JOIN_DTTM: '2023-12-01 14:20:00',
    INFO_UPDATE_DTTM: '2025-02-28 09:00:00',
    WITHDRAW_DTTM: '2025-03-15 10:00:00',
    DORMANT_DTTM: '-',
    INSERT_DTTM: '2023-12-01 14:20:00',
    UPDATE_DTTM: '2025-02-28 09:00:00',
  },
  {
    MEMBER_ID: 'choi005',
    MEMBER_NO: 'M031249',
    MEMBER_NM: '최수진',
    MEMBER_TYPE: 'DENTIST',
    BIRTH_DATE: '1992-09-18',
    DOCTOR_LICENSE_NO: '56789',
    SCHOOL: '경희대학교',
    DEPARTMENT: '피부과',
    IS_DIRECTOR: 'N',
    EMAIL: 'choi@example.com',
    MOBILE_NO: '010-8888-4444',
    EMAIL_AGREE: 'N',
    SMS_AGREE: 'N',
    REPLY_AGREE: 'Y',
    HOSPITAL_NM: 'E 의원',
    HOSPITAL_NO: '0651251258',
    HOSPITAL_TEL: '02-444-5555',
    STATUS: 'ACTIVE',
    JOIN_TYPE: 'NORMAL',
    JOIN_DTTM: '2024-08-05 10:10:00',
    INFO_UPDATE_DTTM: '2025-07-01 11:45:00',
    DORMANT_DTTM: '-',
    INSERT_DTTM: '2024-08-05 10:10:00',
    UPDATE_DTTM: '2025-07-01 11:45:00',
  },
];

/* ─── 상태/가입유형 라벨 변환 ─── */
const statusLabel = (val?: string) => {
  const found = MEMBER_STATUS_OPTIONS.find((o) => o.value === val);
  return found?.label ?? val ?? '-';
};

const memberTypeLabel = (val?: string) => {
  const found = MEMBER_TYPE_OPTIONS.find((o) => o.value === val);
  return found?.label ?? val ?? '-';
};

const joinTypeLabel = (val?: string) => {
  const found = JOIN_TYPE_OPTIONS.find((o) => o.value === val);
  return found?.label ?? val ?? '-';
};

/* ─── 테이블 컬럼 ─── */
const columns: ColumnDef<Member, unknown>[] = [
  {
    id: 'rowNum',
    header: 'No',
    size: 60,
    cell: ({ row }) => row.index + 1,
  },
  { accessorKey: 'LOGIN_ID', header: '회원아이디', size: 130 },
  { accessorKey: 'MEMBER_NM', header: '회원명', size: 100 },
  { accessorKey: 'BIRTH_DATE', header: '생년월일', size: 110 },
  { accessorKey: 'MOBILE_NO', header: '휴대전화번호', size: 140 },
  {
    accessorKey: 'STATUS',
    header: '상태',
    size: 80,
    cell: ({ getValue }) => {
      const val = getValue() as string;
      return (
        <span
          className={
            val === 'ACTIVE'
              ? 'text-src-point font-medium'
              : val === 'WITHDRAWN'
                ? 'text-src-red font-medium'
                : ''
          }
        >
          {statusLabel(val)}
        </span>
      );
    },
  },
  {
    accessorKey: 'JOIN_TYPE',
    header: '가입유형',
    size: 100,
    cell: ({ getValue }) => joinTypeLabel(getValue() as string),
  },
  { accessorKey: 'UPDATE_DTTM', header: '수정일시', size: 160 },
];

/* ─── 검색 필드 라벨+인풋 공통 ─── */
function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════
   회원관리 페이지
   ═══════════════════════════════════════ */
export default function MemberPage() {
  /* ─── 리스트 상태 ─── */
  const [data, setData] = useState<Member[]>(MOCK_MEMBERS);
  const [loading] = useState(false);
  const [totalItems, setTotalItems] = useState(MOCK_MEMBERS.length);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  /* ─── 검색 조건 ─── */
  const [searchDoctorLicenseNo, setSearchDoctorLicenseNo] = useState('');
  const [searchMemberId, setSearchMemberId] = useState('');
  const [searchBirthDate, setSearchBirthDate] = useState('');
  const [searchMobileNo, setSearchMobileNo] = useState('');
  const [searchMemberNm, setSearchMemberNm] = useState('');
  const [searchMemberType, setSearchMemberType] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchJoinType, setSearchJoinType] = useState('');

  /* ─── 상세 다이얼로그 ─── */
  const [detailOpen, setDetailOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Member>>({});

  /* ─── 확인 다이얼로그 ─── */
  const [pwResetOpen, setPwResetOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  /* ─── 검색 ─── */
  const handleSearch = useCallback(() => {
    // TODO: 백엔드 API 연동 시 교체
    let filtered = [...MOCK_MEMBERS];
    if (searchDoctorLicenseNo)
      filtered = filtered.filter((m) => m.DOCTOR_LICENSE_NO?.includes(searchDoctorLicenseNo));
    if (searchMemberId)
      filtered = filtered.filter((m) => m.LOGIN_ID?.includes(searchMemberId));
    if (searchBirthDate)
      filtered = filtered.filter((m) => m.BIRTH_DATE?.includes(searchBirthDate));
    if (searchMobileNo)
      filtered = filtered.filter((m) => m.MOBILE_NO?.includes(searchMobileNo));
    if (searchMemberNm)
      filtered = filtered.filter((m) => m.MEMBER_NM?.includes(searchMemberNm));
    if (searchMemberType)
      filtered = filtered.filter((m) => m.MEMBER_TYPE === searchMemberType);
    if (searchStatus)
      filtered = filtered.filter((m) => m.STATUS === searchStatus);
    if (searchJoinType)
      filtered = filtered.filter((m) => m.JOIN_TYPE === searchJoinType);
    setData(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1);
  }, [searchDoctorLicenseNo, searchMemberId, searchBirthDate, searchMobileNo, searchMemberNm, searchMemberType, searchStatus, searchJoinType]);

  /* ─── 초기화 ─── */
  const handleReset = () => {
    setSearchDoctorLicenseNo('');
    setSearchMemberId('');
    setSearchBirthDate('');
    setSearchMobileNo('');
    setSearchMemberNm('');
    setSearchMemberType('');
    setSearchStatus('');
    setSearchJoinType('');
    setData(MOCK_MEMBERS);
    setTotalItems(MOCK_MEMBERS.length);
    setCurrentPage(1);
  };

  /* ─── 행 클릭 → 상세 팝업 ─── */
  const handleRowClick = (row: Member) => {
    setFormData({ ...row });
    setDetailOpen(true);
  };

  /* ─── 저장 (TODO: API 연동) ─── */
  const handleSave = () => {
    toast.success('회원 정보가 수정되었습니다.');
    setSaveConfirmOpen(false);
    setDetailOpen(false);
  };

  /* ─── 페이징 ─── */
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const updateField = (key: keyof Member, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <ListPageTemplate
        title="회원관리"
        totalItems={totalItems}
        onSearch={handleSearch}
        onReset={handleReset}
        searchSection={
          <div className="grid grid-cols-4 gap-x-6 gap-y-4">
            <FieldGroup label="의사면허번호">
              <Input
                value={searchDoctorLicenseNo}
                onChange={(e) => setSearchDoctorLicenseNo(e.target.value)}
                placeholder="의사면허번호"
              />
            </FieldGroup>
            <FieldGroup label="회원아이디">
              <Input
                value={searchMemberId}
                onChange={(e) => setSearchMemberId(e.target.value)}
                placeholder="회원아이디"
              />
            </FieldGroup>
            <FieldGroup label="생년월일">
              <Input
                value={searchBirthDate}
                onChange={(e) => setSearchBirthDate(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </FieldGroup>
            <FieldGroup label="휴대전화번호">
              <Input
                value={searchMobileNo}
                onChange={(e) => setSearchMobileNo(e.target.value)}
                placeholder="휴대전화번호"
              />
            </FieldGroup>
            <FieldGroup label="회원명">
              <Input
                value={searchMemberNm}
                onChange={(e) => setSearchMemberNm(e.target.value)}
                placeholder="회원명"
              />
            </FieldGroup>
            <FieldGroup label="회원구분">
              <Select value={searchMemberType} onValueChange={setSearchMemberType}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value || '__all'} value={opt.value || '__all'}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldGroup>
            <FieldGroup label="회원상태">
              <Select value={searchStatus} onValueChange={setSearchStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value || '__all'} value={opt.value || '__all'}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldGroup>
            <FieldGroup label="가입유형">
              <Select value={searchJoinType} onValueChange={setSearchJoinType}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  {JOIN_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value || '__all'} value={opt.value || '__all'}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldGroup>
          </div>
        }
        listContent={
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            totalItems={totalItems}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={Math.ceil(totalItems / pageSize) || 1}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRowClick={handleRowClick}
          />
        }
      />

      {/* ═══ 회원 조회 및 수정 다이얼로그 ═══ */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent size="lg" className="max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>회원 조회 및 수정</DialogTitle>
            <DialogDescription>
              회원 정보를 조회하고 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-5 overflow-y-auto">
            {/* ─── Row 1: 회원ID, 회원번호, 회원명 ─── */}
            <div className="grid grid-cols-3 gap-4">
              <FieldGroup label="회원ID">
                <Input value={formData.MEMBER_ID || ''} disabled />
              </FieldGroup>
              <FieldGroup label="회원번호">
                <Input value={formData.MEMBER_NO || ''} disabled />
              </FieldGroup>
              <FieldGroup label="회원명">
                <Input value={formData.MEMBER_NM || ''} disabled />
              </FieldGroup>
            </div>

            {/* ─── Row 2: 회원구분, 생년월일, 의사면허번호 ─── */}
            <div className="grid grid-cols-3 gap-4">
              <FieldGroup label="회원구분">
                <Input value={memberTypeLabel(formData.MEMBER_TYPE)} disabled />
              </FieldGroup>
              <FieldGroup label="생년월일">
                <Input value={formData.BIRTH_DATE || ''} disabled />
              </FieldGroup>
              <FieldGroup label="의사면허번호">
                <Input value={formData.DOCTOR_LICENSE_NO || ''} disabled />
              </FieldGroup>
            </div>

            {/* ─── Row 3: 출신학교, 진료과, 원장여부 ─── */}
            <div className="grid grid-cols-3 gap-4">
              <FieldGroup label="출신학교">
                <Input value={formData.SCHOOL || ''} disabled />
              </FieldGroup>
              <FieldGroup label="진료과">
                <Input value={formData.DEPARTMENT || ''} disabled />
              </FieldGroup>
              <FieldGroup label="원장여부">
                <div className="flex items-center h-10 gap-4">
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      name="isDirector"
                      className="accent-primary"
                      checked={formData.IS_DIRECTOR === 'Y'}
                      disabled
                    />
                    원장
                  </label>
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      name="isDirector"
                      className="accent-primary"
                      checked={formData.IS_DIRECTOR !== 'Y'}
                      disabled
                    />
                    비원장
                  </label>
                </div>
              </FieldGroup>
            </div>

            {/* ─── 세부전공 (full width) ─── */}
            <FieldGroup label="세부전공">
              <Input value={formData.SPECIALTY || ''} disabled />
            </FieldGroup>

            {/* ─── 이메일, 휴대전화번호 (2 col) ─── */}
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="이메일">
                <Input value={formData.EMAIL || ''} disabled />
              </FieldGroup>
              <FieldGroup label="휴대전화번호">
                <Input value={formData.MOBILE_NO || ''} disabled />
              </FieldGroup>
            </div>

            {/* ─── 수신 동의 여부 (3 col radios) ─── */}
            <div className="grid grid-cols-3 gap-4">
              <FieldGroup label="이메일 수신 동의 여부">
                <div className="flex items-center h-10 gap-4">
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      name="emailAgree"
                      className="accent-primary"
                      checked={formData.EMAIL_AGREE === 'Y'}
                      disabled
                    />
                    동의
                  </label>
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      name="emailAgree"
                      className="accent-primary"
                      checked={formData.EMAIL_AGREE !== 'Y'}
                      disabled
                    />
                    미동의
                  </label>
                </div>
              </FieldGroup>
              <FieldGroup label="SMS 수신 동의 여부">
                <div className="flex items-center h-10 gap-4">
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      name="smsAgree"
                      className="accent-primary"
                      checked={formData.SMS_AGREE === 'Y'}
                      disabled
                    />
                    동의
                  </label>
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      name="smsAgree"
                      className="accent-primary"
                      checked={formData.SMS_AGREE !== 'Y'}
                      disabled
                    />
                    미동의
                  </label>
                </div>
              </FieldGroup>
              <FieldGroup label="회신서 동의 여부">
                <div className="flex items-center h-10 gap-4">
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      name="replyAgree"
                      className="accent-primary"
                      checked={formData.REPLY_AGREE === 'Y'}
                      disabled
                    />
                    동의
                  </label>
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="radio"
                      name="replyAgree"
                      className="accent-primary"
                      checked={formData.REPLY_AGREE !== 'Y'}
                      disabled
                    />
                    미동의
                  </label>
                </div>
              </FieldGroup>
            </div>

            {/* ─── 병원정보 섹션 ─── */}
            <div className="border-t border-gray-500 pt-5">
              <h3 className="text-base font-semibold mb-4">병원정보</h3>

              <div className="space-y-4">
                {/* 병원명, 요양기관번호, 대표전화 */}
                <div className="grid grid-cols-3 gap-4">
                  <FieldGroup label="병원명">
                    <Input value={formData.HOSPITAL_NM || ''} disabled />
                  </FieldGroup>
                  <FieldGroup label="요양기관번호">
                    <Input value={formData.HOSPITAL_NO || ''} disabled />
                  </FieldGroup>
                  <FieldGroup label="대표전화">
                    <Input value={formData.HOSPITAL_TEL || ''} disabled />
                  </FieldGroup>
                </div>

                {/* 병원주소 (full width, 2 inputs) */}
                <FieldGroup label="병원주소">
                  <div className="flex gap-2">
                    <Input
                      value={formData.HOSPITAL_ADDR || ''}
                      disabled
                      className="flex-1"
                    />
                    <Input
                      value={formData.HOSPITAL_ADDR_DETAIL || ''}
                      disabled
                      className="flex-1"
                    />
                  </div>
                </FieldGroup>

                {/* 병원 홈페이지 주소 */}
                <FieldGroup label="병원 홈페이지 주소">
                  <Input value={formData.HOSPITAL_URL || ''} disabled />
                </FieldGroup>
              </div>
            </div>

            {/* ─── 상태 정보 테이블 (빨간 테두리) ─── */}
            <div className="overflow-hidden rounded-lg border border-gray-500">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-500">
                    <th className="bg-gray-300 px-4 py-2.5 text-left font-semibold whitespace-nowrap">
                      회원상태
                    </th>
                    <td className="px-4 py-2.5">
                      <span
                        className={
                          formData.STATUS === 'ACTIVE'
                            ? 'text-src-point font-medium'
                            : formData.STATUS === 'WITHDRAWN'
                              ? 'text-src-red font-medium'
                              : ''
                        }
                      >
                        {statusLabel(formData.STATUS)}
                      </span>
                    </td>
                    <th className="bg-gray-300 px-4 py-2.5 text-left font-semibold whitespace-nowrap">
                      가입유형
                    </th>
                    <td className="px-4 py-2.5">{joinTypeLabel(formData.JOIN_TYPE)}</td>
                    <th className="bg-gray-300 px-4 py-2.5 text-left font-semibold whitespace-nowrap">
                      회원가입일시
                    </th>
                    <td className="px-4 py-2.5">{formData.JOIN_DTTM || '-'}</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <th className="bg-gray-300 px-4 py-2.5 text-left font-semibold whitespace-nowrap">
                      회원정보수정일시
                    </th>
                    <td className="px-4 py-2.5">{formData.INFO_UPDATE_DTTM || '-'}</td>
                    <th className="bg-gray-300 px-4 py-2.5 text-left font-semibold whitespace-nowrap">
                      휴면계정 전환일
                    </th>
                    <td className="px-4 py-2.5">{formData.DORMANT_DTTM || '-'}</td>
                    <th className="bg-gray-300 px-4 py-2.5 text-left font-semibold whitespace-nowrap">
                      회원탈퇴일시
                    </th>
                    <td className="px-4 py-2.5">{formData.WITHDRAW_DTTM || '-'}</td>
                  </tr>
                  <tr>
                    <th className="bg-gray-300 px-4 py-2.5 text-left font-semibold whitespace-nowrap">
                      마지막로그인일시
                    </th>
                    <td className="px-4 py-2.5">{formData.LAST_LOGIN_DTTM || '-'}</td>
                    <th className="bg-gray-300 px-4 py-2.5 text-left font-semibold whitespace-nowrap">
                      마지막로그인IP
                    </th>
                    <td className="px-4 py-2.5" colSpan={3}>{formData.LAST_LOGIN_IP || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ─── 비고 (관리자용 - 유일하게 수정 가능) ─── */}
            <FieldGroup label="비고">
              <Textarea
                value={formData.MEMO || ''}
                onChange={(e) => updateField('MEMO', e.target.value)}
                placeholder="회원에 대한 특이사항을 기재하세요."
                rows={3}
              />
            </FieldGroup>
          </DialogBody>

          <DialogFooter className="justify-between">
            <div className="flex gap-2">
              <Button onClick={() => setPwResetOpen(true)}>비밀번호 초기화</Button>
              <Button variant="destructive" onClick={() => setWithdrawOpen(true)}>
                탈퇴처리
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCancelConfirmOpen(true)}>
                취소
              </Button>
              <Button variant="dark" onClick={() => setSaveConfirmOpen(true)}>
                저장
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ 비밀번호 초기화 확인 ═══ */}
      <ConfirmDialog
        open={pwResetOpen}
        onOpenChange={setPwResetOpen}
        title="비밀번호 초기화"
        description="비밀번호를 초기화하시겠습니까? 초기화된 비밀번호는 회원의 휴대전화번호로 전송됩니다."
        onConfirm={() => {
          toast.success('비밀번호가 초기화되었습니다. 회원의 휴대전화번호로 전송되었습니다.');
          setPwResetOpen(false);
        }}
        destructive
      />

      {/* ═══ 탈퇴처리 확인 ═══ */}
      <ConfirmDialog
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        title="탈퇴처리"
        description="해당 회원을 탈퇴 처리하시겠습니까?"
        onConfirm={() => {
          toast.success('회원이 탈퇴 처리되었습니다.');
          setWithdrawOpen(false);
          setDetailOpen(false);
        }}
        destructive
      />

      {/* ═══ 저장 확인 ═══ */}
      <ConfirmDialog
        open={saveConfirmOpen}
        onOpenChange={setSaveConfirmOpen}
        title="저장"
        description="수정한 내용으로 저장하시겠습니까?"
        onConfirm={handleSave}
      />

      {/* ═══ 취소 확인 ═══ */}
      <ConfirmDialog
        open={cancelConfirmOpen}
        onOpenChange={setCancelConfirmOpen}
        title="취소"
        description="취소 시 수정한 내용이 저장되지 않습니다. 취소하시겠습니까?"
        onConfirm={() => {
          setCancelConfirmOpen(false);
          setDetailOpen(false);
        }}
        destructive
      />
    </>
  );
}
