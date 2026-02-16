import { gql } from '@apollo/client';

/** 관리자 협력병의원 신청 목록 조회 */
export const GET_ADMIN_PARTNER_APPLICATIONS = gql`
  query AdminPartnerApplications($pagination: PaginationInput, $status: PartnerStatus) {
    adminPartnerApplications(pagination: $pagination, status: $status) {
      items {
        id
        status
        hospitalCode
        hospitalId
        staffName
        staffPhone
        staffEmail
        directorName
        directorPhone
        approvedAt
        reviewedAt
        reviewedById
        rejectReason
        createdAt
        updatedAt
        hospital {
          id
          name
          representative
          phone
          faxNumber
          address
          addressDetail
          zipCode
          website
          specialties
          partnerType
          classificationCode
          phisCode
        }
      }
      totalCount
      hasNextPage
    }
  }
`;

/** 관리자 협력병의원 신청 상세 조회 */
export const GET_ADMIN_PARTNER_APPLICATION_BY_ID = gql`
  query AdminPartnerApplicationById($id: String!) {
    adminPartnerApplicationById(id: $id) {
      id
      status
      hospitalCode
      hospitalId
      staffName
      staffPhone
      staffEmail
      directorName
      directorPhone
      directorLicenseNo
      directorBirthDate
      directorGender
      directorEmail
      directorSchool
      directorGraduationYear
      directorTrainingHospital
      directorDepartment
      directorSubSpecialty
      directorCarNo
      directorEmailConsent
      directorSmsConsent
      directorReplyConsent
      isDirector
      institutionType
      staffPosition
      staffTel
      staffDeptType
      staffDeptValue
      remarks
      attachments
      approvedAt
      reviewedAt
      reviewedById
      rejectReason
      createdAt
      updatedAt
      # 체크리스트 항목
      activeBedCount
      totalBedCount
      premiumRoomCount
      multiRoomCount
      icuCount
      erCount
      nurseCount
      specialistCount
      totalStaffCount
      hasDialysisRoom
      hasEr
      hasHospice
      hasIcu
      hasOperatingRoom
      hasPhysicalTherapy
      hasPsychClosed
      hasPsychGeneral
      hasIntegratedNursing
      hasGuardianCare
      hasSharedCare
      hasRehabIsolation
      hasRehabOt
      hasRehabPt
      hasRehabSt
      hasRehabSwallow
      isolationRoomCount
      isolationSingleCount
      isolationDoubleCount
      isolationTripleCount
      isolationTypes
      isolationCareType
      isolationRehabType
      majorEquipment
      availableTreatments
      departmentSpecialists
      hospital {
        id
        name
        representative
        phone
        faxNumber
        address
        addressDetail
        zipCode
        website
        specialties
        partnerType
        classificationCode
        phisCode
      }
    }
  }
`;

/** 협력병의원 신청 승인 */
export const APPROVE_PARTNER_APPLICATION = gql`
  mutation ApprovePartnerApplication($id: String!) {
    approvePartnerApplication(id: $id) {
      id
      status
    }
  }
`;

/** 협력병의원 신청 반려 */
export const REJECT_PARTNER_APPLICATION = gql`
  mutation RejectPartnerApplication($id: String!, $reason: String!) {
    rejectPartnerApplication(id: $id, reason: $reason) {
      id
      status
    }
  }
`;
