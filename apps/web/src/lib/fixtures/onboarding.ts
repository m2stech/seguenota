export type DetectedCertificate = {
  thumbprint: string;
  holderCnpj: string;
  holderName: string;
  issuer: string;
  validUntil: string;
};

export const DETECTED_CERTIFICATES: DetectedCertificate[] = [
  {
    thumbprint: "A1B2C3D4E5F6",
    holderCnpj: "12.345.678/0001-95",
    holderName: "Contabilidade Horizonte Ltda.",
    issuer: "AC SAFEWEB RFB v5",
    validUntil: "2026-03-14",
  },
  {
    thumbprint: "F6E5D4C3B2A1",
    holderCnpj: "98.765.432/0001-98",
    holderName: "Comércio Nortex S.A.",
    issuer: "AC CERTISIGN RFB G5",
    validUntil: "2027-08-02",
  },
];
